import React from "react";

export default function Pagination({
  totalRecords,
  pageSize,
  currentPage,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalRecords / pageSize);
  if (totalPages <= 1) return null;

  // build an array [1, 2, …, totalPages]
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination-container">
      <button
        className="pagination-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        « Previous
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={`pagination-btn${p === currentPage ? " active" : ""}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      <button
        className="pagination-btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next »
      </button>

      <span className="pagination-info">Total Record(s): {totalRecords}</span>
    </div>
  );
}
