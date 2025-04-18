import React, { useState } from "react";
import "../Styles/SignUp.css"; // Import CSS file for styling
import FormInput from "./FormInput";
import SuccessMessage from "./SuccessMessage";
import { validateSignUpForm } from "../Utils/validation"; // Import validation function
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State for form validation
  const [errors, setErrors] = useState({});

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const newErrors = validateSignUpForm(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);

      // Simulate API call/backend integration
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        // In a real app, you would send the form data to your backend here
        console.log("Form submitted successfully:", formData);
      }, 1500);
    }
  };

  // Show success message after submission and redirect to login page
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  if (isSubmitted) {
    return (
      <div className="signup-container">
        <div className="signup-card">
          <SuccessMessage
            title="Account Created!"
            message="Your account has been created successfully."
            buttonText="Log in"
            onButtonClick={handleLoginRedirect}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1 className="signup-title">Create your account</h1>
          <p className="signup-subtitle">Fill in the details to get started</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <FormInput
            label="Full Name"
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            error={errors.fullName}
          />

          <FormInput
            label="Mobile Number"
            id="mobileNumber"
            name="mobileNumber"
            type="tel"
            value={formData.mobileNumber}
            onChange={handleChange}
            placeholder="Enter your mobile number"
            error={errors.mobileNumber}
          />

          <FormInput
            label="Email Address"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            error={errors.email}
          />

          <FormInput
            label="Password"
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter a password"
            error={errors.password}
          />

          <FormInput
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            error={errors.confirmPassword}
          />

          <button
            type="submit"
            className="signup-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                Creating Account
                <span className="spinner"></span>
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="signin-link">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
