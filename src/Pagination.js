// import React from 'react';

// function Pagination({ totalRows, rowsPerPage, currentPage, onPageChange, onRowsPerPageChange }) {
//   const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;

//   const handleRowsChange = (e) => {
//     onRowsPerPageChange(Number(e.target.value));
//     onPageChange(1); // Reset to first page
//   };

//   return (
//     <div className="pagination-container">
//       <div className="rows-per-page">
//         <span>Rows per page</span>
//         <select value={rowsPerPage} onChange={handleRowsChange}>
//           <option value="5">5</option>
//           <option value="10">10</option>
//           <option value="20">20</option>
//         </select>
//       </div>
//       <div className="page-controls">
//         <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
//           &lt;&lt;
//         </button>
//         <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
//           &lt;
//         </button>
//         <span>Page {currentPage} of {totalPages}</span>
//         <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
//           &gt;
//         </button>
//          <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
//           &gt;&gt;
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Pagination;

import React from 'react';

function Pagination({ totalRows, rowsPerPage, currentPage, onPageChange, onRowsPerPageChange }) {
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handleRowsChange = (e) => {
    onRowsPerPageChange(Number(e.target.value));
    onPageChange(1); // Reset to first page
  };

  return (
    <div className="pagination-container">
      <div className="rows-per-page">
        <span>Rows per page</span>
        <select value={rowsPerPage} onChange={handleRowsChange}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>
      <div className="page-controls">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          &lt;
        </button>
        <span>Page {currentPage} of {totalPages || 1}</span>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
          &gt;
        </button>
      </div>
    </div>
  );
}

export default Pagination;