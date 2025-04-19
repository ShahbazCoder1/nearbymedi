import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Pagination from "./Pagination";

const Dashboard = ({
  selectedShop,
  medicines,
  onAddMedicine,
  onRemoveMedicine,
  onEditMedicine,
}) => {
  // --- State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMedicines, setFilteredMedicines] = useState(medicines);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editName, setEditName] = useState("");
  const [editBrand, setEditBrand] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // --- Pagination config ---
  const pageSize = 5;
  const totalRecords = filteredMedicines.length;

  // --- Filter logic ---

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();

    // Annotate each medicine with its original position:
    const withIndex = medicines.map((m, idx) => ({
      ...m,
      originalIndex: idx,
    }));

    // Filter on name/brand:
    const filtered =
      term === ""
        ? withIndex
        : withIndex.filter(
            (rec) =>
              rec.name.toLowerCase().includes(term) ||
              (rec.brand && rec.brand.toLowerCase().includes(term))
          );

    setFilteredMedicines(filtered);
    setCurrentPage(1);
  }, [searchTerm, medicines]);

  // --- Compute current page slice ---
  const startIndex = (currentPage - 1) * pageSize;
  const currentRecords = filteredMedicines.slice(
    startIndex,
    startIndex + pageSize
  );

  // --- Handlers ---

  const handleEditClick = (originalIndex, med) => {
    setEditingIndex(originalIndex);
    setEditName(med.name);
    setEditBrand(med.brand || "");
  };

  const handleSaveClick = (originalIndex) => {
    onEditMedicine(originalIndex, { name: editName, brand: editBrand });
    setEditingIndex(null);
  };

  const handleCancelClick = () => {
    setEditingIndex(null);
  };

  return (
    <div className="container">
      {/* Shop Info & Add Medicine */}
      <div className="shop-info">
        <input
          type="text"
          value={`${selectedShop.name}, ${selectedShop.address}, ${selectedShop.pincode}`}
          readOnly
          className="shop-info-input"
        />
        <div className="shop-actions">
          <button onClick={onAddMedicine} className="add-medicine-button">
            Add Medicine
          </button>
        </div>
      </div>

      {/* Search + Total Stock */}
      <div className="medicine-search-container">
        <div className="search-wrapper">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search Medicine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button
              type="button"
              onClick={() => {
                setHasSearched(true); // <-- track that user triggered search
                setCurrentPage(1);
              }}
              className="search-button"
            >
              Search
            </button>
          </div>
        </div>
        <div className="total-stock">
          <p>Total Medicine(s): {totalRecords}</p>
        </div>
      </div>

      {/* Table Header */}
      <div className="table-header">
        <div className="table-title">
          <h3>Medicine List</h3>
        </div>
      </div>

      {/* Medicine Table */}
      <div className="table-container">
        <table className="medicine-table">
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Medicine Name</th>
              <th>Brand</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((rec, index) => {
              const { name, brand, originalIndex } = rec;
              const isEditing = editingIndex === originalIndex;

              return (
                <tr key={originalIndex}>
                  {/* Sl No: show the original position + 1 */}
                  <td>{originalIndex + 1}</td>

                  <td>
                    {isEditing ? (
                      <input
                        className="edit-input"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    ) : (
                      name
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        className="edit-input"
                        value={editBrand}
                        onChange={(e) => setEditBrand(e.target.value)}
                        placeholder="(optional)"
                      />
                    ) : (
                      brand || "-"
                    )}
                  </td>

                  <td className="action-cell">
                    {isEditing ? (
                      <>
                        <button
                          className="save-btn"
                          onClick={() => handleSaveClick(originalIndex)}
                        >
                          Save
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={handleCancelClick}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="remove-button"
                          onClick={() => onRemoveMedicine(originalIndex)}
                        >
                          Remove
                        </button>
                        <button
                          className="edit-button"
                          onClick={() => handleEditClick(originalIndex, rec)}
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
            {currentRecords.length === 0 && (
              <tr>
                <td colSpan="4" className="no-data">
                  {medicines.length === 0
                    ? "No medicines to display"
                    : hasSearched
                    ? "No medicines found"
                    : ""}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <Pagination
        totalRecords={totalRecords}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Dashboard;
