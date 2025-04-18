export const validateSignUpForm = (formData) => {
  const errors = {};

  // Full Name validation
  if (!formData.fullName.trim()) {
    errors.fullName = "Full name is required";
  }

  // Mobile Number validation
  if (!formData.mobileNumber.trim()) {
    errors.mobileNumber = "Mobile number is required";
  } else if (!/^\d{10}$/.test(formData.mobileNumber.trim())) {
    errors.mobileNumber = "Enter a valid 10-digit mobile number";
  }

  // Email validation
  if (!formData.email.trim()) {
    errors.email = "Email address is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Enter a valid email address";
  }

  // Password validation
  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  // Confirm Password validation
  if (!formData.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};
