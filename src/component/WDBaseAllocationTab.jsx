

// import React, { useState, useMemo, useEffect } from 'react';

// // --- Icon Components ---
// const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
// const AddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
// const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
// const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
// const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
// const CancelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

// // --- Helper for Validation ---
// const validateAllocation = (data) => {
//     const errors = {};
//     const { task, staffMember, allocation } = data;

//     // Task Validation
//     if (!task || !task.trim()) errors.task = "Task cannot be empty.";
//     else if (/^\d+$/.test(task.trim())) errors.task = "Invalid Task! Task cannot be numbers.";
//     else if (/[^a-zA-Z0-9\s,.]/.test(task)) errors.task = "Invalid Task! Task cannot have special characters (except ',' and '.').";

//     // Staff Member Validation
//     if (!staffMember || !staffMember.trim()) errors.staffMember = "Staff Member cannot be empty.";
//     else if (/[^a-zA-Z\s]/.test(staffMember)) errors.staffMember = "Invalid Staff Member! Staff Member name cannot have special characters.";
//     else if (/^\d+$/.test(staffMember.trim())) errors.staffMember = "Invalid Staff Member! Staff Member name cannot be numbers.";


//     // Allocation Validation
//     const allocValue = parseFloat(allocation);
//     if (String(allocation).trim() === '') errors.allocation = "Allocation to Staff Member cannot be empty.";
//     else if (isNaN(allocValue)) errors.allocation = "Invalid Allocation to Staff Member, Allocation must be a number.";
//     else if (allocValue < 0) errors.allocation = "Allocation cannot be negative.";
//     else if (allocValue > 4.5) errors.allocation = "Allocation cannot exceed 4.5%.";

//     return errors;
// };


// export default function WDBaseAllocationTab({ subject, onAllocationChange }) {
//     // --- PROP DESTRUCTURING CORRECTED ---
//     // Removed `increaseToBaseAllocation` to align with the data being passed and the Excel formula.
//     const { 
//         subjectCoordinator = "N/A", 
//         baseAllocationFromSW = 0, 
//         perGroupAllocationFromSW = 0, 
//     } = subject || {};

//     // Main data state
//     const [otherStaffAllocations, setOtherStaffAllocations] = useState([]);
    
//     // UI mode states
//     const [isAdding, setIsAdding] = useState(false);
//     const [editingRowId, setEditingRowId] = useState(null);
    
//     // Form data states
//     const [newAllocation, setNewAllocation] = useState({ task: '', staffMember: '', allocation: '' });
//     const [currentEditingRow, setCurrentEditingRow] = useState(null);
//     const [errors, setErrors] = useState({});

//     // Modal states
//     const [showInfoModal, setShowInfoModal] = useState(false);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [rowToDelete, setRowToDelete] = useState(null);

//     // --- Derived State and Calculations ---
//     const totalDelegatedWorkload = useMemo(() => {
//         // This is the SUM(F10:F15) part of the formula.
//         return otherStaffAllocations.reduce((total, item) => total + (Number(item.allocation) || 0), 0);
//     }, [otherStaffAllocations]);

//     // --- CALCULATION CORRECTED ---
//     // Implements the formula: Base Allocation + Per-group Allocation - Sum of Delegated Allocations.
//     const coordinatorAllocation = useMemo(() => {
//         const totalWorkloadPool = (baseAllocationFromSW || 0) + (
//             //perGroupAllocationFromSW || 
//             0);
//         return totalWorkloadPool - totalDelegatedWorkload;
//     }, [baseAllocationFromSW, perGroupAllocationFromSW, totalDelegatedWorkload]);


//     // This new useEffect hook is the key to connecting the tabs.
//     // It watches for changes and sends a complete list of allocations to the parent page.
//     useEffect(() => {
//         // Format the coordinator's data
//         const coordinatorData = {
//             staffMember: subjectCoordinator,
//             general_workload: coordinatorAllocation,
//             coordination_workload: coordinatorAllocation, // For project-based, the base IS the coordination
//         };

//         // Format the other staff members' data
//         const otherStaffData = otherStaffAllocations.map(item => ({
//             staffMember: item.staffMember,
//             general_workload: item.allocation,
//             coordination_workload: 0, // Other staff are not coordinators
//         }));
        
//         // Combine them and send the data up to the parent component
//         const allAllocations = [coordinatorData, ...otherStaffData];
//         if (onAllocationChange) {
//             onAllocationChange(allAllocations);
//         }

//     }, [otherStaffAllocations, coordinatorAllocation, subjectCoordinator, onAllocationChange]);
    

//     // Clear errors when switching modes
//     useEffect(() => {
//         setErrors({});
//     }, [isAdding, editingRowId]);

//     // --- Event Handlers (No changes below this line) ---
//     const handleAddClick = () => {
//         setIsAdding(true);
//         setEditingRowId(null);
//         setNewAllocation({ task: '', staffMember: '', allocation: '' });
//     };

//     const handleCancelAdd = () => {
//         setIsAdding(false);
//         setErrors({});
//     };

//     const handleSaveNew = () => {
//         const validationErrors = validateAllocation(newAllocation);
//         if (Object.keys(validationErrors).length > 0) {
//             setErrors(validationErrors);
//             return;
//         }
//         setOtherStaffAllocations([...otherStaffAllocations, { ...newAllocation, id: Date.now(), allocation: newAllocation.allocation / 100 }]);
//         setIsAdding(false);
//     };

//     const handleEditClick = (row) => {
//         setEditingRowId(row.id);
//         setIsAdding(false);
//         setCurrentEditingRow({ ...row, allocation: row.allocation * 100 }); // Edit in %
//     };

//     const handleCancelEdit = () => {
//         setEditingRowId(null);
//         setCurrentEditingRow(null);
//     };
    
//     const handleUpdate = () => {
//         const validationErrors = validateAllocation(currentEditingRow);
//         if (Object.keys(validationErrors).length > 0) {
//             setErrors(validationErrors);
//             return;
//         }
//         setOtherStaffAllocations(
//             otherStaffAllocations.map(row => 
//                 row.id === editingRowId ? { ...currentEditingRow, allocation: currentEditingRow.allocation / 100 } : row
//             )
//         );
//         setEditingRowId(null);
//     };

//     const handleDeleteClick = (row) => {
//         setShowDeleteModal(true);
//         setRowToDelete(row);
//     };

//     const confirmDelete = () => {
//         setOtherStaffAllocations(otherStaffAllocations.filter(row => row.id !== rowToDelete.id));
//         setShowDeleteModal(false);
//         setRowToDelete(null);
//     };

//     const handleInputChange = (e, formType) => {
//         const { name, value } = e.target;
//         if (formType === 'new') {
//             setNewAllocation({ ...newAllocation, [name]: value });
//         } else if (formType === 'edit') {
//             setCurrentEditingRow({ ...currentEditingRow, [name]: value });
//         }
//     };
    
//     const formatAsPercent = (value) => `${(Number(value) * 100).toFixed(1)}%`;

//     // --- Render ---
//     const renderRow = (row) => {
//         const isEditingThisRow = editingRowId === row.id;
//         const sourceData = isEditingThisRow ? currentEditingRow : row;
//         const formType = 'edit';
        
//         return (
//             <tr key={row.id} style={styles.tableRow}>
//                 <td style={styles.tableCell}>
//                     <div style={{ display: 'flex', gap: '0.75rem' }}>
//                         {isEditingThisRow ? (
//                             <>
//                                 <button style={styles.iconButton} title="Save" onClick={handleUpdate}><SaveIcon /></button>
//                                 <button style={styles.iconButton} title="Cancel" onClick={handleCancelEdit}><CancelIcon /></button>
//                             </>
//                         ) : (
//                             <>
//                                 <button style={styles.iconButton} title="Edit" onClick={() => handleEditClick(row)}><EditIcon /></button>
//                                 <button style={styles.iconButton} title="Delete" onClick={() => handleDeleteClick(row)}><DeleteIcon /></button>
//                             </>
//                         )}
//                     </div>
//                 </td>
//                 <td style={styles.tableCell}>
//                     {isEditingThisRow ? <InputField name="task" value={sourceData.task} onChange={(e) => handleInputChange(e, formType)} error={errors.task} /> : sourceData.task}
//                 </td>
//                 <td style={styles.tableCell}>
//                     {isEditingThisRow ? <InputField name="staffMember" value={sourceData.staffMember} onChange={(e) => handleInputChange(e, formType)} error={errors.staffMember} /> : sourceData.staffMember}
//                 </td>
//                 <td style={styles.tableCell}>
//                     {isEditingThisRow ? <InputField type="number" name="allocation" value={sourceData.allocation} onChange={(e) => handleInputChange(e, formType)} error={errors.allocation} suffix="%" /> : formatAsPercent(sourceData.allocation)}
//                 </td>
//                  <td style={{...styles.tableCell, color: '#6c757d'}}>
//                     {isEditingThisRow ? `${sourceData.allocation || 0}%` : formatAsPercent(sourceData.allocation)}
//                 </td>
//             </tr>
//         );
//     };

//     const renderAddNewRow = () => {
//         if (!isAdding) return null;
//         const formType = 'new';
//         return (
//             <tr style={{ ...styles.tableRow, backgroundColor: '#f8f9fa' }}>
//                 <td style={styles.tableCell}>
//                     <div style={{ display: 'flex', gap: '0.75rem' }}>
//                         <button style={styles.iconButton} title="Save" onClick={handleSaveNew}><SaveIcon /></button>
//                         <button style={styles.iconButton} title="Cancel" onClick={handleCancelAdd}><CancelIcon /></button>
//                     </div>
//                 </td>
//                 <td style={styles.tableCell}><InputField name="task" value={newAllocation.task} onChange={(e) => handleInputChange(e, formType)} error={errors.task} /></td>
//                 <td style={styles.tableCell}><InputField name="staffMember" value={newAllocation.staffMember} onChange={(e) => handleInputChange(e, formType)} error={errors.staffMember} /></td>
//                 <td style={styles.tableCell}><InputField type="number" name="allocation" value={newAllocation.allocation} onChange={(e) => handleInputChange(e, formType)} error={errors.allocation} suffix="%" /></td>
//                 <td style={{...styles.tableCell, color: '#6c757d'}}>{newAllocation.allocation || 0}%</td>
//             </tr>
//         );
//     };
    
//     return (
//         <div style={styles.tabContentContainer}>
//             {/* --- Modals --- */}
//             {showInfoModal && <InfoModal onClose={() => setShowInfoModal(false)} />}
//             {showDeleteModal && <DeleteModal onConfirm={confirmDelete} onCancel={() => setShowDeleteModal(false)} staffName={rowToDelete?.staffMember} />}

//             {/* --- Header --- */}
//             <div style={styles.tabHeader}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                     <h3 style={styles.tabTitle}>Base Allocation</h3>
//                     <button style={{...styles.iconButton, color: '#6c757d'}} onClick={() => setShowInfoModal(true)}><InfoIcon /></button>
//                 </div>
//                 <button style={styles.addButton} onClick={handleAddClick} disabled={isAdding || editingRowId !== null}><AddIcon /> Add</button>
//             </div>

//             {/* --- Table --- */}
//             <table style={styles.table}>
//                 <thead>
//                     <tr style={styles.tableHeaderRow}>
//                         <th style={{ ...styles.tableHeaderCell, width: '10%' }}>Actions</th>
//                         <th style={styles.tableHeaderCell}>Task</th>
//                         <th style={{ ...styles.tableHeaderCell, width: '20%' }}>Staff Member</th>
//                         <th style={{ ...styles.tableHeaderCell, width: '25%' }}>Allocation to Staff Member</th>
//                         <th style={{ ...styles.tableHeaderCell, width: '15%' }}>Allocation</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {otherStaffAllocations.map(renderRow)}
//                     {renderAddNewRow()}
//                     <tr style={styles.tableRow}>
//                         <td colSpan="4" style={{...styles.tableCell, fontWeight: '500'}}>Allocation to Subject Coordinator: {subjectCoordinator}</td>
//                         <td style={{...styles.tableCell, fontWeight: 'bold', color: coordinatorAllocation < 0 ? '#dc3545' : '#212529'}}>{formatAsPercent(coordinatorAllocation)}</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//              {coordinatorAllocation < 0 && <div style={styles.errorText}>Warning: Total allocation exceeds available workload. Coordinator allocation is negative.</div>}

//             <footer style={styles.tabFooter}>
//                 <button style={styles.button('primary')}>Save</button>
//             </footer>
//         </div>
//     );
// }

// // --- Sub-Components ---
// const InputField = ({ type = 'text', name, value, onChange, error, suffix }) => (
//     <div>
//         <div style={{...styles.inputWrapper, borderColor: error ? '#dc3545' : '#ced4da'}}>
//              <input type={type} name={name} value={value} onChange={onChange} style={styles.inputField} />
//              {suffix && <span style={styles.inputSuffix}>{suffix}</span>}
//         </div>
//         {error && <div style={styles.errorText}>{error}</div>}
//     </div>
// );

// const InfoModal = ({ onClose }) => (
//     <div style={styles.modalOverlay}>
//         <div style={styles.modalContent}>
//             <h4 style={styles.modalTitle}>Base Allocation Information</h4>
//             <p>Base allocation is used to distribute subject-related tasks among various staff members.</p>
//             <p>This includes responsibilities like preparing assessment materials, managing the online learning site, and other administrative or teaching support tasks essential for the subject's delivery.</p>
//             <button onClick={onClose} style={styles.button('secondary')}>Close</button>
//         </div>
//     </div>
// );

// const DeleteModal = ({ onConfirm, onCancel, staffName }) => (
//     <div style={styles.modalOverlay}>
//         <div style={styles.modalContent}>
//             <h4 style={styles.modalTitle}>Confirm Deletion</h4>
//             <p>Are you sure you want to delete the allocation for <strong>{staffName}</strong>? This action cannot be undone.</p>
//             <div style={styles.modalActions}>
//                 <button onClick={onCancel} style={styles.button('secondary')}>Cancel</button>
//                 <button onClick={onConfirm} style={{...styles.button('primary'), backgroundColor: '#dc3545'}}>Delete</button>
//             </div>
//         </div>
//     </div>
// );

// // --- Styles ---
// const styles = {
//     tabContentContainer: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', marginTop: '-1px' },
//     tabHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
//     tabTitle: { margin: 0, color: '#343a40', fontSize: '1.25rem' },
//     addButton: { padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500', backgroundColor: '#0d0d0d', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' },
//     table: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' },
//     tableHeaderRow: { borderBottom: '2px solid #343a40' },
//     tableHeaderCell: { padding: '0.75rem', textAlign: 'left', color: '#495057', fontWeight: '600', fontSize: '0.9rem' },
//     tableRow: { borderBottom: '1px solid #dee2e6' },
//     tableCell: { padding: '0.75rem', color: '#343a40', verticalAlign: 'top' },
//     iconButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#495057' },
//     inputWrapper: { display: 'flex', alignItems: 'center', border: '1px solid', borderRadius: '4px' },
//     inputField: { width: '100%', padding: '0.5rem', border: 'none', borderRadius: '4px', fontSize: '0.9rem', backgroundColor: 'transparent', outline: 'none' },
//     inputSuffix: { paddingRight: '0.5rem', color: '#6c757d'},
//     errorText: { color: '#dc3545', marginTop: '0.25rem', fontSize: '0.8rem' },
//     tabFooter: { display: 'flex', justifyContent: 'flex-start', marginTop: '2rem', borderTop: '1px solid #e9ecef', paddingTop: '1.5rem' },
//     button: (variant = 'primary') => ({ padding: '0.6rem 1.2rem', fontSize: '1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500', transition: 'background-color 0.2s', backgroundColor: variant === 'primary' ? '#0d0d0d' : '#6c757d', color: 'white' }),
//     modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
//     modalContent: { backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '500px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' },
//     modalTitle: { marginTop: 0, color: '#343a40' },
//     modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' },
// };

import React, { useState, useMemo, useEffect } from 'react';

// --- Icon Components ---
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
const AddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const CancelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

// --- Helper for Validation ---
const validateAllocation = (data) => {
    const errors = {};
    const { task, staffMember, allocation } = data;
    if (!task || !task.trim()) errors.task = "Task cannot be empty.";
    if (!staffMember || !staffMember.trim()) errors.staffMember = "Staff Member cannot be empty.";
    const allocValue = parseFloat(allocation);
    if (String(allocation).trim() === '') errors.allocation = "Allocation cannot be empty.";
    else if (isNaN(allocValue)) errors.allocation = "Allocation must be a number.";
    else if (allocValue < 0) errors.allocation = "Allocation cannot be negative.";
    return errors;
};

// --- Main Component ---
export default function WDBaseAllocationTab({ subject, onAllocationChange }) {
    const {
        subjectCoordinator = "N/A",
        baseAllocationFromSW = 0,
    } = subject || {};

    const [otherStaffAllocations, setOtherStaffAllocations] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingRowId, setEditingRowId] = useState(null);
    const [newAllocation, setNewAllocation] = useState({ task: '', staffMember: '', allocation: '' });
    const [currentEditingRow, setCurrentEditingRow] = useState(null);
    const [errors, setErrors] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);

    const totalDelegatedWorkload = useMemo(() => {
        return otherStaffAllocations.reduce((total, item) => total + (Number(item.allocation) || 0), 0);
    }, [otherStaffAllocations]);

    const coordinatorAllocation = useMemo(() => {
        const totalWorkloadPool = baseAllocationFromSW || 0;
        const finalAllocation = totalWorkloadPool - totalDelegatedWorkload;
        return finalAllocation > 0 ? finalAllocation : 0;
    }, [baseAllocationFromSW, totalDelegatedWorkload]);

    useEffect(() => {
        const coordinatorData = {
            staffMember: subjectCoordinator,
            general_workload: coordinatorAllocation,
            coordination_workload: coordinatorAllocation, 
        };
        const otherStaffData = otherStaffAllocations.map(item => ({
            staffMember: item.staffMember,
            general_workload: item.allocation,
            coordination_workload: 0,
        }));
        
        const allAllocations = [coordinatorData, ...otherStaffData];
        if (onAllocationChange) {
            onAllocationChange(allAllocations);
        }
    }, [otherStaffAllocations, coordinatorAllocation, subjectCoordinator, onAllocationChange]);

    useEffect(() => { setErrors({}); }, [isAdding, editingRowId]);

    const handleAddClick = () => { setIsAdding(true); setEditingRowId(null); setNewAllocation({ task: '', staffMember: '', allocation: '' }); };
    const handleCancelAdd = () => { setIsAdding(false); setErrors({}); };
    const handleSaveNew = () => {
        const validationErrors = validateAllocation(newAllocation);
        if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
        setOtherStaffAllocations([...otherStaffAllocations, { ...newAllocation, id: Date.now(), allocation: newAllocation.allocation / 100 }]);
        setIsAdding(false);
    };
    const handleEditClick = (row) => { setEditingRowId(row.id); setIsAdding(false); setCurrentEditingRow({ ...row, allocation: row.allocation * 100 }); };
    const handleCancelEdit = () => { setEditingRowId(null); setCurrentEditingRow(null); };
    const handleUpdate = () => {
        const validationErrors = validateAllocation(currentEditingRow);
        if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
        setOtherStaffAllocations(otherStaffAllocations.map(row => row.id === editingRowId ? { ...currentEditingRow, allocation: currentEditingRow.allocation / 100 } : row));
        setEditingRowId(null);
    };
    const handleDeleteClick = (row) => { setShowDeleteModal(true); setRowToDelete(row); };
    const confirmDelete = () => { setOtherStaffAllocations(otherStaffAllocations.filter(row => row.id !== rowToDelete.id)); setShowDeleteModal(false); setRowToDelete(null); };
    const handleInputChange = (e, formType) => {
        const { name, value } = e.target;
        if (formType === 'new') { setNewAllocation({ ...newAllocation, [name]: value }); }
        else if (formType === 'edit') { setCurrentEditingRow({ ...currentEditingRow, [name]: value }); }
    };
    const formatAsPercent = (value) => `${(Number(value) * 100).toFixed(1)}%`;
    
    // (Render function and sub-components are unchanged)
    const renderRow = (row) => {
        const isEditingThisRow = editingRowId === row.id;
        const sourceData = isEditingThisRow ? currentEditingRow : row;
        const formType = 'edit';
        
        return (
            <tr key={row.id} style={styles.tableRow}>
                <td style={styles.tableCell}><div style={{ display: 'flex', gap: '0.75rem' }}>{isEditingThisRow ? (<><button style={styles.iconButton} title="Save" onClick={handleUpdate}><SaveIcon /></button><button style={styles.iconButton} title="Cancel" onClick={handleCancelEdit}><CancelIcon /></button></>) : (<><button style={styles.iconButton} title="Edit" onClick={() => handleEditClick(row)}><EditIcon /></button><button style={styles.iconButton} title="Delete" onClick={() => handleDeleteClick(row)}><DeleteIcon /></button></>)}</div></td>
                <td style={styles.tableCell}>{isEditingThisRow ? <InputField name="task" value={sourceData.task} onChange={(e) => handleInputChange(e, formType)} error={errors.task} /> : sourceData.task}</td>
                <td style={styles.tableCell}>{isEditingThisRow ? <InputField name="staffMember" value={sourceData.staffMember} onChange={(e) => handleInputChange(e, formType)} error={errors.staffMember} /> : sourceData.staffMember}</td>
                <td style={{...styles.tableCell, textAlign: 'right'}}>{isEditingThisRow ? <InputField type="number" name="allocation" value={sourceData.allocation} onChange={(e) => handleInputChange(e, formType)} error={errors.allocation} suffix="%" /> : formatAsPercent(sourceData.allocation)}</td>
            </tr>
        );
    };
    const renderAddNewRow = () => {
        if (!isAdding) return null;
        const formType = 'new';
        return (<tr style={{ ...styles.tableRow, backgroundColor: '#f8f9fa' }}><td style={styles.tableCell}><div style={{ display: 'flex', gap: '0.75rem' }}><button style={styles.iconButton} title="Save" onClick={handleSaveNew}><SaveIcon /></button><button style={styles.iconButton} title="Cancel" onClick={handleCancelAdd}><CancelIcon /></button></div></td><td style={styles.tableCell}><InputField name="task" value={newAllocation.task} onChange={(e) => handleInputChange(e, formType)} error={errors.task} /></td><td style={styles.tableCell}><InputField name="staffMember" value={newAllocation.staffMember} onChange={(e) => handleInputChange(e, formType)} error={errors.staffMember} /></td><td style={{...styles.tableCell, textAlign: 'right'}}><InputField type="number" name="allocation" value={newAllocation.allocation} onChange={(e) => handleInputChange(e, formType)} error={errors.allocation} suffix="%" /></td></tr>);
    };
    return (<div style={styles.tabContentContainer}>{showDeleteModal && <DeleteModal onConfirm={confirmDelete} onCancel={() => setShowDeleteModal(false)} staffName={rowToDelete?.staffMember} />}<div style={styles.tabHeader}><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><h3 style={styles.tabTitle}>Base Allocation</h3><button style={{...styles.iconButton, color: '#6c757d'}}><InfoIcon /></button></div><button style={styles.addButton} onClick={handleAddClick} disabled={isAdding || editingRowId !== null}><AddIcon /> Add</button></div><table style={styles.table}><thead><tr style={styles.tableHeaderRow}><th style={{ ...styles.tableHeaderCell, width: '10%' }}>Actions</th><th style={styles.tableHeaderCell}>Task</th><th style={{ ...styles.tableHeaderCell, width: '20%' }}>Staff Member</th><th style={{ ...styles.tableHeaderCell, width: '25%', textAlign: 'right' }}>Allocation to Staff Member</th></tr></thead><tbody>{otherStaffAllocations.map(renderRow)}{renderAddNewRow()}<tr style={styles.tableRow}><td colSpan="3" style={{...styles.tableCell, fontWeight: '500'}}>Allocation to Subject Coordinator: {subjectCoordinator}</td><td style={{...styles.tableCell, fontWeight: 'bold', textAlign: 'right', color: coordinatorAllocation < 0 ? '#dc3545' : '#212529'}}>{formatAsPercent(coordinatorAllocation)}</td></tr></tbody></table>{coordinatorAllocation < 0 && <div style={styles.errorText}>Warning: Total allocation exceeds available workload. Coordinator allocation is negative.</div>}</div>);
}
const InputField = ({ type = 'text', name, value, onChange, error, suffix }) => (<div><div style={{...styles.inputWrapper, borderColor: error ? '#dc3545' : '#ced4da'}}><input type={type} name={name} value={value} onChange={onChange} style={styles.inputField} />{suffix && <span style={styles.inputSuffix}>{suffix}</span>}</div>{error && <div style={styles.errorText}>{error}</div>}</div>);
const DeleteModal = ({ onConfirm, onCancel, staffName }) => (<div style={styles.modalOverlay}><div style={styles.modalContent}><h4 style={styles.modalTitle}>Confirm Deletion</h4><p>Are you sure you want to delete the allocation for <strong>{staffName}</strong>? This action cannot be undone.</p><div style={styles.modalActions}><button onClick={onCancel} style={styles.button('secondary')}>Cancel</button><button onClick={onConfirm} style={{...styles.button('primary'), backgroundColor: '#dc3545'}}>Delete</button></div></div></div>);
const styles = {
    tabContentContainer: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', marginTop: '-1px' },
    tabHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    tabTitle: { margin: 0, color: '#343a40', fontSize: '1.25rem' },
    addButton: { padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500', backgroundColor: '#0d0d0d', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' },
    tableHeaderRow: { borderBottom: '2px solid #343a40' },
    tableHeaderCell: { padding: '0.75rem', textAlign: 'left', color: '#495057', fontWeight: '600', fontSize: '0.9rem' },
    tableRow: { borderBottom: '1px solid #dee2e6' },
    tableCell: { padding: '0.75rem', color: '#343a40', verticalAlign: 'top' },
    iconButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#495057' },
    inputWrapper: { display: 'flex', alignItems: 'center', border: '1px solid', borderRadius: '4px' },
    inputField: { width: '100%', padding: '0.5rem', border: 'none', borderRadius: '4px', fontSize: '0.9rem', backgroundColor: 'transparent', outline: 'none' },
    inputSuffix: { paddingRight: '0.5rem', color: '#6c757d'},
    errorText: { color: '#dc3545', marginTop: '0.25rem', fontSize: '0.8rem' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '500px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' },
    modalTitle: { marginTop: 0, color: '#343a40' },
    modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' },
};