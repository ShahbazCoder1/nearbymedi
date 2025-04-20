import React, { useState, useEffect } from "react";
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
    email: "",
    password: "",
    confirmPassword: "",
    registrationType: "user" // Add this line
  });

  // State for form validation
  const [errors, setErrors] = useState({});

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // State for server errors
  const [serverError, setServerError] = useState("");

  // Check if profiles table exists on component mount
  useEffect(() => {
    const checkProfilesTable = async () => {
      try {
        // Try to get the schema information about the profiles table
        const { error } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);

        // If there's an error about the table not existing, we'll handle it in the form submission
        if (error && error.message.includes('does not exist')) {
          console.log('Profiles table does not exist.');
        }
      } catch (err) {
        console.error("Error checking profiles table:", err);
      }
    };

    checkProfilesTable();
  }, []);

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
              user_type: formData.registrationType
            }
          }
        });

        if (error) {
          throw error;
        }

        // If signup is successful, try to save additional user data
        if (data.user) {
          try {
            // Try to insert into profiles table
            const { error: profileError } = await supabase
              .from('profiles')
              .insert([
                {
                  user_id: data.user.id,
                  full_name: formData.fullName,
                  email: formData.email,
                  user_type: formData.registrationType
                }
              ]);

            if (profileError) {
              // If the error is not about the table missing, log it
              if (!profileError.message.includes('does not exist')) {
                console.error("Error saving profile data:", profileError);
              } else {
                // Table doesn't exist - we'll rely on auth metadata only
                console.log("Profiles table doesn't exist. Using auth metadata only.");
              }
            }
          } catch (profileErr) {
            console.error("Error during profile creation:", profileErr);
          }

          // If user is a shop owner, try to create an entry in the shops table
          if (formData.registrationType === 'shop') {
            try {
              const { error: shopError } = await supabase
                .from('shops')
                .insert([
                  {
                    owner_id: data.user.id,
                    name: `${formData.fullName}'s Shop`,
                    address: "Address not set",
                    pincode: "000000"
                  }
                ]);

              if (shopError && !shopError.message.includes('does not exist')) {
                console.error("Error creating shop:", shopError);
              }
            } catch (shopErr) {
              console.error("Error during shop creation:", shopErr);
            }
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
          <select
            name="registrationType"
            value={formData.registrationType}
            onChange={handleChange}
            className="registration-type-select"
          >
            <option value="user">User Registration</option>
            <option value="shop">Shop Owner Registration</option>
          </select>
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