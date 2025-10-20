// FILE: src/utils/quoteStorage.js
// PURPOSE: Save and retrieve quotes using localStorage

export const saveQuote = (email, quoteData) => {
  try {
    const timestamp = new Date().toISOString();
    const quote = {
      email,
      data: quoteData,
      savedAt: timestamp,
      id: Date.now().toString()
    };

    // Get existing quotes
    const existingQuotes = JSON.parse(localStorage.getItem('wfm_quotes') || '[]');

    // Add new quote
    existingQuotes.push(quote);

    // Save back to localStorage
    localStorage.setItem('wfm_quotes', JSON.stringify(existingQuotes));
    localStorage.setItem('wfm_last_email', email);

    return { success: true, quoteId: quote.id };
  } catch (error) {
    console.error('Error saving quote:', error);
    return { success: false, error: error.message };
  }
};

export const getQuotesByEmail = (email) => {
  try {
    const quotes = JSON.parse(localStorage.getItem('wfm_quotes') || '[]');
    return quotes.filter(q => q.email.toLowerCase() === email.toLowerCase());
  } catch (error) {
    console.error('Error retrieving quotes:', error);
    return [];
  }
};

export const getLastEmail = () => {
  return localStorage.getItem('wfm_last_email') || '';
};

export const getAllQuotes = () => {
  try {
    return JSON.parse(localStorage.getItem('wfm_quotes') || '[]');
  } catch (error) {
    console.error('Error retrieving all quotes:', error);
    return [];
  }
};
