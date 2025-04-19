import { Search } from "lucide-react";
import React, { useState } from "react";

const ShopSearch = ({ onSelectShop, dummyShops }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showShops, setShowShops] = useState(false);
  const [filteredShops, setFilteredShops] = useState([]);

  const handleSearch = () => {
    const filtered = dummyShops.filter(
      (shop) =>
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.pincode.includes(searchTerm)
    );
    setFilteredShops(filtered);
  };

  const handleFocus = () => {
    setShowShops(true);
    handleSearch(); // Filter shops based on current search term
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (showShops) {
      // If shops are already showing, update the filtered list
      const filtered = dummyShops.filter(
        (shop) =>
          shop.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          shop.address.toLowerCase().includes(e.target.value.toLowerCase()) ||
          shop.pincode.includes(e.target.value)
      );
      setFilteredShops(filtered);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="container">
      <div className="search-container">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Search your shop..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyPress}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      {showShops && (
        <div className="shops-list">
          {filteredShops.length > 0 ? (
            filteredShops.map((shop) => (
              <div
                key={shop.id}
                className="shop-item"
                onClick={() => onSelectShop(shop)}
              >
                <h3>{shop.name}</h3>
                <p>{shop.address}</p>
                <p>PIN: {shop.pincode}</p>
              </div>
            ))
          ) : (
            <div className="no-results">
              No shops found. Try another search.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopSearch;
