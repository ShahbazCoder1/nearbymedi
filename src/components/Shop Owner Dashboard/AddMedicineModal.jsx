import React, { useState } from "react";
import { FaFileUpload } from "react-icons/fa";

const AddMedicineModal = ({ onClose, onAdd }) => {
  const [medicineName, setMedicineName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [file, setFile] = useState(null);

  const handleAdd = () => {
    if (!medicineName.trim()) {
      alert("Medicine name is required");
      return;
    }

    // Add medicine to the list and clear the form
    onAdd({
      name: medicineName,
      brand: brandName,
    });

    // Reset form
    setMedicineName("");
    setBrandName("");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("File selected:", selectedFile.name);
    }
  };

  const handleUpload = () => {
    if (file) {
      console.log("File would be sent to backend:", file.name);
      alert(`File "${file.name}" uploaded successfully!`);
      setFile(null);
    } else {
      alert("Please select a file first");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add Medicine</h2>
        <div className="modal-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Medicine name..."
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Brand (Optional)"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-actions">
            <button onClick={handleAdd} className="add-button">
              Add
            </button>
          </div>
        </div>

        {/* <div className="divider"></div> */}

        <div className="excel-upload">
          <h2>OR</h2>
          <div className="file-upload-container">
            <input
              type="file"
              id="excel-file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="file-input"
            />
            <label htmlFor="excel-file" className="file-upload-button">
              <FaFileUpload className="upload-icon" />
              {file ? file.name : "Upload Your Excel File"}
            </label>
            <button
              onClick={handleUpload}
              className={`upload-button ${!file ? "disabled" : ""}`}
              disabled={!file}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMedicineModal;
