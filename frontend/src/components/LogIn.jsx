import React, { useState, useEffect } from "react";
import "../Styles/LogIn.css";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const LogIn = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    registrationType: "user"
  });

  // State for form validation
  const [errors, setErrors] = useState({});

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  // Check if profiles table exists on component mount
  useEffect(() => {
    const checkProfilesTable = async () => {
      try {
        // Try to get the schema information about the profiles table
        const { error } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);

        // If there's an error about the table not existing, create it
        if (error && error.message.includes('does not exist')) {
          console.log('Profiles table does not exist. Creating it...');
          await createProfilesTable();
        }
      } catch (err) {
        console.error("Error checking profiles table:", err);
      }
    };

    checkProfilesTable();
  }, []);

  // Function to create the profiles table
  const createProfilesTable = async () => {
    try {
      // Use SQL to create the profiles table via the REST API
      const { error } = await supabase.rpc('create_profiles_table');
      
      if (error) {
        console.error("Error creating profiles table:", error);
      } else {
        console.log("Profiles table created successfully");
      }
    } catch (err) {
      console.error("Error executing create_profiles_table RPC:", err);
    }
  };

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

    const isValid = validateForm();

    if (isValid) {
      setIsSubmitting(true);

      try {
        // Sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.identifier,
          password: formData.password,
        });

        if (error) throw error;

        // Try to get user data from profiles table
        let userType = formData.registrationType;
        let userName = '';
        
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('user_type, full_name')
            .eq('user_id', data.user.id)
            .single();

          if (!profileError && profileData) {
            // If profile exists, verify user type
            if (profileData.user_type !== formData.registrationType) {
              throw new Error(`Invalid login. Please select correct ${profileData.user_type} login option.`);
            }
            // Set user data from profile
            userType = profileData.user_type;
            userName = profileData.full_name;
          } else {
            // If profile doesn't exist, create one based on the auth metadata
            const userData = data.user.user_metadata || {};
            userName = userData.full_name || data.user.email.split('@')[0];
            
            // Create a new profile entry
            await supabase.from('profiles').insert([{
              user_id: data.user.id,
              email: data.user.email,
              full_name: userName,
              user_type: formData.registrationType
            }]).single();
          }
        } catch (profileErr) {
          // If error is not about table missing, rethrow it
          if (!profileErr.message.includes('does not exist')) {
            throw profileErr;
          }
          
          // Otherwise, use auth metadata as fallback
          const userData = data.user.user_metadata || {};
          userName = userData.full_name || data.user.email.split('@')[0];
          userType = formData.registrationType;
        }

        setIsSubmitting(false);
        setIsSubmitted(true);
        
        // Store user type and profile data in session storage
        sessionStorage.setItem('userType', userType);
        sessionStorage.setItem('userName', userName);
        sessionStorage.setItem('userId', data.user.id);
      } catch (error) {
        console.error("Login error:", error);
        setServerError(error.message || "Invalid credentials. Please try again.");
        setIsSubmitting(false);
      }
    }
  };

  // Navigate to appropriate dashboard after successful login
  const handleGoToHome = () => {
    const userType = sessionStorage.getItem('userType');
    if (userType === 'shop') {
      navigate('/shop-dashboard');
    } else {
      navigate('/dashboard');
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
          <select
            name="registrationType"
            value={formData.registrationType}
            onChange={handleChange}
            className="registration-type-select"
          >
            <option value="user">User Login</option>
            <option value="shop">Shop Owner Login</option>
          </select>
        </div>

        {serverError && (
          <div className="error-message server-error">
            {serverError}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="identifier">
              Email Address
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
