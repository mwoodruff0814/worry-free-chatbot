// FILE: src/components/FlowController.jsx
import React, { useEffect, useCallback, useState } from 'react';
import { useChatContext } from '../context/ChatContext';
import { STAGES } from '../constants/stages';
import { calculateDistance } from '../utils/googleMaps';
import { CONFIG } from '../constants/config';
import { submitLead } from '../services/emailService';
import { calculateMovingEstimate, calculateLaborEstimate, calculateSingleItemEstimate, calculateFVPCost } from '../utils/calculations';
import ChatInput from './Modals/chat/ChatInput';
import ChatOptions from './Modals/chat/ChatOptions';
import LocationInput from './Modals/chat/LocationInput';
import MultiSelect from './Modals/chat/MultiSelect';
import EstimateModal from './Modals/chat/EstimateModal';
import PaymentModal from './Modals/chat/PaymentModal';
import DatePickerComponent from './UI/DatePicker';
import squarePaymentService from '../services/squarePaymentService';

const FlowController = () => {
  const {
    chatState,
    updateStage,
    updateChatData,
    addBotMessage,
    saveNavigationState
  } = useChatContext();

  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Handler for name input
  const handleNameInput = useCallback((value) => {
    const parts = value.trim().split(/\s+/);
    if (parts.length >= 2) {
      const firstName = parts[0];
      const lastName = parts.slice(1).join(' ');

      updateChatData({
        name: value,
        firstName: firstName,
        lastName: lastName
      });

      const greetings = [
        `Wonderful to meet you, ${firstName}! 😊`,
        `Great! Thanks ${firstName}, nice to have you here!`,
        `Perfect! Hi ${firstName}, excited to help you today! 👋`,
        `Awesome! Hey ${firstName}, let's get you moved!`
      ];
      addBotMessage(greetings[Math.floor(Math.random() * greetings.length)], 30);

      setTimeout(() => {
        addBotMessage("Let me get your contact info so we can send you the estimate. What's your email address?", 50);
        updateStage(STAGES.GET_EMAIL);
      }, 25);
    } else {
      addBotMessage("Just need your full name to get started - first and last name, please! 📝", 30);
    }
  }, [updateChatData, addBotMessage, updateStage]);

  // Handler for service selection
  const handleServiceSelection = useCallback((value) => {
    updateChatData({ serviceType: value });

    const serviceNames = {
      'moving': 'a full moving service',
      'labor': 'a labor crew',
      'single': 'a single item move',
      'insurance_claim': 'an insurance claim'
    };

    if (value === 'questions') {
      updateStage(STAGES.QUESTIONS);
      addBotMessage("I'm all ears! What would you like to know? 💬", 30);
    } else if (value === 'insurance_claim') {
      updateStage(STAGES.INSURANCE_CLAIMS_START);
      addBotMessage("I'm really sorry to hear about the damage. Don't worry though - I'll walk you through the claim process and make it as painless as possible.", 30);
    } else {
      const responses = [
        `Excellent choice! Let's get you ${serviceNames[value]} estimate right away.`,
        `Perfect! I'll set up ${serviceNames[value]} estimate for you.`,
        `Great! Let me help you with ${serviceNames[value]} - this won't take long!`
      ];
      addBotMessage(responses[Math.floor(Math.random() * responses.length)], 30);
      setTimeout(() => {
        const dateQuestions = [
          "When are you thinking? What date works best for your service? 📅",
          "Let's pick a date - when would be ideal for you? 📆",
          "When would you like to schedule this? Pick any date that works! 🗓️"
        ];
        addBotMessage(dateQuestions[Math.floor(Math.random() * dateQuestions.length)], 50);
        updateStage(STAGES.MOVING_DATE);
      }, 90);
    }
  }, [updateChatData, addBotMessage, updateStage]);

  // Handler for moving date
  const handleMovingDate = useCallback((value) => {
    const formattedDate = new Date(value).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    updateChatData({
      movingDate: value,
      formattedDate: formattedDate
    });

    const confirmations = [
      `Got it! I've noted ${formattedDate} for your service. ✓`,
      `Perfect! ${formattedDate} is all set. 👍`,
      `Excellent! Marked down ${formattedDate}. ✅`
    ];
    addBotMessage(confirmations[Math.floor(Math.random() * confirmations.length)], 30);

    // Check if date is soon for urgency messaging
    const today = new Date();
    const moveDate = new Date(value);
    const daysDiff = Math.ceil((moveDate - today) / (1000 * 60 * 60 * 24));

    if (daysDiff <= 7 && daysDiff >= 0) {
      setTimeout(() => {
        addBotMessage(`⚡ Wow, that's coming up quick - only ${daysDiff} days away! We're getting pretty booked. 💡 Pro tip: Call us right after your estimate to lock in your spot!`, 25);
      }, 50);
    }

    if (chatState.data.serviceType === 'single') {
      updateStage(STAGES.LOCATION_FROM);
      setTimeout(() => {
        addBotMessage("Alright, where are we picking up this item from? 💡 Just start typing and I'll suggest addresses!", 25);
      }, 25);
    } else {
      updateStage(STAGES.PEST_DISCLAIMER);
      setTimeout(() => {
        addBotMessage("Quick pause - I need to show you something important before we continue:", 25);
      }, 25);
    }
  }, [updateChatData, addBotMessage, updateStage, chatState.data.serviceType]);

  // Handler for pest disclaimer
  const handlePestDisclaimer = useCallback((value) => {
    if (value === 'continue_after_disclaimer') {
      updateStage(STAGES.LOCATION_FROM);
      addBotMessage("Now I'll need your complete starting address to calculate the estimate.", 30);
      setTimeout(() => {
        addBotMessage("💡 Tip: Start typing and I'll suggest addresses!", 50);
      }, 25);
    } else if (value === 'exit_pest_issues') {
      addBotMessage("I understand. Please contact us at 330-435-8686 once any pest issues have been addressed. We'll be happy to help with your move then!", 30);
      updateStage(STAGES.EXIT);
    }
  }, [addBotMessage, updateStage]);

  // Handler for location from - SIMPLIFIED: just collect address
  const handleLocationFrom = useCallback(async (value) => {
    console.log('🔍 handleLocationFrom called with:', value);

    // Very lenient validation - just check if it's not empty
    if (!value || value.trim().length < 3) {
      addBotMessage("Could you please enter an address?", 30);
      return;
    }

    console.log('✅ Validation passed, proceeding...');
    updateChatData({ from: value });
    addBotMessage(`Perfect! Got your starting location: ${value} ✓`, 30);

    setTimeout(() => {
      updateStage(STAGES.LOCATION_TO);
      if (chatState.data.serviceType === 'single') {
        addBotMessage("Great! Now I need the delivery address.", 50);
      } else {
        addBotMessage("Great! Now I need your destination address - where are you moving TO?", 50);
      }
      addBotMessage("💡 Tip: Start typing and I'll suggest addresses!", 90);
    }, 25);
  }, [updateChatData, addBotMessage, updateStage, chatState.data.serviceType]);

  // NEW: Handler for START_LOCATION_DETAILS - calculates all distances then asks location questions
  const handleStartLocationDetails = useCallback(async () => {
    const baseAddress = CONFIG.baseAddress || "11715 Mahoning Avenue, North Jackson, OH 44451";
    const { from, to, thirdLocation } = chatState.data;

    addBotMessage("Calculating all distances and drive times... 🗺️", 30);

    try {
      // Calculate from base to location FROM
      const baseToFrom = await calculateDistance(baseAddress, from);
      const fromDistance = parseFloat(baseToFrom.distance);
      const fromDuration = parseFloat(baseToFrom.duration);

      // Calculate from location FROM to location TO
      const fromToTo = await calculateDistance(from, to);
      const tripDistance = parseFloat(fromToTo.distance);
      const tripDuration = parseFloat(fromToTo.duration);

      let thirdLocationDistance = 0;
      let thirdLocationDuration = 0;
      let thirdToBaseDistance = 0;
      let thirdToBaseDuration = 0;
      let totalTripDistance = fromDistance + tripDistance;

      // If there's a third location, calculate those distances too
      if (thirdLocation) {
        const toToThird = await calculateDistance(to, thirdLocation);
        thirdLocationDistance = parseFloat(toToThird.distance);
        thirdLocationDuration = parseFloat(toToThird.duration);

        const thirdToBase = await calculateDistance(thirdLocation, baseAddress);
        thirdToBaseDistance = parseFloat(thirdToBase.distance);
        thirdToBaseDuration = parseFloat(thirdToBase.duration);

        totalTripDistance = fromDistance + tripDistance + thirdLocationDistance + thirdToBaseDistance;
      } else {
        // Calculate return from TO to base
        const toToBase = await calculateDistance(to, baseAddress);
        thirdToBaseDistance = parseFloat(toToBase.distance);
        thirdToBaseDuration = parseFloat(toToBase.duration);
      }

      // Store all distance calculations
      updateChatData({
        fromDistance,
        fromDuration,
        fromHasTolls: baseToFrom.hasTolls || false,
        tripDistance,
        tripDuration,
        tripHasTolls: fromToTo.hasTolls || false,
        thirdLocationDistance,
        thirdLocationDuration,
        thirdToBaseDistance,
        thirdToBaseDuration,
        deliveryToBaseDistance: thirdToBaseDistance,
        deliveryToBaseDuration: thirdToBaseDuration,
        totalTripDistance
      });

      // Display distance summary
      setTimeout(() => {
        addBotMessage(`📍 Base to pickup: ${fromDistance.toFixed(1)} miles (${Math.ceil(fromDuration * 60)} min)`, 50);
        addBotMessage(`📍 Pickup to delivery: ${tripDistance.toFixed(1)} miles (${Math.ceil(tripDuration * 60)} min)`, 90);

        if (thirdLocation) {
          addBotMessage(`📍 Delivery to third stop: ${thirdLocationDistance.toFixed(1)} miles (${Math.ceil(thirdLocationDuration * 60)} min)`, 25);
          addBotMessage(`📍 Third stop back to base: ${thirdToBaseDistance.toFixed(1)} miles (${Math.ceil(thirdToBaseDuration * 60)} min)`, 30);
        } else {
          addBotMessage(`📍 Return to base: ${thirdToBaseDistance.toFixed(1)} miles (${Math.ceil(thirdToBaseDuration * 60)} min)`, 25);
        }

        addBotMessage(`✅ Total trip: ${totalTripDistance.toFixed(1)} miles`, 30);

        // Check for out of area or long distance
        if (fromDistance > 150) {
          setTimeout(() => {
            addBotMessage("🚨 This location might be outside our standard service area. You may need to call for a custom quote at 330-435-8686.", 175);
            updateStage(STAGES.OUT_OF_AREA);
          }, 175);
        } else {
          // Start asking questions about location FROM
          setTimeout(() => {
            addBotMessage("Now let me ask you a few questions about each location...", 175);
            setTimeout(() => {
              updateStage(STAGES.STAIRS_FROM);
              addBotMessage("Starting with your pickup location - are there any stairs there?", 50);
            }, 30);
          }, 175);
        }
      }, 25);

    } catch (error) {
      console.error('❌ Distance calculation error:', error);
      addBotMessage(`⚠️ ${error.message || "Couldn't calculate distances automatically. We'll verify during booking."}`, 50);

      // Set default distances and continue
      updateChatData({
        fromDistance: 30,
        fromDuration: 0.67,
        tripDistance: 30,
        tripDuration: 0.67,
        totalTripDistance: 60
      });

      setTimeout(() => {
        updateStage(STAGES.STAIRS_FROM);
        addBotMessage("Now let me ask you a few questions about each location...", 25);
        setTimeout(() => {
          addBotMessage("Starting with your pickup location - are there any stairs there?", 120);
        }, 30);
      }, 25);
    }
  }, [chatState.data, updateChatData, addBotMessage, updateStage]);

  // Handler for stairs from - continues with questions about FROM location
  const handleStairsFrom = useCallback((value) => {
    updateChatData({ stairsFrom: parseInt(value) });

    const stairsText = value === '0' ? 'No stairs' : value === '1' ? '1 flight' : `${value} flights`;
    addBotMessage(`${stairsText} at pickup - noted! ✓`, 30);

    // For labor-only, ask about destination stairs next
    if (chatState.data.serviceType === 'labor') {
      setTimeout(() => {
        updateStage(STAGES.STAIRS_TO);
        addBotMessage("And how about stairs at the delivery location?", 50);
      }, 25);
    }
    // For single item moves, ask about destination stairs next
    else if (chatState.data.serviceType === 'single') {
      setTimeout(() => {
        updateStage(STAGES.STAIRS_TO);
        addBotMessage("And how about stairs at the delivery location?", 50);
      }, 25);
    }
    // For full moves, continue with questions about the FROM location
    else {
      setTimeout(() => {
        updateStage(STAGES.HOME_TYPE);
        addBotMessage("What type of place are you moving FROM?", 50);
      }, 25);
    }
  }, [updateChatData, addBotMessage, updateStage, chatState.data.serviceType]);

  // Handler for location to - SIMPLIFIED: just collect address
  const handleLocationTo = useCallback(async (value) => {
    // Validate address format
    if (!value.includes(',') || value.split(',').length < 2) {
      addBotMessage("Please enter a complete address including street, city, and state.", 30);
      return;
    }

    updateChatData({ to: value });
    addBotMessage(`Perfect! Got your destination: ${value} ✓`, 30);

    // For labor-only and single item moves, calculate distances first
    if (chatState.data.serviceType === 'labor' || chatState.data.serviceType === 'single') {
      setTimeout(() => {
        updateStage(STAGES.START_LOCATION_DETAILS);
        addBotMessage("Great! Let me calculate the trip details... 🗺️", 50);
        // useEffect at line 1754 will auto-trigger handleStartLocationDetails
      }, 25);
    }
    // For full moves, ask about third location
    else {
      setTimeout(() => {
        updateStage(STAGES.ASK_THIRD_LOCATION);
        addBotMessage("Do you have a third location (like a storage unit)?", 50);
      }, 25);
    }
  }, [updateChatData, addBotMessage, updateStage, chatState.data.serviceType]);

  // Helper function to calculate return distance from delivery to base
  const calculateReturnDistance = useCallback(async (deliveryAddress) => {
    try {
      const baseAddress = CONFIG.baseAddress || "11715 Mahoning Avenue, North Jackson, OH 44451";
      const result = await calculateDistance(deliveryAddress, baseAddress);
      
      const returnDistance = parseFloat(result.distance);
      const returnDuration = parseFloat(result.duration);
      
      updateChatData({ 
        deliveryToBaseDistance: returnDistance,
        deliveryToBaseDuration: returnDuration
      });
      
      // Only charge half return if > 85 miles
      if (returnDistance > 85) {
        console.log('Long return distance detected:', returnDistance, 'miles - will charge half return trip');
      }
    } catch (error) {
      console.error('Error calculating return distance:', error);
      // Fallback to using fromDistance as estimate
      updateChatData({ 
        deliveryToBaseDistance: chatState.data.fromDistance || 30,
        deliveryToBaseDuration: ((chatState.data.fromDistance || 30) / 45)
      });
    }
  }, [updateChatData, chatState.data.fromDistance]);

  // Handler for stairs to - continues with questions about TO location
  const handleStairsTo = useCallback((value) => {
    updateChatData({
      stairsTo: parseInt(value),
      deliveryStairs: parseInt(value) // Also set for single items
    });

    const stairsText = value === '0' ? 'No stairs' : value === '1' ? '1 flight' : `${value} flights`;
    addBotMessage(`${stairsText} at destination - noted! ✓`, 30);

    // For labor-only, ask about heavy items next
    if (chatState.data.serviceType === 'labor') {
      setTimeout(() => {
        updateStage(STAGES.HEAVY_ITEMS_CHECK);
        addBotMessage("Do you have any heavy items (300+ lbs) that need moving?", 50);
      }, 25);
    }
    // For single item moves, offer photos
    else if (chatState.data.serviceType === 'single') {
      setTimeout(() => {
        updateStage(STAGES.OFFER_PHOTOS_SINGLE);
        addBotMessage(`Would you like to add photos of your ${chatState.data.itemName || 'item'}? This ensures we bring the right equipment.`, 50);
      }, 25);
    }
    // For full moves, if there's a third location, ask about it next
    else if (chatState.data.thirdLocation) {
      setTimeout(() => {
        updateStage(STAGES.STAIRS_THIRD);
        addBotMessage("Now let me ask about your third location...", 50);
        setTimeout(() => {
          addBotMessage("Are there any stairs at the third location?", 90);
        }, 30);
      }, 25);
    }
    // Otherwise, continue with destination type questions
    else {
      setTimeout(() => {
        updateStage(STAGES.DESTINATION_TYPE);
        addBotMessage("What type of place are you moving TO?", 50);
      }, 25);
    }
  }, [updateChatData, addBotMessage, updateStage, chatState.data.serviceType, chatState.data.itemName, chatState.data.thirdLocation]);

  // Proceed after all locations are collected
  const proceedAfterLocations = useCallback(() => {
    updateStage(STAGES.HOME_TYPE);
    addBotMessage("What type of place are you moving FROM?", 30);
  }, [updateStage, addBotMessage]);

  // Handler for third location
  const handleThirdLocation = useCallback(async (answer) => {
    if (answer === 'yes') {
      updateChatData({ hasThirdLocation: true });
      updateStage(STAGES.LOCATION_THIRD);
      addBotMessage("What's the address of the third location?", 30);
      addBotMessage("💡 Tip: Start typing and I'll suggest addresses!", 50);
    } else {
      updateChatData({ hasThirdLocation: false });
      proceedAfterLocations();
    }
  }, [updateChatData, updateStage, addBotMessage, proceedAfterLocations]);

  // Handler for third location address - SIMPLIFIED: just collect address
  const handleLocationThird = useCallback(async (value) => {
    if (!value.includes(',') || value.split(',').length < 2) {
      addBotMessage("Please enter a complete address including street, city, and state.", 30);
      return;
    }

    updateChatData({ thirdLocation: value });
    addBotMessage(`Perfect! Got your third location: ${value} ✓`, 30);

    setTimeout(() => {
      updateStage(STAGES.START_LOCATION_DETAILS);
      addBotMessage("Great! Now let me calculate all the trip details... 🗺️", 50);
    }, 25);
  }, [updateChatData, addBotMessage, updateStage]);

  // Handler for stairs at third location
  const handleStairsThird = useCallback((value) => {
    console.log('🪜 Stairs at third location:', value);
    updateChatData({ stairsThird: parseInt(value) });

    const stairsText = value === '0' ? 'No stairs' : value === '1' ? '1 flight' : `${value} flights`;
    addBotMessage(`${stairsText} at third location - noted! ✓`, 30);

    // Ask about bedrooms at third location
    setTimeout(() => {
      updateStage(STAGES.BEDROOMS_THIRD);
      addBotMessage("How many bedrooms at this third location?", 50);
    }, 25);
  }, [updateChatData, addBotMessage, updateStage]);

  // Handler for bedrooms at third location
  const handleBedroomsThird = useCallback((value) => {
    console.log('🛏️ Bedrooms at third location:', value);
    updateChatData({ bedroomsThird: parseInt(value) });

    const bedroomText = value === '1' ? '1 bedroom' : `${value} bedrooms`;
    addBotMessage(`Perfect! ${bedroomText} at third location noted. ✓`, 30);

    // All location questions done, move to general questions
    setTimeout(() => {
      updateStage(STAGES.TV_HANDLING_CHECK);
      addBotMessage("Now let me ask about some specifics...", 50);
      setTimeout(() => {
        addBotMessage("Do you have any TVs that need special handling? 📺", 90);
      }, 30);
    }, 25);
  }, [updateChatData, addBotMessage, updateStage]);

  // Handler for showing booking options (final estimate screen)
  const handleShowBookingOptions = useCallback(async (value) => {
    console.log('📋 Booking option selected:', value);

    if (value === 'schedule_acuity') {
      addBotMessage("Perfect! Let me open the scheduler for you... 📅", 30);
      // Trigger Acuity scheduler
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('open-acuity-scheduler'));
      }, 50);
    } else if (value === 'call') {
      addBotMessage("Great! Give us a call at 330-435-8686. We're ready to help! 📞", 30);
      setTimeout(() => {
        window.open('tel:330-435-8686');
      }, 30);
    } else if (value === 'email_quote') {
      addBotMessage("Perfect! I'm sending your estimate now... 📧", 30);

      try {
        // Submit the lead and send customer quote
        await submitLead(chatState.data);

        setTimeout(() => {
          addBotMessage("✅ Success! Your estimate has been sent to your email and our team. Check your inbox!", 25);
          setTimeout(() => {
            addBotMessage("You should receive two emails: one with your detailed estimate and one confirmation that we received your request. 📬", 25);
          }, 25);
        }, 50);
      } catch (error) {
        console.error('❌ Email send failed:', error);
        setTimeout(() => {
          addBotMessage("⚠️ Oops! There was an issue sending the email. Please call us at 330-435-8686 or try again.", 25);
        }, 50);
      }
    } else if (value === 'restart') {
      addBotMessage("No problem! Let's start fresh. 🔄", 30);
      setTimeout(() => {
        window.location.reload();
      }, 25);
    }
  }, [addBotMessage, chatState.data]);

  // Handler for questions/FAQ
  const handleQuestions = useCallback((value) => {
    console.log('❓ Question asked:', value);

    const answers = {
      'service_areas': "We proudly serve Northeast Ohio including Youngstown, Warren, Akron, Canton, and surrounding areas. Give us a call at 330-435-8686 to confirm your specific location!",
      'whats_included': "Our Movers + Truck service include professional movers, truck, fuel, equipment (dollies, straps, blankets), basic liability coverage, and local moves within 30 miles. Additional fees may apply for long distances, stairs, or specialty items.",
      'packing_info': "We offer full packing, partial packing (fragile items only), or just packing supplies. Our team uses professional-grade materials and techniques to protect your belongings.",
      'restricted_items': "We cannot move hazardous materials (paint, chemicals, propane), perishable food, plants, or items with pest infestations. Firearms and valuable documents should be transported personally.",
      'why_choose_us': "Worry Free Moving has been serving Northeast Ohio since 1997! We're locally owned, fully insured, and treat every move like it's our own. Our team is professional, careful, and committed to making your move worry-free! ⭐"
    };

    addBotMessage(answers[value] || "Great question! Give us a call at 330-435-8686 and we'll be happy to help!", 30);

    setTimeout(() => {
      addBotMessage("Anything else you'd like to know, or ready to get an estimate?", 25);
    }, 25);
  }, [addBotMessage]);

  // Handler for out of area
  const handleOutOfArea = useCallback((value) => {
    console.log('🚫 Out of area option:', value);

    if (value === 'call') {
      addBotMessage("Perfect! Call us at 330-435-8686 and we'll discuss your long-distance move. 📞", 30);
      setTimeout(() => {
        window.open('tel:330-435-8686');
      }, 30);
    } else if (value === 'continue') {
      addBotMessage("Great! Let's continue with your estimate. Keep in mind there may be additional travel fees. ✓", 30);
      setTimeout(() => {
        proceedAfterLocations();
      }, 25);
    } else if (value === 'restart') {
      window.location.reload();
    }
  }, [addBotMessage, proceedAfterLocations]);

  // Handler for home type
  const handleHomeType = useCallback((value) => {
    console.log('🏠 Home type selected:', value);
    updateChatData({ homeTypeFrom: value });

    const homeTypeNames = {
      'house': 'House',
      'apartment': 'Apartment',
      'condo': 'Condo',
      'storage': 'Storage Unit'
    };

    addBotMessage(`Got it - ${homeTypeNames[value]}! ✓`, 30);

    setTimeout(() => {
      updateStage(STAGES.HOME_SIZE_ASSESSMENT);
      addBotMessage("Is your current place larger than 2,600 square feet?", 50);
    }, 25);
  }, [updateChatData, addBotMessage, updateStage]);

  // Handler for home size assessment
  const handleHomeSizeAssessment = useCallback((value) => {
    console.log('📏 Home size selected:', value);
    updateChatData({ homeSize: value });

    const sizeText = value === 'large' ? 'larger home' : 'standard size home';
    addBotMessage(`Thanks - I've noted it's a ${sizeText}! ✓`, 30);

    setTimeout(() => {
      updateStage(STAGES.ACCESS_OBSTACLES);
      addBotMessage("Is there a long walk from the parking area to your door (75+ feet)?", 50);
    }, 25);
  }, [updateChatData, addBotMessage, updateStage]);

  // Handler for access obstacles
  const handleAccessObstacles = useCallback((value) => {
    console.log('🚶 Access distance:', value);
    updateChatData({ accessDistance: value });

    addBotMessage(value === 'long_walk' ? 'Got it - noted the long walk! ✓' : 'Perfect, normal access! ✓', 30);

    setTimeout(() => {
      updateStage(STAGES.BEDROOMS_FROM);
      addBotMessage("How many bedrooms are you moving FROM?", 50);
    }, 25);
  }, [updateChatData, addBotMessage, updateStage]);

  // Handler for destination type
  const handleDestinationType = useCallback((value) => {
    console.log('🏠 Destination type selected:', value);
    updateChatData({ homeTypeTo: value });

    const homeTypeNames = {
      'house': 'House',
      'apartment': 'Apartment',
      'condo': 'Condo',
      'storage': 'Storage Unit'
    };

    addBotMessage(`Moving to a ${homeTypeNames[value]} - got it! ✓`, 30);

    // If it's a storage unit, skip bedroom question
    if (value === 'storage') {
      setTimeout(() => {
        updateStage(STAGES.TV_HANDLING_CHECK);
        addBotMessage("Now let me ask about some specifics...", 50);
        setTimeout(() => {
          addBotMessage("Do you have any TVs that need special handling? 📺", 90);
        }, 30);
      }, 25);
    } else {
      setTimeout(() => {
        updateStage(STAGES.HOME_SIZE_ASSESSMENT_TO);
        addBotMessage("Is your destination place larger than 2,600 square feet?", 50);
      }, 25);
    }
  }, [updateChatData, addBotMessage, updateStage]);

  // Handler for bedrooms from
  const handleBedroomsFrom = useCallback((value) => {
    console.log('🛏️ Bedrooms from:', value);
    updateChatData({ bedroomsFrom: value });

    const bedroomText = value === '1' ? 'Studio/1 Bedroom' : `${value} Bedrooms`;
    addBotMessage(`${bedroomText} at current place - noted! ✓`, 30);

    setTimeout(() => {
      updateStage(STAGES.DESTINATION_TYPE);
      addBotMessage("What type of place are you moving TO?", 50);
    }, 25);
  }, [updateChatData, addBotMessage, updateStage]);

  // Handler for bedrooms to
  const handleBedroomsTo = useCallback((value) => {
    console.log('🛏️ Bedrooms to:', value);
    updateChatData({ bedroomsTo: value });

    const bedroomText = value === '1' ? 'Studio/1 Bedroom' : `${value} Bedrooms`;
    addBotMessage(`${bedroomText} at new place - perfect! ✓`, 30);

    // Continue to next stage (TV handling, appliances, etc.)
    setTimeout(() => {
      updateStage(STAGES.TV_HANDLING_CHECK);
      addBotMessage("Do you have any large TVs (55 inches or larger)?", 50);
    }, 25);
  }, [updateChatData, addBotMessage, updateStage]);

  // Handler for home size assessment at destination
  const handleHomeSizeAssessmentTo = useCallback((value) => {
    console.log('🏠 Home size assessment (TO):', value);
    updateChatData({ homeSizeTo: value });

    addBotMessage(value === 'large' ?
      'Large destination home noted! ✓' :
      'Standard size destination noted! ✓', 30);

    setTimeout(() => {
      updateStage(STAGES.BEDROOMS_TO);
      addBotMessage("How many bedrooms at your new place?", 50);
    }, 25);
  }, [updateChatData, addBotMessage, updateStage]);

  // Handler for TV handling check
  const handleTVHandlingCheck = useCallback((value) => {
    console.log('📺 TV handling:', value);
    updateChatData({ hasLargeTVs: value === 'yes' });

    if (value === 'yes') {
      addBotMessage("Got it - we'll handle those carefully! ✓", 30);
      setTimeout(() => {
        updateStage(STAGES.TV_PACKING_OPTIONS);
        addBotMessage("Do you have the original TV boxes, or need professional TV boxes?", 50);
      }, 25);
    } else {
      addBotMessage("No problem! ✓", 30);
      setTimeout(() => {
        updateStage(STAGES.CHECK_APPLIANCES);
        addBotMessage("Do you have any appliances that need moving (fridge, washer, dryer, etc.)?", 50);
      }, 25);
    }
  }, [updateChatData, addBotMessage, updateStage]);

  // Handler for TV packing options
  const handleTVPackingOptions = useCallback((value) => {
    console.log('📦 TV packing:', value);
    updateChatData({ tvPacking: value });

    const packingText = {
      'have_boxes': 'Great - original boxes!',
      'need_boxes': 'We\'ll bring professional TV boxes!',
      'no_boxes': 'Got it - you\'ll wrap them!'
    };

    addBotMessage(`${packingText[value]} ✓`, 30);

    setTimeout(() => {
      updateStage(STAGES.CHECK_APPLIANCES);
      addBotMessage("Do you have any appliances that need moving (fridge, washer, dryer, etc.)?", 50);
    }, 25);
  }, [updateChatData, addBotMessage, updateStage]);

  // Handler for check appliances (multi-select)
  const handleCheckAppliances = useCallback((selectedAppliances) => {
    console.log('🔌 Appliances selected:', selectedAppliances);

    // Handle array format from multi-select
    if (Array.isArray(selectedAppliances)) {
      updateChatData({
        appliances: selectedAppliances,
        hasAppliances: selectedAppliances.length > 0,
        applianceCount: selectedAppliances.length
      });

      if (selectedAppliances.length > 0) {
        const applianceNames = {
          'refrigerator': 'Refrigerator',
          'washer': 'Washer',
          'dryer': 'Dryer',
          'stove': 'Stove',
          'freezer': 'Freezer',
          'dishwasher': 'Dishwasher'
        };
        const selectedNames = selectedAppliances.map(a => applianceNames[a] || a);
        addBotMessage(`Got it! ${selectedNames.join(', ')} - all noted! ✓`, 30);
      } else {
        addBotMessage("No appliances - got it! ✓", 30);
      }

      setTimeout(() => {
        updateStage(STAGES.SHOP_EQUIPMENT_CHECK);
        addBotMessage("Do you have any shop/garage equipment? Select all that apply:", 50);
      }, 25);
    }
  }, [updateChatData, addBotMessage, updateStage]);

  // Handler for select appliances (detailed)
  const handleSelectAppliances = useCallback((value) => {
    console.log('🔌 Appliance selection:', value);

    const applianceList = chatState.data.applianceList || [];
    const currentAppliance = chatState.data.currentApplianceIndex || 0;
    const appliances = ['refrigerator', 'washer', 'dryer', 'stove', 'freezer', 'dishwasher'];
    const applianceNames = {
      'refrigerator': 'Refrigerator',
      'washer': 'Washer',
      'dryer': 'Dryer',
      'stove': 'Stove/Range',
      'freezer': 'Deep Freezer',
      'dishwasher': 'Dishwasher'
    };

    if (value === 'yes') {
      applianceList.push(appliances[currentAppliance]);
      addBotMessage(`${applianceNames[appliances[currentAppliance]]} - noted! ✓`, 30);
    } else {
      addBotMessage("No problem! ✓", 25);
    }

    const nextIndex = currentAppliance + 1;

    if (nextIndex < appliances.length) {
      updateChatData({
        applianceList,
        currentApplianceIndex: nextIndex
      });
      setTimeout(() => {
        addBotMessage(`Do you have a ${applianceNames[appliances[nextIndex]]} to move?`, 175);
      }, 30);
    } else {
      updateChatData({
        applianceList,
        applianceCount: applianceList.length
      });
      setTimeout(() => {
        updateStage(STAGES.SHOP_EQUIPMENT_CHECK);
        addBotMessage("Do you have any shop/garage equipment (workbenches, tool chests, etc.)?", 50);
      }, 50);
    }
  }, [chatState.data.applianceList, chatState.data.currentApplianceIndex, updateChatData, addBotMessage, updateStage]);

  // Handler for shop equipment check
  const handleShopEquipmentCheck = useCallback((selectedItems) => {
    console.log('🔧 Shop equipment selected:', selectedItems);

    // Handle both array (multi-select) and string (old yes/no) formats
    if (Array.isArray(selectedItems)) {
      updateChatData({
        shopEquipment: selectedItems,
        hasShopEquipment: selectedItems.length > 0
      });

      if (selectedItems.length > 0) {
        const itemNames = selectedItems.map(item => {
          const names = {
            'workbench': 'Workbench',
            'toolchest': 'Tool Chest',
            'compressor': 'Air Compressor',
            'generator': 'Generator',
            'ladders': 'Ladders',
            'mower': 'Lawn Mower',
            'snowblower': 'Snow Blower',
            'other': 'Other Equipment'
          };
          return names[item] || item;
        }).join(', ');

        addBotMessage(`Shop equipment noted: ${itemNames} ✓`, 30);
      } else {
        addBotMessage("No shop equipment - perfect! ✓", 30);
      }
    } else {
      // Legacy yes/no handling
      updateChatData({ hasShopEquipment: selectedItems === 'yes' });
      if (selectedItems === 'yes') {
        addBotMessage("Got it - I'll note the shop equipment! ✓", 30);
      } else {
        addBotMessage("No shop equipment - perfect! ✓", 30);
      }
    }

    setTimeout(() => {
      updateStage(STAGES.OVERSIZED_FURNITURE_CHECK);
      addBotMessage("Do you have any oversized or specialty items? (Piano, safe, pool table, gym equipment, etc.)", 50);
    }, 25);
  }, [updateChatData, addBotMessage, updateStage]);

  // Handler for oversized furniture check
  const handleOversizedFurnitureCheck = useCallback((value) => {
    console.log('📦 Oversized furniture check:', value);
    updateChatData({ hasOversizedItems: value === 'yes' });

    if (value === 'yes') {
      addBotMessage("Perfect! These items need special attention. Let me get details. ✓", 30);
      setTimeout(() => {
        updateStage(STAGES.SPECIAL_ITEMS);
        addBotMessage("Which special items do you have? Select all that apply:", 50);
      }, 25);
    } else {
      addBotMessage("No oversized items - great! ✓", 30);
      setTimeout(() => {
        updateStage(STAGES.ASK_PACKING_SUPPLIES);
        addBotMessage("Do you need packing materials (boxes, tape, bubble wrap)?", 50);
      }, 25);
    }
  }, [updateChatData, addBotMessage, updateStage]);

  // Handler for heavy items check (labor-only) - now multi-select
  const handleHeavyItemsCheck = useCallback((selectedItems) => {
    console.log('⚖️ Heavy items selected:', selectedItems);

    // Handle both array (multi-select) and legacy string formats
    if (!Array.isArray(selectedItems)) {
      // Legacy handling - shouldn't happen with MultiSelect but keeping for safety
      updateChatData({ hasHeavyItems: selectedItems === 'yes' });
      if (selectedItems === 'yes') {
        updateChatData({ minimumCrewSize: 4 });
      }
      setTimeout(() => {
        updateStage(STAGES.CREW_SIZE);
        addBotMessage("How many movers do you need?", 25);
      }, 25);
      return;
    }

    // Store selected items
    updateChatData({
      heavyItemsList: selectedItems,
      heavyItemsCount: selectedItems.length,
      hasHeavyItems: selectedItems.length > 0
    });

    // Check for items we don't move
    const cannotMove = [];
    if (selectedItems.includes('hotTub')) {
      cannotMove.push('hot tubs');
    }
    if (selectedItems.includes('poolTable')) {
      cannotMove.push('pool tables');
    }
    if (selectedItems.includes('aquarium')) {
      cannotMove.push('large aquariums');
    }
    if (selectedItems.includes('shed')) {
      cannotMove.push('sheds');
    }

    // If they selected items we can't move, show disclaimer
    if (cannotMove.length > 0) {
      const items = cannotMove.length === 1 ? cannotMove[0] :
                    cannotMove.length === 2 ? `${cannotMove[0]} or ${cannotMove[1]}` :
                    `${cannotMove.slice(0, -1).join(', ')}, or ${cannotMove[cannotMove.length - 1]}`;
      addBotMessage(`❌ Unfortunately, we do not move ${items}. We'll focus on the other items you selected.`, 30);
      setTimeout(() => {
        // Remove items we can't move from the list
        const validItems = selectedItems.filter(item => !['hotTub', 'poolTable', 'aquarium', 'shed'].includes(item));
        updateChatData({
          heavyItemsList: validItems,
          heavyItemsCount: validItems.length,
          hasHeavyItems: validItems.length > 0
        });
      }, 50);
    }

    // No items selected
    if (selectedItems.length === 0) {
      addBotMessage("No heavy items selected. ✓", 30);
      setTimeout(() => {
        updateStage(STAGES.CREW_SIZE);
        addBotMessage("How many movers do you need?", 50);
      }, 25);
      return;
    }

    // Filter out items we can't move for processing
    const validItems = selectedItems.filter(item => !['hotTub', 'poolTable', 'aquarium', 'shed'].includes(item));

    if (validItems.length === 0) {
      // They only selected items we can't move
      setTimeout(() => {
        updateStage(STAGES.CREW_SIZE);
        addBotMessage("How many movers do you need?", cannotMove.length > 0 ? 1500 : 1000);
      }, cannotMove.length > 0 ? 1500 : 1000);
      return;
    }

    // Show what was selected
    const itemNames = {
      'piano': '🎹 Piano',
      'safe': '🔒 Safe',
      'gym': '🏋️ Universal Gym',
      'freeWeights': '💪 Free Weights',
      'treadmill': '🏃 Treadmill/Elliptical',
      'hutch': '🪑 China Hutch',
      'aquarium': '🐠 Large Aquarium',
      'otherHeavy': '⚖️ Other Heavy Items (350+ lbs)'
    };
    const names = validItems.map(item => itemNames[item] || item).join(', ');
    addBotMessage(`Heavy items noted: ${names} ✓`, cannotMove.length > 0 ? 1000 : 500);

    // Determine if 4-person crew is needed
    // Items that require 4 people: piano, safe, gym, otherHeavy
    // Items that only need 2 people: hutch, freeWeights, treadmill
    const fourPersonItems = validItems.filter(item =>
      ['piano', 'safe', 'gym', 'otherHeavy'].includes(item)
    );

    if (fourPersonItems.length > 0) {
      // Set minimum crew size to 4 for heavy items that need it
      setTimeout(() => {
        updateChatData({ minimumCrewSize: 4 });
        addBotMessage("💪 Heavy items require at least 4 movers for safety.", cannotMove.length > 0 ? 1500 : 1000);
      }, cannotMove.length > 0 ? 1500 : 1000);
    } else {
      // Only lighter items selected (hutch, free weights, treadmill) - 2 people is fine
      setTimeout(() => {
        addBotMessage("✓ These items can be handled with your selected crew size.", cannotMove.length > 0 ? 1500 : 1000);
      }, cannotMove.length > 0 ? 1500 : 1000);
    }

    // Calculate delay based on whether crew size message was shown
    const baseDelay = cannotMove.length > 0 ? 1500 : 1000;
    const crewMessageDelay = fourPersonItems.length > 0 ? 1500 : 1000;

    // Check if piano was selected - requires follow-up
    if (validItems.includes('piano')) {
      setTimeout(() => {
        updateStage(STAGES.PIANO_TYPE);
        addBotMessage("What type of piano is it?", 50);
      }, baseDelay + crewMessageDelay);
      return;
    }

    // Check if safe was selected - requires follow-up
    if (validItems.includes('safe')) {
      setTimeout(() => {
        updateStage(STAGES.SAFE_DETAILS);
        addBotMessage("Let me ask about the safe details:", 50);
        setTimeout(() => {
          addBotMessage("⚠️ Items over 350 lbs WITH stairs require 4 people minimum.", 150);
        }, 25);
      }, baseDelay + crewMessageDelay);
      return;
    }

    // No follow-ups needed, go to crew size
    setTimeout(() => {
      updateStage(STAGES.CREW_SIZE);
      addBotMessage("How many movers do you need?", 50);
    }, baseDelay + crewMessageDelay);
  }, [updateChatData, addBotMessage, updateStage]);

  const handleSpecialItems = useCallback((selectedItems) => {
    console.log('🎹 Special items selected:', selectedItems);

    // Handle both array (multi-select) and string (old single-select) formats
    if (Array.isArray(selectedItems)) {
      updateChatData({
        specialItemsList: selectedItems,
        specialItemsCount: selectedItems.length,
        hasSpecialItems: selectedItems.length > 0
      });

      if (selectedItems.length === 0) {
        addBotMessage("No special items selected. ✓", 30);
      } else {
        const itemNames = {
          'piano': '🎹 Piano',
          'safe': '🔒 Safe',
          'heavyItems': '⚖️ Heavy Items (300+ lbs)',
          'gym': '🏋️ Universal Gym',
          'freeWeights': '💪 Free Weights',
          'treadmill': '🏃 Treadmill/Elliptical',
          'hutch': '🪑 China Hutch',
          'aquarium': '🐠 Large Aquarium'
        };
        const names = selectedItems.map(item => itemNames[item] || item).join(', ');
        addBotMessage(`Special items noted: ${names} ✓`, 30);

        // Check if piano was selected - requires follow-up
        if (selectedItems.includes('piano')) {
          setTimeout(() => {
            updateStage(STAGES.PIANO_TYPE);
            addBotMessage("What type of piano is it?", 50);
            addBotMessage("⚠️ Note: We only move Spinet and Upright pianos. Grand pianos require specialized movers.", 90);
          }, 25);
          return;
        }

        // Offer photos for special items
        setTimeout(() => {
          updateStage(STAGES.OFFER_SPECIAL_ITEM_PHOTOS);
          addBotMessage("Would you like to add photos of these special items? This helps us bring the right equipment!", 50);
        }, 25);
      }
    } else {
      // Legacy single-select handling
      const specialItemsList = chatState.data.specialItemsList || [];

      if (selectedItems === 'none') {
        addBotMessage("No special items selected. ✓", 30);
      } else {
        specialItemsList.push(selectedItems);
        const itemNames = {
          'piano': 'Piano',
          'safe': 'Safe',
          'heavyItems': 'Heavy Items (300+ lbs)',
          'gym': 'Universal Gym',
          'freeWeights': 'Free Weights',
          'treadmill': 'Treadmill/Elliptical',
          'hutch': 'China Hutch',
          'aquarium': 'Large Aquarium'
        };
        addBotMessage(`${itemNames[selectedItems]} - we'll handle it with care! ✓`, 30);
      }

      updateChatData({
        specialItemsList,
        specialItemsCount: specialItemsList.length
      });
    }

    // If no piano or legacy path, continue to packing
    if (!Array.isArray(selectedItems) || !selectedItems.includes('piano')) {
      setTimeout(() => {
        updateStage(STAGES.ASK_PACKING_SUPPLIES);
        addBotMessage("Do you need packing materials (boxes, tape, bubble wrap)?", 50);
      }, 25);
    }
  }, [chatState.data.specialItemsList, updateChatData, addBotMessage, updateStage]);

  // Handler for piano type
  const handlePianoType = useCallback((value) => {
    console.log('🎹 Piano type selected:', value);

    if (value === 'grand') {
      updateChatData({ pianoType: value, requiresPhoneCall: true });
      addBotMessage("Grand pianos require specialized movers with proper equipment and insurance. 📞", 30);
      setTimeout(() => {
        addBotMessage("Please call us at 330-435-8686 to schedule this move. We'll discuss the details and provide an accurate quote!", 25);
        updateStage(STAGES.OUT_OF_AREA); // Or create a REQUIRES_CALL stage
      }, 25);
    } else {
      // Spinet or Upright
      const crewSize = value === 'spinet' ? 3 : 4;
      const pianoBoardFee = 75; // Piano board rental fee

      updateChatData({
        pianoType: value,
        minimumCrewSize: crewSize,
        pianoBoardFee: pianoBoardFee,
        additionalFees: {
          ...(chatState.data.additionalFees || {}),
          pianoBoard: pianoBoardFee
        }
      });

      const pianoNames = {
        'spinet': 'Spinet piano (requires 3 movers)',
        'upright': 'Upright piano (requires 4 movers)'
      };

      addBotMessage(`${pianoNames[value]} noted! ✓`, 30);
      setTimeout(() => {
        addBotMessage(`Piano board rental: $${pianoBoardFee} (required for safe transport)`, 25);
      }, 50);

      // Offer photos
      setTimeout(() => {
        updateStage(STAGES.OFFER_SPECIAL_ITEM_PHOTOS);
        addBotMessage("Would you like to add photos of your special items? This helps us bring the right equipment!", 25);
      }, 30);
    }
  }, [chatState.data.additionalFees, updateChatData, addBotMessage, updateStage]);

  // Handler for safe details
  const handleSafeDetails = useCallback((value) => {
    console.log('🔒 Safe details selected:', value);

    if (value === 'unsure') {
      updateChatData({ safeDetails: value, requiresPhoneCall: true });
      addBotMessage("No problem! Safe moving requires careful assessment. 📞", 30);
      setTimeout(() => {
        addBotMessage("Please call us at 330-435-8686 so we can discuss the safe's weight, dimensions, and access details.", 25);
        setTimeout(() => {
          addBotMessage("This ensures we bring the right equipment and crew size!", 25);
        }, 90);
      }, 50);
      setTimeout(() => {
        updateStage(STAGES.CREW_SIZE);
        addBotMessage("For now, let's continue with your estimate. How many movers do you need?", 190);
      }, 875);
      return;
    }

    if (value === 'heavy_with_stairs') {
      updateChatData({ safeDetails: value, minimumCrewSize: 4, requiresPhoneCall: true });
      addBotMessage("⚠️ Safes over 350 lbs with stairs require a phone consultation for safety.", 30);
      setTimeout(() => {
        addBotMessage("Please call us at 330-435-8686 to discuss. We need at least 4 movers and special equipment.", 25);
        setTimeout(() => {
          addBotMessage("💡 Pro tip: We prefer garage deliveries for heavy safes when possible!", 25);
        }, 90);
      }, 50);
      setTimeout(() => {
        updateStage(STAGES.CREW_SIZE);
        addBotMessage("For your estimate, we'll plan for 4+ movers. How many would you like?", 190);
      }, 875);
      return;
    }

    if (value === 'heavy_no_stairs') {
      const crewSize = 4;
      updateChatData({
        safeDetails: value,
        minimumCrewSize: crewSize
      });
      addBotMessage("Heavy safe noted! We'll need at least 4 movers for this. 💪", 30);
      setTimeout(() => {
        addBotMessage("⚠️ Note: We cannot move safes over 400 lbs. If yours is close to that limit, please call us at 330-435-8686.", 25);
      }, 50);
      setTimeout(() => {
        updateStage(STAGES.CREW_SIZE);
        addBotMessage("How many movers would you like?", 140);
      }, 160);
      return;
    }

    if (value === 'light_with_stairs') {
      const crewSize = 4;
      updateChatData({
        safeDetails: value,
        minimumCrewSize: crewSize
      });
      addBotMessage("Safe with stairs - we'll need 4 movers for safety. ✓", 30);
      setTimeout(() => {
        addBotMessage("💡 Even lighter safes with stairs require extra hands to navigate safely!", 25);
      }, 50);
      setTimeout(() => {
        updateStage(STAGES.CREW_SIZE);
        addBotMessage("How many movers do you need? (Minimum 4 for this safe)", 140);
      }, 160);
      return;
    }

    // light_no_stairs
    const crewSize = 3;
    updateChatData({
      safeDetails: value,
      minimumCrewSize: crewSize
    });
    addBotMessage("Lighter safe, no stairs - we'll need at least 3 movers. ✓", 30);
    setTimeout(() => {
      updateStage(STAGES.CREW_SIZE);
      addBotMessage("How many movers do you need?", 90);
    }, 25);
  }, [updateChatData, addBotMessage, updateStage]);

  // Handler for crew size with validation
  const handleCrewSize = useCallback((value) => {
    console.log('👥 Crew size selected:', value);
    const selectedCrew = parseInt(value);
    const minimumCrew = chatState.data.minimumCrewSize || 2;

    // Validate against minimum crew size
    if (selectedCrew < minimumCrew) {
      addBotMessage(`❌ Sorry, you need at least ${minimumCrew} movers for the items you've selected.`, 30);
      setTimeout(() => {
        addBotMessage("Please select a larger crew size or call us at 330-435-8686 to discuss alternatives.", 25);
      }, 50);
      return; // Don't advance, let them try again
    }

    updateChatData({ crewSize: selectedCrew });
    addBotMessage(`Perfect! ${selectedCrew} person crew selected. ✓`, 30);

    // Continue to hours
    setTimeout(() => {
      updateStage(STAGES.HOURS);
      addBotMessage("How many hours do you estimate needing? (2 hour minimum)", 50);
    }, 25);
  }, [chatState.data.minimumCrewSize, updateChatData, addBotMessage, updateStage]);

  // Handler for hours
  const handleHours = useCallback((value) => {
    console.log('⏰ Hours selected:', value);

    if (value === 'other_hours') {
      addBotMessage("How many hours do you estimate needing? Please enter a number (2-12):", 30);
      return; // Will stay on HOURS stage, waiting for custom input
    }

    const hours = parseInt(value);

    // Validate hours (minimum 2, maximum 12)
    if (hours < 2) {
      addBotMessage("We have a 2-hour minimum. Please select at least 2 hours.", 30);
      return;
    }

    if (hours > 12) {
      addBotMessage("For jobs over 12 hours, please call us at 330-435-8686 for a custom quote.", 30);
      return;
    }

    updateChatData({ hours: hours });
    addBotMessage(`Perfect! ${hours} hours noted. ✓`, 30);

    // For labor-only, offer photos next
    if (chatState.data.serviceType === 'labor') {
      setTimeout(() => {
        updateStage(STAGES.OFFER_PHOTOS_LABOR);
        addBotMessage("Would you like to add photos of the items you need help with? This helps us bring the right equipment!", 50);
      }, 25);
    } else {
      // For other service types, calculate estimate and show booking options
      setTimeout(() => {
        addBotMessage("🎉 Calculating your personalized estimate now...", 50);
        setTimeout(async () => {
          try {
            // Calculate estimate based on service type
            let estimate;
            if (chatState.data.serviceType === 'moving') {
              estimate = await calculateMovingEstimate(chatState.data);
            } else if (chatState.data.serviceType === 'single') {
              estimate = calculateSingleItemEstimate(chatState.data);
            }

            // Store estimate in chat data
            updateChatData({ estimate });

            // Show estimate popup
            if (estimate) {
              setTimeout(() => {
                addBotMessage(`🎉 Great news! Your estimate is ready for $${estimate.total}! Opening details now...`, 30);
                setTimeout(() => {
                  setShowEstimateModal(true);
                  setTimeout(() => {
                    updateStage(STAGES.SHOW_BOOKING_OPTIONS);
                  }, 25);
                }, 25);
              }, 30);
            } else {
              updateStage(STAGES.SHOW_BOOKING_OPTIONS);
              addBotMessage("Your estimate is ready! Here are your next steps:", 25);
            }
          } catch (error) {
            console.error('❌ Estimate calculation failed:', error);
            updateStage(STAGES.SHOW_BOOKING_OPTIONS);
            addBotMessage("Here are your next steps:", 25);
          }
        }, 25);
      }, 25);
    }
  }, [chatState.data, updateChatData, addBotMessage, updateStage]);

  // Handler for labor photos
  const handleOfferPhotosLabor = useCallback((value) => {
    console.log('📸 Labor photos:', value);

    if (value === 'yes') {
      updateChatData({ wantsToAddPhotos: true });
      addBotMessage("Great! You can upload photos when we confirm your booking. 📸 ✓", 30);
    } else {
      addBotMessage("No problem! We'll work with the details you've provided. ✓", 30);
    }

    setTimeout(() => {
      addBotMessage("🎉 Calculating your personalized labor estimate now...", 50);
      setTimeout(async () => {
        try {
          // Calculate labor estimate
          const estimate = calculateLaborEstimate(chatState.data);

          // Store estimate in chat data
          updateChatData({ estimate });

          // Show estimate popup
          if (estimate) {
            setTimeout(() => {
              addBotMessage(`🎉 Great news! Your labor estimate is ready for $${estimate.total}! Opening details now...`, 30);
              setTimeout(() => {
                setShowEstimateModal(true);
                setTimeout(() => {
                  updateStage(STAGES.SHOW_BOOKING_OPTIONS);
                }, 25);
              }, 25);
            }, 30);
          } else {
            updateStage(STAGES.SHOW_BOOKING_OPTIONS);
            addBotMessage("Your estimate is ready! Here are your next steps:", 25);
          }
        } catch (error) {
          console.error('❌ Labor estimate calculation failed:', error);
          updateStage(STAGES.SHOW_BOOKING_OPTIONS);
          addBotMessage("Here are your next steps:", 25);
        }
      }, 25);
    }, 25);
  }, [chatState.data, updateChatData, addBotMessage, updateStage]);

  // Handler for single item photos
  const handleOfferPhotosSingle = useCallback((value) => {
    console.log('📸 Single item photos:', value);

    if (value === 'add_photos') {
      updateChatData({ wantsToAddPhotos: true });
      addBotMessage("Great! You can upload photos when we confirm your booking. 📸 ✓", 30);
    } else {
      addBotMessage("No problem! We'll work with the details you've provided. ✓", 30);
    }

    setTimeout(() => {
      addBotMessage("🎉 Calculating your personalized estimate now...", 50);
      setTimeout(async () => {
        try {
          // Calculate single item estimate
          const estimate = calculateSingleItemEstimate(chatState.data);

          // Store estimate in chat data
          updateChatData({ estimate });

          // Show estimate popup
          if (estimate) {
            setTimeout(() => {
              addBotMessage(`🎉 Great news! Your estimate is ready for $${estimate.total}! Opening details now...`, 30);
              setTimeout(() => {
                setShowEstimateModal(true);
                setTimeout(() => {
                  updateStage(STAGES.SHOW_BOOKING_OPTIONS);
                }, 25);
              }, 25);
            }, 30);
          } else {
            updateStage(STAGES.SHOW_BOOKING_OPTIONS);
            addBotMessage("Your estimate is ready! Here are your next steps:", 25);
          }
        } catch (error) {
          console.error('❌ Single item estimate calculation failed:', error);
          updateStage(STAGES.SHOW_BOOKING_OPTIONS);
          addBotMessage("Here are your next steps:", 25);
        }
      }, 25);
    }, 25);
  }, [chatState.data, updateChatData, addBotMessage, updateStage]);

  // Handler for special item photos
  const handleOfferSpecialItemPhotos = useCallback((value) => {
    console.log('📸 Special item photos:', value);

    if (value === 'yes') {
      updateChatData({ wantsToAddPhotos: true });
      addBotMessage("Great! You can upload photos when we confirm your booking. 📸 ✓", 30);
    } else {
      addBotMessage("No problem! We'll work with the details you've provided. ✓", 30);
    }

    setTimeout(() => {
      updateStage(STAGES.ASK_PACKING_SUPPLIES);
      addBotMessage("Do you need packing materials (boxes, tape, bubble wrap)?", 50);
    }, 25);
  }, [updateChatData, addBotMessage, updateStage]);

  // Handler for FVP options
  const handleShowFVPOptions = useCallback(async (value) => {
    console.log('🛡️ FVP option selected:', value);

    if (value === 'standard') {
      updateChatData({ fvpOption: 'standard', fvpCost: 0 });
      addBotMessage("Standard coverage selected - you're covered at $0.60 per pound per article. ✓", 30);

      // Calculate and show estimate for standard coverage
      setTimeout(() => {
        addBotMessage("🎉 Calculating your personalized estimate now...", 50);
        setTimeout(async () => {
          try {
            // Calculate moving estimate with standard FVP
            const updatedData = {
              ...chatState.data,
              fvpOption: 'standard',
              fvpCost: 0
            };
            const estimate = await calculateMovingEstimate(updatedData);

            // Store estimate in chat data
            updateChatData({ estimate });

            // Show estimate popup
            if (estimate) {
              setTimeout(() => {
                addBotMessage(`🎉 Great news! Your estimate is ready for $${estimate.total}! Opening details now...`, 30);
                setTimeout(() => {
                  setShowEstimateModal(true);
                  setTimeout(() => {
                    updateStage(STAGES.SHOW_BOOKING_OPTIONS);
                  }, 25);
                }, 25);
              }, 30);
            } else {
              updateStage(STAGES.SHOW_BOOKING_OPTIONS);
              addBotMessage("Your estimate is ready! Here are your next steps:", 25);
            }
          } catch (error) {
            console.error('❌ Estimate calculation failed:', error);
            updateStage(STAGES.SHOW_BOOKING_OPTIONS);
            addBotMessage("Here are your next steps:", 25);
          }
        }, 25);
      }, 25);

    } else if (value === 'fvp') {
      updateChatData({ fvpOption: 'fvp' });
      addBotMessage("Excellent choice! Full Value Protection provides comprehensive coverage. 🛡️", 30);
      setTimeout(() => {
        updateStage(STAGES.FVP_VALUE);
        addBotMessage("What's the estimated value of your personal property? (Enter amount in dollars, e.g., 25000)", 25);
      }, 50);
    } else if (value === 'skip') {
      updateChatData({ fvpOption: 'standard', fvpCost: 0 });
      addBotMessage("No problem! You'll have standard coverage at $0.60 per pound per article. ✓", 30);

      // Calculate and show estimate for skip option (same as standard)
      setTimeout(() => {
        addBotMessage("🎉 Calculating your personalized estimate now...", 50);
        setTimeout(async () => {
          try {
            // Calculate moving estimate with standard FVP
            const updatedData = {
              ...chatState.data,
              fvpOption: 'standard',
              fvpCost: 0
            };
            const estimate = await calculateMovingEstimate(updatedData);

            // Store estimate in chat data
            updateChatData({ estimate });

            // Show estimate popup
            if (estimate) {
              setTimeout(() => {
                addBotMessage(`🎉 Great news! Your estimate is ready for $${estimate.total}! Opening details now...`, 30);
                setTimeout(() => {
                  setShowEstimateModal(true);
                  setTimeout(() => {
                    updateStage(STAGES.SHOW_BOOKING_OPTIONS);
                  }, 25);
                }, 25);
              }, 30);
            } else {
              updateStage(STAGES.SHOW_BOOKING_OPTIONS);
              addBotMessage("Your estimate is ready! Here are your next steps:", 25);
            }
          } catch (error) {
            console.error('❌ Estimate calculation failed:', error);
            updateStage(STAGES.SHOW_BOOKING_OPTIONS);
            addBotMessage("Here are your next steps:", 25);
          }
        }, 25);
      }, 25);
    }
  }, [chatState.data, updateChatData, addBotMessage, updateStage, setShowEstimateModal]);

  // Handler for FVP value input
  const handleFVPValue = useCallback((value) => {
    console.log('💰 FVP value entered:', value);
    const cleanValue = parseFloat(value) || 0;

    if (cleanValue < 1000) {
      addBotMessage("Please enter a value of at least $1,000.", 30);
      return;
    }

    if (cleanValue > 500000) {
      addBotMessage("For values over $500,000, please call us at 330-435-8686 for specialized coverage. 📞", 30);
      return;
    }

    updateChatData({ fvpValue: cleanValue });
    addBotMessage(`Perfect! Coverage for $${cleanValue.toLocaleString()} noted. ✓`, 30);

    setTimeout(() => {
      updateStage(STAGES.FVP_DEDUCTIBLE);
      addBotMessage("Choose your deductible level. Higher deductibles reduce the protection cost:", 25);
    }, 50);
  }, [updateChatData, addBotMessage, updateStage]);

  // Handler for FVP deductible selection
  const handleFVPDeductible = useCallback(async (value) => {
    console.log('🔒 FVP deductible selected:', value);
    const deductible = parseInt(value) || 0;
    const fvpValue = chatState.data.fvpValue || 0;
    const tripDistance = chatState.data.tripDistance || 30;

    // Calculate FVP cost using the utility function
    const fvpCost = calculateFVPCost(fvpValue, deductible, tripDistance);

    updateChatData({
      fvpDeductible: deductible,
      fvpCost: fvpCost
    });

    const deductibleText = deductible === 0 ? '$0' : `$${deductible.toLocaleString()}`;
    addBotMessage(`${deductibleText} deductible selected. Your Full Value Protection cost: $${fvpCost.toLocaleString()} ✓`, 30);

    setTimeout(() => {
      addBotMessage("🎉 Calculating your personalized estimate now...", 50);
      setTimeout(async () => {
        try {
          // Calculate moving estimate with FVP included
          const updatedData = {
            ...chatState.data,
            fvpDeductible: deductible,
            fvpCost: fvpCost
          };
          const estimate = await calculateMovingEstimate(updatedData);

          // Store estimate in chat data
          updateChatData({ estimate });

          // Show estimate popup
          if (estimate) {
            setTimeout(() => {
              addBotMessage(`🎉 Great news! Your estimate is ready for $${estimate.total}! Opening details now...`, 30);
              setTimeout(() => {
                setShowEstimateModal(true);
                // After showing estimate, show personal items warning
                setTimeout(() => {
                  addBotMessage(`<div style="background: #fff5f5; border: 1px solid #fc8181; border-radius: 8px; padding: 12px; margin: 10px 0;">
                    <strong style="color: #e53e3e;">⚠️ Important: Personal Items Notice</strong><br><br>
                    <div style="color: #742a2a; font-size: 13px; line-height: 1.5;">
                      For your security, please transport these items in your personal vehicle:
                      <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Irreplaceable items and family heirlooms</li>
                        <li>Prescription medications</li>
                        <li>Important documents</li>
                        <li>Valuable jewelry</li>
                        <li>Items of sentimental value</li>
                      </ul>
                      <div style="background: #ffe6e6; padding: 10px; border-radius: 6px; margin-top: 12px; border-left: 3px solid #dc3545;">
                        <strong>🚫 Coverage Disclaimer:</strong> Personal belongings, jewelry, and prescription medications are NOT covered by Full Value Protection or standard moving insurance. Please keep these items with you.
                      </div>
                    </div>
                  </div>`, 25);

                  setTimeout(() => {
                    updateStage(STAGES.SHOW_BOOKING_OPTIONS);
                    addBotMessage("Your estimate includes Full Value Protection. Here are your next steps:", 25);
                  }, 25);
                }, 25);
              }, 25);
            }, 30);
          } else {
            updateStage(STAGES.SHOW_BOOKING_OPTIONS);
            addBotMessage("Your estimate is ready! Here are your next steps:", 25);
          }
        } catch (error) {
          console.error('❌ Estimate calculation failed:', error);
          updateStage(STAGES.SHOW_BOOKING_OPTIONS);
          addBotMessage("Here are your next steps:", 25);
        }
      }, 25);
    }, 25);
  }, [chatState.data, updateChatData, addBotMessage, updateStage, setShowEstimateModal]);

  // Handler for packing supplies
  const handleAskPackingSupplies = useCallback((value) => {
    console.log('📦 Packing supplies:', value);

    if (value === 'yes') {
      // Estimate total rooms based on bedroom count
      const bedrooms = parseInt(chatState.data.bedrooms) || 2;
      // Estimate: bedrooms + living room + kitchen + bathrooms
      const totalRooms = Math.max(bedrooms + 2, 3); // Minimum 3 rooms

      updateChatData({
        needsPackingMaterials: true,
        totalRooms: totalRooms
      });

      addBotMessage("We'll include packing materials! ✓", 30);
    } else {
      updateChatData({ needsPackingMaterials: false });
      addBotMessage("No problem - you've got your own! ✓", 30);
    }

    setTimeout(() => {
      updateStage(STAGES.ASK_PACKING_SERVICE);
      addBotMessage("Do you need professional packing help?", 50);
    }, 25);
  }, [chatState.data, updateChatData, addBotMessage, updateStage]);

  // Handler for total rooms
  const handleAskTotalRooms = useCallback((value) => {
    console.log('🏠 Total rooms:', value);
    const totalRooms = parseInt(value);

    if (!totalRooms || totalRooms < 1 || totalRooms > 30) {
      addBotMessage("Please enter a valid number of rooms (1-30).", 30);
      return;
    }

    updateChatData({ totalRooms });
    addBotMessage(`Perfect! ${totalRooms} rooms noted. ✓`, 30);

    setTimeout(() => {
      updateStage(STAGES.ASK_PACKING_SERVICE);
      addBotMessage("Do you need professional packing help?", 50);
    }, 25);
  }, [updateChatData, addBotMessage, updateStage]);

  // Handler for packing service
  const handleAskPackingService = useCallback((value) => {
    console.log('🎁 Packing service:', value);

    // Partial packing takes 0.5x the time of full packing
    const packingTimeMultiplier = value === 'partial' ? 0.5 : value === 'full' ? 1.0 : 0;

    updateChatData({
      packingService: value,
      packingTimeMultiplier: packingTimeMultiplier
    });

    const packingText = {
      'full': 'Full packing service - we\'ll pack everything!',
      'partial': 'Partial packing for fragile items (estimated at half the time of full packing)!',
      'no': 'No packing service needed!'
    };

    addBotMessage(`${packingText[value]} ✓`, 30);

    setTimeout(() => {
      updateStage(STAGES.SHOW_FVP_OPTIONS);
      addBotMessage("Would you like to add Full Value Protection to your move?", 50);
    }, 25);
  }, [updateChatData, addBotMessage, updateStage]);

  // Handler for get email
  const handleGetEmail = useCallback((value) => {
    console.log('📧 Email:', value);

    // Basic email validation
    if (!value || !value.includes('@') || value.length < 5) {
      addBotMessage("Please enter a valid email address.", 30);
      return;
    }

    updateChatData({ email: value });
    addBotMessage("Perfect! ✓", 30);

    setTimeout(() => {
      updateStage(STAGES.GET_PHONE);
      addBotMessage("And what's the best phone number to reach you?", 50);
    }, 25);
  }, [updateChatData, addBotMessage, updateStage]);

  // Handler for get phone
  const handleGetPhone = useCallback((value) => {
    console.log('📞 Phone:', value);

    // Basic phone validation
    const phoneDigits = value.replace(/\D/g, '');
    if (!phoneDigits || phoneDigits.length < 10) {
      addBotMessage("Please enter a valid phone number.", 30);
      return;
    }

    updateChatData({ phone: value });
    addBotMessage("Perfect! ✓", 30);

    setTimeout(() => {
      const serviceQuestions = [
        "So, what brings you here today? What kind of service can I help you with?",
        "What type of service are you looking for today?",
        "What can I help you with - are you planning a move, or do you need something else?"
      ];
      addBotMessage(serviceQuestions[Math.floor(Math.random() * serviceQuestions.length)], 50);
      updateStage(STAGES.SERVICE_SELECTION);
    }, 25);
  }, [updateChatData, addBotMessage, updateStage]);

  // Process user responses
  const processResponse = useCallback((value) => {
    console.log('FlowController: Processing response:', value, 'for stage:', chatState.stage);
    
    if (!['restart', 'continue', 'back_to_questions'].includes(value)) {
      saveNavigationState();
    }

    if (value === 'restart') {
      window.location.reload();
      return;
    }

    switch (chatState.stage) {
      case STAGES.GET_NAME_INITIAL:
        handleNameInput(value);
        break;
      
      case STAGES.SERVICE_SELECTION:
        handleServiceSelection(value);
        break;
      
      case STAGES.MOVING_DATE:
        handleMovingDate(value);
        break;
      
      case STAGES.PEST_DISCLAIMER:
        handlePestDisclaimer(value);
        break;
      
      case STAGES.LOCATION_FROM:
        handleLocationFrom(value);
        break;
        
      case STAGES.STAIRS_FROM:
        handleStairsFrom(value);
        break;
        
      case STAGES.LOCATION_TO:
        handleLocationTo(value);
        break;
        
      case STAGES.STAIRS_TO:
        handleStairsTo(value);
        break;
        
      case STAGES.ASK_THIRD_LOCATION:
        handleThirdLocation(value);
        break;
        
      case STAGES.LOCATION_THIRD:
        handleLocationThird(value);
        break;

      case STAGES.START_LOCATION_DETAILS:
        handleStartLocationDetails();
        break;

      case STAGES.STAIRS_THIRD:
        handleStairsThird(value);
        break;

      case STAGES.HOME_TYPE:
        handleHomeType(value);
        break;

      case STAGES.HOME_SIZE_ASSESSMENT:
        handleHomeSizeAssessment(value);
        break;

      case STAGES.ACCESS_OBSTACLES:
        handleAccessObstacles(value);
        break;

      case STAGES.DESTINATION_TYPE:
        handleDestinationType(value);
        break;

      case STAGES.BEDROOMS_FROM:
        handleBedroomsFrom(value);
        break;

      case STAGES.HOME_SIZE_ASSESSMENT_TO:
        handleHomeSizeAssessmentTo(value);
        break;

      case STAGES.BEDROOMS_TO:
        handleBedroomsTo(value);
        break;

      case STAGES.BEDROOMS_THIRD:
        handleBedroomsThird(value);
        break;

      case STAGES.TV_HANDLING_CHECK:
        handleTVHandlingCheck(value);
        break;

      case STAGES.TV_PACKING_OPTIONS:
        handleTVPackingOptions(value);
        break;

      case STAGES.CHECK_APPLIANCES:
        handleCheckAppliances(value);
        break;

      case STAGES.SELECT_APPLIANCES:
        handleSelectAppliances(value);
        break;

      case STAGES.SHOP_EQUIPMENT_CHECK:
        handleShopEquipmentCheck(value);
        break;

      case STAGES.OVERSIZED_FURNITURE_CHECK:
        handleOversizedFurnitureCheck(value);
        break;

      case STAGES.HEAVY_ITEMS_CHECK:
        handleHeavyItemsCheck(value);
        break;

      case STAGES.SPECIAL_ITEMS:
        handleSpecialItems(value);
        break;

      case STAGES.PIANO_TYPE:
        handlePianoType(value);
        break;

      case STAGES.SAFE_DETAILS:
        handleSafeDetails(value);
        break;

      case STAGES.CREW_SIZE:
      case STAGES.CREW_SIZE_MOVING:
        handleCrewSize(value);
        break;

      case STAGES.HOURS:
        handleHours(value);
        break;

      case STAGES.OFFER_PHOTOS_LABOR:
        handleOfferPhotosLabor(value);
        break;

      case STAGES.OFFER_PHOTOS_SINGLE:
        handleOfferPhotosSingle(value);
        break;

      case STAGES.OFFER_SPECIAL_ITEM_PHOTOS:
        handleOfferSpecialItemPhotos(value);
        break;

      case STAGES.ASK_PACKING_SUPPLIES:
        handleAskPackingSupplies(value);
        break;

      case STAGES.ASK_TOTAL_ROOMS:
        handleAskTotalRooms(value);
        break;

      case STAGES.ASK_PACKING_SERVICE:
        handleAskPackingService(value);
        break;

      case STAGES.GET_EMAIL:
        handleGetEmail(value);
        break;

      case STAGES.GET_PHONE:
        handleGetPhone(value);
        break;

      case STAGES.SHOW_FVP_OPTIONS:
        handleShowFVPOptions(value);
        break;

      case STAGES.FVP_VALUE:
        handleFVPValue(value);
        break;

      case STAGES.FVP_DEDUCTIBLE:
        handleFVPDeductible(value);
        break;

      case STAGES.SHOW_BOOKING_OPTIONS:
        handleShowBookingOptions(value);
        break;

      case STAGES.QUESTIONS:
        handleQuestions(value);
        break;

      case STAGES.OUT_OF_AREA:
        handleOutOfArea(value);
        break;

      default:
        console.log('Unhandled stage:', chatState.stage);
    }
  }, [
    chatState.stage,
    saveNavigationState,
    handleNameInput,
    handleServiceSelection,
    handleMovingDate,
    handlePestDisclaimer,
    handleLocationFrom,
    handleStairsFrom,
    handleLocationTo,
    handleStairsTo,
    handleThirdLocation,
    handleLocationThird,
    handleHomeType,
    handleHomeSizeAssessment,
    handleAccessObstacles,
    handleDestinationType,
    handleBedroomsFrom,
    handleHomeSizeAssessmentTo,
    handleBedroomsTo,
    handleBedroomsThird,
    handleTVHandlingCheck,
    handleTVPackingOptions,
    handleCheckAppliances,
    handleSelectAppliances,
    handleShopEquipmentCheck,
    handleOversizedFurnitureCheck,
    handleHeavyItemsCheck,
    handleSpecialItems,
    handlePianoType,
    handleSafeDetails,
    handleCrewSize,
    handleHours,
    handleOfferPhotosLabor,
    handleOfferPhotosSingle,
    handleOfferSpecialItemPhotos,
    handleAskPackingSupplies,
    handleAskTotalRooms,
    handleAskPackingService,
    handleGetEmail,
    handleGetPhone,
    handleStairsThird,
    handleShowFVPOptions,
    handleFVPValue,
    handleFVPDeductible,
    handleShowBookingOptions,
    handleQuestions,
    handleOutOfArea
  ]);

  // Listen for user input from ChatInput via ChatContext
  useEffect(() => {
    const handleUserInput = (e) => {
      if (e.detail && e.detail.message) {
        console.log('FlowController: Received input:', e.detail.message, 'Stage:', e.detail.stage);
        processResponse(e.detail.message);
      }
    };

    window.addEventListener('process-user-input', handleUserInput);
    
    return () => {
      window.removeEventListener('process-user-input', handleUserInput);
    };
  }, [processResponse]);

  // Listen for option selections
  useEffect(() => {
    const handleOptionSelect = (e) => {
      if (e.detail && e.detail.value) {
        console.log('FlowController: Option selected:', e.detail.value);
        processResponse(e.detail.value);
      }
    };

    window.addEventListener('option-selected', handleOptionSelect);

    return () => {
      window.removeEventListener('option-selected', handleOptionSelect);
    };
  }, [processResponse]);

  // Auto-trigger START_LOCATION_DETAILS when stage changes to it (only once per stage change)
  const lastTriggeredStageRef = React.useRef(null);
  useEffect(() => {
    if (chatState.stage === STAGES.START_LOCATION_DETAILS && lastTriggeredStageRef.current !== chatState.stage) {
      console.log('🚀 Auto-triggering handleStartLocationDetails');
      lastTriggeredStageRef.current = chatState.stage;
      handleStartLocationDetails();
    }
  }, [chatState.stage, handleStartLocationDetails]);

  // ChatMessages Component
  const ChatMessages = () => {
    return (
      <div style={{ padding: '20px' }}>
        {chatState.messages.map((msg) => (
          <div 
            key={msg.id} 
            style={{
              marginBottom: '15px',
              padding: '12px 16px',
              borderRadius: '18px',
              maxWidth: '80%',
              wordWrap: 'break-word',
              animation: 'fadeIn 0.3s ease-in',
              ...(msg.type === 'bot' ? {
                background: 'white',
                color: '#222',
                marginRight: 'auto',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              } : msg.type === 'user' ? {
                background: 'linear-gradient(135deg, #004085 0%, #0056b3 100%)',
                color: 'white',
                marginLeft: 'auto',
                boxShadow: '0 1px 3px rgba(0,64,133,0.3)'
              } : {})
            }}
          >
            {msg.type === 'typing' ? (
              <div dangerouslySetInnerHTML={{ __html: msg.content }} />
            ) : (
              msg.content
            )}
          </div>
        ))}
      </div>
    );
  };

  // DatePicker Component - Using the proper component with Confirm button
  const DatePicker = ({ onDateSelect }) => {
    return (
      <DatePickerComponent
        onDateSelected={(formattedDate) => {
          onDateSelect(formattedDate);
        }}
      />
    );
  };

  // PestDisclaimer Component - Compact version
  const PestDisclaimer = () => {
    const [agreed, setAgreed] = React.useState(false);

    const handleAgree = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setAgreed(true);
      updateChatData({
        pestDisclaimerAgreed: true,
        pestDisclaimerTimestamp: new Date().toISOString()
      });

      setTimeout(() => {
        processResponse('continue_after_disclaimer');
      }, 25);
    };

    return (
      <div style={{
        padding: '12px 15px',
        background: 'white',
        borderTop: '1px solid #e2e8f0'
      }}>
        <div style={{
          background: '#fff5f5',
          border: '1px solid #fc8181',
          borderRadius: '6px',
          padding: '10px',
          marginBottom: '10px',
          fontSize: '12px',
          color: '#742a2a'
        }}>
          <div style={{
            fontWeight: '600',
            color: '#e53e3e',
            fontSize: '13px',
            marginBottom: '6px'
          }}>
            ⚠️ Pest Control Notice
          </div>
          <div style={{ lineHeight: '1.4' }}>
            We reserve the right to refuse service if pest infestations are discovered. You must disclose any known issues.
          </div>
        </div>

        <button
          onClick={handleAgree}
          disabled={agreed}
          style={{
            width: '100%',
            padding: '12px',
            background: agreed ? 'linear-gradient(135deg, #2c2c2c 0%, #404040 100%)' : 'white',
            border: agreed ? 'none' : '2px solid #333',
            borderRadius: '8px',
            color: agreed ? 'white' : '#333',
            fontWeight: '600',
            fontSize: '14px',
            cursor: agreed ? 'default' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: agreed ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
          }}
        >
          {agreed ? '✓ Understood' : 'I Understand & Continue'}
        </button>
      </div>
    );
  };
  // Determine which component to render
  const renderStageComponent = () => {
    if (chatState.stage === STAGES.MOVING_DATE) {
      return <DatePicker onDateSelect={processResponse} />;
    }

    if (chatState.stage === STAGES.PEST_DISCLAIMER) {
      return <PestDisclaimer />;
    }

    // Address stages use LocationInput with autocomplete
    if (chatState.stage === STAGES.LOCATION_FROM) {
      return (
        <div style={{ padding: '20px', background: 'white', borderTop: '1px solid #e2e8f0' }}>
          <LocationInput key="location-from" onSelect={handleLocationFrom} placeholder="Start typing your pickup address..." />
        </div>
      );
    }

    if (chatState.stage === STAGES.LOCATION_TO) {
      return (
        <div style={{ padding: '20px', background: 'white', borderTop: '1px solid #e2e8f0' }}>
          <LocationInput key="location-to" onSelect={handleLocationTo} placeholder="Start typing destination address..." />
        </div>
      );
    }

    if (chatState.stage === STAGES.LOCATION_THIRD) {
      return (
        <div style={{ padding: '20px', background: 'white', borderTop: '1px solid #e2e8f0' }}>
          <LocationInput key="location-third" onSelect={handleLocationThird} placeholder="Start typing third location address..." />
        </div>
      );
    }

    // Name, email, phone, and FVP value input use regular ChatInput
    if (chatState.stage === STAGES.GET_NAME_INITIAL ||
        chatState.stage === STAGES.GET_EMAIL ||
        chatState.stage === STAGES.GET_PHONE ||
        chatState.stage === STAGES.FVP_VALUE) {
      return <ChatInput />;
    }

    // Appliances check uses MultiSelect
    if (chatState.stage === STAGES.CHECK_APPLIANCES) {
      const applianceOptions = [
        { text: "Refrigerator 🧊", value: "refrigerator" },
        { text: "Washer 🧺", value: "washer" },
        { text: "Dryer", value: "dryer" },
        { text: "Stove/Range 🍳", value: "stove" },
        { text: "Deep Freezer ❄️", value: "freezer" },
        { text: "Dishwasher 🍽️", value: "dishwasher" }
      ];
      return (
        <MultiSelect
          options={applianceOptions}
          onSubmit={handleCheckAppliances}
          title="Select all appliances you're moving:"
          minSelections={0}
        />
      );
    }

    // Shop equipment uses MultiSelect
    if (chatState.stage === STAGES.SHOP_EQUIPMENT_CHECK) {
      const shopOptions = [
        { text: "Workbench 🔨", value: "workbench" },
        { text: "Tool Chest 🧰", value: "toolchest" },
        { text: "Air Compressor", value: "compressor" },
        { text: "Generator ⚡", value: "generator" },
        { text: "Ladders", value: "ladders" },
        { text: "Lawn Mower 🌱", value: "mower" },
        { text: "Snow Blower ❄️", value: "snowblower" },
        { text: "Other Equipment", value: "other" }
      ];
      return (
        <MultiSelect
          options={shopOptions}
          onSubmit={handleShopEquipmentCheck}
          title="Select all shop/garage equipment you're moving:"
          minSelections={0}
        />
      );
    }

    // Heavy items check uses MultiSelect (for labor-only)
    if (chatState.stage === STAGES.HEAVY_ITEMS_CHECK) {
      const heavyItemOptions = [
        { text: "Piano 🎹", value: "piano" },
        { text: "Safe 🔒", value: "safe" },
        { text: "Hot Tub ❌", value: "hotTub" },
        { text: "Pool Table ❌", value: "poolTable" },
        { text: "Large Aquarium ❌", value: "aquarium" },
        { text: "Shed ❌", value: "shed" },
        { text: "Universal Gym", value: "gym" },
        { text: "Free Weights", value: "freeWeights" },
        { text: "Treadmill/Elliptical", value: "treadmill" },
        { text: "China Hutch", value: "hutch" },
        { text: "Other Heavy Items (350+ lbs)", value: "otherHeavy" }
      ];
      return (
        <MultiSelect
          options={heavyItemOptions}
          onSubmit={handleHeavyItemsCheck}
          title="Select all heavy items (check all that apply):"
          minSelections={0}
        />
      );
    }

    // Special items uses MultiSelect
    if (chatState.stage === STAGES.SPECIAL_ITEMS) {
      const specialItemOptions = [
        { text: "Piano 🎹", value: "piano" },
        { text: "Safe 🔒", value: "safe" },
        { text: "Heavy Items (300+ lbs)", value: "heavyItems" },
        { text: "Universal Gym", value: "gym" },
        { text: "Free Weights", value: "freeWeights" },
        { text: "Treadmill/Elliptical", value: "treadmill" },
        { text: "China Hutch", value: "hutch" },
        { text: "Large Aquarium", value: "aquarium" }
      ];
      return (
        <MultiSelect
          options={specialItemOptions}
          onSubmit={handleSpecialItems}
          title="Select all specialty items you're moving:"
          minSelections={0}
        />
      );
    }

    return <ChatOptions />;
  };
  // Handle estimate modal actions
  const handleCloseEstimate = () => {
    setShowEstimateModal(false);
  };

  const handleEmailEstimate = async () => {
    try {
      await submitLead(chatState.data);
      setShowEstimateModal(false);
      addBotMessage("✅ Success! Your estimate has been sent to your email!", 30);
    } catch (error) {
      console.error('Email send failed:', error);
      addBotMessage("⚠️ There was an issue sending the email. Please try again or call us at 330-435-8686.", 30);
    }
  };

  const handleBookNow = () => {
    // Close estimate modal and show payment modal
    setShowEstimateModal(false);
    setShowPaymentModal(true);
    addBotMessage("Perfect! Let's securely save your payment method for this booking... 💳", 30);
  };

  const handlePaymentComplete = async (paymentData) => {
    try {
      addBotMessage("💳 Saving your card securely...", 25);

      // Call backend to create Square customer and store card
      const result = await squarePaymentService.createCustomerWithCard(
        {
          firstName: chatState.data.firstName,
          lastName: chatState.data.lastName,
          email: chatState.data.email,
          phone: chatState.data.phone,
          movingDate: chatState.data.formattedDate
        },
        paymentData.token,
        chatState.data.estimate
      );

      console.log('✅ Card saved:', result);

      // Close payment modal
      setShowPaymentModal(false);

      // Send estimate email
      addBotMessage("✅ Card saved! Sending your estimate now... 📧", 30);

      try {
        await submitLead(chatState.data);
        setTimeout(() => {
          addBotMessage("✅ Estimate sent! Opening scheduler... 📅", 50);
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('open-acuity-scheduler'));
          }, 30);
        }, 25);
      } catch (emailError) {
        console.error('Email send failed:', emailError);
        setTimeout(() => {
          addBotMessage("Opening scheduler... (We'll send your estimate shortly)", 50);
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('open-acuity-scheduler'));
          }, 30);
        }, 25);
      }
    } catch (error) {
      console.error('Payment save failed:', error);
      setShowPaymentModal(false);
      addBotMessage("⚠️ We had trouble saving your payment method. You can still book - we'll collect payment later. Opening scheduler...", 25);
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('open-acuity-scheduler'));
      }, 25);
    }
  };

  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
    addBotMessage("No problem! You can still book your move. We'll collect payment information later. Opening scheduler... 📅", 30);
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('open-acuity-scheduler'));
    }, 25);
  };

  return (
    <div style={{
      flexGrow: 1,
      overflow: 'auto',
      background: 'linear-gradient(to bottom, #f8fafb 0%, #f0f4f8 100%)',
      display: 'flex',
      flexDirection: 'column',
      WebkitOverflowScrolling: 'touch',
      scrollBehavior: 'smooth'
    }}>
      <ChatMessages />
      <div style={{ minHeight: '20px' }} />
      {renderStageComponent()}

      {/* Estimate Modal */}
      {showEstimateModal && chatState.data.estimate && (
        <EstimateModal
          estimate={chatState.data.estimate}
          serviceType={chatState.data.serviceType}
          onClose={handleCloseEstimate}
          onEmailEstimate={handleEmailEstimate}
          onBookNow={handleBookNow}
        />
      )}

      {/* Payment Modal */}
      {showPaymentModal && chatState.data.estimate && (
        <PaymentModal
          estimate={chatState.data.estimate}
          customerData={{
            firstName: chatState.data.firstName,
            lastName: chatState.data.lastName,
            email: chatState.data.email,
            phone: chatState.data.phone,
            movingDate: chatState.data.formattedDate
          }}
          onClose={handlePaymentModalClose}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
};

export default FlowController;