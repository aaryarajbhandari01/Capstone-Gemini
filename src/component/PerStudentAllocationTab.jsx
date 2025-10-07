import React, { useState, useEffect, useMemo, useRef, useLayoutEffect, useContext } from 'react';
import { StaffRolesContext } from '../StaffRolesContext';

// Mock context for standalone example. Replace with your actual import.


// --- Content for Information Popups ---
const TOOLTIP_CONTENT = {
    perStudentAllocation: "Enter the total number of students in the subject (across all deliveries) and, in the table, adjust the distribution of the workload per 25 students (3%) onto the subject coordinator and the staff roles. The sum of all allocations per 25 students must not exceed 3% plus any administrative loading that applies. The given values are an example only.",
    adminLoading: "If assessment arrangements made by the University result in substantial additional workload (e.g. staff having to spend more time on organising or supervising assessment items than what would be expected given the approved assessment items and University policies, or staff ending up spending excessive time in misconduct proceedings), an administrative loading of up to 1% per 25 students to the per-student allocation can be claimed. If a claim is made, provide details below.",
    tableAllocation: "The per-student allocation covers all marking (including exam and tutorial/prac/lab marking); student consultation; and some coordination."
};

// --- Helper Components & Icons ---
const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#6c757d', cursor: 'pointer' }}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', color: '#495057' }}>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);
const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
);
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', color: '#28a745' }}>
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', color: '#dc3545' }}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

// --- Reusable InfoPopup Component with Overflow Prevention ---
const InfoPopup = ({ content }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null); // Ref for the icon's container
    const popupRef = useRef(null);     // Ref for the popup tooltip itself

    useLayoutEffect(() => {
        if (isOpen && containerRef.current && popupRef.current) {
            const popup = popupRef.current;
            
            // Reset to default centered position to get accurate measurements
            popup.style.left = '50%';
            popup.style.right = 'auto';
            popup.style.transform = 'translateX(-50%)';

            const popupRect = popup.getBoundingClientRect();
            const viewportWidth = window.innerWidth;

            // Check for right overflow
            if (popupRect.right > viewportWidth) {
                popup.style.left = 'auto';
                popup.style.right = '0';
                popup.style.transform = 'translateX(0%)';
            }

            // Check for left overflow
            if (popupRect.left < 0) {
                popup.style.left = '0';
                popup.style.right = 'auto';
                popup.style.transform = 'translateX(0%)';
            }
        }
    }, [isOpen]);

    // Handles closing the popup when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div style={styles.popupContainer} ref={containerRef}>
            <span onClick={() => setIsOpen(!isOpen)} style={styles.infoIconWrapper}>
                <InfoIcon />
            </span>
            {isOpen && (
                <div style={styles.popup} ref={popupRef}>
                    {content}
                </div>
            )}
        </div>
    );
};


// --- PercentageInput component for a smooth UX ---
const PercentageInput = ({ value, onChange, style }) => {
    const [inputValue, setInputValue] = useState((value * 100).toString());
    useEffect(() => {
        if (parseFloat(inputValue) !== value * 100) {
             setInputValue((value * 100).toString());
        }
    }, [value]);
    const handleChange = (e) => {
        const rawValue = e.target.value;
        setInputValue(rawValue);
        const numericValue = parseFloat(rawValue);
        if (!isNaN(numericValue)) onChange(numericValue / 100);
        else if (rawValue === '' || rawValue === '.') onChange(0);
    };
    const handleBlur = () => {
        const cleanValue = parseFloat(inputValue) || 0;
        setInputValue(cleanValue.toString());
        onChange(cleanValue / 100);
    };
    return <input type="number" value={inputValue} onChange={handleChange} onBlur={handleBlur} style={style} step="0.001" onClick={(e) => e.stopPropagation()} />;
};

// --- Main Component ---
export default function PerStudentAllocationTab({ onAllocationChange }) {
    const { definedRoles } = useContext(StaffRolesContext);
    const [numberOfStudents, setNumberOfStudents] = useState(100);
    const [adminLoading, setAdminLoading] = useState(0.0);
    const [details, setDetails] = useState('');
    const [allocations, setAllocations] = useState([
        { id: 'coord', role: 'Subject Coordinator', marking: 0.00, consultation: 0.00, coordination: 0.00 },
    ]);
    const [editingId, setEditingId] = useState(null);
    const [backupAllocation, setBackupAllocation] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [errors, setErrors] = useState({});

    const BASE_RATE_PER_25 = 0.03;
    const maxTableAllocation = useMemo(() => BASE_RATE_PER_25 + adminLoading, [adminLoading]);
    const sumOfDistributedRates = useMemo(() => allocations.reduce((total, role) => total + (role.marking || 0) + (role.consultation || 0) + (role.coordination || 0), 0), [allocations]);
    const totalPerStudentAllocation = useMemo(() => {
        const totalRate = BASE_RATE_PER_25 + adminLoading;
        return (numberOfStudents > 0 ? (numberOfStudents / 25) * totalRate : 0);
    }, [numberOfStudents, adminLoading]);

    useEffect(() => {
        const newErrors = {};
        if (adminLoading > 0.01) newErrors.adminLoading = 'Administrative loading cannot exceed 1%.';
        if (adminLoading > 0 && details.trim() === '') newErrors.details = 'Details are required if administrative loading is claimed.';
        if (parseFloat(sumOfDistributedRates.toFixed(5)) > parseFloat(maxTableAllocation.toFixed(5))) {
            newErrors.table = `MAXIMUM EXCEEDED: Sum of allocations (${(sumOfDistributedRates * 100).toFixed(3)}%) is greater than the allowed total of ${(maxTableAllocation * 100).toFixed(3)}%.`;
        }
        setErrors(newErrors);
    }, [adminLoading, details, sumOfDistributedRates, maxTableAllocation]);

    useEffect(() => {
        if (onAllocationChange) onAllocationChange(totalPerStudentAllocation);
    }, [totalPerStudentAllocation, onAllocationChange]);

      useEffect(() => {
        setAllocations(currentAllocations => {
            const coordinator = currentAllocations.find(a => a.id === 'coord') || 
                                { id: 'coord', role: 'Subject Coordinator', marking: 0, consultation: 0.0025, coordination: 0.00125 };

            const syncedRoles = definedRoles.map(propRole => {
                const existing = currentAllocations.find(a => a.id === propRole.id);
                return existing ? { ...existing, role: propRole.name } : { 
                    id: propRole.id, 
                    role: propRole.name, 
                    marking: 0, consultation: 0, coordination: 0 
                };
            });
            // Ensure coordinator is always first and not duplicated
            const otherRoles = syncedRoles.filter(r => r.id !== 'coord');
            return [coordinator, ...otherRoles];
        });
    }, [definedRoles]);

    const handleEditClick = (id) => {
        setBackupAllocation({ ...allocations.find(a => a.id === id) });
        setEditingId(id);
    };
    const handleSaveRow = () => {
        setEditingId(null);
        setBackupAllocation(null);
    };
    const handleCancelRow = () => {
        if (backupAllocation) setAllocations(current => current.map(a => a.id === backupAllocation.id ? backupAllocation : a));
        setEditingId(null);
        setBackupAllocation(null);
    };
    const handleAllocationValueChange = (id, field, decimalValue) => setAllocations(current => current.map(alloc => alloc.id === id ? { ...alloc, [field]: decimalValue } : alloc));
    const handleSave = () => {
        handleSaveRow();
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
    };
    const isSaveDisabled = Object.keys(errors).length > 0;

    return (
        <div style={styles.container}>
            <div style={styles.inputGroup}>
                <label style={styles.label} htmlFor="totalAllocation">
                    Per-student Allocation <InfoPopup content={TOOLTIP_CONTENT.perStudentAllocation} />
                </label>
                <input style={{...styles.input, ...styles.readOnlyInput}} id="totalAllocation" type="text" value={`${(totalPerStudentAllocation * 100).toFixed(2)}%`} readOnly />
            </div>
            <div style={styles.inputGroup}>
                <label style={styles.label} htmlFor="numStudents">Number of students</label>
                <input style={{...styles.input, ...styles.fullWidthInput}} id="numStudents" type="number" value={numberOfStudents} onChange={(e) => setNumberOfStudents(parseInt(e.target.value, 10) || 0)} />
            </div>
            <div style={styles.inputGroup}>
                <label style={styles.label} htmlFor="adminLoading">
                    Administrative loading per 25 students <InfoPopup content={TOOLTIP_CONTENT.adminLoading} />
                </label>
                <div style={styles.inputWithUnit}>
                    <PercentageInput value={adminLoading} onChange={setAdminLoading} style={{...styles.input, ...styles.percentageInput}}/>
                    <span>%</span>
                </div>
                 {errors.adminLoading && <div style={styles.errorText}>{errors.adminLoading}</div>}
            </div>
            <div style={{...styles.inputGroup, maxWidth: 'unset'}}>
                <label style={styles.label} htmlFor="details">Details</label>
                <textarea style={styles.textarea} id="details" placeholder="If a claim is made, provide details." value={details} onChange={(e) => setDetails(e.target.value)}></textarea>
                 {errors.details && <div style={styles.errorText}>{errors.details}</div>}
            </div>
            <div style={styles.tableContainer}>
                 <div style={styles.tableHeader}>
                    <h3 style={styles.tableTitle}>Allocation per 25 students (Sum must not exceed {(maxTableAllocation * 100).toFixed(3)}%)</h3>
                    <InfoPopup content={TOOLTIP_CONTENT.tableAllocation} />
                </div>
                {errors.table && <div style={{...styles.errorText, marginBottom: '1rem', textAlign: 'center'}}>{errors.table}</div>}
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={{...styles.th, ...styles.leftAlign}}>Actions</th>
                            <th style={{...styles.th, ...styles.leftAlign}}>Staff Role</th>
                            <th style={{...styles.th}}>Marking</th>
                            <th style={{...styles.th}}>Consultation</th>
                            <th style={{...styles.th}}>Coordination</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allocations.map((item) => {
                           const isEditing = editingId === item.id;
                           return (
                            <tr key={item.id}>
                                <td style={{...styles.td, ...styles.leftAlign}}>
                                    {isEditing ? (
                                        <div style={styles.actionIcons}>
                                            <span title="Save Edit" onClick={handleSaveRow}><CheckIcon /></span>
                                            <span title="Cancel Edit" onClick={handleCancelRow}><XIcon /></span>
                                        </div>
                                    ) : (
                                        <span title="Edit Row" onClick={() => handleEditClick(item.id)}><EditIcon /></span>
                                    )}
                                </td>
                                <td style={{...styles.td, ...styles.leftAlign}}>{item.role}</td>
                                <td style={styles.td}>{isEditing ? <PercentageInput value={item.marking} onChange={(val) => handleAllocationValueChange(item.id, 'marking', val)} style={styles.tableInput} /> : `${(item.marking * 100).toFixed(3)}%`}</td>
                                <td style={styles.td}>{isEditing ? <PercentageInput value={item.consultation} onChange={(val) => handleAllocationValueChange(item.id, 'consultation', val)} style={styles.tableInput} /> : `${(item.consultation * 100).toFixed(3)}%`}</td>
                                <td style={styles.td}>{isEditing ? <PercentageInput value={item.coordination} onChange={(val) => handleAllocationValueChange(item.id, 'coordination', val)} style={styles.tableInput} /> : `${(item.coordination * 100).toFixed(3)}%`}</td>
                            </tr>
                           );
                        })}
                    </tbody>
                </table>
            </div>
            <div style={styles.buttonContainer}>
                <button style={{...styles.saveButton, ...(isSaveDisabled && styles.disabledButton)}} onClick={handleSave} disabled={isSaveDisabled}>
                    <SaveIcon />
                    Save All Changes
                </button>
                {showSuccessMessage && <div style={styles.successMessage}>✅ Changes saved successfully!</div>}
            </div>
        </div>
    );
}

// --- Styles ---
const styles = {
    container: { backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid #dee2e6' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', maxWidth: '400px' },
    label: { color: '#212529', fontWeight: '600', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    input: { padding: '0.6rem 0.75rem', border: 'none', borderRadius: '4px', fontSize: '1rem', backgroundColor: '#fff' },
    fullWidthInput: { width: '100%', border: '1px solid #ced4da'},
    percentageInput: { textAlign: 'right', width: '100%' },
    readOnlyInput: { backgroundColor: '#f8f9fa', color: '#495057', border: '1px solid #ced4da' },
    textarea: { padding: '0.75rem', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '1rem', minHeight: '80px', resize: 'vertical' },
    tableContainer: { marginTop: '2.5rem' },
    tableHeader: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' },
    tableTitle: { margin: 0, fontSize: '1.25rem', fontWeight: '600', color: '#212529', textAlign: 'center' },
    table: { width: '100%', borderCollapse: 'collapse', borderSpacing: 0 },
    th: { padding: '0.75rem 1rem', textAlign: 'center', borderBottom: '2px solid #dee2e6', color: '#6c757d', fontWeight: '500', fontSize: '0.9rem', textTransform: 'uppercase' },
    td: { padding: '1rem', textAlign: 'center', borderBottom: '1px solid #e9ecef', color: '#212529', fontSize: '0.95rem' },
    leftAlign: { textAlign: 'left' },
    tableInput: { width: '100px', padding: '0.4rem 0.5rem', border: '1px solid #007bff', borderRadius: '4px', textAlign: 'center', fontSize: '0.95rem', backgroundColor: '#f0f8ff' },
    actionIcons: { display: 'flex', alignItems: 'center', gap: '1rem' },
    buttonContainer: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '2rem', gap: '1.5rem' },
    saveButton: { backgroundColor: '#212529', color: 'white', padding: '0.6rem 1.5rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', transition: 'background-color 0.2s' },
    disabledButton: { backgroundColor: '#6c757d', cursor: 'not-allowed' },
    successMessage: { padding: '0.6rem 1rem', borderRadius: '6px', backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', fontWeight: '500' },
    errorText: { color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' },
    inputWithUnit: { display: 'flex', alignItems: 'center', border: '1px solid #ced4da', borderRadius: '4px', paddingRight: '0.75rem' },
    popupContainer: { position: 'relative', display: 'inline-flex', alignItems: 'center' },
    infoIconWrapper: { display: 'flex', alignItems: 'center' },
    popup: { position: 'absolute', bottom: '140%', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#343a40', color: '#fff', padding: '10px 15px', borderRadius: '6px', zIndex: 100, width: '320px', fontSize: '0.9rem', lineHeight: '1.5', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', textAlign: 'left'},
};

