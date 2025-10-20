// FILE: src/utils/validators.js
// PURPOSE: Input validation functions

export const validateEmail = (email) => {
  return email.includes('@') && email.includes('.') && email.length > 5;
};

export const validatePhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10;
};

export const parseFullName = (fullName) => {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length >= 2) {
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');
    return { firstName, lastName };
  }
  return null;
};

export const validateAddress = (address) => {
  return address.includes(',') && address.split(',').length >= 2;
};

export const isSameDay = (dateString) => {
  try {
    const moveDate = new Date(dateString);
    const today = new Date();
    
    return moveDate.getDate() === today.getDate() &&
           moveDate.getMonth() === today.getMonth() &&
           moveDate.getFullYear() === today.getFullYear();
  } catch {
    return false;
  }
};