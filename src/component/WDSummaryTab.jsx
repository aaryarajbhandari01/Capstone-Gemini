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

// --- Main Summary Tab Component ---
export default function WDSummaryTab({ totalSubjectWorkload, baseAllocations = [], onSummaryChange }) {
    const [summaryRows, setSummaryRows] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    // Step 1, 2 & 3: Aggregate data from other tabs and initialize the summary table state
    useEffect(() => {
        // For project-based subjects, all allocation entries come from the baseAllocations prop.
        const allAllocationEntries = [...baseAllocations];

        const staffTotals = allAllocationEntries.reduce((acc, entry) => {
            if (!entry.staffMember) return acc;
            if (!acc[entry.staffMember]) {
                acc[entry.staffMember] = { rawTotal: 0, minCoord: 0 };
            }
            acc[entry.staffMember].rawTotal += parseFloat(entry.general_workload || 0);
            acc[entry.staffMember].minCoord += parseFloat(entry.coordination_workload || 0);
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

        if (unallocatedAvailableWorkload < -0.0001) { // Use tolerance for float comparison
            setErrorMessage('Error: Total agreed allocations exceed the total available subject workload.');
        } else {
            setErrorMessage('');
        }
        
        onSummaryChange({
            totalWorkloadAllocationsForSubject,
            unallocatedAvailableWorkload,
        });

    }, [summaryRows, totalSubjectWorkload, onSummaryChange]);

    const handleInputChange = (index, field, value) => {
        const updatedRows = [...summaryRows];
        // Prevent negative values as per validation rules
        const numericValue = parseFloat(value) < 0 ? 0 : value;
        updatedRows[index][field] = numericValue;
        setSummaryRows(updatedRows);
    };

    const handleAddRow = () => {
        const newRow = {
            id: summaryRows.length > 0 ? Math.max(...summaryRows.map(r => r.id)) + 1 : 0,
            staffMember: 'New Staff Member', // Placeholder, should be editable
            rawTotalAllocation: 0,
            minCoordinationAllocation: 0,
            agreedTotalAllocation: 0,
            includedCoordinationAllocation: 0,
        };
        setSummaryRows([...summaryRows, newRow]);
    };

    const handleDeleteRow = (idToDelete) => {
        setSummaryRows(summaryRows.filter(row => row.id !== idToDelete));
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
                    <InfoIcon />
                </div>
                <button style={styles.addButton} onClick={handleAddRow}>
                    <AddIcon /> Add
                </button>
            </div>

            {errorMessage && <div style={styles.errorBanner}>{errorMessage}</div>}

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
                    {summaryRows.map((row, index) => (
                        <tr key={row.id} style={styles.tableRow}>
                            <td style={styles.tableCell}>
                                <button style={styles.iconButton} title="Edit"><EditIcon /></button>
                                <button style={styles.iconButton} title="Delete" onClick={() => handleDeleteRow(row.id)}><DeleteIcon /></button>
                            </td>
                            <td style={styles.tableCell}>{row.staffMember}</td>
                            <td style={{...styles.tableCell, textAlign: 'right'}}>{formatPercent(row.rawTotalAllocation)}</td>
                            <td style={{...styles.tableCell, textAlign: 'right'}}>{formatPercent(row.minCoordinationAllocation)}</td>
                            <td style={{...styles.tableCell, textAlign: 'right'}}>
                                <input
                                    type="number"
                                    value={(row.agreedTotalAllocation * 100).toFixed(1)}
                                    onChange={(e) => handleInputChange(index, 'agreedTotalAllocation', parseFloat(e.target.value) / 100)}
                                    style={styles.inputField}
                                    step="0.1"
                                    min="0"
                                />
                            </td>
                            <td style={{...styles.tableCell, textAlign: 'right'}}>
                                <input
                                    type="number"
                                    value={(row.includedCoordinationAllocation * 100).toFixed(1)}
                                    onChange={(e) => handleInputChange(index, 'includedCoordinationAllocation', parseFloat(e.target.value) / 100)}
                                    style={styles.inputField}
                                    step="0.1"
                                    min="0"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <div style={styles.tabFooter}>
                <button style={styles.saveButton}>Save</button>
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
    tabFooter: { display: 'flex', justifyContent: 'flex-start', marginTop: '2rem', borderTop: '1px solid #e9ecef', paddingTop: '1.5rem' },
    saveButton: { padding: '0.6rem 1.2rem', fontSize: '1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500', backgroundColor: '#007bff', color: 'white' },
    errorBanner: { backgroundColor: '#f8d7da', color: '#721c24', padding: '1rem', borderRadius: '6px', border: '1px solid #f5c6cb', marginBottom: '1.5rem' },
};