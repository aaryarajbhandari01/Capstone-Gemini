

// // // import React, { useState, useMemo, useEffect } from 'react';
// // // import { useWorkload } from '../WorkloadContext';

// // // // --- Helper Icon Components ---
// // // const EditIcon = ({ onClick }) => ( <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', color: '#6c757d' }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg> );
// // // const DeleteIcon = ({ onClick }) => ( <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', color: '#dc3545' }}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg> );
// // // const SaveRowIcon = ({ onClick }) => ( <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', color: '#28a745' }}><polyline points="20 6 9 17 4 12"></polyline></svg> );
// // // const InfoIcon = ({ onClick }) => ( <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#6c757d', marginLeft: '8px', verticalAlign: 'middle', cursor: 'pointer' }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg> );

// // // // --- Helper UI Components ---
// // // const Toast = ({ message, type, onClose }) => {
// // //     useEffect(() => {
// // //         const timer = setTimeout(onClose, 3000);
// // //         return () => clearTimeout(timer);
// // //     }, [onClose]);
// // //     // ... (styles for Toast)
// // //     return <div style={{...styles.toast, backgroundColor: type === 'success' ? '#28a745' : '#dc3545'}}>{message}</div>;
// // // };

// // // const Modal = ({ title, content, onClose }) => (
// // //     <div style={styles.modalBackdrop}>
// // //         <div style={styles.modalContent}>
// // //             <div style={styles.modalHeader}>
// // //                 <h3 style={{ margin: 0 }}>{title}</h3>
// // //                 <button onClick={onClose} style={styles.modalCloseButton}>×</button>
// // //             </div>
// // //             <div style={styles.modalBody}><p style={styles.modalText}>{content}</p></div>
// // //         </div>
// // //     </div>
// // // );


// // // // --- Constants for Modal Text ---
// // // const PER_DELIVERY_INFO = { /* ... */ };
// // // const FIRST_OFFERING_INFO = { /* ... */ };


// // // // --- Main Per-delivery Allocation Tab Component ---
// // // export default function PerDeliveryAllocationTab({ term, onAllocationChange }) {
// // //     // --- State Management ---
// // //     const { deliveries, setDeliveries, firstOfferingOfYear, setFirstOfferingOfYear } = useWorkload();
// // //     const [editingId, setEditingId] = useState(null);
// // //     const [errors, setErrors] = useState({});
// // //     const [toast, setToast] = useState({ message: '', type: '', key: 0 });
// // //     const [modalInfo, setModalInfo] = useState({ show: false, title: '', content: '' });

// // //     // --- Calculations with useMemo to prevent loops ---
// // //     const calculatedData = useMemo(() => {
// // //         const termMultiplier = 1.0;
        
// // //         const getEarlyCareerBonus = (loadingType) => {
// // //             const map = {
// // //                 "Yes - materials provided": 0.02,
// // //                 "Yes - materials need major rewriting": 0.03,
// // //                 "Yes - no materials provided": 0.04,
// // //             };
// // //             return map[loadingType] || 0;
// // //         };

// // //         // This function produces the raw allocation value (e.g., 0.03 for 3%)
// // //         const calculateInitialAllocation = (delivery) => {
// // //             const time = Number(delivery.weeklyLectureTime) || 0;
// // //             const earlyCareerBonus = getEarlyCareerBonus(delivery.earlyCareerLoading);
// // //             return (0.01 + (time * termMultiplier * 0.01) + earlyCareerBonus);
// // //         };
        
// // //         // Create a new array that includes the calculated 'initialAllocation'
// // //         const deliveriesWithCalculations = deliveries.map(d => ({
// // //             ...d,
// // //             initialAllocation: calculateInitialAllocation(d)
// // //         }));

// // //         const sumOfIndividualAllocations = deliveriesWithCalculations.reduce((sum, d) => sum + d.initialAllocation, 0);

// // //         let firstOfferingBonus = 0;
// // //         if (firstOfferingOfYear === 'Yes' && deliveries.length > 0) {
// // //             const maxLectureTime = Math.max(...deliveries.map(d => Number(d.weeklyLectureTime) || 0));
// // //             firstOfferingBonus = 0.01 * termMultiplier * maxLectureTime;
// // //         }

// // //         const totalPerDeliveryAllocation = sumOfIndividualAllocations + firstOfferingBonus;
        
// // //         return {
// // //             total: totalPerDeliveryAllocation,
// // //             finalDeliveries: deliveriesWithCalculations 
// // //         };
// // //     }, [deliveries, firstOfferingOfYear, term]);

// // //     // --- Side Effect to sync data back to context and parent ---
// // //     useEffect(() => {
// // //         // 1. Notify the parent page of the new total allocation
// // //         if (onAllocationChange) {
// // //             onAllocationChange(calculatedData.total);
// // //         }
        
// // //         // 2. Save the array with the new 'initialAllocation' back to the context.
// // //         // A deep comparison prevents an infinite loop.
// // //         if (JSON.stringify(deliveries) !== JSON.stringify(calculatedData.finalDeliveries)) {
// // //             setDeliveries(calculatedData.finalDeliveries);
// // //         }
// // //     }, [calculatedData, onAllocationChange, setDeliveries, deliveries]);


// // //     // --- Event Handlers ---
// // //     const showToast = (message, type = 'success') => setToast({ message, type, key: Date.now() });
// // //     const showModal = (info) => setModalInfo({ show: true, title: info.title, content: info.content });
// // //     const hideModal = () => setModalInfo({ show: false, title: '', content: '' });

// // //     const handleDeliveryChange = (id, field, value) => {
// // //         const newDeliveries = deliveries.map(d =>
// // //             d.id === id ? { ...d, [field]: value } : d
// // //         );
// // //         setDeliveries(newDeliveries);
// // //     };
    
// // //     const handleAddDelivery = () => {
// // //         const newId = deliveries.length > 0 ? Math.max(...deliveries.map(d => d.id)) + 1 : 1;
// // //         setDeliveries([...deliveries, {
// // //             id: newId, deliveryLocation: '', lecturer: '',
// // //             weeklyLectureTime: '', earlyCareerLoading: 'No'
// // //         }]);
// // //         setEditingId(newId);
// // //     };

// // //     const handleDeleteDelivery = (idToDelete) => {
// // //         if (window.confirm("Are you sure?")) {
// // //             setDeliveries(deliveries.filter(d => d.id !== idToDelete));
// // //         }
// // //     };

// // //     const handleSave = () => {
// // //         if (editingId !== null) {
// // //             showToast('Please save the currently editing row first.', 'error');
// // //             return;
// // //         }
// // //         showToast("Per Delivery Allocation Saved!", 'success');
// // //     };
    
// // //     const earlyCareerOptions = ["No", "Yes - materials provided", "Yes - materials need major rewriting", "Yes - no materials provided"];

// // //     // --- Render ---
// // //     return (
// // //         <div style={styles.container}>
// // //             {toast.message && <Toast key={toast.key} message={toast.message} type={toast.type} onClose={() => setToast({ message: ''})} />}
// // //             {modalInfo.show && <Modal title={modalInfo.title} content={modalInfo.content} onClose={hideModal} />}

// // //             <div style={styles.formGroup}>
// // //                 <label style={styles.label} htmlFor="totalAllocation">Per-delivery Allocation<InfoIcon onClick={() => showModal(PER_DELIVERY_INFO)} /></label>
// // //                 <input type="text" id="totalAllocation" readOnly style={styles.totalInput} value={`${(calculatedData.total * 100).toFixed(1)}%`} />
// // //             </div>

// // //             <div style={styles.formGroupWithBorder}>
// // //                 <label style={styles.label} htmlFor="firstOffering">First offering of the calendar year<InfoIcon onClick={() => showModal(FIRST_OFFERING_INFO)} /></label>
// // //                 <select id="firstOffering" style={styles.select} value={firstOfferingOfYear} onChange={(e) => setFirstOfferingOfYear(e.target.value)}>
// // //                     <option value="Yes">Yes</option>
// // //                     <option value="No">No</option>
// // //                 </select>
// // //             </div>

// // //             <div style={styles.tableActions}><button style={styles.addButton} onClick={handleAddDelivery}>+ Add</button></div>

// // //             <div style={styles.tableContainer}>
// // //                 <div style={styles.tableHeader}>
// // //                     <div style={{...styles.tableCell, flex: 0.5}}>Actions</div>
// // //                     <div style={{...styles.tableCell, flex: 1}}>Delivery</div>
// // //                     <div style={{...styles.tableCell, flex: 2}}>Lecturer / Campus Coordinator</div>
// // //                     <div style={{...styles.tableCell, flex: 2}}>Weekly lecture time (hours)</div>
// // //                     <div style={{...styles.tableCell, flex: 2.5}}>Early career academic loading</div>
// // //                     <div style={{...styles.tableCell, flex: 1, justifyContent: 'flex-end'}}>Allocation</div>
// // //                 </div>

// // //                 {calculatedData.finalDeliveries.map((delivery) => {
// // //                     const isEditing = editingId === delivery.id;
// // //                     return (
// // //                         <div key={delivery.id} style={styles.tableRow}>
// // //                             <div style={{...styles.tableCell, flex: 0.5, display: 'flex', gap: '8px' }}>
// // //                                 {isEditing ? (<SaveRowIcon onClick={() => setEditingId(null)} />) : (<EditIcon onClick={() => setEditingId(delivery.id)} />)}
// // //                                 <DeleteIcon onClick={() => handleDeleteDelivery(delivery.id)} />
// // //                             </div>
// // //                             <div style={{...styles.tableCell, flex: 1}}><input type="text" style={styles.tableInput} value={delivery.deliveryLocation} disabled={!isEditing} onChange={(e) => handleDeliveryChange(delivery.id, 'deliveryLocation', e.target.value)} /></div>
// // //                             <div style={{...styles.tableCell, flex: 2}}><input type="text" style={styles.tableInput} value={delivery.lecturer} disabled={!isEditing} onChange={(e) => handleDeliveryChange(delivery.id, 'lecturer', e.target.value)} /></div>
// // //                             <div style={{...styles.tableCell, flex: 2}}><input type="number" style={styles.tableInput} value={delivery.weeklyLectureTime} min="0" disabled={!isEditing} onChange={(e) => handleDeliveryChange(delivery.id, 'weeklyLectureTime', e.target.value)} /></div>
// // //                             <div style={{...styles.tableCell, flex: 2.5}}>
// // //                                 <select style={styles.tableSelect} value={delivery.earlyCareerLoading} disabled={!isEditing} onChange={(e) => handleDeliveryChange(delivery.id, 'earlyCareerLoading', e.target.value)} >
// // //                                     {earlyCareerOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
// // //                                 </select>
// // //                             </div>
// // //                             <div style={{...styles.tableCell, flex: 1, justifyContent: 'flex-end'}}>
// // //                                  <input type="text" readOnly style={{...styles.tableInput, ...styles.readOnlyInput}} value={`${(delivery.initialAllocation * 100).toFixed(1)}%`} />
// // //                             </div>
// // //                         </div>
// // //                     );
// // //                 })}
// // //             </div>

// // //             <div style={styles.footer}><button style={styles.saveButton} onClick={handleSave}>Save</button></div>
// // //         </div>
// // //     );
// // // }

// // // // --- Component-Specific Styles ---
// // // const styles = {
// // //     container: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', fontFamily: 'sans-serif' },
// // //     formGroup: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' },
// // //     formGroupWithBorder: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', border: '1px solid #dee2e6', padding: '1rem', borderRadius: '6px' },
// // //     label: { fontWeight: '500', color: '#495057', display: 'flex', alignItems: 'center' },
// // //     totalInput: { padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', backgroundColor: '#e9ecef', fontSize: '1rem', width: '100px', textAlign: 'center', fontWeight: 'bold' },
// // //     select: { padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', backgroundColor: '#fff', fontSize: '1rem', width: '200px' },
// // //     tableActions: { display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' },
// // //     addButton: { padding: '0.5rem 1.5rem', fontSize: '1rem', borderRadius: '6px', border: '1px solid #343a40', cursor: 'pointer', fontWeight: '600', backgroundColor: '#343a40', color: 'white' },
// // //     tableContainer: { border: '1px solid #dee2e6', borderRadius: '6px', overflow: 'hidden' },
// // //     tableHeader: { display: 'flex', backgroundColor: '#f8f9fa', fontWeight: '600', color: '#495057', borderBottom: '1px solid #dee2e6', padding: '0.75rem', fontSize: '0.9rem', textAlign: 'left' },
// // //     tableRow: { display: 'flex', alignItems: 'flex-start', borderBottom: '1px solid #e9ecef', padding: '0.5rem 0.75rem' },
// // //     tableCell: { padding: '0 0.5rem', display: 'flex', alignItems: 'center' },
// // //     tableInput: { width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', fontSize: '1rem', backgroundColor: '#fff' },
// // //     tableSelect: { width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', backgroundColor: '#fff', fontSize: '1rem' },
// // //     readOnlyInput: { backgroundColor: '#e9ecef', border: '1px solid #ced4da', textAlign: 'right' },
// // //     footer: { marginTop: '2rem' },
// // //     saveButton: { padding: '0.6rem 1.2rem', fontSize: '1rem', borderRadius: '6px', border: '1px solid #343a40', cursor: 'pointer', fontWeight: '600', backgroundColor: '#343a40', color: 'white' },
// // //     toast: { position: 'fixed', top: '20px', right: '20px', padding: '1rem 1.5rem', borderRadius: '6px', color: 'white', zIndex: 1000, boxShadow: '0 4px 8px rgba(0,0,0,0.1)', fontSize: '1rem' },
// // //     modalBackdrop: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1040 },
// // //     modalContent: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '90%', maxWidth: '600px', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)' },
// // //     modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #dee2e6', paddingBottom: '10px', marginBottom: '15px' },
// // //     modalCloseButton: { background: 'none', border: 'none', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', color: '#6c757d' },
// // //     modalBody: { maxHeight: '70vh', overflowY: 'auto' },
// // //     modalText: { whiteSpace: 'pre-wrap', fontSize: '1rem', lineHeight: '1.6', color: '#495057', margin: 0 },
// // // };

// // // const customStyles = document.createElement('style');
// // // customStyles.innerHTML = `
// // //     input:disabled, select:disabled {
// // //         background-color: #f8f9fa !important;
// // //         cursor: not-allowed;
// // //         opacity: 0.8;
// // //     }
// // //     input[type="number"]::-webkit-inner-spin-button, 
// // //     input[type="number"]::-webkit-outer-spin-button { 
// // //         -webkit-appearance: none; 
// // //         margin: 0; 
// // //     }
// // // `;
// // // document.head.appendChild(customStyles);

// // import React, { useState, useMemo, useEffect } from 'react';
// // import { useWorkload } from '../WorkloadContext';

// // // --- Helper Icon Components ---
// // const EditIcon = ({ onClick }) => ( <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', color: '#6c757d' }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg> );
// // const DeleteIcon = ({ onClick }) => ( <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', color: '#dc3545' }}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg> );
// // const SaveRowIcon = ({ onClick }) => ( <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', color: '#28a745' }}><polyline points="20 6 9 17 4 12"></polyline></svg> );
// // const InfoIcon = ({ onClick }) => ( <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#6c757d', marginLeft: '8px', verticalAlign: 'middle', cursor: 'pointer' }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg> );

// // // --- Helper UI Components ---
// // const Toast = ({ message, type, onClose }) => {
// //     useEffect(() => {
// //         const timer = setTimeout(onClose, 3000);
// //         return () => clearTimeout(timer);
// //     }, [onClose]);
// //     return <div style={{...styles.toast, backgroundColor: type === 'success' ? '#28a745' : '#dc3545'}}>{message}</div>;
// // };

// // const Modal = ({ title, content, onClose }) => (
// //     <div style={styles.modalBackdrop}>
// //         <div style={styles.modalContent}>
// //             <div style={styles.modalHeader}>
// //                 <h3 style={{ margin: 0 }}>{title}</h3>
// //                 <button onClick={onClose} style={styles.modalCloseButton}>×</button>
// //             </div>
// //             <div style={styles.modalBody}><p style={styles.modalText}>{content}</p></div>
// //         </div>
// //     </div>
// // );

// // // --- Constants for Modal Text (assuming they are defined as you had them) ---
// // const PER_DELIVERY_INFO = { title: "Per-delivery Allocation Information", content: `"List all deliveries and, for each delivery, indicate the lecturer, the weekly lecture (or large group class) time, and whether the lecturing staff member is an early career academic; see the SCDMS Work Plan Policy or the notes (tool tips) for the definition of “delivery”, “early career academic” and “weekly lecture time”.

// // The ""weekly lecture time"" is based on the average weekly large group classes (such as lectures) over the entire term; other arrangements such as fortnightly classes should be counted pro-rata.

// // Where an external delivery or a blended delivery in which all content is delivered
// // through vUWS is the only delivery of the subject in the given term, that delivery
// // is considered to be equivalent to a 1 hour lecture per week.

// // In all other situations, large group classes are counted as they are actually taught.

// //  - For a subject that has an external or blended delivery in addition to a live delivery (on campus or via Zoom), the external or blended delivery should be entered with a weekly lecture time of 0 hours.

// //  - For a subject that has live lectures taught across multiple campuses via Zoom, one delivery should be entered normally; the remaining deliveries should be entered with a weekly lecture time of 0 hours."			` };
// // const FIRST_OFFERING_INFO = { title: "First Offering Information", content: `The per-delivery allocation covers tasks at the large group level: (i) preparation of teaching materials for lectures or large group workshops [first delivery in each calendar year only]; (ii) lecture or large workshop delivery; (iii) subject coordination tasks that depend only on the number of deliveries, for instance, timetabling matters or campus coordination of lecturers and tutors; and (iv) any other matters arising from delivering the subject for a separate student cohort.` };

// // // --- Main Per-delivery Allocation Tab Component ---
// // export default function PerDeliveryAllocationTab({ term, onAllocationChange }) {
// //     // --- State Management ---
// //     const { deliveries, setDeliveries, firstOfferingOfYear, setFirstOfferingOfYear } = useWorkload();
// //     const [editingId, setEditingId] = useState(null);
// //     const [errors, setErrors] = useState({});
// //     const [toast, setToast] = useState({ message: '', type: '', key: 0 });
// //     const [modalInfo, setModalInfo] = useState({ show: false, title: '', content: '' });

// //     // --- Calculations with useMemo (This fixes the infinite loop) ---
// //     const calculatedData = useMemo(() => {
// //         const termMultiplier = 1.0;
        
// //         const getEarlyCareerBonus = (loadingType) => {
// //             const map = {
// //                 "Yes - materials provided": 0.02,
// //                 "Yes - materials need major rewriting": 0.03,
// //                 "Yes - no materials provided": 0.04,
// //             };
// //             return map[loadingType] || 0;
// //         };
        
// //         const calculateInitialAllocation = (delivery) => {
// //             const time = Number(delivery.weeklyLectureTime) || 0;
// //             const earlyCareerBonus = getEarlyCareerBonus(delivery.earlyCareerLoading);
// //             return (0.01 + (time * termMultiplier * 0.01) + earlyCareerBonus);
// //         };
        
// //         const deliveriesWithCalculations = deliveries.map(d => ({
// //             ...d,
// //             initialAllocation: calculateInitialAllocation(d)
// //         }));

// //         const sumOfIndividualAllocations = deliveriesWithCalculations.reduce((sum, d) => sum + d.initialAllocation, 0);

// //         let firstOfferingBonus = 0;
// //         if (firstOfferingOfYear === 'Yes' && deliveries.length > 0) {
// //             const maxLectureTime = Math.max(...deliveries.map(d => Number(d.weeklyLectureTime) || 0));
// //             firstOfferingBonus = 0.01 * termMultiplier * maxLectureTime;
// //         }

// //         const totalPerDeliveryAllocation = sumOfIndividualAllocations + firstOfferingBonus;
        
// //         return {
// //             total: totalPerDeliveryAllocation,
// //             finalDeliveries: deliveriesWithCalculations 
// //         };
// //     }, [deliveries, firstOfferingOfYear, term]);

// //     // --- Side Effect to sync data back to context and parent ---
// //     useEffect(() => {
// //         if (onAllocationChange) {
// //             onAllocationChange(calculatedData.total);
// //         }
        
// //         // Safely update the context only when data has actually changed
// //         if (JSON.stringify(deliveries) !== JSON.stringify(calculatedData.finalDeliveries)) {
// //             setDeliveries(calculatedData.finalDeliveries);
// //         }
// //     }, [calculatedData, onAllocationChange, setDeliveries, deliveries]);

// //     // --- Event Handlers (now work correctly) ---
// //     const showToast = (message, type = 'success') => setToast({ message, type, key: Date.now() });
// //     const showModal = (info) => setModalInfo({ show: true, title: info.title, content: info.content });
// //     const hideModal = () => setModalInfo({ show: false, title: '', content: '' });

// //     const handleDeliveryChange = (id, field, value) => {
// //         const newDeliveries = deliveries.map(d =>
// //             d.id === id ? { ...d, [field]: value } : d
// //         );
// //         setDeliveries(newDeliveries);
// //     };

// //     const handleAddDelivery = () => {
// //         const newId = deliveries.length > 0 ? Math.max(...deliveries.map(d => d.id)) + 1 : 1;
// //         setDeliveries([...deliveries, {
// //             id: newId, deliveryLocation: '', lecturer: '',
// //             weeklyLectureTime: '', earlyCareerLoading: 'No'
// //         }]);
// //         setEditingId(newId);
// //     };

// //     const handleDeleteDelivery = (idToDelete) => {
// //         if (window.confirm("Are you sure you want to delete this delivery?")) {
// //             setDeliveries(deliveries.filter(d => d.id !== idToDelete));
// //         }
// //     };
    
// //     const handleSaveRow = (id) => {
// //         setEditingId(null);
// //         showToast('Row saved!', 'success');
// //     };

// //     const handleSave = () => {
// //         if (editingId !== null) {
// //             showToast('Please save the currently editing row first.', 'error');
// //             return;
// //         }
// //         showToast("Per Delivery Allocation Saved!", 'success');
// //     };
    
// //     const earlyCareerOptions = ["No", "Yes - materials provided", "Yes - materials need major rewriting", "Yes - no materials provided"];

// //     // --- Render ---
// //     return (
// //         <div style={styles.container}>
// //             {toast.message && <Toast key={toast.key} message={toast.message} type={toast.type} onClose={() => setToast({ message: ''})} />}
// //             {modalInfo.show && <Modal title={modalInfo.title} content={modalInfo.content} onClose={hideModal} />}

// //             <div style={styles.formGroup}>
// //                 <label style={styles.label} htmlFor="totalAllocation">Per-delivery Allocation<InfoIcon onClick={() => showModal(PER_DELIVERY_INFO)} /></label>
// //                 <input type="text" id="totalAllocation" readOnly style={styles.totalInput} value={`${(calculatedData.total * 100).toFixed(1)}%`} />
// //             </div>

// //             <div style={styles.formGroupWithBorder}>
// //                 <label style={styles.label} htmlFor="firstOffering">First offering of the calendar year<InfoIcon onClick={() => showModal(FIRST_OFFERING_INFO)} /></label>
// //                 <select id="firstOffering" style={styles.select} value={firstOfferingOfYear} onChange={(e) => setFirstOfferingOfYear(e.target.value)}>
// //                     <option value="Yes">Yes</option>
// //                     <option value="No">No</option>
// //                 </select>
// //             </div>

// //             <div style={styles.tableActions}><button style={styles.addButton} onClick={handleAddDelivery}>+ Add</button></div>

// //             <div style={styles.tableContainer}>
// //                 <div style={styles.tableHeader}>
// //                     <div style={{...styles.tableCell, flex: 0.5}}>Actions</div>
// //                     <div style={{...styles.tableCell, flex: 1}}>Delivery</div>
// //                     <div style={{...styles.tableCell, flex: 2}}>Lecturer / Campus Coordinator</div>
// //                     <div style={{...styles.tableCell, flex: 2}}>Weekly lecture time (hours)</div>
// //                     <div style={{...styles.tableCell, flex: 2.5}}>Early career academic loading</div>
// //                     <div style={{...styles.tableCell, flex: 1, justifyContent: 'flex-end'}}>Allocation</div>
// //                 </div>

// //                 {calculatedData.finalDeliveries.map((delivery) => {
// //                     const isEditing = editingId === delivery.id;
// //                     return (
// //                         <div key={delivery.id} style={styles.tableRow}>
// //                             <div style={{...styles.tableCell, flex: 0.5, display: 'flex', gap: '8px' }}>
// //                                 {isEditing ? (<SaveRowIcon onClick={() => handleSaveRow(delivery.id)} />) : (<EditIcon onClick={() => setEditingId(delivery.id)} />)}
// //                                 <DeleteIcon onClick={() => handleDeleteDelivery(delivery.id)} />
// //                             </div>
// //                             <div style={{...styles.tableCell, flex: 1}}><input type="text" style={styles.tableInput} value={delivery.deliveryLocation} disabled={!isEditing} onChange={(e) => handleDeliveryChange(delivery.id, 'deliveryLocation', e.target.value)} /></div>
// //                             <div style={{...styles.tableCell, flex: 2}}><input type="text" style={styles.tableInput} value={delivery.lecturer} disabled={!isEditing} onChange={(e) => handleDeliveryChange(delivery.id, 'lecturer', e.target.value)} /></div>
// //                             <div style={{...styles.tableCell, flex: 2}}><input type="number" style={styles.tableInput} value={delivery.weeklyLectureTime} min="0" disabled={!isEditing} onChange={(e) => handleDeliveryChange(delivery.id, 'weeklyLectureTime', e.target.value)} /></div>
// //                             <div style={{...styles.tableCell, flex: 2.5}}>
// //                                 <select style={styles.tableSelect} value={delivery.earlyCareerLoading} disabled={!isEditing} onChange={(e) => handleDeliveryChange(delivery.id, 'earlyCareerLoading', e.target.value)} >
// //                                     {earlyCareerOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
// //                                 </select>
// //                             </div>
// //                             <div style={{...styles.tableCell, flex: 1, justifyContent: 'flex-end'}}>
// //                                  <input type="text" readOnly style={{...styles.tableInput, ...styles.readOnlyInput}} value={`${(delivery.initialAllocation * 100).toFixed(1)}%`} />
// //                             </div>
// //                         </div>
// //                     );
// //                 })}
// //             </div>

// //             <div style={styles.footer}><button style={styles.saveButton} onClick={handleSave}>Save</button></div>
// //         </div>
// //     );
// // }

// // // --- Component-Specific Styles ---
// // const styles = {
// //     container: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', fontFamily: 'sans-serif' },
// //     formGroup: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' },
// //     formGroupWithBorder: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', border: '1px solid #dee2e6', padding: '1rem', borderRadius: '6px' },
// //     label: { fontWeight: '500', color: '#495057', display: 'flex', alignItems: 'center' },
// //     totalInput: { padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', backgroundColor: '#e9ecef', fontSize: '1rem', width: '100px', textAlign: 'center', fontWeight: 'bold' },
// //     select: { padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', backgroundColor: '#fff', fontSize: '1rem', width: '200px' },
// //     tableActions: { display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' },
// //     addButton: { padding: '0.5rem 1.5rem', fontSize: '1rem', borderRadius: '6px', border: '1px solid #343a40', cursor: 'pointer', fontWeight: '600', backgroundColor: '#343a40', color: 'white' },
// //     tableContainer: { border: '1px solid #dee2e6', borderRadius: '6px', overflow: 'hidden' },
// //     tableHeader: { display: 'flex', backgroundColor: '#f8f9fa', fontWeight: '600', color: '#495057', borderBottom: '1px solid #dee2e6', padding: '0.75rem', fontSize: '0.9rem', textAlign: 'left' },
// //     tableRow: { display: 'flex', alignItems: 'flex-start', borderBottom: '1px solid #e9ecef', padding: '0.5rem 0.75rem' },
// //     tableCell: { padding: '0 0.5rem', display: 'flex', alignItems: 'center' },
// //     tableInput: { width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', fontSize: '1rem', backgroundColor: '#fff' },
// //     tableSelect: { width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', backgroundColor: '#fff', fontSize: '1rem' },
// //     readOnlyInput: { backgroundColor: '#e9ecef', border: '1px solid #ced4da', textAlign: 'right' },
// //     footer: { marginTop: '2rem' },
// //     saveButton: { padding: '0.6rem 1.2rem', fontSize: '1rem', borderRadius: '6px', border: '1px solid #343a40', cursor: 'pointer', fontWeight: '600', backgroundColor: '#343a40', color: 'white' },
// //     toast: { position: 'fixed', top: '20px', right: '20px', padding: '1rem 1.5rem', borderRadius: '6px', color: 'white', zIndex: 1000, boxShadow: '0 4px 8px rgba(0,0,0,0.1)', fontSize: '1rem' },
// //     modalBackdrop: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1040 },
// //     modalContent: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '90%', maxWidth: '600px', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)' },
// //     modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #dee2e6', paddingBottom: '10px', marginBottom: '15px' },
// //     modalCloseButton: { background: 'none', border: 'none', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', color: '#6c757d' },
// //     modalBody: { maxHeight: '70vh', overflowY: 'auto' },
// //     modalText: { whiteSpace: 'pre-wrap', fontSize: '1rem', lineHeight: '1.6', color: '#495057', margin: 0 },
// // };

// // const customStyles = document.createElement('style');
// // customStyles.innerHTML = `
// //     input:disabled, select:disabled {
// //         background-color: #f8f9fa !important;
// //         cursor: not-allowed;
// //         opacity: 0.8;
// //     }
// //     input[type="number"]::-webkit-inner-spin-button, 
// //     input[type="number"]::-webkit-outer-spin-button { 
// //         -webkit-appearance: none; 
// //         margin: 0; 
// //     }
// // `;
// // document.head.appendChild(customStyles);

// import React, { useState, useMemo, useEffect } from 'react';
// import { useWorkload } from '../WorkloadContext';

// // --- Helper Icon Components ---
// const EditIcon = ({ onClick, disabled }) => ( <svg onClick={!disabled ? onClick : undefined} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: disabled ? 'not-allowed' : 'pointer', color: '#6c757d', opacity: disabled ? 0.5 : 1 }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg> );
// const DeleteIcon = ({ onClick, disabled }) => ( <svg onClick={!disabled ? onClick : undefined} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: disabled ? 'not-allowed' : 'pointer', color: '#dc3545', opacity: disabled ? 0.5 : 1 }}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg> );
// const SaveRowIcon = ({ onClick }) => ( <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', color: '#28a745' }}><polyline points="20 6 9 17 4 12"></polyline></svg> );
// const CancelRowIcon = ({ onClick }) => ( <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', color: '#dc3545' }}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> );
// const InfoIcon = ({ onClick }) => ( <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#6c757d', marginLeft: '8px', verticalAlign: 'middle', cursor: 'pointer' }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg> );

// // --- Helper UI Components ---
// const Toast = ({ message, type, onClose }) => {
//     useEffect(() => {
//         const timer = setTimeout(onClose, 3000);
//         return () => clearTimeout(timer);
//     }, [onClose]);
//     return <div style={{...styles.toast, backgroundColor: type === 'success' ? '#28a745' : '#dc3545'}}>{message}</div>;
// };

// const Modal = ({ title, content, onClose }) => (
//     <div style={styles.modalBackdrop}>
//         <div style={styles.modalContent}>
//             <div style={styles.modalHeader}>
//                 <h3 style={{ margin: 0 }}>{title}</h3>
//                 <button onClick={onClose} style={styles.modalCloseButton}>×</button>
//             </div>
//             <div style={styles.modalBody}><p style={styles.modalText}>{content}</p></div>
//         </div>
//     </div>
// );

// // --- Constants for Modal Text ---
// const PER_DELIVERY_INFO = { title: "Per-delivery Allocation Information", content: `The per-delivery allocation covers tasks at the large group level:\n(i) preparation of teaching materials for lectures or large group workshops [first delivery in each calendar year only];\n(ii) lecture or large workshop delivery;\n(iii) subject coordination tasks that depend only on the number of deliveries, for instance, timetabling matters or campus coordination of lecturers and tutors; and\n(iv) any other matters arising from delivering the subject for a separate student cohort.` };
// const FIRST_OFFERING_INFO = { title: "First Offering Information", content: `List all deliveries and, for each delivery, indicate the lecturer, the weekly lecture (or large group class) time, and whether the lecturing staff member is an early career academic; see the SCDMS Work Plan Policy or the notes (tool tips) for the definition of “delivery”, “early career academic” and “weekly lecture time”.\n\nThe "weekly lecture time" is based on the average weekly large group classes (such as lectures) over the entire term; other arrangements such as fortnightly classes should be counted pro-rata.\n\nWhere an external delivery or a blended delivery in which all content is delivered through vUWS is the only delivery of the subject in the given term, that delivery is considered to be equivalent to a 1 hour lecture per week. In all other situations, large group classes are counted as they are actually taught.\n\n- For a subject that has an external or blended delivery in addition to a live delivery (on campus or via Zoom), the external or blended delivery should be entered with a weekly lecture time of 0 hours.\n- For a subject that has live lectures taught across multiple campuses via Zoom, one delivery should be entered normally; the remaining deliveries should be entered with a weekly lecture time of 0 hours.` };


// // --- Main Per-delivery Allocation Tab Component ---
// export default function PerDeliveryAllocationTab({ term, onAllocationChange }) {
//     // --- State Management ---
//     const { deliveries, setDeliveries, firstOfferingOfYear, setFirstOfferingOfYear } = useWorkload();
//     const [editingId, setEditingId] = useState(null);
//     const [editingDelivery, setEditingDelivery] = useState(null); // Holds temporary data for the row being edited
//     const [rowErrors, setRowErrors] = useState({});
//     const [toast, setToast] = useState({ message: '', type: '', key: 0 });
//     const [modalInfo, setModalInfo] = useState({ show: false, title: '', content: '' });

//     // --- Calculations ---
//     const calculatedData = useMemo(() => {
//         const termMultiplier = 1.0;
//         const getEarlyCareerBonus = (loadingType) => ({ "Yes - materials provided": 0.02, "Yes - materials need major rewriting": 0.03, "Yes - no materials provided": 0.04 })[loadingType] || 0;
//         const calculateInitialAllocation = (delivery) => (0.01 + (Number(delivery.weeklyLectureTime) || 0) * termMultiplier * 0.01) + getEarlyCareerBonus(delivery.earlyCareerLoading);
        
//         const finalDeliveries = deliveries.map(d => ({ ...d, initialAllocation: calculateInitialAllocation(d) }));
//         const sumOfIndividualAllocations = finalDeliveries.reduce((sum, d) => sum + d.initialAllocation, 0);
        
//         let firstOfferingBonus = 0;
//         if (firstOfferingOfYear === 'Yes' && deliveries.length > 0) {
//             const maxLectureTime = Math.max(...deliveries.map(d => Number(d.weeklyLectureTime) || 0));
//             firstOfferingBonus = 0.01 * termMultiplier * maxLectureTime;
//         }
//         return { total: sumOfIndividualAllocations + firstOfferingBonus, finalDeliveries };
//     }, [deliveries, firstOfferingOfYear, term]);

//     // --- Side Effect to sync total back to parent ---
//     useEffect(() => {
//         if (onAllocationChange) onAllocationChange(calculatedData.total);
//     }, [calculatedData.total, onAllocationChange]);

//     // --- Validation Logic ---
//     const validateDelivery = (delivery) => {
//         const errors = {};
//         const textRegex = /^[a-zA-Z\s]+$/;
//         if (!delivery.deliveryLocation.trim()) errors.deliveryLocation = 'Cannot be blank.';
//         else if (!textRegex.test(delivery.deliveryLocation)) errors.deliveryLocation = 'Invalid characters.';
//         if (!delivery.lecturer.trim()) errors.lecturer = 'Cannot be blank.';
//         else if (!textRegex.test(delivery.lecturer)) errors.lecturer = 'Invalid characters.';
//         const lectureTime = delivery.weeklyLectureTime;
//         if (String(lectureTime).trim() === '') errors.weeklyLectureTime = 'Cannot be blank.';
//         else if (isNaN(Number(lectureTime)) || Number(lectureTime) < 0) errors.weeklyLectureTime = 'Must be a positive number.';
//         return errors;
//     };

//     // --- Event Handlers ---
//     const showToast = (message, type = 'success') => setToast({ message, type, key: Date.now() });
//     const showModal = (info) => setModalInfo({ show: true, title: info.title, content: info.content });
//     const hideModal = () => setModalInfo({ show: false, title: '', content: '' });

//     const handleEditingChange = (field, value) => {
//         if (!editingDelivery) return;
//         const updatedDelivery = { ...editingDelivery, [field]: value };
//         setEditingDelivery(updatedDelivery);
//         setRowErrors(validateDelivery(updatedDelivery));
//     };

//     const handleAddDelivery = () => {
//         if (editingId) {
//             showToast('Please save or cancel your current edit first.', 'error');
//             return;
//         }
//         const newId = Date.now();
//         const newDelivery = { id: newId, deliveryLocation: '', lecturer: '', weeklyLectureTime: '', earlyCareerLoading: 'No' };
//         setEditingId(newId);
//         setEditingDelivery(newDelivery);
//         setRowErrors(validateDelivery(newDelivery));
//     };

//     const handleDeleteDelivery = (idToDelete) => {
//         if (window.confirm("Are you sure you want to delete this delivery?")) {
//             setDeliveries(deliveries.filter(d => d.id !== idToDelete));
//             showToast('Delivery deleted successfully.', 'success');
//         }
//     };
    
//     const handleEdit = (delivery) => {
//         setEditingId(delivery.id);
//         setEditingDelivery({ ...delivery });
//         setRowErrors({});
//     };

//     const handleCancelEdit = () => {
//         setEditingId(null);
//         setEditingDelivery(null);
//         setRowErrors({});
//     };

//     const handleSaveRow = () => {
//         const errors = validateDelivery(editingDelivery);
//         if (Object.keys(errors).length > 0) {
//             setRowErrors(errors);
//             showToast('Please fix the errors before saving.', 'error');
//             return;
//         }
        
//         const isNew = !deliveries.some(d => d.id === editingDelivery.id);
//         if (isNew) {
//             setDeliveries([...deliveries, editingDelivery]);
//         } else {
//             setDeliveries(deliveries.map(d => d.id === editingDelivery.id ? editingDelivery : d));
//         }
        
//         handleCancelEdit(); // Reset editing state
//         showToast('Row saved!', 'success');
//     };

//     const handleSave = () => {
//         if (editingId !== null) {
//             showToast('Please save the currently editing row first.', 'error');
//             return;
//         }
//         showToast("Per Delivery Allocations Saved!", 'success');
//     };
    
//     const earlyCareerOptions = ["No", "Yes - materials provided", "Yes - materials need major rewriting", "Yes - no materials provided"];

//     const deliveriesToRender = useMemo(() => {
//         if (editingDelivery && !deliveries.some(d => d.id === editingDelivery.id)) {
//             return [...calculatedData.finalDeliveries, editingDelivery];
//         }
//         return calculatedData.finalDeliveries;
//     }, [calculatedData.finalDeliveries, editingDelivery, deliveries]);

//     return (
//         <div style={styles.container}>
//             {toast.message && <Toast key={toast.key} message={toast.message} type={toast.type} onClose={() => setToast({ message: ''})} />}
//             {modalInfo.show && <Modal title={modalInfo.title} content={modalInfo.content} onClose={hideModal} />}

//             <div style={styles.formGroup}>
//                 <label style={styles.label}>Per-delivery Allocation<InfoIcon onClick={() => showModal(PER_DELIVERY_INFO)} /></label>
//                 <input type="text" readOnly style={styles.totalInput} value={`${(calculatedData.total * 100).toFixed(1)}%`} />
//             </div>

//             <div style={styles.formGroupWithBorder}>
//                 <label style={styles.label}>First offering of the calendar year<InfoIcon onClick={() => showModal(FIRST_OFFERING_INFO)} /></label>
//                 <select style={styles.select} value={firstOfferingOfYear} onChange={(e) => setFirstOfferingOfYear(e.target.value)}>
//                     <option value="Yes">Yes</option>
//                     <option value="No">No</option>
//                 </select>
//             </div>

//             <div style={styles.tableActions}>
//                 <button style={{...styles.addButton, opacity: editingId ? 0.5 : 1}} onClick={handleAddDelivery} disabled={!!editingId}>+ Add Delivery</button>
//             </div>

//             <div style={styles.tableContainer}>
//                 <div style={styles.tableHeader}>
//                     <div style={{...styles.tableCell, flex: 0.7}}>Actions</div>
//                     <div style={{...styles.tableCell, flex: 1.5}}>Delivery</div>
//                     <div style={{...styles.tableCell, flex: 2}}>Lecturer / Campus Coordinator</div>
//                     <div style={{...styles.tableCell, flex: 1.5}}>Weekly lecture time (hours)</div>
//                     <div style={{...styles.tableCell, flex: 2}}>Early career academic loading</div>
//                     <div style={{...styles.tableCell, flex: 1, justifyContent: 'flex-end'}}>Allocation</div>
//                 </div>

//                 {deliveriesToRender.map((delivery) => {
//                     const isEditing = editingId === delivery.id;
//                     const data = isEditing ? editingDelivery : delivery;
//                     const errors = isEditing ? rowErrors : {};

//                     return (
//                         <div key={delivery.id} style={styles.tableRow}>
//                             <div style={{...styles.tableCell, flex: 0.7, display: 'flex', gap: '12px' }}>
//                                 {isEditing ? (
//                                     <>
//                                         <SaveRowIcon onClick={handleSaveRow} />
//                                         <CancelRowIcon onClick={handleCancelEdit} />
//                                     </>
//                                 ) : (
//                                     <>
//                                         <EditIcon onClick={() => handleEdit(delivery)} disabled={!!editingId} />
//                                         <DeleteIcon onClick={() => handleDeleteDelivery(delivery.id)} disabled={!!editingId} />
//                                     </>
//                                 )}
//                             </div>
//                             <div style={{...styles.tableCell, flex: 1.5, flexDirection: 'column', alignItems: 'flex-start'}}>
//                                 <input type="text" style={{...styles.tableInput, ...(errors.deliveryLocation && styles.invalidInput)}} value={data.deliveryLocation} disabled={!isEditing} onChange={(e) => handleEditingChange('deliveryLocation', e.target.value)} />
//                                 {errors.deliveryLocation && <span style={styles.errorText}>{errors.deliveryLocation}</span>}
//                             </div>
//                             <div style={{...styles.tableCell, flex: 2, flexDirection: 'column', alignItems: 'flex-start'}}>
//                                 <input type="text" style={{...styles.tableInput, ...(errors.lecturer && styles.invalidInput)}} value={data.lecturer} disabled={!isEditing} onChange={(e) => handleEditingChange('lecturer', e.target.value)} />
//                                 {errors.lecturer && <span style={styles.errorText}>{errors.lecturer}</span>}
//                             </div>
//                             <div style={{...styles.tableCell, flex: 1.5, flexDirection: 'column', alignItems: 'flex-start'}}>
//                                 <input type="number" style={{...styles.tableInput, ...(errors.weeklyLectureTime && styles.invalidInput)}} value={data.weeklyLectureTime} min="0" disabled={!isEditing} onChange={(e) => handleEditingChange('weeklyLectureTime', e.target.value)} />
//                                 {errors.weeklyLectureTime && <span style={styles.errorText}>{errors.weeklyLectureTime}</span>}
//                             </div>
//                             <div style={{...styles.tableCell, flex: 2}}>
//                                 <select style={styles.tableSelect} value={data.earlyCareerLoading} disabled={!isEditing} onChange={(e) => handleEditingChange('earlyCareerLoading', e.target.value)} >
//                                     {earlyCareerOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//                                 </select>
//                             </div>
//                             <div style={{...styles.tableCell, flex: 1, justifyContent: 'flex-end'}}>
//                                  <input type="text" readOnly style={{...styles.tableInput, ...styles.readOnlyInput}} value={`${(delivery.initialAllocation * 100 || 0).toFixed(1)}%`} />
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>

//             <div style={styles.footer}><button style={styles.saveButton} onClick={handleSave}>Save All</button></div>
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
//     tableHeader: { display: 'flex', backgroundColor: '#f8f9fa', fontWeight: '600', color: '#495057', borderBottom: '1px solid #dee2e6', padding: '0.75rem', fontSize: '0.9rem', textAlign: 'left' },
//     tableRow: { display: 'flex', alignItems: 'flex-start', borderBottom: '1px solid #e9ecef', padding: '0.5rem 0.75rem' },
//     tableCell: { padding: '0 0.5rem', display: 'flex', alignItems: 'center' },
//     tableInput: { width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', fontSize: '1rem', backgroundColor: '#fff' },
//     tableSelect: { width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', backgroundColor: '#fff', fontSize: '1rem' },
//     readOnlyInput: { backgroundColor: '#e9ecef', border: '1px solid #ced4da', textAlign: 'right' },
//     footer: { marginTop: '2rem' },
//     saveButton: { padding: '0.6rem 1.2rem', fontSize: '1rem', borderRadius: '6px', border: '1px solid #343a40', cursor: 'pointer', fontWeight: '600', backgroundColor: '#343a40', color: 'white' },
//     toast: { position: 'fixed', top: '20px', right: '20px', padding: '1rem 1.5rem', borderRadius: '6px', color: 'white', zIndex: 1000, boxShadow: '0 4px 8px rgba(0,0,0,0.1)', fontSize: '1rem' },
//     modalBackdrop: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1040 },
//     modalContent: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '90%', maxWidth: '600px', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)' },
//     modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #dee2e6', paddingBottom: '10px', marginBottom: '15px' },
//     modalCloseButton: { background: 'none', border: 'none', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', color: '#6c757d' },
//     modalBody: { maxHeight: '70vh', overflowY: 'auto' },
//     modalText: { whiteSpace: 'pre-wrap', fontSize: '1rem', lineHeight: '1.6', color: '#495057', margin: 0 },
//     errorText: { color: '#dc3545', fontSize: '0.8rem', marginTop: '4px', width: '100%', textAlign: 'left' },
//     invalidInput: { borderColor: '#dc3545' },
// };

// const customStyles = document.createElement('style');
// customStyles.innerHTML = `
//     input:disabled, select:disabled {
//         background-color: #f8f9fa !important;
//         cursor: not-allowed;
//         opacity: 0.8;
//     }
//     input[type="number"]::-webkit-inner-spin-button, 
//     input[type="number"]::-webkit-outer-spin-button { 
//         -webkit-appearance: none; 
//         margin: 0; 
//     }
// `;
// document.head.appendChild(customStyles);


import React, { useState, useMemo, useEffect } from 'react';

import { useWorkload } from '../WorkloadContext';



// --- Helper Icon Components ---

const EditIcon = ({ onClick, disabled }) => ( <svg onClick={!disabled ? onClick : undefined} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: disabled ? 'not-allowed' : 'pointer', color: '#6c757d', opacity: disabled ? 0.5 : 1 }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg> );

const DeleteIcon = ({ onClick, disabled }) => ( <svg onClick={!disabled ? onClick : undefined} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: disabled ? 'not-allowed' : 'pointer', color: '#dc3545', opacity: disabled ? 0.5 : 1 }}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg> );

const SaveRowIcon = ({ onClick }) => ( <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', color: '#28a745' }}><polyline points="20 6 9 17 4 12"></polyline></svg> );

const CancelRowIcon = ({ onClick }) => ( <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', color: '#dc3545' }}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> );

const InfoIcon = ({ onClick }) => ( <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#6c757d', marginLeft: '8px', verticalAlign: 'middle', cursor: 'pointer' }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg> );



// --- Helper UI Components ---

const Toast = ({ message, type, onClose }) => {

useEffect(() => {

const timer = setTimeout(onClose, 3000);

return () => clearTimeout(timer);

}, [onClose]);

return <div style={{...styles.toast, backgroundColor: type === 'success' ? '#28a745' : '#dc3545'}}>{message}</div>;

};



const Modal = ({ title, content, onClose }) => (

<div style={styles.modalBackdrop}>

<div style={styles.modalContent}>

<div style={styles.modalHeader}>

<h3 style={{ margin: 0 }}>{title}</h3>

<button onClick={onClose} style={styles.modalCloseButton}>×</button>

</div>

<div style={styles.modalBody}><p style={styles.modalText}>{content}</p></div>

</div>

</div>

);



// --- Constants for Modal Text ---

const PER_DELIVERY_INFO = { title: "Per-delivery Allocation Information", content: `The per-delivery allocation covers tasks at the large group level:\n(i) preparation of teaching materials for lectures or large group workshops [first delivery in each calendar year only];\n(ii) lecture or large workshop delivery;\n(iii) subject coordination tasks that depend only on the number of deliveries, for instance, timetabling matters or campus coordination of lecturers and tutors; and\n(iv) any other matters arising from delivering the subject for a separate student cohort.` };

const FIRST_OFFERING_INFO = { title: "First Offering Information", content: `List all deliveries and, for each delivery, indicate the lecturer, the weekly lecture (or large group class) time, and whether the lecturing staff member is an early career academic; see the SCDMS Work Plan Policy or the notes (tool tips) for the definition of “delivery”, “early career academic” and “weekly lecture time”.\n\nThe "weekly lecture time" is based on the average weekly large group classes (such as lectures) over the entire term; other arrangements such as fortnightly classes should be counted pro-rata.\n\nWhere an external delivery or a blended delivery in which all content is delivered through vUWS is the only delivery of the subject in the given term, that delivery is considered to be equivalent to a 1 hour lecture per week. In all other situations, large group classes are counted as they are actually taught.\n\n- For a subject that has an external or blended delivery in addition to a live delivery (on campus or via Zoom), the external or blended delivery should be entered with a weekly lecture time of 0 hours.\n- For a subject that has live lectures taught across multiple campuses via Zoom, one delivery should be entered normally; the remaining deliveries should be entered with a weekly lecture time of 0 hours.` };





// --- Main Per-delivery Allocation Tab Component ---

export default function PerDeliveryAllocationTab({ term, onAllocationChange }) {

// --- State Management ---

const { deliveries, setDeliveries, firstOfferingOfYear, setFirstOfferingOfYear } = useWorkload();

const [editingId, setEditingId] = useState(null);

const [editingDelivery, setEditingDelivery] = useState(null); // Holds temporary data for the row being edited

const [rowErrors, setRowErrors] = useState({});

const [toast, setToast] = useState({ message: '', type: '', key: 0 });

const [modalInfo, setModalInfo] = useState({ show: false, title: '', content: '' });



// --- Calculations ---

const calculatedData = useMemo(() => {

const termMultiplier = 1.0;

const getEarlyCareerBonus = (loadingType) => ({ "Yes - materials provided": 0.02, "Yes - materials need major rewriting": 0.03, "Yes - no materials provided": 0.04 })[loadingType] || 0;

const calculateInitialAllocation = (delivery) => (0.01 + (Number(delivery.weeklyLectureTime) || 0) * termMultiplier * 0.01) + getEarlyCareerBonus(delivery.earlyCareerLoading);


const finalDeliveries = deliveries.map(d => ({ ...d, initialAllocation: calculateInitialAllocation(d) }));

const sumOfIndividualAllocations = finalDeliveries.reduce((sum, d) => sum + d.initialAllocation, 0);


let firstOfferingBonus = 0;

if (firstOfferingOfYear === 'Yes' && deliveries.length > 0) {

const maxLectureTime = Math.max(...deliveries.map(d => Number(d.weeklyLectureTime) || 0));

firstOfferingBonus = 0.01 * termMultiplier * maxLectureTime;

}

return { total: sumOfIndividualAllocations + firstOfferingBonus, finalDeliveries };

}, [deliveries, firstOfferingOfYear, term]);



// --- Side Effect to sync total back to parent ---

useEffect(() => {

if (onAllocationChange) onAllocationChange(calculatedData.total);

}, [calculatedData.total, onAllocationChange]);



// --- Validation Logic ---

const validateDelivery = (delivery) => {

const errors = {};

const textRegex = /^[a-zA-Z\s]+$/;

if (!delivery.deliveryLocation.trim()) errors.deliveryLocation = 'Cannot be blank.';

else if (!textRegex.test(delivery.deliveryLocation)) errors.deliveryLocation = 'Invalid characters.';

if (!delivery.lecturer.trim()) errors.lecturer = 'Cannot be blank.';

else if (!textRegex.test(delivery.lecturer)) errors.lecturer = 'Invalid characters.';

const lectureTime = delivery.weeklyLectureTime;

if (String(lectureTime).trim() === '') errors.weeklyLectureTime = 'Cannot be blank.';

else if (isNaN(Number(lectureTime)) || Number(lectureTime) < 0) errors.weeklyLectureTime = 'Must be a positive number.';

return errors;

};



// --- Event Handlers ---

const showToast = (message, type = 'success') => setToast({ message, type, key: Date.now() });

const showModal = (info) => setModalInfo({ show: true, title: info.title, content: info.content });

const hideModal = () => setModalInfo({ show: false, title: '', content: '' });



const handleEditingChange = (field, value) => {

if (!editingDelivery) return;

const updatedDelivery = { ...editingDelivery, [field]: value };

setEditingDelivery(updatedDelivery);

setRowErrors(validateDelivery(updatedDelivery));

};



const handleAddDelivery = () => {

if (editingId) {

showToast('Please save or cancel your current edit first.', 'error');

return;

}

const newId = Date.now();

const newDelivery = { id: newId, deliveryLocation: '', lecturer: '', weeklyLectureTime: '', earlyCareerLoading: 'No' };

setEditingId(newId);

setEditingDelivery(newDelivery);

setRowErrors(validateDelivery(newDelivery));

};



const handleDeleteDelivery = (idToDelete) => {

if (window.confirm("Are you sure you want to delete this delivery?")) {

setDeliveries(deliveries.filter(d => d.id !== idToDelete));

showToast('Delivery deleted successfully.', 'success');

}

};


const handleEdit = (delivery) => {

setEditingId(delivery.id);

setEditingDelivery({ ...delivery });

setRowErrors({});

};



const handleCancelEdit = () => {

setEditingId(null);

setEditingDelivery(null);

setRowErrors({});

};



const handleSaveRow = () => {

const errors = validateDelivery(editingDelivery);

if (Object.keys(errors).length > 0) {

setRowErrors(errors);

showToast('Please fix the errors before saving.', 'error');

return;

}


const isNew = !deliveries.some(d => d.id === editingDelivery.id);

if (isNew) {

setDeliveries([...deliveries, editingDelivery]);

} else {

setDeliveries(deliveries.map(d => d.id === editingDelivery.id ? editingDelivery : d));

}


handleCancelEdit(); // Reset editing state

showToast('Row saved!', 'success');

};



const handleSave = () => {

if (editingId !== null) {

showToast('Please save the currently editing row first.', 'error');

return;

}

showToast("Per Delivery Allocations Saved!", 'success');

};


const earlyCareerOptions = ["No", "Yes - materials provided", "Yes - materials need major rewriting", "Yes - no materials provided"];



const deliveriesToRender = useMemo(() => {

if (editingDelivery && !deliveries.some(d => d.id === editingDelivery.id)) {

return [...calculatedData.finalDeliveries, editingDelivery];

}

return calculatedData.finalDeliveries;

}, [calculatedData.finalDeliveries, editingDelivery, deliveries]);



return (

<div style={styles.container}>

{toast.message && <Toast key={toast.key} message={toast.message} type={toast.type} onClose={() => setToast({ message: ''})} />}

{modalInfo.show && <Modal title={modalInfo.title} content={modalInfo.content} onClose={hideModal} />}



<div style={styles.formGroup}>

<label style={styles.label}>Per-delivery Allocation<InfoIcon onClick={() => showModal(PER_DELIVERY_INFO)} /></label>

<input type="text" readOnly style={styles.totalInput} value={`${(calculatedData.total * 100).toFixed(1)}%`} />

</div>



<div style={styles.formGroupWithBorder}>

<label style={styles.label}>First offering of the calendar year<InfoIcon onClick={() => showModal(FIRST_OFFERING_INFO)} /></label>

<select style={styles.select} value={firstOfferingOfYear} onChange={(e) => setFirstOfferingOfYear(e.target.value)}>

<option value="Yes">Yes</option>

<option value="No">No</option>

</select>

</div>



<div style={styles.tableActions}>

<button style={{...styles.addButton, opacity: editingId ? 0.5 : 1}} onClick={handleAddDelivery} disabled={!!editingId}>+ Add Delivery</button>

</div>



<div style={styles.tableContainer}>

<div style={styles.tableHeader}>

<div style={{...styles.tableCell, flex: 0.7}}>Actions</div>

<div style={{...styles.tableCell, flex: 1.5}}>Delivery</div>

<div style={{...styles.tableCell, flex: 2}}>Lecturer / Campus Coordinator</div>

<div style={{...styles.tableCell, flex: 1.5}}>Weekly lecture time (hours)</div>

<div style={{...styles.tableCell, flex: 2}}>Early career academic loading</div>

<div style={{...styles.tableCell, flex: 1, justifyContent: 'flex-end'}}>Allocation</div>

</div>



{deliveriesToRender.map((delivery) => {

const isEditing = editingId === delivery.id;

const data = isEditing ? editingDelivery : delivery;

const errors = isEditing ? rowErrors : {};



return (

<div key={delivery.id} style={styles.tableRow}>

<div style={{...styles.tableCell, flex: 0.7, display: 'flex', gap: '12px' }}>

{isEditing ? (

<>

<SaveRowIcon onClick={handleSaveRow} />

<CancelRowIcon onClick={handleCancelEdit} />

</>

) : (

<>

<EditIcon onClick={() => handleEdit(delivery)} disabled={!!editingId} />

<DeleteIcon onClick={() => handleDeleteDelivery(delivery.id)} disabled={!!editingId} />

</>

)}

</div>

<div style={{...styles.tableCell, flex: 1.5, flexDirection: 'column', alignItems: 'flex-start'}}>

<input type="text" style={{...styles.tableInput, ...(errors.deliveryLocation && styles.invalidInput)}} value={data.deliveryLocation} disabled={!isEditing} onChange={(e) => handleEditingChange('deliveryLocation', e.target.value)} />

{errors.deliveryLocation && <span style={styles.errorText}>{errors.deliveryLocation}</span>}

</div>

<div style={{...styles.tableCell, flex: 2, flexDirection: 'column', alignItems: 'flex-start'}}>

<input type="text" style={{...styles.tableInput, ...(errors.lecturer && styles.invalidInput)}} value={data.lecturer} disabled={!isEditing} onChange={(e) => handleEditingChange('lecturer', e.target.value)} />

{errors.lecturer && <span style={styles.errorText}>{errors.lecturer}</span>}

</div>

<div style={{...styles.tableCell, flex: 1.5, flexDirection: 'column', alignItems: 'flex-start'}}>

<input type="number" style={{...styles.tableInput, ...(errors.weeklyLectureTime && styles.invalidInput)}} value={data.weeklyLectureTime} min="0" disabled={!isEditing} onChange={(e) => handleEditingChange('weeklyLectureTime', e.target.value)} />

{errors.weeklyLectureTime && <span style={styles.errorText}>{errors.weeklyLectureTime}</span>}

</div>

<div style={{...styles.tableCell, flex: 2}}>

<select style={styles.tableSelect} value={data.earlyCareerLoading} disabled={!isEditing} onChange={(e) => handleEditingChange('earlyCareerLoading', e.target.value)} >

{earlyCareerOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}

</select>

</div>

<div style={{...styles.tableCell, flex: 1, justifyContent: 'flex-end'}}>

<input type="text" readOnly style={{...styles.tableInput, ...styles.readOnlyInput}} value={`${(delivery.initialAllocation * 100 || 0).toFixed(1)}%`} />

</div>

</div>

);

})}

</div>



<div style={styles.footer}><button style={styles.saveButton} onClick={handleSave}>Save All</button></div>

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

tableInput: { width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', fontSize: '1rem', backgroundColor: '#fff' },

tableSelect: { width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', backgroundColor: '#fff', fontSize: '1rem' },

readOnlyInput: { backgroundColor: '#e9ecef', border: '1px solid #ced4da', textAlign: 'right' },

footer: { marginTop: '2rem' },

saveButton: { padding: '0.6rem 1.2rem', fontSize: '1rem', borderRadius: '6px', border: '1px solid #343a40', cursor: 'pointer', fontWeight: '600', backgroundColor: '#343a40', color: 'white' },

toast: { position: 'fixed', top: '20px', right: '20px', padding: '1rem 1.5rem', borderRadius: '6px', color: 'white', zIndex: 1000, boxShadow: '0 4px 8px rgba(0,0,0,0.1)', fontSize: '1rem' },

modalBackdrop: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1040 },

modalContent: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '90%', maxWidth: '600px', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)' },

modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #dee2e6', paddingBottom: '10px', marginBottom: '15px' },

modalCloseButton: { background: 'none', border: 'none', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', color: '#6c757d' },

modalBody: { maxHeight: '70vh', overflowY: 'auto' },

modalText: { whiteSpace: 'pre-wrap', fontSize: '1rem', lineHeight: '1.6', color: '#495057', margin: 0 },

errorText: { color: '#dc3545', fontSize: '0.8rem', marginTop: '4px', width: '100%', textAlign: 'left' },

invalidInput: { borderColor: '#dc3545' },

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

`;

document.head.appendChild(customStyles);