
// import React, { useState, useMemo, useEffect } from 'react';

// // --- SVG Icon Components (no changes) ---
// const InfoIcon = () => <svg style={{ color: '#6b7280' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
// const AddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
// const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
// const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
// const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
// const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#28a745' }}><polyline points="20 6 9 17 4 12"></polyline></svg>;
// const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#dc3545' }}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

// const Tooltip = ({ children, text }) => {
//     const [visible, setVisible] = useState(false);
//     return (
//         <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }} onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
//             {children}
//             {visible && (<div style={{ position: 'absolute', bottom: '125%', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#343a40', color: '#fff', padding: '10px 15px', borderRadius: '6px', zIndex: 100, width: '320px', fontSize: '0.9rem', lineHeight: '1.5', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', textAlign: 'left', }}>{text}</div>)}
//         </div>
//     );
// };


// export default function WDPerStudentPerActivityAllocationTab({ subject, sourceData = { perStudentAllocations: [], activityAllocations: [], definedRoles: [] } }) {
//     // --- Styles ---
//     const styles = {
//         panel: { position: 'relative', backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)", padding: "32px", marginBottom: "32px" },
//         h2: { fontSize: "20px", fontWeight: "600", color: "#111827", margin: 0 },
//         headerContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
//         titleContainer: { display: 'flex', alignItems: 'center', gap: '12px' },
//         addButton: { backgroundColor: "#111827", color: "white", padding: "8px 16px", borderRadius: "9999px", fontWeight: "600", border: "none", cursor: "pointer", display: 'flex', alignItems: 'center', gap: '8px' },
//         tabContainer: { display: 'inline-flex', border: "1px solid #d1d5db", borderRadius: "9999px", marginBottom: "24px", overflow: 'hidden' },
//         tab: { base: { padding: "10px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer", backgroundColor: "transparent", border: "none", borderRight: "1px solid #d1d5db" }, active: { backgroundColor: "#111827", color: "white" }, inactive: { color: "#374151" } },
//         table: { base: { width: "100%", borderCollapse: "collapse" }, thead: { backgroundColor: "#f9fafb" }, th: { padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }, tr: { borderBottom: "1px solid #e5e7eb" }, td: { padding: "16px", fontSize: "14px", verticalAlign: 'top' } },
//         inputField: { width: "95%", padding: "6px 8px", border: "1px solid #d1d5db", borderRadius: "6px", boxSizing: 'border-box' },
//         errorInputField: { borderColor: '#dc3545', borderWidth: '1px' },
//         actionIcons: { display: 'flex', alignItems: 'center', gap: '8px' },
//         iconButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' },
//         summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', marginTop: '24px', borderTop: '1px solid #e5e7eb' },
//         summaryLabel: { fontSize: '14px', color: '#374151' },
//         summaryValue: { fontSize: '16px', fontWeight: 'bold', color: '#111827' },
//         footer: { display: 'flex', justifyContent: 'flex-start', marginTop: '32px' },
//         saveButton: { backgroundColor: "#111827", color: "white", padding: "10px 24px", borderRadius: "6px", fontWeight: "600", border: "none", cursor: "pointer", display: 'flex', alignItems: 'center' },
//         disabledButton: { backgroundColor: '#6c757d', cursor: 'not-allowed', opacity: 0.7 },
//         errorBox: { color: '#721c24', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.9rem' },
//         inputWrapper: { position: 'relative' },
//         inlineErrorText: { color: '#dc3545', fontSize: '0.8rem', position: 'absolute', top: '100%', left: 0, marginTop: '2px' },
//         toast: { position: 'fixed', top: '20px', right: '20px', backgroundColor: '#28a745', color: 'white', padding: '12px 24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1000, fontSize: '15px', fontWeight: '600' },
//     };
    
//     const ROLE_FACTORS = {
//         'Assistant subject coordinator': { perStudentFactor: 0.00375, activity1Factor: 0.00025, activity2Factor: 0.00005, activity3Factor: 0.00005 },
//         'Tutor': { perStudentFactor: 0.001, activity1Factor: 0.001, activity2Factor: 0.002, activity3Factor: 0.002 },
//         'Exam marker': { perStudentFactor: 0.0015, activity1Factor: 0, activity2Factor: 0, activity3Factor: 0 },
//         'default': { perStudentFactor: 0, activity1Factor: 0, activity2Factor: 0, activity3Factor: 0 }
//     };

//     // ✅ UPDATED: Calculation now safely parses strings to numbers, defaulting to 0.
//     function calculateStaffAllocation(staff, role) {
//         if (!staff || !role) return 0;
//         const factors = ROLE_FACTORS[role.name] || ROLE_FACTORS.default;
        
//         const students = parseInt(staff.students, 10) || 0;
//         const groups = staff.groups || {};

//         const perStudentPart = (students / 25) * factors.perStudentFactor;
//         const activity1Part = (parseInt(groups['activity-1'], 10) || 0) * factors.activity1Factor;
//         const activity2Part = (parseInt(groups['activity-2'], 10) || 0) * factors.activity2Factor;
//         const activity3Part = (parseInt(groups['activity-3'], 10) || 0) * factors.activity3Factor;
        
//         return perStudentPart + activity1Part + activity2Part + activity3Part;
//     }

//     // --- State Management ---
//     const [staffAllocationData, setStaffAllocationData] = useState({});
//     const [activeTab, setActiveTab] = useState(null);
//     const [editingId, setEditingId] = useState(null);
//     const [backupRow, setBackupRow] = useState(null);
//     const [errors, setErrors] = useState({ totals: {}, rows: {} });
//     const [toast, setToast] = useState(null);

//     const rolesData = useMemo(() => {
//         if (!sourceData.definedRoles) return [];
//         return sourceData.definedRoles.map((role) => ({
//             id: role.id, name: role.name,
//             activities: [{ id: `activity-1`, name: "Activity 1" }, { id: `activity-2`, name: "Activity 2" }, { id: `activity-3`, name: "Activity 3" }],
//             staffAllocations: staffAllocationData[role.id] || []
//         }));
//     }, [sourceData.definedRoles, staffAllocationData]);

//     const activeRole = useMemo(() => rolesData.find(role => role.id === activeTab), [rolesData, activeTab]);
    
//     useEffect(() => { if (rolesData.length > 0 && !activeTab) { setActiveTab(rolesData[0].id); } }, [rolesData, activeTab]);

//     // ✅ UPDATED: Validation logic for empty and non-numeric inputs
//     useEffect(() => {
//         const newErrors = { totals: {}, rows: {} };
//         const nameRegex = /^[a-zA-Z\s]+$/;
//         const numberRegex = /^\d+$/; // Checks for one or more digits

//         // --- Inline Validation (Per Row) ---
//         Object.values(staffAllocationData).flat().forEach(staff => {
//             const rowErrors = {};
            
//             // Name validation
//             const trimmedName = staff.name.trim();
//             if (!trimmedName) {
//                 rowErrors.name = 'Cannot be empty.';
//             } else if (!nameRegex.test(trimmedName)) {
//                 rowErrors.name = 'Invalid characters in name.';
//             }

//             // Students validation
//             const studentValue = String(staff.students).trim();
//             if (studentValue === '') {
//                 rowErrors.students = 'Cannot be empty.';
//             } else if (!numberRegex.test(studentValue)) {
//                 rowErrors.students = 'Must be a number.';
//             }

//             // Groups validation
//             rowErrors.groups = {};
//             activeRole?.activities.forEach(activity => {
//                 const groupValue = String(staff.groups[activity.id] || '').trim();
//                  if (groupValue === '') {
//                     rowErrors.groups[activity.id] = 'Cannot be empty.';
//                 } else if (!numberRegex.test(groupValue)) {
//                     rowErrors.groups[activity.id] = 'Must be a number.';
//                 }
//             });
//             if (Object.keys(rowErrors.groups).length === 0) delete rowErrors.groups;
            
//             if (Object.keys(rowErrors).length > 0) {
//                 newErrors.rows[staff.id] = rowErrors;
//             }
//         });
//         setErrors(newErrors);
//     }, [staffAllocationData, activeRole]);
    
//     useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(null), 3000); return () => clearTimeout(timer); } }, [toast]);
    
//     const isSaveDisabled = Object.keys(errors.totals).length > 0 || Object.keys(errors.rows).length > 0;
    
//     // --- Event Handlers ---
//     const handleEdit = (staff) => { setBackupRow(staff); setEditingId(staff.id); };
//     const handleSaveRow = () => { setEditingId(null); setBackupRow(null); setToast('Row updated successfully!'); };
//     const handleCancel = () => { if (!backupRow) { setEditingId(null); return; } if (backupRow.name === '') { setStaffAllocationData(currentData => ({ ...currentData, [activeTab]: (currentData[activeTab] || []).filter(staff => staff.id !== editingId) })); } else { setStaffAllocationData(currentData => ({ ...currentData, [activeTab]: (currentData[activeTab] || []).map(staff => staff.id === editingId ? backupRow : staff) })); } setEditingId(null); setBackupRow(null); };

//     // ✅ UPDATED: Stores raw string value from input, does not parse to number here
//     const handleInputChange = (staffId, field, value, activityId = null) => {
//         setStaffAllocationData(currentData => ({
//             ...currentData,
//             [activeTab]: currentData[activeTab].map(staff => {
//                 if (staff.id === staffId) {
//                     if (field === 'groups' && activityId) {
//                         return { ...staff, groups: { ...staff.groups, [activityId]: value } };
//                     }
//                     return { ...staff, [field]: value };
//                 }
//                 return staff;
//             })
//         }));
//     };

//     // ✅ UPDATED: New rows now start with empty strings for number fields
//     const handleAddRow = () => {
//         if (!activeRole) return;
//         const newStaff = { id: `staff-${Date.now()}`, name: '', students: '', groups: activeRole.activities.reduce((acc, activity) => ({ ...acc, [activity.id]: '' }), {}) };
//         setStaffAllocationData(currentData => ({ ...currentData, [activeTab]: [...(currentData[activeTab] || []), newStaff] }));
//         handleEdit(newStaff);
//     };

//     const handleDeleteRow = (staffId) => { if (window.confirm("Are you sure you want to delete this row?")) { setStaffAllocationData(currentData => ({ ...currentData, [activeTab]: currentData[activeTab].filter(s => s.id !== staffId) })); setToast('Row deleted successfully!'); } };
//     const handleSaveChanges = () => { if (isSaveDisabled) return; console.log("Saving all data:", staffAllocationData); setToast('All changes saved successfully!'); };
    
//     return (
//         <div style={styles.panel}>
//             {toast && <div style={styles.toast}>{toast}</div>}
//             {Object.values(errors.totals).map(errorMsg => (<div key={errorMsg} style={styles.errorBox}>{errorMsg}</div>))}
//             <div style={styles.headerContainer}>
//                 <div style={styles.titleContainer}>
//                     <h2 style={styles.h2}>Per-student / Per-activity Allocation</h2>
//                     <Tooltip text="List all staff acting in this role..."><InfoIcon /></Tooltip>
//                 </div>
//                 <button style={styles.addButton} onClick={handleAddRow}><AddIcon /> Add</button>
//             </div>
//             <div style={styles.tabContainer}>
//                 {rolesData.map((role, index) => (<button key={role.id} onClick={() => setActiveTab(role.id)} style={{ ...styles.tab.base, ...(activeTab === role.id ? styles.tab.active : styles.tab.inactive), ...(index === rolesData.length - 1 && { borderRight: 'none' }) }}>{role.name}</button>))}
//             </div>
//             <table style={styles.table.base}>
//                 <thead>
//                     <tr>
//                         <th style={styles.table.th}>Actions</th>
//                         <th style={styles.table.th}>Staff Member Acting in Role</th>
//                         <th style={styles.table.th}>Number of Students</th>
//                         {activeRole?.activities.map((activity, index) => <th key={activity.id} style={styles.table.th}>{`Groups for Activity ${index + 1}`}</th>)}
//                         <th style={{...styles.table.th, textAlign: 'right'}}>Allocation</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {activeRole?.staffAllocations.map(staff => {
//                         const isEditing = editingId === staff.id;
//                         const rowErrors = errors.rows[staff.id] || {};
//                         return (
//                             <tr key={staff.id}>
//                                 <td style={styles.table.td}><div style={styles.actionIcons}>{isEditing ? (<><button style={styles.iconButton} onClick={handleSaveRow} title="Save"><CheckIcon /></button><button style={styles.iconButton} onClick={handleCancel} title="Cancel"><XIcon /></button></>) : (<><button style={styles.iconButton} onClick={() => handleEdit(staff)} title="Edit"><EditIcon /></button><button style={styles.iconButton} onClick={() => handleDeleteRow(staff.id)} title="Delete"><DeleteIcon /></button></>)}</div></td>
//                                 <td style={styles.table.td}>
//                                     <div style={styles.inputWrapper}> 
//                                         {isEditing ? (<><input type="text" style={{...styles.inputField, ...(rowErrors.name && styles.errorInputField)}} value={staff.name} onChange={(e) => handleInputChange(staff.id, 'name', e.target.value)} />{rowErrors.name && <div style={styles.inlineErrorText}>{rowErrors.name}</div>}</>) : ( staff.name )}
//                                     </div>
//                                 </td>
//                                 <td style={styles.table.td}>
//                                     <div style={styles.inputWrapper}>
//                                         {isEditing ? (<><input type="number" min="0" style={{...styles.inputField, ...(rowErrors.students && styles.errorInputField)}} value={staff.students} onChange={(e) => handleInputChange(staff.id, 'students', e.target.value)} />{rowErrors.students && <div style={styles.inlineErrorText}>{rowErrors.students}</div>}</>) : staff.students}
//                                     </div>
//                                 </td>
//                                 {activeRole.activities.map(activity => {
//                                     const groupError = rowErrors.groups?.[activity.id];
//                                     return (
//                                         <td key={activity.id} style={styles.table.td}>
//                                             <div style={styles.inputWrapper}>
//                                                 {isEditing ? (<><input type="number" min="0" style={{...styles.inputField, ...(groupError && styles.errorInputField)}} value={staff.groups[activity.id] || ''} onChange={(e) => handleInputChange(staff.id, 'groups', e.target.value, activity.id)} />{groupError && <div style={styles.inlineErrorText}>{groupError}</div>}</>) : (staff.groups[activity.id] || '')}
//                                             </div>
//                                         </td>
//                                     );
//                                 })}
//                                 <td style={{ ...styles.table.td, textAlign: 'right', fontWeight: 'bold' }}>
//                                     {(calculateStaffAllocation(staff, activeRole) * 100).toFixed(1)}%
//                                 </td>
//                             </tr>
//                         );
//                     })}
//                 </tbody>
//             </table>
//             <div style={styles.summaryRow}>
//                 <span style={styles.summaryLabel}>Allocation to Subject Coordinator: {subject?.subjectCoordinator || "Tom"}</span>
//                 <span style={styles.summaryValue}>1.5%</span>
//             </div>
//             <div style={styles.footer}>
//                 <button style={{...styles.saveButton, ...(isSaveDisabled && styles.disabledButton)}} disabled={isSaveDisabled} onClick={handleSaveChanges}>
//                     <SaveIcon />Save
//                 </button>
//             </div>
//         </div>
//     );
// }

import React, { useState, useMemo, useEffect } from 'react';

// --- SVG Icon Components (no changes) ---
const InfoIcon = () => <svg style={{ color: '#6b7280' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
const AddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#28a745' }}><polyline points="20 6 9 17 4 12"></polyline></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#dc3545' }}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

const Tooltip = ({ children, text }) => {
    const [visible, setVisible] = useState(false);
    return (
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }} onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
            {children}
            {visible && (<div style={{ position: 'absolute', bottom: '125%', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#343a40', color: '#fff', padding: '10px 15px', borderRadius: '6px', zIndex: 100, width: '320px', fontSize: '0.9rem', lineHeight: '1.5', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', textAlign: 'left', }}>{text}</div>)}
        </div>
    );
};

export default function WDPerStudentPerActivityAllocationTab({ subject, sourceData = { perStudentAllocations: [], activityAllocations: [], definedRoles: [] } }) {
    // --- Styles ---
    const styles = {
        panel: { position: 'relative', backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)", padding: "32px", marginBottom: "32px" },
        h2: { fontSize: "20px", fontWeight: "600", color: "#111827", margin: 0 },
        headerContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
        titleContainer: { display: 'flex', alignItems: 'center', gap: '12px' },
        addButton: { backgroundColor: "#111827", color: "white", padding: "8px 16px", borderRadius: "9999px", fontWeight: "600", border: "none", cursor: "pointer", display: 'flex', alignItems: 'center', gap: '8px' },
        tabContainer: { display: 'inline-flex', border: "1px solid #d1d5db", borderRadius: "9999px", marginBottom: "24px", overflow: 'hidden' },
        tab: { base: { padding: "10px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer", backgroundColor: "transparent", border: "none", borderRight: "1px solid #d1d5db" }, active: { backgroundColor: "#111827", color: "white" }, inactive: { color: "#374151" } },
        table: { base: { width: "100%", borderCollapse: "collapse" }, thead: { backgroundColor: "#f9fafb" }, th: { padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }, tr: { borderBottom: "1px solid #e5e7eb" }, td: { padding: "16px", fontSize: "14px", verticalAlign: 'top' } },
        inputField: { width: "95%", padding: "6px 8px", border: "1px solid #d1d5db", borderRadius: "6px", boxSizing: 'border-box' },
        errorInputField: { borderColor: '#dc3545', borderWidth: '1px' },
        actionIcons: { display: 'flex', alignItems: 'center', gap: '8px' },
        iconButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' },
        summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', marginTop: '24px', borderTop: '1px solid #e5e7eb' },
        summaryLabel: { fontSize: '14px', color: '#374151' },
        summaryValue: { fontSize: '16px', fontWeight: 'bold', color: '#111827' },
        footer: { display: 'flex', justifyContent: 'flex-start', marginTop: '32px' },
        saveButton: { backgroundColor: "#111827", color: "white", padding: "10px 24px", borderRadius: "6px", fontWeight: "600", border: "none", cursor: "pointer", display: 'flex', alignItems: 'center' },
        disabledButton: { backgroundColor: '#6c757d', cursor: 'not-allowed', opacity: 0.7 },
        disabledIconButton: { cursor: 'not-allowed', opacity: 0.5 },
        errorBox: { color: '#721c24', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.9rem' },
        inputWrapper: { position: 'relative' },
        inlineErrorText: { color: '#dc3545', fontSize: '0.8rem', position: 'absolute', top: '100%', left: 0, marginTop: '2px' },
        toast: { position: 'fixed', top: '20px', right: '20px', backgroundColor: '#28a745', color: 'white', padding: '12px 24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1000, fontSize: '15px', fontWeight: '600' },
    };
    
    const ROLE_FACTORS = {
        'Assistant subject coordinator': { perStudentFactor: 0.00375, activity1Factor: 0.00025, activity2Factor: 0.00005, activity3Factor: 0.00005 },
        'Tutor': { perStudentFactor: 0.001, activity1Factor: 0.001, activity2Factor: 0.002, activity3Factor: 0.002 },
        'Exam marker': { perStudentFactor: 0.0015, activity1Factor: 0, activity2Factor: 0, activity3Factor: 0 },
        'default': { perStudentFactor: 0, activity1Factor: 0, activity2Factor: 0, activity3Factor: 0 }
    };

    function calculateStaffAllocation(staff, role) {
        if (!staff || !role) return 0;
        const factors = ROLE_FACTORS[role.name] || ROLE_FACTORS.default;
        const students = parseInt(staff.students, 10) || 0;
        const groups = staff.groups || {};
        const perStudentPart = (students / 25) * factors.perStudentFactor;
        const activity1Part = (parseInt(groups['activity-1'], 10) || 0) * factors.activity1Factor;
        const activity2Part = (parseInt(groups['activity-2'], 10) || 0) * factors.activity2Factor;
        const activity3Part = (parseInt(groups['activity-3'], 10) || 0) * factors.activity3Factor;
        return perStudentPart + activity1Part + activity2Part + activity3Part;
    }

    // --- State Management ---
    const [staffAllocationData, setStaffAllocationData] = useState({});
    const [activeTab, setActiveTab] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [backupRow, setBackupRow] = useState(null);
    const [errors, setErrors] = useState({ totals: {}, rows: {} });
    const [toast, setToast] = useState(null);

    const rolesData = useMemo(() => {
        if (!sourceData.definedRoles) return [];
        return sourceData.definedRoles.map((role) => ({
            id: role.id, name: role.name,
            activities: [{ id: `activity-1`, name: "Activity 1" }, { id: `activity-2`, name: "Activity 2" }, { id: `activity-3`, name: "Activity 3" }],
            staffAllocations: staffAllocationData[role.id] || []
        }));
    }, [sourceData.definedRoles, staffAllocationData]);

    const activeRole = useMemo(() => rolesData.find(role => role.id === activeTab), [rolesData, activeTab]);
    
    useEffect(() => { if (rolesData.length > 0 && !activeTab) { setActiveTab(rolesData[0].id); } }, [rolesData, activeTab]);

    useEffect(() => {
        const newErrors = { totals: {}, rows: {} };
        const nameRegex = /^[a-zA-Z\s]+$/;
        const numberRegex = /^\d+$/;

        Object.values(staffAllocationData).flat().forEach(staff => {
            const rowErrors = {};
            const trimmedName = staff.name.trim();
            if (!trimmedName) {
                rowErrors.name = 'Cannot be empty.';
            } else if (!nameRegex.test(trimmedName)) {
                rowErrors.name = 'Name can only contain letters and spaces.';
            }

            const studentValue = String(staff.students).trim();
            if (studentValue === '') {
                rowErrors.students = 'Cannot be empty.';
            } else if (!numberRegex.test(studentValue)) {
                rowErrors.students = 'Must be a number.';
            }

            rowErrors.groups = {};
            activeRole?.activities.forEach(activity => {
                const groupValue = String(staff.groups[activity.id] || '').trim();
                 if (groupValue === '') {
                    rowErrors.groups[activity.id] = 'Cannot be empty.';
                } else if (!numberRegex.test(groupValue)) {
                    rowErrors.groups[activity.id] = 'Must be a number.';
                }
            });
            if (Object.keys(rowErrors.groups).length === 0) delete rowErrors.groups;
            
            if (Object.keys(rowErrors).length > 0) {
                newErrors.rows[staff.id] = rowErrors;
            }
        });
        setErrors(newErrors);
    }, [staffAllocationData, activeRole]);
    
    useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(null), 3000); return () => clearTimeout(timer); } }, [toast]);
    
    const isSaveDisabled = Object.keys(errors.totals).length > 0 || Object.keys(errors.rows).length > 0;
    
    // --- Event Handlers ---
    const handleEdit = (staff) => { setBackupRow(staff); setEditingId(staff.id); };
    const handleSaveRow = (staffId) => {
        const rowErrors = errors.rows[staffId] || {};
        if (Object.keys(rowErrors).length > 0) return;
        setEditingId(null);
        setBackupRow(null);
        setToast('Row updated successfully!');
    };
    const handleCancel = () => { if (!backupRow) { setEditingId(null); return; } if (backupRow.name === '') { setStaffAllocationData(currentData => ({ ...currentData, [activeTab]: (currentData[activeTab] || []).filter(staff => staff.id !== editingId) })); } else { setStaffAllocationData(currentData => ({ ...currentData, [activeTab]: (currentData[activeTab] || []).map(staff => staff.id === editingId ? backupRow : staff) })); } setEditingId(null); setBackupRow(null); };
    const handleInputChange = (staffId, field, value, activityId = null) => {
        setStaffAllocationData(currentData => ({
            ...currentData,
            [activeTab]: currentData[activeTab].map(staff => {
                if (staff.id === staffId) {
                    if (field === 'groups' && activityId) {
                        return { ...staff, groups: { ...staff.groups, [activityId]: value } };
                    }
                    return { ...staff, [field]: value };
                }
                return staff;
            })
        }));
    };
    const handleAddRow = () => {
        if (!activeRole) return;
        const newStaff = { id: `staff-${Date.now()}`, name: '', students: '', groups: activeRole.activities.reduce((acc, activity) => ({ ...acc, [activity.id]: '' }), {}) };
        setStaffAllocationData(currentData => ({ ...currentData, [activeTab]: [...(currentData[activeTab] || []), newStaff] }));
        handleEdit(newStaff);
    };
    const handleDeleteRow = (staffId) => { if (window.confirm("Are you sure you want to delete this row?")) { setStaffAllocationData(currentData => ({ ...currentData, [activeTab]: currentData[activeTab].filter(s => s.id !== staffId) })); setToast('Row deleted successfully!'); } };
    const handleSaveChanges = () => { if (isSaveDisabled) return; console.log("Saving all data:", staffAllocationData); setToast('All changes saved successfully!'); };
    
    return (
        <div style={styles.panel}>
            {toast && <div style={styles.toast}>{toast}</div>}
            {Object.values(errors.totals).map(errorMsg => (<div key={errorMsg} style={styles.errorBox}>{errorMsg}</div>))}
            <div style={styles.headerContainer}>
                <div style={styles.titleContainer}><h2 style={styles.h2}>Per-student / Per-activity Allocation</h2><Tooltip text="List all staff acting in this role, including sessional and professional staff.  For each staff member, enter the number of students and the number of groups for each small-group activity for which the staff member is responsible in this role.  The column sums should normally equal the total number of students respectively groups for the relevant activity."><InfoIcon /></Tooltip></div>
                <button style={styles.addButton} onClick={handleAddRow}><AddIcon /> Add</button>
            </div>
            <div style={styles.tabContainer}>
                {rolesData.map((role, index) => (<button key={role.id} onClick={() => setActiveTab(role.id)} style={{ ...styles.tab.base, ...(activeTab === role.id ? styles.tab.active : styles.tab.inactive), ...(index === rolesData.length - 1 && { borderRight: 'none' }) }}>{role.name}</button>))}
            </div>
            <table style={styles.table.base}>
                <thead>
                    <tr>
                        <th style={styles.table.th}>Actions</th>
                        <th style={styles.table.th}>Staff Member Acting in Role</th>
                        <th style={styles.table.th}>Number of Students</th>
                        {activeRole?.activities.map((activity, index) => <th key={activity.id} style={styles.table.th}>{`Groups for Activity ${index + 1}`}</th>)}
                        <th style={{...styles.table.th, textAlign: 'right'}}>Allocation</th>
                    </tr>
                </thead>
                <tbody>
                    {activeRole?.staffAllocations.map(staff => {
                        const isEditing = editingId === staff.id;
                        const rowErrors = errors.rows[staff.id] || {};
                        const isRowSaveDisabled = Object.keys(rowErrors).length > 0;
                        // ✅ ADDED: Logic to disable edit button if another row is already being edited
                        const isAnotherRowEditing = editingId !== null && editingId !== staff.id;

                        return (
                            <tr key={staff.id}>
                                <td style={styles.table.td}>
                                    <div style={styles.actionIcons}>
                                        {isEditing ? (
                                            <>
                                                <button style={{...styles.iconButton, ...(isRowSaveDisabled && styles.disabledIconButton)}} onClick={() => handleSaveRow(staff.id)} title={isRowSaveDisabled ? "Please fix errors before saving" : "Save"} disabled={isRowSaveDisabled}><CheckIcon /></button>
                                                <button style={styles.iconButton} onClick={handleCancel} title="Cancel"><XIcon /></button>
                                            </>
                                        ) : (
                                            <>
                                                {/* ✅ UPDATED: Edit button is now disabled if another row is being edited */}
                                                <button 
                                                    style={{...styles.iconButton, ...(isAnotherRowEditing && styles.disabledIconButton)}} 
                                                    onClick={() => handleEdit(staff)} 
                                                    title={isAnotherRowEditing ? "Finish editing the current row first" : "Edit"}
                                                    disabled={isAnotherRowEditing}
                                                >
                                                    <EditIcon />
                                                </button>
                                                <button style={styles.iconButton} onClick={() => handleDeleteRow(staff.id)} title="Delete"><DeleteIcon /></button>
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td style={styles.table.td}><div style={styles.inputWrapper}>{isEditing ? (<><input type="text" style={{...styles.inputField, ...(rowErrors.name && styles.errorInputField)}} value={staff.name} onChange={(e) => handleInputChange(staff.id, 'name', e.target.value)} />{rowErrors.name && <div style={styles.inlineErrorText}>{rowErrors.name}</div>}</>) : ( staff.name )}</div></td>
                                <td style={styles.table.td}><div style={styles.inputWrapper}>{isEditing ? (<><input type="number" min="0" style={{...styles.inputField, ...(rowErrors.students && styles.errorInputField)}} value={staff.students} onChange={(e) => handleInputChange(staff.id, 'students', e.target.value)} />{rowErrors.students && <div style={styles.inlineErrorText}>{rowErrors.students}</div>}</>) : staff.students}</div></td>
                                {activeRole.activities.map(activity => {
                                    const groupError = rowErrors.groups?.[activity.id];
                                    return (
                                        <td key={activity.id} style={styles.table.td}><div style={styles.inputWrapper}>{isEditing ? (<><input type="number" min="0" style={{...styles.inputField, ...(groupError && styles.errorInputField)}} value={staff.groups[activity.id] || ''} onChange={(e) => handleInputChange(staff.id, 'groups', e.target.value, activity.id)} />{groupError && <div style={styles.inlineErrorText}>{groupError}</div>}</>) : (staff.groups[activity.id] || '')}</div></td>
                                    );
                                })}
                                <td style={{ ...styles.table.td, textAlign: 'right', fontWeight: 'bold' }}>{(calculateStaffAllocation(staff, activeRole) * 100).toFixed(1)}%</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Allocation to Subject Coordinator: {subject?.subjectCoordinator || "Tom"}</span>
                <span style={styles.summaryValue}>1.5%</span>
            </div>
            <div style={styles.footer}>
                <button style={{...styles.saveButton, ...(isSaveDisabled && styles.disabledButton)}} disabled={isSaveDisabled} onClick={handleSaveChanges}><SaveIcon />Save</button>
            </div>
        </div>
    );
}