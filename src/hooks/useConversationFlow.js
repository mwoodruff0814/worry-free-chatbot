// FILE: src/hooks/useConversationFlow.js
// PURPOSE: This hook manages the entire conversation flow logic
// It's like the brain of your chatbot - it decides what happens next based on user input

import { useEffect, useCallback, useRef } from 'react';
import { useChatContext } from '../context/ChatContext';
import { STAGES } from '../constants/stages';
import { SARAH_PERSONALITY, SALES_MESSAGES } from '../constants/messages';
import { 
  validateEmail, 
  validatePhone, 
  parseFullName, 
  isSameDay 
} from '../utils/validators';
import { formatDate, formatMoney } from '../utils/formatters';
import { 
  calculateMovingEstimate, 
  calculateLaborEstimate, 
  calculateSingleItemEstimate 
} from '../utils/calculations';

export const useConversationFlow = () => {
  // Get everything we need from the chat context
  const { 
    chatState, 
    updateChatData, 
    updateStage, 
    addBotMessage,
    addUserMessage,
    saveNavigationState 
  } = useChatContext();
  
  // Keep track of which messages we've already processed
  // This prevents duplicate processing
  const processedMessages = useRef(new Set());
  
  // Helper function to get random responses
  const getRandomResponse = useCallback((array) => {
    return array[Math.floor(Math.random() * array.length)];
  }, []);

  // ============================================
  // MAIN RESPONSE PROCESSOR
  // This is the heart of your chatbot logic
  // ============================================
  const processResponse = useCallback(async (value) => {
    console.log('Processing response:', value, 'Current stage:', chatState.stage);
    
    // Save navigation state before processing (for back button)
    saveNavigationState();

    // Handle global commands that work from any stage
    if (value === 'restart') {
      window.location.reload();
      return;
    }

    if (value === 'call') {
      window.location.href = 'tel:330-435-8686';
      return;
    }

    // ============================================
    // STAGE-SPECIFIC LOGIC
    // Each stage has its own handling logic
    // ============================================
    
    switch (chatState.stage) {
      // ----------------
      // INITIAL NAME COLLECTION
      // ----------------
      case STAGES.GET_NAME_INITIAL: {
        const parsed = parseFullName(value);
        if (parsed) {
          // Save the name data
          updateChatData({
            name: value,
            firstName: parsed.firstName,
            lastName: parsed.lastName
          });

          // Respond with personality
          const ack = getRandomResponse(SARAH_PERSONALITY.acknowledgments);
          addBotMessage(`${ack} Nice to meet you, ${parsed.firstName}! 😊`);

          // Add trust-building messages
          setTimeout(() => {
            const trust = getRandomResponse(SALES_MESSAGES.trust);
            addBotMessage(trust);

            setTimeout(() => {
              addBotMessage("What type of service do you need today?");
              updateStage(STAGES.SERVICE_SELECTION);
            }, 1200);
          }, 800);
        } else {
          addBotMessage("I need both your first and last name to proceed. Please enter your full name:");
        }
        break;
      }

      // ----------------
      // SERVICE SELECTION
      // ----------------
      case STAGES.SERVICE_SELECTION: {
        if (value === 'questions') {
          updateStage(STAGES.QUESTIONS);
          addBotMessage("I'm happy to help! What would you like to know?");
        } else {
          updateChatData({ serviceType: value });
          
          const serviceNames = {
            'moving': 'full moving service',
            'labor': 'labor crew',
            'single': 'single item move'
          };
          
          const ack = getRandomResponse(SARAH_PERSONALITY.acknowledgments);
          addBotMessage(`${ack} I'll help you get a ${serviceNames[value]} estimate.`);

          // Different flow for single items
          if (value === 'single') {
            updateStage(STAGES.ITEM_TYPE);
            setTimeout(() => {
              addBotMessage("What category best describes your item?");
            }, 1200);
          } else {
            // Regular flow - ask for moving date
            updateStage(STAGES.MOVING_DATE);
            setTimeout(() => {
              addBotMessage("Let's start with your moving date. When would you like to schedule your service? 📅");
            }, 1200);
          }
        }
        break;
      }

      // ----------------
      // MOVING DATE
      // ----------------
      case STAGES.MOVING_DATE: {
        const formattedDate = formatDate(value);
        const sameDayMove = isSameDay(value);

        updateChatData({
          movingDate: value,
          formattedDate: formattedDate,
          isSameDay: sameDayMove
        });

        if (sameDayMove) {
          addBotMessage(`<div class="highlight-box">
            <span class="urgency-text">⚡ That's TODAY! Same-day moves have a 10% premium.</span>
          </div>`);
        }

        addBotMessage(`Perfect! I have ${formattedDate} noted for your service.`);

        // Skip pest disclaimer for single items
        if (chatState.data.serviceType === 'single') {
          updateStage(STAGES.LOCATION_FROM);
          setTimeout(() => {
            addBotMessage(`Now I need the pickup address for your ${chatState.data.itemName || 'item'}.`);
          }, 1000);
        } else {
          updateStage(STAGES.PEST_DISCLAIMER);
          setTimeout(() => {
            addBotMessage("Before we continue, I need to show you an important notice:");
          }, 1500);
        }
        break;
      }

      // ----------------
      // PEST DISCLAIMER
      // ----------------
      case STAGES.PEST_DISCLAIMER: {
        if (value === 'continue_after_disclaimer') {
          if (!chatState.data.pestDisclaimerAgreed) {
            addBotMessage("You must agree to the pest control disclaimer to continue.");
            return;
          }
          
          updateStage(STAGES.LOCATION_FROM);
          addBotMessage("Now I'll need your complete starting address to calculate the estimate.");
        } else if (value === 'exit_pest_issues') {
          addBotMessage("I understand. Please contact us at 330-435-8686 once any pest issues have been addressed.");
        }
        break;
      }

      // ----------------
      // LOCATION FROM
      // ----------------
      case STAGES.LOCATION_FROM: {
        if (!value.includes(',') || value.split(',').length < 2) {
          addBotMessage("Could you please enter a complete address including street, city, and state?");
          addBotMessage("Example: 123 Main Street, Youngstown, OH 44512");
          return;
        }

        updateChatData({ from: value });
        
        // For demo purposes, simulate distance calculation
        const simulatedDistance = Math.floor(Math.random() * 50) + 10;
        updateChatData({ fromDistance: simulatedDistance });
        
        addBotMessage(`Distance from our base: ${simulatedDistance} miles ✅`);

        updateStage(STAGES.STAIRS_FROM);
        setTimeout(() => {
          addBotMessage("Are there any stairs at your current location?");
        }, 800);
        break;
      }

      // ----------------
      // STAIRS FROM
      // ----------------
      case STAGES.STAIRS_FROM: {
        updateChatData({ stairsFrom: parseInt(value) });

        if (chatState.data.serviceType === 'single') {
          updateStage(STAGES.LOCATION_TO);
          addBotMessage("Great! Now I need the delivery address.");
        } else if (chatState.data.serviceType === 'labor') {
          updateStage(STAGES.CREW_SIZE);
          addBotMessage("How many movers do you need?");
        } else {
          updateStage(STAGES.LOCATION_TO);
          addBotMessage("Great! Now I need your destination address.");
        }
        break;
      }

      // ----------------
      // LOCATION TO
      // ----------------
      case STAGES.LOCATION_TO: {
        if (!value.includes(',') || value.split(',').length < 2) {
          addBotMessage("Please enter a complete address including street, city, and state.");
          return;
        }

        updateChatData({ to: value });
        
        // Simulate trip distance
        const tripDistance = Math.floor(Math.random() * 100) + 20;
        updateChatData({ tripDistance });
        
        addBotMessage(`Trip distance: ${tripDistance} miles ✅`);

        updateStage(STAGES.STAIRS_TO);
        setTimeout(() => {
          addBotMessage("Are there any stairs at your destination?");
        }, 800);
        break;
      }

      // ----------------
      // STAIRS TO
      // ----------------
      case STAGES.STAIRS_TO: {
        updateChatData({ stairsTo: parseInt(value) });

        if (chatState.data.serviceType === 'single') {
          // Calculate estimate for single item
          const estimate = calculateSingleItemEstimate(chatState.data);
          updateChatData({ estimate });
          updateStage(STAGES.SHOW_ESTIMATE);
          displayEstimate(estimate);
        } else {
          updateStage(STAGES.HOME_TYPE);
          addBotMessage("What type of place are you moving FROM?");
        }
        break;
      }

      // ----------------
      // HOME TYPE
      // ----------------
      case STAGES.HOME_TYPE: {
        updateChatData({ homeType: value });
        updateStage(STAGES.BEDROOMS_FROM);
        addBotMessage("How many bedrooms at your CURRENT location?");
        break;
      }

      // ----------------
      // BEDROOMS FROM
      // ----------------
      case STAGES.BEDROOMS_FROM: {
        updateChatData({ bedrooms: parseInt(value) });
        
        if (chatState.data.serviceType === 'labor') {
          updateStage(STAGES.CREW_SIZE);
          addBotMessage("How many movers do you need?");
        } else {
          updateStage(STAGES.SPECIAL_ITEMS);
          addBotMessage("Do you have any special items that require extra care?");
        }
        break;
      }

      // ----------------
      // CREW SIZE
      // ----------------
      case STAGES.CREW_SIZE: {
        updateChatData({ crewSize: parseInt(value) });
        
        if (chatState.data.serviceType === 'labor') {
          updateStage(STAGES.HOURS);
          addBotMessage("How many hours do you need the crew?");
        } else {
          // Calculate moving estimate
          const estimate = await calculateMovingEstimate(chatState.data);
          updateChatData({ estimate });
          updateStage(STAGES.SHOW_ESTIMATE);
          displayEstimate(estimate);
        }
        break;
      }

      // ----------------
      // HOURS (for labor service)
      // ----------------
      case STAGES.HOURS: {
        const hours = parseInt(value);
        if (!isNaN(hours) && hours >= 2 && hours <= 12) {
          updateChatData({ hours });
          
          // Calculate labor estimate
          const estimate = calculateLaborEstimate(chatState.data);
          updateChatData({ estimate });
          updateStage(STAGES.SHOW_ESTIMATE);
          displayEstimate(estimate);
        } else {
          addBotMessage("Please enter a number between 2 and 12 hours.");
        }
        break;
      }

      // ----------------
      // SPECIAL ITEMS
      // ----------------
      case STAGES.SPECIAL_ITEMS: {
        updateChatData({ specialItems: value });
        updateStage(STAGES.CREW_SIZE);
        addBotMessage("How many movers would you like?");
        break;
      }

      // ----------------
      // EMAIL COLLECTION
      // ----------------
      case STAGES.GET_EMAIL: {
        if (validateEmail(value)) {
          updateChatData({ email: value });
          updateStage(STAGES.GET_PHONE);
          addBotMessage("And what's the best phone number to reach you?");
        } else {
          addBotMessage("Hmm, that doesn't look like a valid email. Please try again:");
        }
        break;
      }

      // ----------------
      // PHONE COLLECTION
      // ----------------
      case STAGES.GET_PHONE: {
        if (validatePhone(value)) {
          updateChatData({ phone: value });
          addBotMessage(`✅ Perfect! I've sent your estimate to ${chatState.data.email}`);
          updateStage(STAGES.SHOW_BOOKING_OPTIONS);
        } else {
          addBotMessage("Please enter a valid phone number (at least 10 digits):");
        }
        break;
      }

      default:
        console.warn('Unhandled stage:', chatState.stage, 'value:', value);
    }
  }, [chatState, updateChatData, updateStage, addBotMessage, saveNavigationState, getRandomResponse]);

  // Helper function to display estimates
  const displayEstimate = useCallback((estimate) => {
    if (estimate.type === 'moving') {
      addBotMessage(`<div class="estimate-details">
        <strong>📊 Your Moving Estimate</strong><br><br>
        📅 Move date: ${chatState.data.formattedDate}<br>
        📍 Route: ${chatState.data.from} → ${chatState.data.to}<br>
        🏠 Move size: ${chatState.data.bedrooms} bedrooms<br>
        👥 Crew: ${estimate.crew} professional movers<br><br>
        <strong>💰 Total Estimate: ${formatMoney(estimate.total)}</strong>
      </div>`);
    } else if (estimate.type === 'labor') {
      addBotMessage(`<div class="estimate-details">
        <strong>💪 Your Labor Crew Estimate</strong><br><br>
        📅 Service date: ${chatState.data.formattedDate}<br>
        👥 Crew size: ${estimate.crew} movers<br>
        ⏱️ Hours: ${estimate.laborHours}<br><br>
        <strong>💰 Total Estimate: ${formatMoney(estimate.total)}</strong>
      </div>`);
    } else if (estimate.type === 'single') {
      addBotMessage(`<div class="estimate-details">
        <strong>📦 Your Single Item Move</strong><br><br>
        📅 Move date: ${chatState.data.formattedDate}<br>
        📦 Item: ${estimate.item}<br>
        👥 Crew: ${estimate.crew} movers<br><br>
        <strong>💰 Total: ${formatMoney(estimate.total)}</strong>
      </div>`);
    }
    
    setTimeout(() => {
      updateStage(STAGES.SHOW_BOOKING_OPTIONS);
    }, 1500);
  }, [chatState.data, addBotMessage, updateStage]);

  // ============================================
  // MESSAGE LISTENER
  // This watches for new user messages and processes them
  // ============================================
  useEffect(() => {
    if (chatState.messages.length === 0) return;

    const lastMessage = chatState.messages[chatState.messages.length - 1];
    
    // Only process user messages that haven't been processed yet
    if (lastMessage && 
        lastMessage.type === 'user' && 
        !processedMessages.current.has(lastMessage.id)) {
      
      console.log('New user message detected:', lastMessage.content);
      processedMessages.current.add(lastMessage.id);
      processResponse(lastMessage.content);
    }
  }, [chatState.messages, processResponse]);

  return {
    processResponse,
    currentStage: chatState.stage
  };
};