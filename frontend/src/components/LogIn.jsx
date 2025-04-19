import React, { useState } from "react";
import "../Styles/LogIn.css";
import { Link } from "react-router-dom";

const LogIn = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
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

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Identifier validation (email or mobile)
    if (!formData.identifier.trim()) {
      newErrors.identifier = "Email or mobile number is required";
    } else if (
      // Check if it's not a valid email or mobile number
      !/\S+@\S+\.\S+/.test(formData.identifier) &&
      !/^\d{10}$/.test(formData.identifier.trim())
    ) {
      newErrors.identifier = "Enter a valid email or mobile number";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const isValid = validateForm();

    if (isValid) {
      setIsSubmitting(true);

      // Simulate API call/backend integration
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        // In a real app, you would send the form data to your backend here
        console.log("Login form submitted successfully:", formData);
      }, 1500);
    }
  };

  // Show success message after submission
  if (isSubmitted) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="success-message">
            <h2>Login Successful!</h2>
            <p>You have been logged in successfully.</p>
            <button
              className="login-button"
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  identifier: "",
                  password: "",
                });
              }}
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Login to your account</h1>
          <p className="login-subtitle">Enter your credentials to continue</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="identifier">
              Email or Mobile Number
            </label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              className={`form-input ${errors.identifier ? "error" : ""}`}
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Enter your email or mobile number"
            />
            {errors.identifier && (
              <span className="error-message">{errors.identifier}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-input ${errors.password ? "error" : ""}`}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                Logging In
                <span className="spinner"></span>
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="signup-link">
          Don't have an account? <Link to="/">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
