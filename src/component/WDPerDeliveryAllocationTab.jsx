

import React, { useState, useMemo, useEffect } from 'react';
import { useWorkload } from '../WorkloadContext';

// --- Icon Components ---
const EditIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> );
const InfoIcon = ({ onClick }) => ( <svg onClick={onClick} style={{ cursor: 'pointer' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> );
const SaveIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> );
const CancelIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> );

// --- NEW: Info Modal Component ---
const InfoModal = ({ onClose, content }) => (
    <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
            <h4 style={styles.modalTitle}>Per-delivery Allocation Information</h4>
            <p style={styles.modalText}>{content}</p>
            <div style={styles.modalActions}>
                <button onClick={onClose} style={styles.saveButton}>Close</button>
            </div>
        </div>
    </div>
);

export default function WDPerDeliveryAllocationTab({ subject }) {
    const { deliveries, setDeliveries } = useWorkload();
    const [componentAllocations, setComponentAllocations] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [error, setError] = useState('');
    const [showInfoModal, setShowInfoModal] = useState(false); // State for modal visibility

    useEffect(() => {
        const initialData = deliveries.map(delivery => {
        
        // --- THIS CALCULATION WAS MISSING ---
        // It calculates the initial allocation based on lecture time.
        const time = Number(delivery.weeklyLectureTime) || 0;
        // The formula gives a 1% base + 1% for each hour of lecture time.
        const calculatedInitialAllocation = 0.01 + (time * 0.01); 
        // --- END OF MISSING CALCULATION ---

        return {
            ...delivery,
            initialAllocation: calculatedInitialAllocation, // Add the calculated value here
            allocationToSubjectCoordinationTeam: delivery.allocationToSubjectCoordinationTeam ?? 0.00,
        };
    });
    setComponentAllocations(initialData);
        // const initialData = deliveries.map(delivery => ({
        //     ...delivery,
        //     allocationToSubjectCoordinationTeam: delivery.allocationToSubjectCoordinationTeam || 0.005,
        // }));
        // setComponentAllocations(initialData);
    }, [deliveries]);

    const calculationInputs = subject?.calculationInputs || {};
    const subjectCoordinatorName = subject?.subjectCoordinator || 'N/A';
    
    const calculatedData = useMemo(() => {
        const lecturerAllocations = componentAllocations.map(row => 
            Math.max(0, (row.initialAllocation || 0) - row.allocationToSubjectCoordinationTeam)
        );

        const increaseOfBaseAllocation = componentAllocations.reduce((sum, row) => 
            sum + row.allocationToSubjectCoordinationTeam, 0
        );

        const isFirstOffering = subject?.firstOfferingOfYear === 'Yes'; 
        let subjectCoordinatorAllocation = 0;
        if (isFirstOffering && increaseOfBaseAllocation > 0) {
            const maxWeeklyLectureTime = Math.max(0, ...componentAllocations.map(d => d.weeklyLectureTime || 0));
            subjectCoordinatorAllocation = 0.01 * maxWeeklyLectureTime;
        }
        
        return { 
            lecturerAllocations,
            increaseOfBaseAllocation, 
            subjectCoordinatorAllocation 
        };
    }, [componentAllocations, subject]);

    const handleEdit = (row) => {
        setEditingId(row.id);
        setEditValue(String((row.allocationToSubjectCoordinationTeam * 100)));
        setError('');
    };

    const handleCancel = () => {
        setEditingId(null);
        setError('');
    };

    const handleSave = () => {
        const numericValue = parseFloat(editValue || '0');
        const editingRow = componentAllocations.find(row => row.id === editingId);
        const initialAllocPercent = (editingRow.initialAllocation || 0) * 100;

        if (isNaN(numericValue) || numericValue < 0 || numericValue > initialAllocPercent) {
            setError(`Value must be between 0 and ${initialAllocPercent.toFixed(1)}.`);
            return;
        }

        const updatedAllocations = componentAllocations.map(row => 
            row.id === editingId 
            ? { ...row, allocationToSubjectCoordinationTeam: numericValue / 100 } 
            : row
        );
        
        setComponentAllocations(updatedAllocations);
        setDeliveries(updatedAllocations);
        setEditingId(null);
        setError('');
    };

    const handleInputChange = (e) => {
        setEditValue(e.target.value);
        if (error) setError('');
    };
    
    const PER_DELIVERY_INFO_TEXT = "The per-delivery allocation covers tasks at the large group level: (i) preparation of teaching materials for lectures or large group workshops [first delivery in each calendar year only]; (ii) lecture or large workshop delivery; (iii) subject coordination tasks that depend only on the number of deliveries, for instance, timetabling matters or campus coordination of lecturers and tutors; and (iv) any other matters arising from delivering the subject for a separate student cohort.";

    return (
        <div style={styles.tabContentContainer}>
            {/* Conditionally render the modal */}
            {showInfoModal && <InfoModal onClose={() => setShowInfoModal(false)} content={PER_DELIVERY_INFO_TEXT} />}
            
            <h3 style={styles.tabTitle}>
                Per-delivery Allocation 
                <InfoIcon onClick={() => setShowInfoModal(true)} />
            </h3>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={{...styles.tableHeaderCell, width: '80px', textAlign: 'center'}}>Actions</th>
                        <th style={styles.tableHeaderCell}>Delivery</th>
                        <th style={styles.tableHeaderCell}>Campus Coordinator</th>
                        <th style={{...styles.tableHeaderCell, textAlign: 'right'}}>Allocation to Subject Coordination Team</th>
                        <th style={{...styles.tableHeaderCell, textAlign: 'right'}}>Allocation</th>
                    </tr>
                </thead>
                <tbody>
                    {componentAllocations.map((row, index) => {
                        const isEditing = editingId === row.id;
                        const lecturerAllocation = calculatedData.lecturerAllocations[index];

                        return (
                            <tr key={row.id} style={styles.tableRow}>
                                <td style={{...styles.tableCell, textAlign: 'center'}}>
                                    {isEditing ? (
                                        <div style={{display: 'flex', justifyContent: 'center', gap: '1rem'}}>
                                            <button style={styles.iconButton} onClick={handleSave} title="Save"><SaveIcon /></button>
                                            <button style={styles.iconButton} onClick={handleCancel} title="Cancel"><CancelIcon /></button>
                                        </div>
                                    ) : (
                                        <button style={styles.iconButton} onClick={() => handleEdit(row)} title="Edit"><EditIcon /></button>
                                    )}
                                </td>
                                <td style={styles.tableCell}>{row.deliveryLocation}</td>
                                <td style={styles.tableCell}>{row.lecturer}</td>
                                <td style={{...styles.tableCell, textAlign: 'right'}}>
                                    {isEditing ? (
                                       <div>
                                            <input 
                                                type="number" value={editValue} onChange={handleInputChange}
                                                style={error ? {...styles.input, ...styles.inputError} : styles.input}
                                                min="0" max={(row.initialAllocation || 0) * 100} step="0.1"
                                            />
                                            {error && <small style={styles.errorMessage}>{error}</small>}
                                        </div>
                                    ) : (
                                        `${(row.allocationToSubjectCoordinationTeam * 100).toFixed(1)}%`
                                    )}
                                </td>
                                <td style={{...styles.tableCell, textAlign: 'right', fontWeight: '500'}}>
                                    {(lecturerAllocation * 100).toFixed(1)}%
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot style={styles.tableFooter}>
                    <tr>
                        <td colSpan="4" style={styles.summaryCellLabel}>Increase of base allocation</td>
                        <td style={{...styles.summaryCellValue, textAlign: 'right'}}>{(calculatedData.increaseOfBaseAllocation * 100).toFixed(1)}%</td>
                    </tr>
                    <tr>
                        <td colSpan="4" style={styles.summaryCellLabel}>Allocation to Subject Coordinator: {subjectCoordinatorName}</td>
                        <td style={{...styles.summaryCellValue, textAlign: 'right'}}>{(calculatedData.subjectCoordinatorAllocation * 100).toFixed(2)}%</td>
                    </tr>
                </tfoot>
            </table>
            <div style={styles.tabActions}>
                <button style={styles.saveButton}>Save</button>
            </div>
        </div>
    );
}

// --- INLINE STYLES ---
const styles = {
    tabContentContainer: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e9ecef', marginTop: '-1px' },
    tabTitle: { margin: '0 0 1.5rem 0', color: '#343a40', fontSize: '1.25rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHeaderCell: { padding: '0.75rem', textAlign: 'left', color: '#6c757d', fontWeight: '500', fontSize: '0.9rem', borderBottom: '1px solid #dee2e6'},
    tableRow: { borderBottom: '1px solid #e9ecef' },
    tableCell: { padding: '1rem 0.75rem', color: '#343a40', verticalAlign: 'middle', fontSize: '0.95rem' },
    iconButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#495057' },
    input: { width: '80px', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px', textAlign: 'right', fontSize: '0.95rem' },
    inputError: { borderColor: '#dc3545' },
    errorMessage: { color: '#dc3545', fontSize: '0.8rem', display: 'block', marginTop: '4px', textAlign: 'left' },
    tableFooter: { borderTop: '2px solid #dee2e6', fontWeight: '500' },
    summaryCellLabel: { padding: '1rem 0.75rem', textAlign: 'right', color: '#495057' },
    summaryCellValue: { padding: '1rem 0.75rem', color: '#343a40' },
    tabActions: { display: 'flex', justifyContent: 'flex-start', marginTop: '2rem' },
    saveButton: { padding: '0.6rem 1.5rem', fontSize: '1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500', backgroundColor: '#0d0d0d', color: 'white' },
    // Styles for the modal
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '600px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' },
    modalTitle: { marginTop: 0, color: '#343a40' },
    modalText: { color: '#495057', lineHeight: 1.6, whiteSpace: 'pre-wrap' },
    modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' },
};