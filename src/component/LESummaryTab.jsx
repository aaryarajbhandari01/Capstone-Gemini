import React, { useState, useEffect } from 'react';

// --- Icon Components (self-contained for portability) ---
const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#6c757d', marginLeft: '8px' }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
);
const AddIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

// --- Tooltip Component ---
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
                    width: '450px',
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
export default function LESummaryTab({
    totalSubjectWorkload,
    baseAllocations = [],
    deliveryAllocations = [],
    perStudentActivityAllocations = {},
    coordinationFactors = {}, // To hold factors like C60, D60, etc.
    onSummaryChange
}) {
    const [summaryRows, setSummaryRows] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    // --- Data Aggregation Logic (Replicates Excel SUMIF) ---
    useEffect(() => {
        const staffTotals = {};

        // Helper to safely add values to the totals object
        const addToTotals = (staffName, rawValue = 0, coordValue = 0) => {
            if (!staffName || staffName.trim() === '') return;
            if (!staffTotals[staffName]) {
                staffTotals[staffName] = { rawTotal: 0, minCoord: 0 };
            }
            staffTotals[staffName].rawTotal += parseFloat(rawValue || 0);
            staffTotals[staffName].minCoord += parseFloat(coordValue || 0);
        };

        // 1. Process Base Allocations (e.g., ranges B10:B15, F10:F15)
        baseAllocations.forEach(alloc => {
            // In base allocation, the entire amount is considered coordination
            addToTotals(alloc.staffMember, alloc.general_workload, alloc.general_workload);
        });
        
        // 2. Process Per-Delivery Allocations (e.g., ranges B23:B28, F23:F28)
        deliveryAllocations.forEach(alloc => {
            addToTotals(alloc.lecturer, alloc.allocation);
            if (alloc.subjectCoordinatorAllocation) {
                 addToTotals(alloc.subjectCoordinatorAllocation.name, alloc.subjectCoordinatorAllocation.allocation);
            }
        });

        // 3. Process Per-Student/Activity Allocations (e.g., ranges A42:A56, F42:F56, H42:H56)
        Object.values(perStudentActivityAllocations).forEach(roleAllocations => {
            roleAllocations.forEach(staff => {
                // Calculate "Raw" Total Allocation (Column F logic)
                const rawAllocation = calculateStaffAllocation(staff, staff.role, coordinationFactors.roleFactors);
                
                // Calculate Minimum Coordination Allocation (Column H logic)
                const coordAllocation = calculateCoordinationAllocation(staff, staff.role, coordinationFactors.studentCoordFactors);
                
                addToTotals(staff.name, rawAllocation, coordAllocation);
            });
        });

        // Convert aggregated data into state rows
        const initialRows = Object.keys(staffTotals).map((name, index) => ({
            id: index,
            staffMember: name,
            rawTotalAllocation: staffTotals[name].rawTotal,
            minCoordinationAllocation: staffTotals[name].minCoord,
            agreedTotalAllocation: staffTotals[name].rawTotal,
            includedCoordinationAllocation: staffTotals[name].minCoord,
        }));

        setSummaryRows(initialRows);

    }, [baseAllocations, deliveryAllocations, perStudentActivityAllocations, coordinationFactors]);

    // --- Final Calculation and Parent Update ---
    useEffect(() => {
        const totalWorkloadAllocationsForSubject = summaryRows.reduce(
            (sum, row) => sum + parseFloat(row.agreedTotalAllocation || 0), 0
        );

        const unallocatedAvailableWorkload = totalSubjectWorkload - totalWorkloadAllocationsForSubject;

        // Use a small tolerance for floating-point comparisons
        if (unallocatedAvailableWorkload < -0.0001) {
            setErrorMessage('Error: Total agreed allocations exceed the total available subject workload.');
        } else {
            setErrorMessage('');
        }
        
        onSummaryChange({
            totalWorkloadAllocationsForSubject,
            unallocatedAvailableWorkload,
        });

    }, [summaryRows, totalSubjectWorkload, onSummaryChange]);
    
    // --- Helper Calculation Functions ---
    // This logic should be consistent with WDPerStudentPerActivityAllocationTab
    const calculateStaffAllocation = (staff, role, roleFactors) => {
        if (!staff || !role || !roleFactors) return 0;
        const factors = roleFactors[role.name] || roleFactors.default;
        const students = staff.students || 0;
        const groups = staff.groups || {};
        
        const perStudentPart = (students / 25) * factors.perStudentFactor;
        const activity1Part = (groups['activity-1'] || 0) * factors.activity1Factor;
        const activity2Part = (groups['activity-2'] || 0) * factors.activity2Factor;
        const activity3Part = (groups['activity-3'] || 0) * factors.activity3Factor;
        
        return perStudentPart + activity1Part + activity2Part + activity3Part;
    };

    // This logic replicates the formulas for column H (e.g., H42 = B42/25 * C60)
    const calculateCoordinationAllocation = (staff, role, studentCoordFactors) => {
        if (!staff || !role || !studentCoordFactors) return 0;
        const factor = studentCoordFactors[role.name] || 0;
        const students = staff.students || 0;
        return (students / 25) * factor;
    };

    // --- Event Handlers ---
    const handleInputChange = (index, field, value) => {
        const updatedRows = [...summaryRows];
        const numericValue = parseFloat(value) < 0 ? 0 : value;
        updatedRows[index][field] = numericValue;
        setSummaryRows(updatedRows);
    };

    const handleAddRow = () => {
        const newRow = {
            id: summaryRows.length > 0 ? Math.max(...summaryRows.map(r => r.id)) + 1 : 0,
            staffMember: 'New Staff Member', // Should be editable
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

    // --- JSX Render ---
    return (
        <div style={styles.tabContentContainer}>
            <div style={styles.tabHeader}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h3 style={styles.tabTitle}>Summary</h3>
                    <Tooltip text="This section aggregates all workload allocations from the previous tabs. Use 'Agreed Allocation' columns to make manual adjustments.">
                        <InfoIcon />
                    </Tooltip>
                </div>
                 {/* The "Update Staff" functionality is now handled automatically by useEffect */}
            </div>

            {errorMessage && <div style={styles.errorBanner}>{errorMessage}</div>}

            <table style={styles.table}>
                <thead>
                    <tr style={styles.tableHeaderRow}>
                        <th style={{...styles.tableHeaderCell, width: '5%'}}></th>
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
                                <button style={styles.iconButton} title="Delete" onClick={() => handleDeleteRow(row.id)}><DeleteIcon /></button>
                            </td>
                            <td style={styles.tableCell}>
                                <input
                                    type="text"
                                    value={row.staffMember}
                                    onChange={(e) => handleInputChange(index, 'staffMember', e.target.value)}
                                    style={styles.textInputField}
                                    placeholder="Enter staff name"
                                />
                            </td>
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
            
            <button style={styles.addRowButton} onClick={handleAddRow}>
                <AddIcon /> Add Manual Allocation
            </button>

            {/* --- Footer Totals --- */}
            <div style={styles.footerContainer}>
                <div style={styles.footerRow}>
                    <span style={styles.footerLabel}>Total Workload Allocations for Subject</span>
                    <span style={styles.footerValue}>{formatPercent(summaryRows.reduce((sum, row) => sum + (row.agreedTotalAllocation || 0), 0))}</span>
                </div>
                <div style={styles.footerRow}>
                    <span style={styles.footerLabel}>Unallocated Available Workload</span>
                    <span style={{...styles.footerValue, color: (totalSubjectWorkload - summaryRows.reduce((sum, row) => sum + (row.agreedTotalAllocation || 0), 0)) < 0 ? '#dc3545' : '#212529'}}>
                        {formatPercent(totalSubjectWorkload - summaryRows.reduce((sum, row) => sum + (row.agreedTotalAllocation || 0), 0))}
                    </span>
                </div>
            </div>
        </div>
    );
}

// --- Styles ---
const styles = {
    tabContentContainer: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', marginTop: '-2px', borderTopLeftRadius: '0' },
    tabHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    tabTitle: { margin: 0, color: '#343a40', fontSize: '1.25rem' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHeaderRow: { borderBottom: '2px solid #343a40' },
    tableHeaderCell: { padding: '0.75rem 0.5rem', textAlign: 'left', color: '#495057', fontWeight: '600', fontSize: '0.9rem' },
    tableRow: { borderBottom: '1px solid #dee2e6' },
    tableCell: { padding: '0.5rem 0.5rem', color: '#343a40', verticalAlign: 'middle', fontSize: '0.9rem' },
    iconButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#495057' },
    inputField: { width: '90px', padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '4px', textAlign: 'right', fontSize: '0.9rem' },
    textInputField: { width: '95%', padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '0.9rem' },
    addRowButton: { marginTop: '1.5rem', padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '6px', border: '1px solid #0d0d0d', cursor: 'pointer', fontWeight: '500', backgroundColor: '#fff', color: '#0d0d0d', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    errorBanner: { backgroundColor: '#f8d7da', color: '#721c24', padding: '1rem', borderRadius: '6px', border: '1px solid #f5c6cb', marginBottom: '1.5rem' },
    footerContainer: { marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e9ecef', maxWidth: '500px', marginLeft: 'auto', marginRight: '0' },
    footerRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' },
    footerLabel: { color: '#495057', fontSize: '0.95rem' },
    footerValue: { color: '#212529', fontSize: '1rem', fontWeight: 'bold' },
};