import React, { useState, useEffect } from 'react';

// --- Icon Components (for self-containment) ---
const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#6c757d', marginLeft: '8px' }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
);
const AddIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

// ✅ ADDED: Save icon for when a row is in edit mode
const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
);

// ✅ ADDED: A simple tooltip component for the info icon
const Tooltip = ({ children, text }) => {
    const [visible, setVisible] = useState(false);
    return (
        <div 
            style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            {visible && (
                <div style={{
                    position: 'absolute',
                    bottom: '125%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#343a40',
                    color: '#fff',
                    padding: '10px 15px',
                    borderRadius: '6px',
                    zIndex: 100,
                    width: '450px', // Increased width for the longer text
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    textAlign: 'left',
                }}>
                    {text}
                </div>
            )}
        </div>
    );
};

// --- Main Summary Tab Component ---
export default function WDSummaryTab({ totalSubjectWorkload, baseAllocations = [], onSummaryChange }) {
    const [summaryRows, setSummaryRows] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');


    // ✅ ADDED: State to manage UI feedback and row editing state
    const [editingRowId, setEditingRowId] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
const [rowIdToDelete, setRowIdToDelete] = useState(null);
    // Step 1, 2 & 3: Aggregate data from other tabs and initialize the summary table state
    useEffect(() => {
         console.log('--- Raw data received ---', baseAllocations);
        // For project-based subjects, all allocation entries come from the baseAllocations prop.
        const allAllocationEntries = [...baseAllocations];

        const staffTotals = allAllocationEntries.reduce((acc, entry) => {
            if (!entry.staffMember) return acc;
            if (!acc[entry.staffMember]) {
                acc[entry.staffMember] = { rawTotal: 0, minCoord: 0 };
            }
            acc[entry.staffMember].rawTotal += parseFloat(entry.general_workload || 0);
            // acc[entry.staffMember].minCoord += parseFloat(entry.coordination_workload || 0);
            acc[entry.staffMember].minCoord += parseFloat( 0);
            return acc;
        }, {});

        const initialRows = Object.keys(staffTotals).map((name, index) => ({
            id: index,
            staffMember: name,
            rawTotalAllocation: staffTotals[name].rawTotal,
            minCoordinationAllocation: staffTotals[name].minCoord,
            agreedTotalAllocation: staffTotals[name].rawTotal, // Default agreed = raw
            includedCoordinationAllocation: staffTotals[name].minCoord, // Default included = min
        }));

        setSummaryRows(initialRows);
    }, [baseAllocations]);

    // Step 4 & 5: Calculate final totals and report back to the parent page whenever data changes
    useEffect(() => {
        const totalWorkloadAllocationsForSubject = summaryRows.reduce(
            (sum, row) => sum + parseFloat(row.agreedTotalAllocation || 0), 0
        );

        const unallocatedAvailableWorkload = totalSubjectWorkload - totalWorkloadAllocationsForSubject;

        // ✅ CHANGED: We preserve the name validation error, otherwise we check for allocation errors.
        if (errorMessage && errorMessage.includes('Staff Member')) {
            // Do nothing, keep the existing staff name error
        } else if (unallocatedAvailableWorkload < -0.0001) { // Use tolerance for float comparison
            setErrorMessage('Error: Total agreed allocations exceed the total available subject workload.');
        } else {
            setErrorMessage('');
        }
        
        onSummaryChange({
            totalWorkloadAllocationsForSubject,
            unallocatedAvailableWorkload,
        });

    }, [summaryRows, totalSubjectWorkload, onSummaryChange]);


    // ✅ ADDED: Handlers for edit and save actions on a row
    const handleEdit = (id) => {
        setEditingRowId(id);
        setSuccessMessage(''); // Clear success message when editing a new row
    };

    // ✅ CHANGED: Added regex validation for invalid characters
    const handleSave = (id) => {
        const rowToSave = summaryRows.find(row => row.id === id);
        const nameValidationRegex = /^[a-zA-Z\s-]*$/; // Allows letters, spaces, and hyphens

        // Validation 1: Check if the name is empty
        if (!rowToSave.staffMember || rowToSave.staffMember.trim() === '') {
            setErrorMessage('Staff Member name cannot be empty.');
            return;
        }

        // Validation 2: Check for numbers or special characters
        if (!nameValidationRegex.test(rowToSave.staffMember)) {
            setErrorMessage('Staff Member cannot have special characters or numbers.');
            return;
        }

        // All checks passed
        setEditingRowId(null);
        setErrorMessage('');
        setSuccessMessage('Row updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };



    // const handleInputChange = (index, field, value) => {
    //     const updatedRows = [...summaryRows];
    //     // Prevent negative values as per validation rules
    //     const numericValue = parseFloat(value) < 0 ? 0 : value;
    //     updatedRows[index][field] = numericValue;
    //     setSummaryRows(updatedRows);
    // };
     // ✅ CHANGED: Correctly handles string vs. number inputs and clears error on valid input.
    const handleInputChange = (index, field, value) => {
        const updatedRows = [...summaryRows];

        if (field === 'staffMember') {
            updatedRows[index][field] = value;
            // Clear "empty name" error as the user types
            if (value.trim() !== '') {
                setErrorMessage('');
            }
        } else {
            // Handle numeric inputs
            const numericValue = parseFloat(value) < 0 ? 0 : value;
            updatedRows[index][field] = numericValue;
        }

        setSummaryRows(updatedRows);
    };

    // const handleAddRow = () => {
    //     const newRow = {
    //         id: summaryRows.length > 0 ? Math.max(...summaryRows.map(r => r.id)) + 1 : 0,
    //         staffMember: 'New Staff Member', // Placeholder, should be editable
    //         rawTotalAllocation: 0,
    //         minCoordinationAllocation: 0,
    //         agreedTotalAllocation: 0,
    //         includedCoordinationAllocation: 0,
    //     };
    //     setSummaryRows([...summaryRows, newRow]);
    // };

    // const handleDeleteRow = (idToDelete) => {
    //     setSummaryRows(summaryRows.filter(row => row.id !== idToDelete));
    // };

    // ✅ CHANGED: New rows now start in edit mode for better UX
    const handleAddRow = () => {
        const newId = summaryRows.length > 0 ? Math.max(...summaryRows.map(r => r.id)) + 1 : 0;
        const newRow = {
            id: newId,
            staffMember: '', // Start empty for user input
            rawTotalAllocation: 0,
            minCoordinationAllocation: 0,
            agreedTotalAllocation: 0,
            includedCoordinationAllocation: 0,
        };
        setSummaryRows([...summaryRows, newRow]);
        setEditingRowId(newId); // Set the new row to be in edit mode immediately
    };

    const handleDeleteClick = (id) => {
    setRowIdToDelete(id);
    setIsModalOpen(true);


};
   const handleDeleteRow = (idToDelete) => {
        const rowToDelete = summaryRows.find(row => row.id === idToDelete);
        const staffName = rowToDelete?.staffMember ? rowToDelete.staffMember.trim() : 'this row';
        
        // Display a confirmation pop-up before proceeding
        if (window.confirm(`Are you sure you want to delete the entry for "${staffName}"?`)) {
            setSummaryRows(summaryRows.filter(row => row.id !== idToDelete));
            setSuccessMessage('Row deleted successfully.');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    const confirmDelete = () => {
    setSummaryRows(summaryRows.filter(row => row.id !== rowIdToDelete));
    setIsModalOpen(false); // Close the modal
    setSuccessMessage('Row deleted successfully.');
    setTimeout(() => setSuccessMessage(''), 3000);
};

    // ✅ ADDED: Handler for the main save button
    // const handleFinalSave = () => {
    //     if (errorMessage) {
    //         alert("Cannot save. Please fix the errors first.");
    //         return;
    //     }
    //     setEditingRowId(null); // Exit any active edit mode
    //     setSuccessMessage('All summary data has been saved.');
    //     // In a real app, you would make an API call here.
    //     setTimeout(() => setSuccessMessage(''), 3000);
    // };
    // ✅ CHANGED: Added validation check before final save.
    const handleFinalSave = () => {
        const nameValidationRegex = /^[a-zA-Z\s-]*$/;

        // Find the first row that fails any validation
        const invalidRow = summaryRows.find(row =>
            !row.staffMember ||
            row.staffMember.trim() === '' ||
            !nameValidationRegex.test(row.staffMember)
        );

        if (invalidRow) {
            // Provide a specific error message based on why it failed
            if (!invalidRow.staffMember || invalidRow.staffMember.trim() === '') {
                setErrorMessage('Staff Member name cannot be empty. Please complete all entries.');
            } else {
                setErrorMessage(`Invalid characters in name for "${invalidRow.staffMember}". Please use only letters, spaces, and hyphens.`);
            }
            setEditingRowId(invalidRow.id);
            return;
        }
        
        if (errorMessage) {
            alert("Cannot save. Please fix the allocation errors first.");
            return;
        }

        setEditingRowId(null);
        setErrorMessage('');
        setSuccessMessage('All summary data has been saved.');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const formatPercent = (decimal) => {
        if (isNaN(decimal) || decimal === null) return '0.0%';
        return `${(decimal * 100).toFixed(1)}%`;
    };

    return (
        <div style={styles.tabContentContainer}>
            <div style={styles.tabHeader}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h3 style={styles.tabTitle}>Summary</h3>
                    <Tooltip text="You can populate the summary section by clicking the button on the right; all staff members appearing above will be listed and their total workload allocation will be computed. This requires macros to be enabled. You can list any additional staff members manually. Use the columns “Agreed Allocation” and “Included Allocation” for Coordination for any adjustments or for a manual allocation.">
                        <InfoIcon />
                    </Tooltip>
                </div>
                <button style={styles.addButton} onClick={handleAddRow}>
                    <AddIcon /> Add
                </button>
            </div>
 {/* ✅ ADDED: Banners for success and error messages */}
            {successMessage && <div style={styles.successBanner}>{successMessage}</div>}
            {errorMessage && <div style={styles.errorBanner}>{errorMessage}</div>}

            {/* {errorMessage && <div style={styles.errorBanner}>{errorMessage}</div>} */}

            <table style={styles.table}>
                <thead>
                    <tr style={styles.tableHeaderRow}>
                        <th style={{...styles.tableHeaderCell, width: '10%'}}>Actions</th>
                        <th style={{...styles.tableHeaderCell, width: '25%'}}>Staff Member</th>
                        <th style={{...styles.tableHeaderCell, textAlign: 'right'}}>"Raw" Total Allocation</th>
                        <th style={{...styles.tableHeaderCell, textAlign: 'right'}}>Minimum Included Allocation for Coordination</th>
                        <th style={{...styles.tableHeaderCell, textAlign: 'right'}}>Agreed Total Allocation</th>
                        <th style={{...styles.tableHeaderCell, textAlign: 'right'}}>Included Allocation for Coordination</th>
                    </tr>
                </thead>
                <tbody>
                    {summaryRows.map((row, index) => {
                        const isEditing = row.id === editingRowId; // Determine if the current row is in edit mode
                        
                        return (
                            <tr key={row.id} style={styles.tableRow}>
                                <td style={styles.tableCell}>
                                    {/* ✅ CHANGED: Show Save button in edit mode, Edit button otherwise */}
                                    {isEditing ? (
                                        <button style={styles.iconButton} title="Save" onClick={() => handleSave(row.id)}><SaveIcon /></button>
                                    ) : (
                                        <button style={styles.iconButton} title="Edit" onClick={() => handleEdit(row.id)}><EditIcon /></button>
                                    )}
                                    <button style={styles.iconButton} title="Delete" onClick={() => handleDeleteClick(row.id)}><DeleteIcon /></button>
                                </td>
                                <td style={styles.tableCell}>
                                    {/* ✅ CHANGED: Show input in edit mode, text otherwise */}
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={row.staffMember}
                                            onChange={(e) => handleInputChange(index, 'staffMember', e.target.value)}
                                            style={styles.textInputField}
                                            placeholder="Enter staff name"
                                        />
                                    ) : (
                                        row.staffMember
                                    )}
                                </td>
                                <td style={{...styles.tableCell, textAlign: 'right'}}>{formatPercent(row.rawTotalAllocation)}</td>
                                <td style={{...styles.tableCell, textAlign: 'right'}}>{formatPercent(row.minCoordinationAllocation)}</td>
                                <td style={{...styles.tableCell, textAlign: 'right'}}>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={(row.agreedTotalAllocation * 100).toFixed(1)}
                                            onChange={(e) => handleInputChange(index, 'agreedTotalAllocation', parseFloat(e.target.value) / 100)}
                                            style={styles.inputField}
                                            step="0.1"
                                            min="0"
                                        />
                                    ) : (
                                        formatPercent(row.agreedTotalAllocation)
                                    )}
                                </td>
                                <td style={{...styles.tableCell, textAlign: 'right'}}>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={(row.includedCoordinationAllocation * 100).toFixed(1)}
                                            onChange={(e) => handleInputChange(index, 'includedCoordinationAllocation', parseFloat(e.target.value) / 100)}
                                            style={styles.inputField}
                                            step="0.1"
                                            min="0"
                                        />
                                    ) : (
                                        formatPercent(row.includedCoordinationAllocation)
                                    )}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {isModalOpen && (
    <div style={styles.modalBackdrop}>
        <div style={styles.modalContent}>
            <h4>Confirm Deletion</h4>
            <p>Are you sure you want to delete this row?</p>
            <div style={styles.modalActions}>
                <button style={styles.modalButton} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button style={{...styles.modalButton, ...styles.deleteButton}} onClick={confirmDelete}>Delete</button>
            </div>
        </div>
    </div>
)}
            {/* <div style={styles.tabFooter}>
                <button style={styles.saveButton}>Save</button>
            </div> */}
            <div style={styles.tabFooter}>
                 {/* ✅ CHANGED: Hooked up the main save button to its handler */}
                <button style={styles.saveButton} onClick={handleFinalSave}>Save</button>
            </div>
        </div>
    );
}

// --- Styles ---
const styles = {
    tabContentContainer: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', marginTop: '-2px', borderTopLeftRadius: '0' },
    tabHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    tabTitle: { margin: 0, color: '#343a40', fontSize: '1.25rem' },
    addButton: { padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500', backgroundColor: '#0d0d0d', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHeaderRow: { borderBottom: '2px solid #343a40' },
    tableHeaderCell: { padding: '0.75rem 0.5rem', textAlign: 'left', color: '#495057', fontWeight: '600', fontSize: '0.9rem' },
    tableRow: { borderBottom: '1px solid #dee2e6' },
    tableCell: { padding: '0.5rem 0.5rem', color: '#343a40', verticalAlign: 'middle', fontSize: '0.9rem' },
    iconButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#495057', marginRight: '0.5rem' },
    inputField: { width: '90px', padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '4px', textAlign: 'right', fontSize: '0.9rem' },
    textInputField: { width: '95%', padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '0.9rem' },
    tabFooter: { display: 'flex', justifyContent: 'flex-start', marginTop: '2rem', borderTop: '1px solid #e9ecef', paddingTop: '1.5rem' },
    saveButton: { padding: '0.6rem 1.2rem', fontSize: '1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500', backgroundColor: '#007bff', color: 'white' },
    errorBanner: { backgroundColor: '#f8d7da', color: '#721c24', padding: '1rem', borderRadius: '6px', border: '1px solid #f5c6cb', marginBottom: '1.5rem' },
successBanner: { backgroundColor: '#d4edda', color: '#155724', padding: '1rem', borderRadius: '6px', border: '1px solid #c3e6cb', marginBottom: '1.5rem' },
// Add these styles to your styles object at the bottom of the file
modalBackdrop: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
modalContent: { backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', width: '400px' },
modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' },
modalButton: { padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer' },
deleteButton: { backgroundColor: '#dc3545', color: 'white', border: 'none' },
};
