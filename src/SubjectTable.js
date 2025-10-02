// import React from 'react';

// // Simple SVG icons for actions
// const EditIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
//         <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
//     </svg>
// );

// const DeleteIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <polyline points="3 6 5 6 21 6"></polyline>
//         <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
//         <line x1="10" y1="11" x2="10" y2="17"></line>
//         <line x1="14" y1="11" x2="14" y2="17"></line>
//     </svg>
// );


// function SubjectTable({ subjects, onEdit, onDelete }) {
//   return (
//     <table className="subject-table">
//       <thead>
//         <tr>
//           <th>Subject Code</th>
//           <th>Subject Name</th>
//           <th>Term</th>
//           <th>Subject Coordinator</th>
//           <th>Version</th>
//           <th>Date</th>
//           <th>Format of delivery</th>
//           {/* Columns from screenshot that are not in the data are omitted for now */}
//           {/* <th>Total Subject Workload</th>
//           <th>Total Workload Allocation</th>
//           <th>Unallocated Available Workload</th> */}
//           <th>Action</th>
//         </tr>
//       </thead>
//       <tbody>
//         {subjects.map(subject => (
//           <tr key={subject.id}>
//             <td>{subject.code}</td>
//             <td>{subject.name}</td>
//             <td>{subject.term}</td>
//             <td>{subject.coordinator}</td>
//             <td>{subject.version}</td>
//             <td>{new Date(subject.date).toLocaleDateString('en-GB')}</td>
//             <td>{subject.delivery}</td>
//             {/* <td>51.5%</td>
//             <td>51.5%</td>
//             <td>0</td> */}
//             <td>
//               <button onClick={() => onEdit(subject)} className="action-btn edit-btn" aria-label="Edit"><EditIcon /></button>
//               <button onClick={() => onDelete(subject.id)} className="action-btn delete-btn" aria-label="Delete"><DeleteIcon /></button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }

// export default SubjectTable;

import React from 'react';

// Simple SVG icons for actions
const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const DeleteIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);


function SubjectTable({ subjects, onEdit, onDelete }) {
  
  // Per test case TC05, clicking a subject should navigate.
  const handleRowClick = (subject) => {
    // In a real app, you would use a router (like React Router) to navigate.
    // e.g., navigate(`/subjects/${subject.id}`);
    console.log(`Navigating to workload page for subject: ${subject.name}`);
  };

  return (
    <div className="table-wrapper">
      <table className="subject-table">
        <thead>
          <tr>
            <th>Subject Code</th>
            <th>Subject Name</th>
            <th>Term</th>
            <th>Subject Coordinator</th>
            <th>Version</th>
            <th>Date</th>
            <th>Format of delivery</th>
            {/* Added missing columns from UI screenshot */}
            <th>Total Subject Workload</th>
            <th>Total Workload Allocation</th>
            <th>Unallocated Available Workload</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map(subject => (
            <tr key={subject.id} onClick={() => handleRowClick(subject)} className="clickable-row">
              <td>{subject.code}</td>
              <td>{subject.name}</td>
              <td>{subject.term}</td>
              <td>{subject.coordinator}</td>
              <td>{subject.version}</td>
              <td>{new Date(subject.date).toLocaleDateString('en-GB')}</td>
              <td>{subject.delivery}</td>
              {/* Added data cells for the new columns */}
              <td>{subject.totalWorkload}</td>
              <td>{subject.allocatedWorkload}</td>
              <td>{subject.unallocatedWorkload}</td>
              <td onClick={(e) => e.stopPropagation()}> {/* Stop row click from firing when clicking buttons */}
                <button onClick={() => onEdit(subject)} className="action-btn edit-btn" aria-label="Edit"><EditIcon /></button>
                <button onClick={() => onDelete(subject.id)} className="action-btn delete-btn" aria-label="Delete"><DeleteIcon /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SubjectTable;