// import React, { useState, useMemo, useEffect } from 'react';

// // --- Helper Components for Icons (using SVG for portability) ---
// const EditIcon = ({ style }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
//     <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
//     <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
//   </svg>
// );

// const DeleteIcon = ({ style }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
//     <polyline points="3 6 5 6 21 6" />
//     <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
//     <line x1="10" y1="11" x2="10" y2="17" />
//     <line x1="14" y1="11" x2="14" y2="17" />
//   </svg>
// );

// // --- Initial Data from Prompt ---
// const initialSubjects = [
//   { "subjectId": "id001", "subjectCode": "EXPL001", "subjectName": "Example 1", "term": "Spring", "subjectCoordinator": "Tom", "version": 1, "date": "18/11/24", "formatOfDelivery": "Lecture based", "totalSubjectWorkload": "51.5%", "totalWorkloadAllocation": "51.5%", "unallocatedAvailableWorkload": "0" },
//   { "subjectId": "id002", "subjectCode": "EXPL002", "subjectName": "Example 2", "term": "Autumn", "subjectCoordinator": "Usha", "version": 1, "date": "25/08/24", "formatOfDelivery": "Project based", "totalSubjectWorkload": "51.5%", "totalWorkloadAllocation": "51.5%", "unallocatedAvailableWorkload": "0" },
//   { "subjectId": "id003", "subjectCode": "EXPL003", "subjectName": "Example 3", "term": "1H", "subjectCoordinator": "Victoria", "version": 1, "date": "08/04/24", "formatOfDelivery": "Lecture based", "totalSubjectWorkload": "51.5%", "totalWorkloadAllocation": "51.5%", "unallocatedAvailableWorkload": "0" }
// ];

// const columns = [
//   { "key": "subjectCode", "header": "Subject Code" },
//   { "key": "subjectName", "header": "Subject Name" },
//   { "key": "term", "header": "Term" },
//   { "key": "subjectCoordinator", "header": "Subject Coordinator" },
//   { "key": "version", "header": "Version" },
//   { "key": "date", "header": "Date" },
//   { "key": "formatOfDelivery", "header": "Format of delivery" },
//   { "key": "totalSubjectWorkload", "header": "Total Subject Workload" },
//   { "key": "totalWorkloadAllocation", "header": "Total Workload Allocation" },
//   { "key": "unallocatedAvailableWorkload", "header": "Unallocated Available Workload" },
//   { "key": "rowActions", "header": "Action" }
// ];

// // --- Main App Component ---
// export default function SubjectManagementPage() {
//   const [subjects, setSubjects] = useState(initialSubjects);
//   const [isFormModalOpen, setFormModalOpen] = useState(false);
//   const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [currentSubject, setCurrentSubject] = useState(null);
//   const [subjectToDelete, setSubjectToDelete] = useState(null);
//   const [notification, setNotification] = useState(null); // { message: string, type: 'success' | 'warning' }
  
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // Effect to automatically hide notification after 3 seconds
//   useEffect(() => {
//     if (notification) {
//       const timer = setTimeout(() => {
//         setNotification(null);
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [notification]);

//   const paginatedSubjects = useMemo(() => {
//     const startIndex = (currentPage - 1) * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;
//     return subjects.slice(startIndex, endIndex);
//   }, [subjects, currentPage, rowsPerPage]);

//   const totalPages = Math.ceil(subjects.length / rowsPerPage);

//   // --- Handlers for Modals and Actions ---

//   const handleOpenAddForm = () => {
//     setCurrentSubject({
//       subjectCode: '',
//       subjectName: '',
//       term: 'Spring',
//       subjectCoordinator: '',
//       version: 1,
//       date: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD for date input
//       formatOfDelivery: 'Lecture based'
//     });
//     setFormModalOpen(true);
//   };

//   const handleOpenEditForm = (subject) => {
//     const dateParts = subject.date.split('/');
//     const formattedDate = `20${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
//     setCurrentSubject({ ...subject, date: formattedDate });
//     setFormModalOpen(true);
//   };
  
//   const handleCloseForm = () => {
//     setFormModalOpen(false);
//     setCurrentSubject(null);
//   };

//   const handleSaveSubject = (subjectData) => {
//     if (subjectData.subjectId) { // Editing existing
//       setSubjects(subjects.map(s => s.subjectId === subjectData.subjectId ? { ...s, ...subjectData, date: new Date(subjectData.date).toLocaleDateString('en-GB')} : s));
//       setNotification({ message: 'Subject updated successfully!', type: 'success' });
//     } else { // Adding new
//       // Warning check for duplicate subject code
//       if (subjects.some(s => s.subjectCode.toLowerCase() === subjectData.subjectCode.toLowerCase())) {
//         setNotification({ message: `Subject code '${subjectData.subjectCode}' already exists.`, type: 'warning' });
//         return;
//       }
//       const newSubject = {
//         ...subjectData,
//         subjectId: `id${Date.now()}`,
//         date: new Date(subjectData.date).toLocaleDateString('en-GB'),
//         totalSubjectWorkload: '0%', 
//         totalWorkloadAllocation: '0%', 
//         unallocatedAvailableWorkload: '0'
//       };
//       setSubjects([...subjects, newSubject]);
//       setNotification({ message: 'Subject added successfully!', type: 'success' });
//     }
//     handleCloseForm();
//   };

//   const handleOpenDeleteConfirmation = (subject) => {
//     setSubjectToDelete(subject);
//     setDeleteModalOpen(true);
//   };

//   const handleCloseDeleteConfirmation = () => {
//     setDeleteModalOpen(false);
//     setSubjectToDelete(null);
//   };

//   const handleConfirmDelete = () => {
//     if (subjectToDelete) {
//       setSubjects(subjects.filter(s => s.subjectId !== subjectToDelete.subjectId));
//       setNotification({ message: 'Subject deleted successfully!', type: 'success' });
//       handleCloseDeleteConfirmation();
//     }
//   };
  
//   // --- Inline Styles ---
//   const styles = {
//     container: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', padding: '2rem', backgroundColor: '#f8f9fa', minHeight: '100vh' },
//     header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
//     title: { color: '#343a40', fontSize: '1.75rem' },
//     button: (variant = 'primary') => ({
//       padding: '0.6rem 1.2rem',
//       fontSize: '1rem',
//       borderRadius: '6px',
//       border: 'none',
//       cursor: 'pointer',
//       fontWeight: '500',
//       transition: 'background-color 0.2s, box-shadow 0.2s',
//       backgroundColor: variant === 'primary' ? '#007bff' : variant === 'danger' ? '#dc3545' : '#6c757d',
//       color: 'white',
//     }),
//     tableContainer: { overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
//     table: { width: '100%', borderCollapse: 'collapse' },
//     th: {
//       padding: '1rem',
//       textAlign: 'left',
//       borderBottom: '2px solid #dee2e6',
//       backgroundColor: '#f8f9fa',
//       color: '#495057',
//       fontSize: '0.8rem',
//       textTransform: 'uppercase',
//       letterSpacing: '0.5px',
//       whiteSpace: 'nowrap'
//     },
//     td: { padding: '1rem', borderBottom: '1px solid #e9ecef', color: '#495057', whiteSpace: 'nowrap', fontSize: '0.9rem' },
//     actionCell: { display: 'flex', gap: '0.75rem' },
//     iconButton: { cursor: 'pointer', background: 'none', border: 'none', padding: '0.25rem', borderRadius: '4px', transition: 'background-color 0.2s' },
//     paginationContainer: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '1.5rem', gap: '1rem' },
//     paginationText: { fontSize: '0.9rem', color: '#495057' },
//     paginationSelect: { padding: '0.4rem', borderRadius: '4px', border: '1px solid #ced4da' },
//   };

//   return (
//     <div style={styles.container}>
//       <Notification notification={notification} />
//       <header style={styles.header}>
//         <h1 style={styles.title}>Subject Workload Manager</h1>
//         <button style={styles.button('primary')} onClick={handleOpenAddForm}>Add Subject</button>
//       </header>

//       <main>
//         <div style={styles.tableContainer}>
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 {columns.map(col => <th key={col.key} style={styles.th}>{col.header}</th>)}
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedSubjects.map(subject => (
//                 <tr key={subject.subjectId} style={{ transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f3f5'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
//                   {columns.map(col => (
//                     <td key={`${subject.subjectId}-${col.key}`} style={styles.td}>
//                       {col.key === 'rowActions' ? (
//                         <div style={styles.actionCell}>
//                           <button style={styles.iconButton} title="Edit Subject" onClick={() => handleOpenEditForm(subject)}>
//                             <EditIcon style={{ color: '#007bff' }} />
//                           </button>
//                           <button style={styles.iconButton} title="Delete Subject" onClick={() => handleOpenDeleteConfirmation(subject)}>
//                             <DeleteIcon style={{ color: '#dc3545' }} />
//                           </button>
//                         </div>
//                       ) : (
//                         subject[col.key]
//                       )}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <div style={styles.paginationContainer}>
//             <span style={styles.paginationText}>Rows per page:</span>
//             <select 
//                 style={styles.paginationSelect}
//                 value={rowsPerPage} 
//                 onChange={e => {setRowsPerPage(Number(e.target.value)); setCurrentPage(1);}}>
//                 {[10, 25, 50].map(size => <option key={size} value={size}>{size}</option>)}
//             </select>
//              <span style={styles.paginationText}>
//                 {`${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, subjects.length)} of ${subjects.length}`}
//             </span>
//             <button style={{...styles.button('secondary'), opacity: currentPage === 1 ? 0.5 : 1}} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</button>
//             <button style={{...styles.button('secondary'), opacity: currentPage === totalPages ? 0.5 : 1}} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
//         </div>
//       </main>

//       {isFormModalOpen && <SubjectFormModal subject={currentSubject} onClose={handleCloseForm} onSave={handleSaveSubject} />}
//       {isDeleteModalOpen && <DeleteConfirmationModal onConfirm={handleConfirmDelete} onCancel={handleCloseDeleteConfirmation} />}
//     </div>
//   );
// }

// // --- Notification Token Component ---
// function Notification({ notification }) {
//   if (!notification) return null;

//   const baseStyle = {
//     position: 'fixed',
//     top: '20px',
//     left: '50%',
//     transform: 'translateX(-50%)',
//     padding: '1rem 1.5rem',
//     borderRadius: '6px',
//     boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//     fontSize: '1rem',
//     fontWeight: '500',
//     zIndex: 1000,
//     transition: 'opacity 0.3s ease-in-out',
//   };

//   const typeStyles = {
//     success: {
//       backgroundColor: '#d4edda',
//       color: '#155724',
//       border: '1px solid #c3e6cb',
//     },
//     warning: {
//       backgroundColor: '#fff3cd',
//       color: '#856404',
//       border: '1px solid #ffeeba',
//     },
//   };

//   return (
//     <div style={{ ...baseStyle, ...typeStyles[notification.type] }}>
//       {notification.message}
//     </div>
//   );
// }


// // --- Subject Form Modal Component ---
// function SubjectFormModal({ subject, onClose, onSave }) {
//   const [formData, setFormData] = useState(subject);
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: null }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     const nameRegex = /^[a-zA-Z\s]*$/;
//     const nameAndCodeRegex = /^[a-zA-Z0-9\s]*$/;
//     const codeRegex = /^[a-zA-Z0-9]*$/;

//     if (!formData.subjectCode.trim()) {
//       newErrors.subjectCode = 'Subject Code is required.';
//     } else if (!codeRegex.test(formData.subjectCode)) {
//       newErrors.subjectCode = 'Subject Code cannot contain special characters or spaces.';
//     }

//     if (!formData.subjectName.trim()) {
//       newErrors.subjectName = 'Subject Name is required.';
//     } else if (!nameAndCodeRegex.test(formData.subjectName)) {
//       newErrors.subjectName = 'Subject Name cannot contain special characters.';
//     }

//     if (!formData.subjectCoordinator.trim()) {
//       newErrors.subjectCoordinator = 'Subject Coordinator is required.';
//     } else if (!nameRegex.test(formData.subjectCoordinator)) {
//       newErrors.subjectCoordinator = 'Coordinator name can only contain letters and spaces.';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };
  
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       onSave(formData);
//     }
//   };
  
//   const styles = {
//     modalBackdrop: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 998 },
//     modalContent: { backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '600px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' },
//     modalHeader: { marginBottom: '1.5rem' },
//     modalTitle: { margin: 0, fontSize: '1.5rem', color: '#343a40' },
//     modalInstructions: { marginTop: '0.5rem', color: '#6c757d', fontSize: '0.9rem' },
//     formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' },
//     formGroup: { display: 'flex', flexDirection: 'column' },
//     label: { marginBottom: '0.5rem', color: '#495057', fontWeight: '500', fontSize: '0.9rem' },
//     input: { padding: '0.6rem', borderRadius: '4px', border: '1px solid #ced4da', fontSize: '1rem' },
//     inputError: { border: '1px solid #dc3545' },
//     errorMessage: { color: '#dc3545', fontSize: '0.8rem', marginTop: '0.25rem', height: '1rem' },
//     modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' },
//     button: (variant = 'primary') => ({
//       padding: '0.6rem 1.2rem',
//       fontSize: '1rem',
//       borderRadius: '6px',
//       border: 'none',
//       cursor: 'pointer',
//       fontWeight: '500',
//       transition: 'background-color 0.2s, box-shadow 0.2s',
//       backgroundColor: variant === 'primary' ? '#007bff' : '#6c757d',
//       color: 'white',
//     }),
//   };
  
//   return (
//     <div style={styles.modalBackdrop} onClick={onClose}>
//       <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
//         <div style={styles.modalHeader}>
//           <h2 style={styles.modalTitle}>{formData.subjectId ? 'Edit Subject' : 'Add Subject'}</h2>
//           <p style={styles.modalInstructions}>Complete all sections that apply to your subject.</p>
//         </div>
//         <form onSubmit={handleSubmit}>
//           <div style={styles.formGrid}>
//             <div style={styles.formGroup}>
//                 <label style={styles.label}>Subject Code</label>
//                 <input style={{...styles.input, ...(errors.subjectCode && styles.inputError)}} name="subjectCode" value={formData.subjectCode} onChange={handleChange} />
//                 <p style={styles.errorMessage}>{errors.subjectCode || ''}</p>
//             </div>
//             <div style={styles.formGroup}>
//                 <label style={styles.label}>Subject Name</label>
//                 <input style={{...styles.input, ...(errors.subjectName && styles.inputError)}} name="subjectName" value={formData.subjectName} onChange={handleChange} />
//                 <p style={styles.errorMessage}>{errors.subjectName || ''}</p>
//             </div>
//             <div style={styles.formGroup}>
//                 <label style={styles.label}>Term</label>
//                 <select style={styles.input} name="term" value={formData.term} onChange={handleChange} required><option>Spring</option><option>Autumn</option><option>1H</option><option>2H</option><option>Q1</option><option>Q2</option></select>
//                 <p style={styles.errorMessage}></p>
//             </div>
//             <div style={styles.formGroup}>
//                 <label style={styles.label}>Subject Coordinator</label>
//                 <input style={{...styles.input, ...(errors.subjectCoordinator && styles.inputError)}} name="subjectCoordinator" value={formData.subjectCoordinator} onChange={handleChange} />
//                 <p style={styles.errorMessage}>{errors.subjectCoordinator || ''}</p>
//             </div>
//             <div style={styles.formGroup}>
//                 <label style={styles.label}>Version</label>
//                 <input style={styles.input} type="number" name="version" value={formData.version} onChange={handleChange} required />
//                 <p style={styles.errorMessage}></p>
//             </div>
//             <div style={styles.formGroup}>
//                 <label style={styles.label}>Date</label>
//                 <input style={styles.input} type="date" name="date" value={formData.date} onChange={handleChange} required />
//                 <p style={styles.errorMessage}></p>
//             </div>
//             <div style={styles.formGroup}>
//                 <label style={styles.label}>Format of delivery</label>
//                 <select style={styles.input} name="formatOfDelivery" value={formData.formatOfDelivery} onChange={handleChange} required><option>Lecture based</option><option>Project based</option></select>
//                 <p style={styles.errorMessage}></p>
//             </div>
//           </div>
//           <div style={styles.modalActions}>
//             <button type="button" style={styles.button('secondary')} onClick={onClose}>Cancel</button>
//             <button type="submit" style={styles.button('primary')}>Save Subject</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// // --- Delete Confirmation Modal Component ---
// function DeleteConfirmationModal({ onConfirm, onCancel }) {
//   const styles = {
//     modalBackdrop: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
//     modalContent: { backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '450px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', textAlign: 'center' },
//     modalTitle: { marginTop: 0, fontSize: '1.5rem', color: '#343a40' },
//     message: { color: '#6c757d', fontSize: '1rem', lineHeight: '1.5' },
//     modalActions: { display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' },
//     button: (variant = 'primary') => ({
//       padding: '0.6rem 1.2rem',
//       fontSize: '1rem',
//       borderRadius: '6px',
//       border: 'none',
//       cursor: 'pointer',
//       fontWeight: '500',
//       transition: 'background-color 0.2s, box-shadow 0.2s',
//       backgroundColor: variant === 'danger' ? '#dc3545' : variant === 'secondary' ? '#6c757d' : '#007bff',
//       color: 'white',
//     }),
//   };

//   return (
//     <div style={styles.modalBackdrop} onClick={onCancel}>
//       <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
//         <h2 style={styles.modalTitle}>Confirm Deletion</h2>
//         <p style={styles.message}>Are you sure you want to delete this subject? This action cannot be undone.</p>
//         <div style={styles.modalActions}>
//           <button style={styles.button('secondary')} onClick={onCancel}>Cancel</button>
//           <button style={styles.button('danger')} onClick={onConfirm}>Confirm Delete</button>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// --- Icon Components ---
const EditIcon = ({ style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
);
const DeleteIcon = ({ style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
);
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
);


// --- Shared Helper Components ---

function Notification({ notification }) {
  if (!notification) return null;
  const baseStyle = { position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', padding: '1rem 1.5rem', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontSize: '1rem', fontWeight: '500', zIndex: 1000, transition: 'opacity 0.3s ease-in-out' };
  const typeStyles = {
    success: { backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' },
    warning: { backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeeba' },
  };
  return <div style={{ ...baseStyle, ...typeStyles[notification.type] }}>{notification.message}</div>;
}

function SubjectFormModal({ subject, onClose, onSave }) {
  const [formData, setFormData] = useState(subject);
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.subjectCode.trim()) newErrors.subjectCode = 'Subject Code is required.';
    else if (!/^[a-zA-Z0-9]*$/.test(formData.subjectCode)) newErrors.subjectCode = 'Subject Code cannot contain special characters or spaces.';
    if (!formData.subjectName.trim()) newErrors.subjectName = 'Subject Name is required.';
    else if (!/^[a-zA-Z0-9\s]*$/.test(formData.subjectName)) newErrors.subjectName = 'Subject Name cannot contain special characters.';
    if (!formData.subjectCoordinator.trim()) newErrors.subjectCoordinator = 'Subject Coordinator is required.';
    else if (!/^[a-zA-Z\s]*$/.test(formData.subjectCoordinator)) newErrors.subjectCoordinator = 'Coordinator name can only contain letters and spaces.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) onSave(formData);
  };
  const styles = {
    modalBackdrop: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 998 },
    modalContent: { backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '600px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' },
    modalHeader: { marginBottom: '1.5rem' },
    modalTitle: { margin: 0, fontSize: '1.5rem', color: '#343a40' },
    modalInstructions: { marginTop: '0.5rem', color: '#6c757d', fontSize: '0.9rem' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' },
    formGroup: { display: 'flex', flexDirection: 'column' },
    label: { marginBottom: '0.5rem', color: '#495057', fontWeight: '500', fontSize: '0.9rem' },
    input: { padding: '0.6rem', borderRadius: '4px', border: '1px solid #ced4da', fontSize: '1rem' },
    inputError: { border: '1px solid #dc3545' },
    errorMessage: { color: '#dc3545', fontSize: '0.8rem', marginTop: '0.25rem', height: '1rem' },
    modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' },
    button: (variant = 'primary') => ({ padding: '0.6rem 1.2rem', fontSize: '1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500', backgroundColor: variant === 'primary' ? '#007bff' : '#6c757d', color: 'white' }),
  };
  return (
    <div style={styles.modalBackdrop} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{formData.subjectId ? 'Edit Subject' : 'Add Subject'}</h2>
          <p style={styles.modalInstructions}>Complete all sections that apply to your subject.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}><label style={styles.label}>Subject Code</label><input style={{...styles.input, ...(errors.subjectCode && styles.inputError)}} name="subjectCode" value={formData.subjectCode} onChange={handleChange} /><p style={styles.errorMessage}>{errors.subjectCode || ''}</p></div>
            <div style={styles.formGroup}><label style={styles.label}>Subject Name</label><input style={{...styles.input, ...(errors.subjectName && styles.inputError)}} name="subjectName" value={formData.subjectName} onChange={handleChange} /><p style={styles.errorMessage}>{errors.subjectName || ''}</p></div>
            <div style={styles.formGroup}><label style={styles.label}>Term</label><select style={styles.input} name="term" value={formData.term} onChange={handleChange} required><option>Spring</option><option>Autumn</option><option>1H</option><option>2H</option><option>Q1</option><option>Q2</option></select><p style={styles.errorMessage}></p></div>
            <div style={styles.formGroup}><label style={styles.label}>Subject Coordinator</label><input style={{...styles.input, ...(errors.subjectCoordinator && styles.inputError)}} name="subjectCoordinator" value={formData.subjectCoordinator} onChange={handleChange} /><p style={styles.errorMessage}>{errors.subjectCoordinator || ''}</p></div>
            <div style={styles.formGroup}><label style={styles.label}>Version</label><input style={styles.input} type="number" name="version" value={formData.version} onChange={handleChange} required /><p style={styles.errorMessage}></p></div>
            <div style={styles.formGroup}><label style={styles.label}>Date</label><input style={styles.input} type="date" name="date" value={formData.date} onChange={handleChange} required /><p style={styles.errorMessage}></p></div>
            <div style={styles.formGroup}><label style={styles.label}>Format of delivery</label><select style={styles.input} name="formatOfDelivery" value={formData.formatOfDelivery} onChange={handleChange} required><option>Lecture based</option><option>Project based</option></select><p style={styles.errorMessage}></p></div>
          </div>
          <div style={styles.modalActions}><button type="button" style={styles.button('secondary')} onClick={onClose}>Cancel</button><button type="submit" style={styles.button('primary')}>Save Subject</button></div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmationModal({ onConfirm, onCancel }) {
  const styles = {
    modalBackdrop: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
    modalContent: { backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '450px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', textAlign: 'center' },
    modalTitle: { marginTop: 0, fontSize: '1.5rem', color: '#343a40' },
    message: { color: '#6c757d', fontSize: '1rem', lineHeight: '1.5' },
    modalActions: { display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' },
    button: (variant) => ({ padding: '0.6rem 1.2rem', fontSize: '1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500', backgroundColor: variant === 'danger' ? '#dc3545' : '#6c757d', color: 'white' }),
  };
  return (
    <div style={styles.modalBackdrop} onClick={onCancel}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2 style={styles.modalTitle}>Confirm Deletion</h2>
        <p style={styles.message}>Are you sure you want to delete this subject? This action cannot be undone.</p>
        <div style={styles.modalActions}><button style={styles.button('secondary')} onClick={onCancel}>Cancel</button><button style={styles.button('danger')} onClick={onConfirm}>Confirm Delete</button></div>
      </div>
    </div>
  );
}


// --- Page 1: Subject Management Page ---

const initialSubjects = [
  { "subjectId": "id001", "subjectCode": "EXPL001", "subjectName": "Example 1", "term": "Spring", "subjectCoordinator": "Tom", "version": 1, "date": "18/11/24", "formatOfDelivery": "Lecture based", "totalSubjectWorkload": "51.5%", "totalWorkloadAllocation": "51.5%", "unallocatedAvailableWorkload": "0" },
  { "subjectId": "id002", "subjectCode": "EXPL002", "subjectName": "Example 2", "term": "Autumn", "subjectCoordinator": "Usha", "version": 1, "date": "25/08/24", "formatOfDelivery": "Project based", "totalSubjectWorkload": "51.5%", "totalWorkloadAllocation": "51.5%", "unallocatedAvailableWorkload": "0" },
  { "subjectId": "id003", "subjectCode": "EXPL003", "subjectName": "Example 3", "term": "1H", "subjectCoordinator": "Victoria", "version": 1, "date": "08/04/24", "formatOfDelivery": "Lecture based", "totalSubjectWorkload": "51.5%", "totalWorkloadAllocation": "51.5%", "unallocatedAvailableWorkload": "0" }
];

const columns = [
  { "key": "subjectCode", "header": "Subject Code" }, { "key": "subjectName", "header": "Subject Name" }, { "key": "term", "header": "Term" }, { "key": "subjectCoordinator", "header": "Subject Coordinator" }, { "key": "version", "header": "Version" }, { "key": "date", "header": "Date" }, { "key": "formatOfDelivery", "header": "Format of delivery" }, { "key": "totalSubjectWorkload", "header": "Total Subject Workload" }, { "key": "totalWorkloadAllocation", "header": "Total Workload Allocation" }, { "key": "unallocatedAvailableWorkload", "header": "Unallocated Available Workload" }, { "key": "rowActions", "header": "Action" }
];

export default function SubjectManagementPage() {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const paginatedSubjects = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return subjects.slice(startIndex, startIndex + rowsPerPage);
  }, [subjects, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(subjects.length / rowsPerPage);

  const handleRowClick = (subject) => {
    navigate(`/subject/${subject.subjectId}`, { state: { subject } });
  };
  
  const handleOpenAddForm = () => {
    setCurrentSubject({ subjectCode: '', subjectName: '', term: 'Spring', subjectCoordinator: '', version: 1, date: new Date().toLocaleDateString('en-CA'), formatOfDelivery: 'Lecture based' });
    setFormModalOpen(true);
  };

  const handleOpenEditForm = (subject) => {
    const dateParts = subject.date.split('/');
    const formattedDate = `20${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
    setCurrentSubject({ ...subject, date: formattedDate });
    setFormModalOpen(true);
  };
  
  const handleCloseForm = () => {
    setFormModalOpen(false);
    setCurrentSubject(null);
  };

  const handleSaveSubject = (subjectData) => {
    if (subjectData.subjectId) {
      setSubjects(subjects.map(s => s.subjectId === subjectData.subjectId ? { ...s, ...subjectData, date: new Date(subjectData.date).toLocaleDateString('en-GB')} : s));
      setNotification({ message: 'Subject updated successfully!', type: 'success' });
    } else {
      if (subjects.some(s => s.subjectCode.toLowerCase() === subjectData.subjectCode.toLowerCase())) {
        setNotification({ message: `Subject code '${subjectData.subjectCode}' already exists.`, type: 'warning' });
        return;
      }
      const newSubject = { ...subjectData, subjectId: `id${Date.now()}`, date: new Date(subjectData.date).toLocaleDateString('en-GB'), totalSubjectWorkload: '0%', totalWorkloadAllocation: '0%', unallocatedAvailableWorkload: '0' };
      setSubjects([...subjects, newSubject]);
      setNotification({ message: 'Subject added successfully!', type: 'success' });
    }
    handleCloseForm();
  };

  const handleOpenDeleteConfirmation = (subject) => {
    setSubjectToDelete(subject);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteModalOpen(false);
    setSubjectToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (subjectToDelete) {
      setSubjects(subjects.filter(s => s.subjectId !== subjectToDelete.subjectId));
      setNotification({ message: 'Subject deleted successfully!', type: 'success' });
      handleCloseDeleteConfirmation();
    }
  };
  
  const styles = {
    container: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', padding: '2rem', backgroundColor: '#f8f9fa', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    title: { color: '#343a40', fontSize: '1.75rem' },
    button: (variant = 'primary') => ({ padding: '0.6rem 1.2rem', fontSize: '1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500', transition: 'background-color 0.2s, box-shadow 0.2s', backgroundColor: variant === 'primary' ? '#007bff' : variant === 'danger' ? '#dc3545' : '#6c757d', color: 'white' }),
    tableContainer: { overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6', backgroundColor: '#f8f9fa', color: '#495057', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' },
    td: { padding: '1rem', borderBottom: '1px solid #e9ecef', color: '#495057', whiteSpace: 'nowrap', fontSize: '0.9rem' },
    tr: { cursor: 'pointer', transition: 'background-color 0.2s' },
    actionCell: { display: 'flex', gap: '0.75rem' },
    iconButton: { cursor: 'pointer', background: 'none', border: 'none', padding: '0.25rem', borderRadius: '4px', transition: 'background-color 0.2s' },
    paginationContainer: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '1.5rem', gap: '1rem' },
    paginationText: { fontSize: '0.9rem', color: '#495057' },
    paginationSelect: { padding: '0.4rem', borderRadius: '4px', border: '1px solid #ced4da' },
  };

  return (
    <div style={styles.container}>
      <Notification notification={notification} />
      <header style={styles.header}><h1 style={styles.title}>Subject Workload Manager</h1><button style={styles.button('primary')} onClick={handleOpenAddForm}>Add Subject</button></header>
      <main>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead><tr>{columns.map(col => <th key={col.key} style={styles.th}>{col.header}</th>)}</tr></thead>
            <tbody>
              {paginatedSubjects.map(subject => (
                <tr key={subject.subjectId} style={styles.tr} onClick={() => handleRowClick(subject)} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f3f5'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                  {columns.map(col => (
                    <td key={`${subject.subjectId}-${col.key}`} style={styles.td}>
                      {col.key === 'rowActions' ? (
                        <div style={styles.actionCell} onClick={e => e.stopPropagation()}>
                          <button style={styles.iconButton} title="Edit Subject" onClick={() => handleOpenEditForm(subject)}><EditIcon style={{ color: '#007bff' }} /></button>
                          <button style={styles.iconButton} title="Delete Subject" onClick={() => handleOpenDeleteConfirmation(subject)}><DeleteIcon style={{ color: '#dc3545' }} /></button>
                        </div>
                      ) : ( subject[col.key] )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={styles.paginationContainer}>
            <span style={styles.paginationText}>Rows per page:</span>
            <select style={styles.paginationSelect} value={rowsPerPage} onChange={e => {setRowsPerPage(Number(e.target.value)); setCurrentPage(1);}}>{[10, 25, 50].map(size => <option key={size} value={size}>{size}</option>)}</select>
            <span style={styles.paginationText}>{`${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, subjects.length)} of ${subjects.length}`}</span>
            <button style={{...styles.button('secondary'), opacity: currentPage === 1 ? 0.5 : 1}} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</button>
            <button style={{...styles.button('secondary'), opacity: currentPage === totalPages ? 0.5 : 1}} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
        </div>
      </main>
      {isFormModalOpen && <SubjectFormModal subject={currentSubject} onClose={handleCloseForm} onSave={handleSaveSubject} />}
      {isDeleteModalOpen && <DeleteConfirmationModal onConfirm={handleConfirmDelete} onCancel={handleCloseDeleteConfirmation} />}
    </div>
  );
}