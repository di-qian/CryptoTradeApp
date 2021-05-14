const Validator = require('validator');
const isEmpty = require('is-empty');
const fs = require('fs');
const path = require('path');
const default_Profile_Path = '/images/profiles/defaultprofile.png';

const validateRegisterInput = (data) => {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions

  data.name = !isEmpty(data.name) ? data.name : '';
  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  data.email = !isEmpty(data.email) ? data.email : '';
  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  data.password = !isEmpty(data.password) ? data.password : '';
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  data.confirmPassword = !isEmpty(data.confirmPassword)
    ? data.confirmPassword
    : '';
  if (Validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword = 'Confirm password field is required';
  }

  if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = 'Passwords must match';
  }

  return {
    errors,
  };
};

const validateProfileInput = (data) => {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions

  data.name = !isEmpty(data.name) ? data.name : '';
  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  data.email = !isEmpty(data.email) ? data.email : '';
  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (data.password) {
    data.password = !isEmpty(data.password) ? data.password : '';
    //   if (Validator.isEmpty(data.password)) {
    //     errors.password = 'Password field is required';
    //   }
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
      errors.password = 'Password must be at least 6 characters';
    }
  }

  data.confirmPassword = !isEmpty(data.confirmPassword)
    ? data.confirmPassword
    : '';
  //   if (Validator.isEmpty(data.confirmPassword)) {
  //     errors.confirmPassword = 'Confirm password field is required';
  //   }

  if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = 'Passwords must match';
  }

  try {
    const __dirname = path.resolve();
    const imagePath = path.join(__dirname, data.image);
    if (data.image !== default_Profile_Path) {
      if (!fs.existsSync(imagePath)) {
        errors.image = 'Incorrect image file path';
      }
    }
  } catch (err) {
    errors.image = err;
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const validateLoginInput = (data) => {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }
  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = {
  validateRegisterInput,
  validateProfileInput,
  validateLoginInput,
};
