import React from "react";

const SuccessMessage = ({ title, message, buttonText, onButtonClick }) => {
  return (
    <div className="success-message">
      <h2>{title}</h2>
      <p>{message}</p>
      <button className="signup-button" onClick={onButtonClick}>
        {buttonText}
      </button>
    </div>
  );
};

export default SuccessMessage;
