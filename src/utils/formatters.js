// FILE: src/utils/formatters.js
// PURPOSE: Data formatting utilities

export const formatMoney = (amount) => {
  const cleanAmount = parseFloat(amount) || 0;
  return '$' + cleanAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  } catch (e) {
    return dateString;
  }
};

export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};