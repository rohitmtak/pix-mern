// Simple password validation for basic store
// Not over-engineered, just essential security

export const validatePassword = (password) => {
  const errors = [];
  
  // Minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  // Must contain uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  // Must contain lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  // Must contain number
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  // Must contain special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

export const getPasswordRequirements = () => {
  return [
    'At least 8 characters long',
    'Contains uppercase letter (A-Z)',
    'Contains lowercase letter (a-z)', 
    'Contains number (0-9)',
    'Contains special character (!@#$%^&*)'
  ];
};
