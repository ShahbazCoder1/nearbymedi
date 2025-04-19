import React, { useState } from "react";
import "../Styles/SignUp.css"; 
import FormInput from "./FormInput";
import SuccessMessage from "./SuccessMessage";
import { validateSignUpForm } from "../Utils/validation";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

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
  // State for server errors
  const [serverError, setServerError] = useState("");

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    // Validate all fields before submission
    const newErrors = validateSignUpForm(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);

      try {
        // Register the user with Supabase
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              mobile_number: formData.mobileNumber,
            }
          }
        });

        if (error) {
          throw error;
        }

        // If signup is successful, you might want to save additional user data
        // to your profiles table in Supabase if needed
        if (data.user) {
          // Optional: Insert additional user data into a custom profiles table
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              { 
                user_id: data.user.id, 
                full_name: formData.fullName,
                mobile_number: formData.mobileNumber,
                email: formData.email
              }
            ]);

          if (profileError) {
            console.error("Error saving profile data:", profileError);
            // Continue anyway since the user was created
          }
        }

        setIsSubmitting(false);
        setIsSubmitted(true);
        console.log("User registered successfully:", data);
        
      } catch (error) {
        console.error("Registration error:", error);
        setServerError(error.message || "Failed to create account. Please try again.");
        setIsSubmitting(false);
      }
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

        {serverError && (
          <div className="error-message server-error">
            {serverError}
          </div>
        )}

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
