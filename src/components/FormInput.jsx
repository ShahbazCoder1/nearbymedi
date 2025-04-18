import React from "react";

const FormInput = ({
  label,
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  error,
}) => {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        className={`form-input ${error ? "error" : ""}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default FormInput;