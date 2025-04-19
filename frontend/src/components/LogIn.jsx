import React, { useState } from "react";
import "../Styles/LogIn.css";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

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
  const [serverError, setServerError] = useState("");
  
  const navigate = useNavigate();

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
    
    // Clear server error when user types anything
    if (serverError) {
      setServerError("");
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    // Validate all fields before submission
    const isValid = validateForm();

    if (isValid) {
      setIsSubmitting(true);

      try {
        // Determine if identifier is an email or phone number
        const isEmail = /\S+@\S+\.\S+/.test(formData.identifier);
        
        // Sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          // If identifier is an email, use it directly; otherwise use it as a phone number
          email: isEmail ? formData.identifier : `${formData.identifier}@phone.user`, // Using a placeholder email for phone numbers
          password: formData.password,
        });

        if (error) {
          throw error;
        }

        // If login successful, check if we need to fetch user profile
        console.log("Login successful:", data);
        
        setIsSubmitting(false);
        setIsSubmitted(true);
      } catch (error) {
        console.error("Login error:", error);
        setServerError(error.message || "Invalid credentials. Please try again.");
        setIsSubmitting(false);
      }
    }
  };

  // Navigate to home page after successful login
  const handleGoToHome = () => {
    navigate('/');
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
              onClick={handleGoToHome}
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

        {serverError && (
          <div className="error-message server-error">
            {serverError}
          </div>
        )}

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
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
