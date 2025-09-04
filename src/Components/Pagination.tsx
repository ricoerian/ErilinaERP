import React from 'react';

interface PaginationProps {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ itemsPerPage, totalItems, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = [];

  const maxPageButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-6">
      <div className="join rounded-md shadow-sm">
        <button
          className="join-item btn btn-sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          « First
        </button>
        <button
          className="join-item btn btn-sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹ Prev
        </button>
        {pageNumbers.map(number => (
          <button
            key={number}
            className={`join-item btn btn-sm ${currentPage === number ? 'btn-active' : ''}`}
            onClick={() => onPageChange(number)}
          >
            {number}
          </button>
        ))}
        <button
          className="join-item btn btn-sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next ›
        </button>
        <button
          className="join-item btn btn-sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last »
        </button>
      </div>
    </div>
  );
};

export default Pagination;
