import React, { useState } from "react";
import ShopSearch from "./ShopSearch";
import Dashboard from "./Dashboard";
import AddMedicineModal from "./AddMedicineModal";
import "../../Styles/ShopOwner.css"; // Import CSS file for styling

// Dummy data for shops
const dummyShops = [
  {
    id: 1,
    name: "MediPlus Pharmacy",
    address: "123 Main St, Downtown",
    pincode: "560001",
  },
  {
    id: 2,
    name: "Healthcare Medicines",
    address: "456 Park Ave, Uptown",
    pincode: "560002",
  },
  {
    id: 3,
    name: "Royal Medical Store",
    address: "789 Central Rd, Midtown",
    pincode: "560003",
  },
  {
    id: 4,
    name: "City Pharmacy",
    address: "321 Broadway, Westside",
    pincode: "560004",
  },
  {
    id: 5,
    name: "Family Medical Shop",
    address: "654 East St, Eastside",
    pincode: "560005",
  },
];

// Dummy data for medicines (initial set for selected shop)
const dummyMedicines = [
  //   { name: "Paracetamol", brand: "Calpol" },
  //   { name: "Amoxicillin", brand: "Mox" },
];

function HomePage() {
  const [selectedShop, setSelectedShop] = useState(null);
  const [medicines, setMedicines] = useState(dummyMedicines);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSelectShop = (shop) => {
    setSelectedShop(shop);
    // Reset to dummy medicines when changing shops
    setMedicines(dummyMedicines);
  };

  const handleAddMedicine = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  const handleAddNewMedicine = (medicine) => {
    const exists = medicines.some(
      (m) =>
        m.name.trim().toLowerCase() === medicine.name.trim().toLowerCase() &&
        (m.brand || "").trim().toLowerCase() ===
          (medicine.brand || "").trim().toLowerCase()
    );
    if (exists) {
      alert("This medicine is already in your list!");
      return;
    }

    setMedicines([...medicines, medicine]);
    setShowAddModal(false);
  };

  const handleRemoveMedicine = (index) => {
    const updatedMedicines = [...medicines];
    updatedMedicines.splice(index, 1);
    setMedicines(updatedMedicines);
  };
  // Edit an existing medicine at a given index
  const handleEditMedicine = (index, updated) => {
    setMedicines((prev) =>
      prev.map((m, i) => (i === index ? { ...m, ...updated } : m))
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Shop Owner Dashboard</h1>
      </header>

      <main className="app-main">
        {!selectedShop ? (
          <ShopSearch onSelectShop={handleSelectShop} dummyShops={dummyShops} />
        ) : (
          <Dashboard
            selectedShop={selectedShop}
            medicines={medicines}
            onAddMedicine={handleAddMedicine}
            onRemoveMedicine={handleRemoveMedicine}
            onEditMedicine={handleEditMedicine}
          />
        )}
      </main>

      {showAddModal && (
        <AddMedicineModal
          onClose={handleCloseModal}
          onAdd={handleAddNewMedicine}
        />
      )}
    </div>
  );
}

export default HomePage;
