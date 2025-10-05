// // import React, { useState, useMemo, useEffect } from 'react';

// // // --- Helper Icon Components ---
// // const EditIcon = () => (
// //     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', color: '#6c757d' }}>
// //         <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
// //         <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
// //     </svg>
// // );

// // const DeleteIcon = () => (
// //     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', color: '#dc3545' }}>
// //         <polyline points="3 6 5 6 21 6" />
// //         <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
// //     </svg>
// // );

// // const InfoIcon = () => (
// //     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#6c757d', marginLeft: '8px' }}>
// //         <circle cx="12" cy="12" r="10" />
// //         <line x1="12" y1="16" x2="12" y2="12" />
// //         <line x1="12" y1="8" x2="12.01" y2="8" />
// //     </svg>
// // );

// // // --- Main Per-delivery Allocation Tab Component ---
// // export default function PerDeliveryAllocationTab({ term, onAllocationChange }) {
// //     // --- State Management ---
// //     const [firstOfferingOfYear, setFirstOfferingOfYear] = useState('Yes');
// //     const [deliveries, setDeliveries] = useState([
// //         { id: 1, deliveryLocation: 'CTN', lecturer: 'Mary', weeklyLectureTime: 2, earlyCareerLoading: 'No' },
// //         { id: 2, deliveryLocation: 'PEN', lecturer: 'Mary', weeklyLectureTime: 0, earlyCareerLoading: 'No' },
// //         { id: 3, deliveryLocation: 'KWD', lecturer: 'Mary', weeklyLectureTime: 0, earlyCareerLoading: 'No' },
// //     ]);

// //     // --- Calculation Logic ---
// //     const calculatedData = useMemo(() => {
// //         // CORRECTED: The term multiplier is 1.0 for this calculation to match Excel and UI evidence.
// //         const termMultiplier = 1.0;

// //         const getEarlyCareerBonus = (loadingType) => {
// //             const map = {
// //                 "Yes - materials provided": 0.02,
// //                 "Yes - materials need major rewriting": 0.03,
// //                 "Yes - no materials provided": 0.04,
// //             };
// //             return map[loadingType] || 0;
// //         };

// //         const individualAllocations = deliveries.map(d => {
// //             const earlyCareerBonus = getEarlyCareerBonus(d.earlyCareerLoading);
// //             const time = Number(d.weeklyLectureTime) || 0;
// //             return 0.01 + (time * termMultiplier * 0.01) + earlyCareerBonus;
// //         });

// //         const sumOfIndividualAllocations = individualAllocations.reduce((sum, alloc) => sum + alloc, 0);

// //         let firstOfferingBonus = 0;
// //         if (firstOfferingOfYear === 'Yes' && deliveries.length > 0) {
// //             const maxLectureTime = Math.max(...deliveries.map(d => Number(d.weeklyLectureTime) || 0));
// //             firstOfferingBonus = 0.01 * termMultiplier * maxLectureTime;
// //         }

// //         const totalPerDeliveryAllocation = sumOfIndividualAllocations + firstOfferingBonus;

// //         return {
// //             total: totalPerDeliveryAllocation,
// //             individuals: individualAllocations
// //         };
// //     }, [deliveries, firstOfferingOfYear, term]);

// //     // --- Effect to notify parent of allocation changes ---
// //     useEffect(() => {
// //         if (onAllocationChange) {
// //             onAllocationChange(calculatedData.total);
// //         }
// //     }, [calculatedData.total, onAllocationChange]);

// //     // --- Event Handlers ---
// //     const handleAddDelivery = () => {
// //         const newId = deliveries.length > 0 ? Math.max(...deliveries.map(d => d.id)) + 1 : 1;
// //         setDeliveries([...deliveries, {
// //             id: newId,
// //             deliveryLocation: '',
// //             lecturer: '',
// //             weeklyLectureTime: 0,
// //             earlyCareerLoading: 'No'
// //         }]);
// //     };

// //     const handleDeleteDelivery = (idToDelete) => {
// //         setDeliveries(deliveries.filter(d => d.id !== idToDelete));
// //     };

// //     const handleDeliveryChange = (id, field, value) => {
// //         setDeliveries(deliveries.map(d =>
// //             d.id === id ? { ...d, [field]: value } : d
// //         ));
// //     };

// //     const earlyCareerOptions = [
// //         "No",
// //         "Yes - materials provided",
// //         "Yes - materials need major rewriting",
// //         "Yes - no materials provided"
// //     ];

// //     // --- Render ---
// //     return (
// //         <div style={styles.container}>
// //             <div style={styles.formGroup}>
// //                 <label style={styles.label} htmlFor="totalAllocation">Per-delivery Allocation <InfoIcon /></label>
// //                 <input
// //                     type="text"
// //                     id="totalAllocation"
// //                     readOnly
// //                     style={styles.totalInput}
// //                     value={`${(calculatedData.total * 100).toFixed(1)}%`}
// //                 />
// //             </div>

// //             <div style={styles.formGroupWithBorder}>
// //                 <label style={styles.label} htmlFor="firstOffering">First offering of the calendar year</label>
// //                 <select
// //                     id="firstOffering"
// //                     style={styles.select}
// //                     value={firstOfferingOfYear}
// //                     onChange={(e) => setFirstOfferingOfYear(e.target.value)}
// //                 >
// //                     <option value="Yes">Yes</option>
// //                     <option value="No">No</option>
// //                 </select>
// //             </div>

// //             <div style={styles.tableActions}>
// //                  <button style={styles.addButton} onClick={handleAddDelivery}>+ Add</button>
// //             </div>

// //             <div style={styles.tableContainer}>
// //                 {/* Table Header */}
// //                 <div style={styles.tableHeader}>
// //                     <div style={{...styles.tableCell, flex: 0.5}}>Actions</div>
// //                     <div style={{...styles.tableCell, flex: 1}}>Delivery</div>
// //                     <div style={{...styles.tableCell, flex: 2}}>Lecturer / Campus Coordinator</div>
// //                     <div style={{...styles.tableCell, flex: 2}}>Weekly lecture time over 13 weeks (hours)</div>
// //                     <div style={{...styles.tableCell, flex: 2.5}}>Early career academic loading</div>
// //                     <div style={{...styles.tableCell, flex: 1, justifyContent: 'flex-end'}}>Allocation</div>
// //                 </div>

// //                 {/* Table Body */}
// //                 {deliveries.map((delivery, index) => (
// //                     <div key={delivery.id} style={styles.tableRow}>
// //                         <div style={{...styles.tableCell, flex: 0.5, display: 'flex', gap: '8px' }}>
// //                             <EditIcon />
// //                             <DeleteIcon onClick={() => handleDeleteDelivery(delivery.id)} />
// //                         </div>
// //                         <div style={{...styles.tableCell, flex: 1}}>
// //                             <input type="text" style={styles.tableInput} value={delivery.deliveryLocation} onChange={(e) => handleDeliveryChange(delivery.id, 'deliveryLocation', e.target.value)} />
// //                         </div>
// //                         <div style={{...styles.tableCell, flex: 2}}>
// //                              <input type="text" style={styles.tableInput} value={delivery.lecturer} onChange={(e) => handleDeliveryChange(delivery.id, 'lecturer', e.target.value)} />
// //                         </div>
// //                         <div style={{...styles.tableCell, flex: 2}}>
// //                             <input type="number" style={styles.tableInput} value={delivery.weeklyLectureTime} min="0" onChange={(e) => handleDeliveryChange(delivery.id, 'weeklyLectureTime', e.target.value)} />
// //                         </div>
// //                         <div style={{...styles.tableCell, flex: 2.5}}>
// //                             <select style={styles.tableSelect} value={delivery.earlyCareerLoading} onChange={(e) => handleDeliveryChange(delivery.id, 'earlyCareerLoading', e.target.value)} >
// //                                 {earlyCareerOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
// //                             </select>
// //                         </div>
// //                         <div style={{...styles.tableCell, flex: 1, justifyContent: 'flex-end'}}>
// //                              <input type="text" readOnly style={{...styles.tableInput, ...styles.readOnlyInput}} value={`${(calculatedData.individuals[index] * 100).toFixed(1)}%`} />
// //                         </div>
// //                     </div>
// //                 ))}
// //             </div>

// //             <div style={styles.footer}>
// //                 <button style={styles.saveButton}>Save</button>
// //             </div>
// //         </div>
// //     );
// // }


// // // --- Component-Specific Styles ---
// // const styles = {
// //     container: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6' },
// //     formGroup: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' },
// //     formGroupWithBorder: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', border: '1px solid #dee2e6', padding: '1rem', borderRadius: '6px' },
// //     label: { fontWeight: '500', color: '#495057', display: 'flex', alignItems: 'center' },
// //     totalInput: { padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', backgroundColor: '#e9ecef', fontSize: '1rem', width: '100px', textAlign: 'center', fontWeight: 'bold' },
// //     select: { padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', backgroundColor: '#fff', fontSize: '1rem', width: '200px' },
// //     tableActions: { display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' },
// //     addButton: { padding: '0.5rem 1.5rem', fontSize: '1rem', borderRadius: '6px', border: '1px solid #343a40', cursor: 'pointer', fontWeight: '600', backgroundColor: '#343a40', color: 'white' },
// //     tableContainer: { border: '1px solid #dee2e6', borderRadius: '6px', overflow: 'hidden' },
// //     tableHeader: { display: 'flex', backgroundColor: '#f8f9fa', fontWeight: '600', color: '#495057', borderBottom: '1px solid #dee2e6', padding: '0.75rem', fontSize: '0.9rem' },
// //     tableRow: { display: 'flex', alignItems: 'center', borderBottom: '1px solid #e9ecef', padding: '0.5rem 0.75rem' },
// //     tableCell: { padding: '0 0.5rem', display: 'flex', alignItems: 'center' },
// //     tableInput: { width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', fontSize: '1rem' },
// //     tableSelect: { width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', backgroundColor: '#fff', fontSize: '1rem' },
// //     readOnlyInput: { backgroundColor: '#e9ecef', border: '1px solid #ced4da', textAlign: 'right' },
// //     footer: { marginTop: '2rem' },
// //     saveButton: { padding: '0.6rem 1.2rem', fontSize: '1rem', borderRadius: '6px', border: '1px solid #343a40', cursor: 'pointer', fontWeight: '600', backgroundColor: '#343a40', color: 'white' }
// // };

// import React, { useState, useMemo, useEffect } from 'react';

// // --- Helper Icon Components (Corrected) ---
// // Added { onClick } prop to be passed to the SVG element
// const EditIcon = ({ onClick }) => (
//     <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', color: '#6c757d' }}>
//         <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
//         <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
//     </svg>
// );

// // Added { onClick } prop to be passed to the SVG element
// const DeleteIcon = ({ onClick }) => (
//     <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', color: '#dc3545' }}>
//         <polyline points="3 6 5 6 21 6" />
//         <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
//     </svg>
// );

// // New component for saving a row edit
// const SaveRowIcon = ({ onClick }) => (
//     <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', color: '#28a745' }}>
//         <polyline points="20 6 9 17 4 12"></polyline>
//     </svg>
// );


// const InfoIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#6c757d', marginLeft: '8px' }}>
//         <circle cx="12" cy="12" r="10" />
//         <line x1="12" y1="16" x2="12" y2="12" />
//         <line x1="12" y1="8" x2="12.01" y2="8" />
//     </svg>
// );


// // --- Main Per-delivery Allocation Tab Component ---
// export default function PerDeliveryAllocationTab({ term, onAllocationChange }) {
//     // --- State Management ---
//     const [firstOfferingOfYear, setFirstOfferingOfYear] = useState('Yes');
//     const [deliveries, setDeliveries] = useState([
//         { id: 1, deliveryLocation: 'CTN', lecturer: 'Mary', weeklyLectureTime: 2, earlyCareerLoading: 'No' },
//         { id: 2, deliveryLocation: 'PEN', lecturer: 'Mary', weeklyLectureTime: 0, earlyCareerLoading: 'No' },
//         { id: 3, deliveryLocation: 'KWD', lecturer: 'Mary', weeklyLectureTime: 0, earlyCareerLoading: 'No' },
//     ]);
//     // New state to track the ID of the row being edited
//     const [editingId, setEditingId] = useState(null);

//     // --- Calculation Logic ---
//     const calculatedData = useMemo(() => {
//         const termMultiplier = 1.0;
//         const getEarlyCareerBonus = (loadingType) => {
//             const map = {
//                 "Yes - materials provided": 0.02,
//                 "Yes - materials need major rewriting": 0.03,
//                 "Yes - no materials provided": 0.04,
//             };
//             return map[loadingType] || 0;
//         };

//         const individualAllocations = deliveries.map(d => {
//             const earlyCareerBonus = getEarlyCareerBonus(d.earlyCareerLoading);
//             const time = Number(d.weeklyLectureTime) || 0;
//             return 0.01 + (time * termMultiplier * 0.01) + earlyCareerBonus;
//         });

//         const sumOfIndividualAllocations = individualAllocations.reduce((sum, alloc) => sum + alloc, 0);

//         let firstOfferingBonus = 0;
//         if (firstOfferingOfYear === 'Yes' && deliveries.length > 0) {
//             const maxLectureTime = Math.max(...deliveries.map(d => Number(d.weeklyLectureTime) || 0));
//             firstOfferingBonus = 0.01 * termMultiplier * maxLectureTime;
//         }

//         const totalPerDeliveryAllocation = sumOfIndividualAllocations + firstOfferingBonus;

//         return {
//             total: totalPerDeliveryAllocation,
//             individuals: individualAllocations
//         };
//     }, [deliveries, firstOfferingOfYear, term]);

//     // --- Effect to notify parent of allocation changes ---
//     useEffect(() => {
//         if (onAllocationChange) {
//             onAllocationChange(calculatedData.total);
//         }
//     }, [calculatedData.total, onAllocationChange]);

//     // --- Event Handlers ---
//     const handleAddDelivery = () => {
//         const newId = deliveries.length > 0 ? Math.max(...deliveries.map(d => d.id)) + 1 : 1;
//         const newDelivery = {
//             id: newId,
//             deliveryLocation: '',
//             lecturer: '',
//             weeklyLectureTime: 0,
//             earlyCareerLoading: 'No'
//         };
//         setDeliveries([...deliveries, newDelivery]);
//         // Immediately set the new row to be in editing mode
//         setEditingId(newId);
//     };

//     const handleDeleteDelivery = (idToDelete) => {
//         setDeliveries(deliveries.filter(d => d.id !== idToDelete));
//     };

//     const handleDeliveryChange = (id, field, value) => {
//         setDeliveries(deliveries.map(d =>
//             d.id === id ? { ...d, [field]: value } : d
//         ));
//     };
    
//     // New handler for the main save button
//     const handleSave = () => {
//         // Here you would typically send the data to an API
//         console.log("Saving data:", {
//             firstOfferingOfYear,
//             deliveries
//         });
//         alert("Data saved! Check the console for the output.");
//     };

//     const earlyCareerOptions = [
//         "No",
//         "Yes - materials provided",
//         "Yes - materials need major rewriting",
//         "Yes - no materials provided"
//     ];

//     // --- Render ---
//     return (
//         <div style={styles.container}>
//             <div style={styles.formGroup}>
//                 <label style={styles.label} htmlFor="totalAllocation">Per-delivery Allocation <InfoIcon /></label>
//                 <input
//                     type="text"
//                     id="totalAllocation"
//                     readOnly
//                     style={styles.totalInput}
//                     value={`${(calculatedData.total * 100).toFixed(1)}%`}
//                 />
//             </div>

//             <div style={styles.formGroupWithBorder}>
//                 <label style={styles.label} htmlFor="firstOffering">First offering of the calendar year</label>
//                 <select
//                     id="firstOffering"
//                     style={styles.select}
//                     value={firstOfferingOfYear}
//                     onChange={(e) => setFirstOfferingOfYear(e.target.value)}
//                 >
//                     <option value="Yes">Yes</option>
//                     <option value="No">No</option>
//                 </select>
//             </div>

//             <div style={styles.tableActions}>
//                  <button style={styles.addButton} onClick={handleAddDelivery}>+ Add</button>
//             </div>

//             <div style={styles.tableContainer}>
//                 {/* Table Header */}
//                 <div style={styles.tableHeader}>
//                     <div style={{...styles.tableCell, flex: 0.5}}>Actions</div>
//                     <div style={{...styles.tableCell, flex: 1}}>Delivery</div>
//                     <div style={{...styles.tableCell, flex: 2}}>Lecturer / Campus Coordinator</div>
//                     <div style={{...styles.tableCell, flex: 2}}>Weekly lecture time over 13 weeks (hours)</div>
//                     <div style={{...styles.tableCell, flex: 2.5}}>Early career academic loading</div>
//                     <div style={{...styles.tableCell, flex: 1, justifyContent: 'flex-end'}}>Allocation</div>
//                 </div>

//                 {/* Table Body */}
//                 {deliveries.map((delivery, index) => {
//                     const isEditing = editingId === delivery.id;
//                     return (
//                         <div key={delivery.id} style={styles.tableRow}>
//                             <div style={{...styles.tableCell, flex: 0.5, display: 'flex', gap: '8px' }}>
//                                 {isEditing ? (
//                                     <SaveRowIcon onClick={() => setEditingId(null)} />
//                                 ) : (
//                                     <EditIcon onClick={() => setEditingId(delivery.id)} />
//                                 )}
//                                 <DeleteIcon onClick={() => handleDeleteDelivery(delivery.id)} />
//                             </div>
//                             <div style={{...styles.tableCell, flex: 1}}>
//                                 <input type="text" style={styles.tableInput} value={delivery.deliveryLocation} disabled={!isEditing} onChange={(e) => handleDeliveryChange(delivery.id, 'deliveryLocation', e.target.value)} />
//                             </div>
//                             <div style={{...styles.tableCell, flex: 2}}>
//                                  <input type="text" style={styles.tableInput} value={delivery.lecturer} disabled={!isEditing} onChange={(e) => handleDeliveryChange(delivery.id, 'lecturer', e.target.value)} />
//                             </div>
//                             <div style={{...styles.tableCell, flex: 2}}>
//                                 <input type="number" style={styles.tableInput} value={delivery.weeklyLectureTime} min="0" disabled={!isEditing} onChange={(e) => handleDeliveryChange(delivery.id, 'weeklyLectureTime', e.target.value)} />
//                             </div>
//                             <div style={{...styles.tableCell, flex: 2.5}}>
//                                 <select style={styles.tableSelect} value={delivery.earlyCareerLoading} disabled={!isEditing} onChange={(e) => handleDeliveryChange(delivery.id, 'earlyCareerLoading', e.target.value)} >
//                                     {earlyCareerOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//                                 </select>
//                             </div>
//                             <div style={{...styles.tableCell, flex: 1, justifyContent: 'flex-end'}}>
//                                  <input type="text" readOnly style={{...styles.tableInput, ...styles.readOnlyInput}} value={`${(calculatedData.individuals[index] * 100).toFixed(1)}%`} />
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>

//             <div style={styles.footer}>
//                 <button style={styles.saveButton} onClick={handleSave}>Save</button>
//             </div>
//         </div>
//     );
// }


// // --- Component-Specific Styles ---
// const styles = {
//     container: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', fontFamily: 'sans-serif' },
//     formGroup: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' },
//     formGroupWithBorder: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', border: '1px solid #dee2e6', padding: '1rem', borderRadius: '6px' },
//     label: { fontWeight: '500', color: '#495057', display: 'flex', alignItems: 'center' },
//     totalInput: { padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', backgroundColor: '#e9ecef', fontSize: '1rem', width: '100px', textAlign: 'center', fontWeight: 'bold' },
//     select: { padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', backgroundColor: '#fff', fontSize: '1rem', width: '200px' },
//     tableActions: { display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' },
//     addButton: { padding: '0.5rem 1.5rem', fontSize: '1rem', borderRadius: '6px', border: '1px solid #343a40', cursor: 'pointer', fontWeight: '600', backgroundColor: '#343a40', color: 'white' },
//     tableContainer: { border: '1px solid #dee2e6', borderRadius: '6px', overflow: 'hidden' },
//     tableHeader: { display: 'flex', backgroundColor: '#f8f9fa', fontWeight: '600', color: '#495057', borderBottom: '1px solid #dee2e6', padding: '0.75rem', fontSize: '0.9rem' },
//     tableRow: { display: 'flex', alignItems: 'center', borderBottom: '1px solid #e9ecef', padding: '0.5rem 0.75rem' },
//     tableCell: { padding: '0 0.5rem', display: 'flex', alignItems: 'center' },
//     tableInput: { width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', fontSize: '1rem', backgroundColor: '#fff' },
//     tableSelect: { width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', backgroundColor: '#fff', fontSize: '1rem' },
//     readOnlyInput: { backgroundColor: '#e9ecef', border: '1px solid #ced4da', textAlign: 'right' },
//     footer: { marginTop: '2rem' },
//     saveButton: { padding: '0.6rem 1.2rem', fontSize: '1rem', borderRadius: '6px', border: '1px solid #343a40', cursor: 'pointer', fontWeight: '600', backgroundColor: '#343a40', color: 'white' }
// };

// // Add this style to the document's head to handle disabled input appearance
// const customStyles = document.createElement('style');
// customStyles.innerHTML = `
//     input:disabled, select:disabled {
//         background-color: #e9ecef !important;
//         cursor: not-allowed;
//         opacity: 0.7;
//     }
// `;
// document.head.appendChild(customStyles);

import React, { useState, useMemo, useEffect, useRef } from 'react';

// --- Helper Icon Components ---
const EditIcon = ({ onClick }) => (
    <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', color: '#6c757d' }}>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const DeleteIcon = ({ onClick }) => (
    <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', color: '#dc3545' }}>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const SaveRowIcon = ({ onClick }) => (
    <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', color: '#28a745' }}>
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

// const InfoIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#6c757d', marginLeft: '8px', verticalAlign: 'middle' }}>
//         <circle cx="12" cy="12" r="10" />
//         <line x1="12" y1="16" x2="12" y2="12" />
//         <line x1="12" y1="8" x2="12.01" y2="8" />
//     </svg>
// );

const InfoIcon = ({ onClick }) => (
    <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#6c757d', marginLeft: '8px', verticalAlign: 'middle', cursor: 'pointer' }}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);

// --- Simple Toast Notification Component ---
const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000); // Auto-dismiss after 3 seconds
        return () => clearTimeout(timer);
    }, [onClose]);

    const style = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '6px',
        color: 'white',
        backgroundColor: type === 'success' ? '#28a745' : '#dc3545',
        zIndex: 1000,
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        fontSize: '1rem',
    };

    return <div style={style}>{message}</div>;
};
// --- NEW: Modal Component ---
const Modal = ({ title, content, onClose }) => {
    return (
        <div style={styles.modalBackdrop}>
            <div style={styles.modalContent}>
                <div style={styles.modalHeader}>
                    <h3 style={{ margin: 0 }}>{title}</h3>
                    <button onClick={onClose} style={styles.modalCloseButton}>×</button>
                </div>
                <div style={styles.modalBody}>
                    <p style={styles.modalText}>{content}</p>
                </div>
            </div>
        </div>
    );
};


// --- Constants for Modal Text ---
const PER_DELIVERY_INFO = {
    title: "Per-delivery Allocation Information",
    content: `The per-delivery allocation covers tasks at the large group level: \n(i) preparation of teaching materials for lectures or large group workshops [first delivery in each calendar year only]; \n(ii) lecture or large workshop delivery; \n(iii) subject coordination tasks that depend only on the number of deliveries, for instance, timetabling matters or campus coordination of lecturers and tutors; and \n(iv) any other matters arising from delivering the subject for a separate student cohort.`
};

const FIRST_OFFERING_INFO = {
    title: "First Offering Information",
    content: `List all deliveries and, for each delivery, indicate the lecturer, the weekly lecture (or large group class) time, and whether the lecturing staff member is an early career academic; see the SCDMS Work Plan Policy or the notes (tool tips) for the definition of “delivery”, “early career academic” and “weekly lecture time”.\n\nThe "weekly lecture time" is based on the average weekly large group classes (such as lectures) over the entire term; other arrangements such as fortnightly classes should be counted pro-rata.\n\nWhere an external delivery or a blended delivery in which all content is delivered through vUWS is the only delivery of the subject in the given term, that delivery is considered to be equivalent to a 1 hour lecture per week.\n\nIn all other situations, large group classes are counted as they are actually taught.\n\n- For a subject that has an external or blended delivery in addition to a live delivery (on campus or via Zoom), the external or blended delivery should be entered with a weekly lecture time of 0 hours.\n\n- For a subject that has live lectures taught across multiple campuses via Zoom, one delivery should be entered normally; the remaining deliveries should be entered with a weekly lecture time of 0 hours.`
};
// --- Main Per-delivery Allocation Tab Component ---
export default function PerDeliveryAllocationTab({ term, onAllocationChange }) {
    // --- State Management ---
    const [firstOfferingOfYear, setFirstOfferingOfYear] = useState('Yes');
    const [deliveries, setDeliveries] = useState([
        { id: 1, deliveryLocation: 'CTN', lecturer: 'Mary', weeklyLectureTime: 2, earlyCareerLoading: 'No' },
        { id: 2, deliveryLocation: 'PEN', lecturer: 'Mary', weeklyLectureTime: 0, earlyCareerLoading: 'No' },
        { id: 3, deliveryLocation: 'KWD', lecturer: 'Mary', weeklyLectureTime: 0, earlyCareerLoading: 'No' },
    ]);
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({}); // For validation errors
    const [toast, setToast] = useState({ message: '', type: '', key: 0 }); // Key to re-trigger toast

    // NEW: State to manage modal visibility and content
    const [modalInfo, setModalInfo] = useState({ show: false, title: '', content: '' });

    // --- Toast Helper ---
    const showToast = (message, type = 'success') => {
        setToast({ message, type, key: Date.now() }); // Use key to re-render toast
    };

    // NEW: Functions to show/hide the modal
    const showModal = (info) => setModalInfo({ show: true, title: info.title, content: info.content });
    const hideModal = () => setModalInfo({ show: false, title: '', content: '' });


    // --- Validation Logic ---
    const validateRow = (delivery) => {
        const newErrors = {};
        const specialCharRegex = /^[a-zA-Z0-9\s-]*$/;

        if (!delivery.deliveryLocation?.trim()) {
            newErrors.deliveryLocation = 'Delivery cannot be blank.';
        } else if (!specialCharRegex.test(delivery.deliveryLocation)) {
            newErrors.deliveryLocation = 'No special characters allowed.';
        }

        if (!delivery.lecturer?.trim()) {
            newErrors.lecturer = 'Lecturer cannot be blank.';
        } else if (!specialCharRegex.test(delivery.lecturer)) {
            newErrors.lecturer = 'No special characters allowed.';
        }

        const lectureTime = delivery.weeklyLectureTime;
        if (lectureTime === '' || lectureTime === null) {
            newErrors.weeklyLectureTime = 'Weekly hours cannot be blank.';
        } else if (isNaN(Number(lectureTime))) {
            newErrors.weeklyLectureTime = 'Must be a valid number.';
        } else if (Number(lectureTime) < 0) {
            newErrors.weeklyLectureTime = 'Cannot be negative.';
        }

        return newErrors;
    };


    // --- Calculation Logic ---
    const calculatedData = useMemo(() => {
        const termMultiplier = 1.0;
        const getEarlyCareerBonus = (loadingType) => {
            const map = {
                "Yes - materials provided": 0.02,
                "Yes - materials need major rewriting": 0.03,
                "Yes - no materials provided": 0.04,
            };
            return map[loadingType] || 0;
        };

        const individualAllocations = deliveries.map(d => {
            const earlyCareerBonus = getEarlyCareerBonus(d.earlyCareerLoading);
            const time = Number(d.weeklyLectureTime) || 0;
            return 0.01 + (time * termMultiplier * 0.01) + earlyCareerBonus;
        });

        const sumOfIndividualAllocations = individualAllocations.reduce((sum, alloc) => sum + alloc, 0);

        let firstOfferingBonus = 0;
        if (firstOfferingOfYear === 'Yes' && deliveries.length > 0) {
            const maxLectureTime = Math.max(...deliveries.map(d => Number(d.weeklyLectureTime) || 0));
            firstOfferingBonus = 0.01 * termMultiplier * maxLectureTime;
        }

        const totalPerDeliveryAllocation = sumOfIndividualAllocations + firstOfferingBonus;

        return {
            total: totalPerDeliveryAllocation,
            individuals: individualAllocations
        };
    }, [deliveries, firstOfferingOfYear, term]);

    // --- Effect to notify parent of allocation changes ---
    useEffect(() => {
        if (onAllocationChange) {
            onAllocationChange(calculatedData.total);
        }
    }, [calculatedData.total, onAllocationChange]);

    // --- Event Handlers ---
    const handleAddDelivery = () => {
        const newId = deliveries.length > 0 ? Math.max(...deliveries.map(d => d.id)) + 1 : 1;
        const newDelivery = {
            id: newId,
            deliveryLocation: '',
            lecturer: '',
            weeklyLectureTime: '', // Use empty string for better validation
            earlyCareerLoading: 'No'
        };
        setDeliveries([...deliveries, newDelivery]);
        setEditingId(newId);
        setErrors(prev => ({ ...prev, [newId]: {} })); // Initialize error state for new row
    };

    const handleDeleteDelivery = (idToDelete) => {
        if (window.confirm("Are you sure you want to delete this delivery? This action cannot be undone.")) {
            setDeliveries(deliveries.filter(d => d.id !== idToDelete));
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[idToDelete];
                return newErrors;
            });
            showToast('Per Delivery record deleted.', 'success');
        }
    };

    const handleDeliveryChange = (id, field, value) => {
        setDeliveries(deliveries.map(d =>
            d.id === id ? { ...d, [field]: value } : d
        ));

        // Clear the specific error when the user starts typing to provide instant feedback
        if (errors[id] && errors[id][field]) {
            setErrors(prev => {
                const newRowErrors = { ...prev[id] };
                delete newRowErrors[field];
                return { ...prev, [id]: newRowErrors };
            });
        }
    };
    
    const handleSaveRow = (id) => {
        const deliveryToValidate = deliveries.find(d => d.id === id);
        const validationErrors = validateRow(deliveryToValidate);

        if (Object.keys(validationErrors).length === 0) {
            setEditingId(null);
            setErrors(prev => ({ ...prev, [id]: {} })); // Clear any lingering errors
            showToast('Per Delivery Allocation saved successfully!', 'success');
        } else {
            setErrors(prev => ({ ...prev, [id]: validationErrors }));
            showToast('Please correct the errors before saving.', 'error');
        }
    };
    
    const handleSave = () => {
        if (editingId !== null) {
            showToast('Please save the currently editing delivery first.', 'error');
            return;
        }
        
        console.log("Saving all data:", {
            firstOfferingOfYear,
            deliveries
        });
        showToast("Per Delivery Allocation Saved!", 'success');
    };

    const earlyCareerOptions = [
        "No",
        "Yes - materials provided",
        "Yes - materials need major rewriting",
        "Yes - no materials provided"
    ];

    // --- Render ---
    return (
        <div style={styles.container}>
            {toast.message && (
                <Toast
                    key={toast.key}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ message: '', type: '', key: 0 })}
                />
            )}

            {/* NEW: Render Modal when show is true */}
            {modalInfo.show && <Modal title={modalInfo.title} content={modalInfo.content} onClose={hideModal} />}

            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="totalAllocation">
                    Per-delivery Allocation
                    {/* UPDATED: InfoIcon now opens the modal */}
                    <InfoIcon onClick={() => showModal(PER_DELIVERY_INFO)} />
                </label>
                <input type="text" id="totalAllocation" readOnly style={styles.totalInput} value={`${(calculatedData.total * 100).toFixed(1)}%`} />
            </div>

            <div style={styles.formGroupWithBorder}>
                <label style={styles.label} htmlFor="firstOffering">
                    First offering of the calendar year
                    {/* UPDATED: InfoIcon now opens the modal */}
                    <InfoIcon onClick={() => showModal(FIRST_OFFERING_INFO)} />
                </label>
                <select id="firstOffering" style={styles.select} value={firstOfferingOfYear} onChange={(e) => setFirstOfferingOfYear(e.target.value)}>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>


            <div style={styles.tableActions}>
                 <button style={styles.addButton} onClick={handleAddDelivery}>+ Add</button>
            </div>

            <div style={styles.tableContainer}>
                <div style={styles.tableHeader}>
                    <div style={{...styles.tableCell, flex: 0.5}}>Actions</div>
                    <div style={{...styles.tableCell, flex: 1}}>Delivery</div>
                    <div style={{...styles.tableCell, flex: 2}}>Lecturer / Campus Coordinator</div>
                    <div style={{...styles.tableCell, flex: 2}}>Weekly lecture time (hours)</div>
                    <div style={{...styles.tableCell, flex: 2.5}}>Early career academic loading</div>
                    <div style={{...styles.tableCell, flex: 1, justifyContent: 'flex-end'}}>Allocation</div>
                </div>

                {deliveries.map((delivery, index) => {
                    const isEditing = editingId === delivery.id;
                    const rowErrors = errors[delivery.id] || {};
                    return (
                        <div key={delivery.id} style={styles.tableRow}>
                            <div style={{...styles.tableCell, flex: 0.5, display: 'flex', gap: '8px' }}>
                                {isEditing ? (
                                    <SaveRowIcon onClick={() => handleSaveRow(delivery.id)} />
                                ) : (
                                    <EditIcon onClick={() => setEditingId(delivery.id)} />
                                )}
                                <DeleteIcon onClick={() => handleDeleteDelivery(delivery.id)} />
                            </div>
                            <div style={{...styles.tableCell, flex: 1, ...styles.inputContainer}}>
                                <input type="text" style={{...styles.tableInput, borderColor: rowErrors.deliveryLocation ? 'red' : '#ced4da' }} value={delivery.deliveryLocation} disabled={!isEditing} onChange={(e) => handleDeliveryChange(delivery.id, 'deliveryLocation', e.target.value)} />
                                {rowErrors.deliveryLocation && <span style={styles.errorText}>{rowErrors.deliveryLocation}</span>}
                            </div>
                            <div style={{...styles.tableCell, flex: 2, ...styles.inputContainer}}>
                                 <input type="text" style={{...styles.tableInput, borderColor: rowErrors.lecturer ? 'red' : '#ced4da'}} value={delivery.lecturer} disabled={!isEditing} onChange={(e) => handleDeliveryChange(delivery.id, 'lecturer', e.target.value)} />
                                 {rowErrors.lecturer && <span style={styles.errorText}>{rowErrors.lecturer}</span>}
                            </div>
                            <div style={{...styles.tableCell, flex: 2, ...styles.inputContainer}}>
                                <input type="number" style={{...styles.tableInput, borderColor: rowErrors.weeklyLectureTime ? 'red' : '#ced4da'}} value={delivery.weeklyLectureTime} min="0" disabled={!isEditing} onChange={(e) => handleDeliveryChange(delivery.id, 'weeklyLectureTime', e.target.value)} />
                                {rowErrors.weeklyLectureTime && <span style={styles.errorText}>{rowErrors.weeklyLectureTime}</span>}
                            </div>
                            <div style={{...styles.tableCell, flex: 2.5, ...styles.inputContainer}}>
                                <select style={styles.tableSelect} value={delivery.earlyCareerLoading} disabled={!isEditing} onChange={(e) => handleDeliveryChange(delivery.id, 'earlyCareerLoading', e.target.value)} >
                                    {earlyCareerOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                            <div style={{...styles.tableCell, flex: 1, justifyContent: 'flex-end'}}>
                                 <input type="text" readOnly style={{...styles.tableInput, ...styles.readOnlyInput}} value={`${(calculatedData.individuals[index] * 100).toFixed(1)}%`} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={styles.footer}>
                <button style={styles.saveButton} onClick={handleSave}>Save</button>
            </div>
        </div>
    );
}

// --- Component-Specific Styles ---
const styles = {
    container: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', fontFamily: 'sans-serif' },
    formGroup: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' },
    formGroupWithBorder: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', border: '1px solid #dee2e6', padding: '1rem', borderRadius: '6px' },
    label: { fontWeight: '500', color: '#495057', display: 'flex', alignItems: 'center' },
    totalInput: { padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', backgroundColor: '#e9ecef', fontSize: '1rem', width: '100px', textAlign: 'center', fontWeight: 'bold' },
    select: { padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', backgroundColor: '#fff', fontSize: '1rem', width: '200px' },
    tableActions: { display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' },
    addButton: { padding: '0.5rem 1.5rem', fontSize: '1rem', borderRadius: '6px', border: '1px solid #343a40', cursor: 'pointer', fontWeight: '600', backgroundColor: '#343a40', color: 'white' },
    tableContainer: { border: '1px solid #dee2e6', borderRadius: '6px', overflow: 'hidden' },
    tableHeader: { display: 'flex', backgroundColor: '#f8f9fa', fontWeight: '600', color: '#495057', borderBottom: '1px solid #dee2e6', padding: '0.75rem', fontSize: '0.9rem', textAlign: 'left' },
    tableRow: { display: 'flex', alignItems: 'flex-start', borderBottom: '1px solid #e9ecef', padding: '0.5rem 0.75rem' },
    tableCell: { padding: '0 0.5rem', display: 'flex', alignItems: 'center' },
    inputContainer: { flexDirection: 'column', alignItems: 'stretch' },
    tableInput: { width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', fontSize: '1rem', backgroundColor: '#fff', transition: 'border-color 0.2s ease-in-out' },
    tableSelect: { width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', backgroundColor: '#fff', fontSize: '1rem', transition: 'border-color 0.2s ease-in-out' },
    readOnlyInput: { backgroundColor: '#e9ecef', border: '1px solid #ced4da', textAlign: 'right' },
    errorText: { color: '#dc3545', fontSize: '0.75rem', marginTop: '4px', textAlign: 'left' },
    footer: { marginTop: '2rem' },
    saveButton: { padding: '0.6rem 1.2rem', fontSize: '1rem', borderRadius: '6px', border: '1px solid #343a40', cursor: 'pointer', fontWeight: '600', backgroundColor: '#343a40', color: 'white' },
    // NEW: Styles for the Modal component
    modalBackdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1040,
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '600px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #dee2e6',
        paddingBottom: '10px',
        marginBottom: '15px',
    },
    modalCloseButton: {
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        color: '#6c757d',
    },
    modalBody: {
        maxHeight: '70vh',
        overflowY: 'auto',
    },
    modalText: {
        whiteSpace: 'pre-wrap', // This preserves line breaks
        fontSize: '1rem',
        lineHeight: '1.6',
        color: '#495057',
        margin: 0,
    },
};


const customStyles = document.createElement('style');
customStyles.innerHTML = `
    input:disabled, select:disabled {
        background-color: #f8f9fa !important;
        cursor: not-allowed;
        opacity: 0.8;
    }
    input[type="number"]::-webkit-inner-spin-button, 
    input[type="number"]::-webkit-outer-spin-button { 
        -webkit-appearance: none; 
        margin: 0; 
    }
    input[type="number"] {
        -moz-appearance: textfield;
    }
`;
document.head.appendChild(customStyles);