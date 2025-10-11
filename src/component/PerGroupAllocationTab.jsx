// // src/component/PerGroupAllocationTab.js

// import React, { useState, useMemo, useEffect } from 'react';

// // --- Helper Components ---
// const InfoIcon = ({ onClick }) => (
//     <svg 
//         onClick={onClick} 
//         xmlns="http://www.w3.org/2000/svg" 
//         width="16" 
//         height="16" 
//         viewBox="0 0 24 24" 
//         fill="none" 
//         stroke="currentColor" 
//         strokeWidth="2" 
//         strokeLinecap="round" 
//         strokeLinejoin="round" 
//         style={{ color: '#6c757d', marginLeft: '8px', cursor: 'pointer' }}
//     >
//         <circle cx="12" cy="12" r="10" />
//         <line x1="12" y1="16" x2="12" y2="12" />
//         <line x1="12" y1="8" x2="12.01" y2="8" />
//     </svg>
// );

// const InfoPopup = ({ onClose }) => (
//     <div style={styles.popupOverlay}>
//         <div style={styles.popup}>
//             <h4 style={styles.popupTitle}>Per-group Allocation</h4>
//             <p style={styles.popupText}>
//                 The per-group allocation covers the workload associated with the sourcing of projects, ongoing student supervision, and final marking.
//             </p>
//             <button onClick={onClose} style={styles.popupButton}>Close</button>
//         </div>
//     </div>
// );

// const PerGroupAllocationTab = ({ onPerGroupAllocationChange, onAllocationChange, onProjectDataChange }) => {
//     // --- State Management ---
//     const [projectGroups, setProjectGroups] = useState(25);
//     const [numberOfGroups, setNumberOfGroups] = useState('5');
//     const [creditPointValue, setCreditPointValue] = useState('10 CP');
//     const [studentsPerGroup, setStudentsPerGroup] = useState('5');
//     const [errors, setErrors] = useState({});
//     const [isInfoVisible, setInfoVisible] = useState(false);
//     const [showSuccessMessage, setShowSuccessMessage] = useState(false);

//     // --- Calculation Logic ---
//     const perGroupAllocation = useMemo(() => {
//         const numGroups = parseInt(numberOfGroups, 10);
//         const numStudents = parseInt(studentsPerGroup, 10);
//         const newErrors = {};

//         // Validation
//         if (isNaN(numGroups) || numGroups <= 0) {
//             newErrors.numberOfGroups = "Number of project groups must be a positive number.";
//         }
//         if (isNaN(numStudents) || numStudents < 1) {
//             newErrors.studentsPerGroup = "Number of students must be 1 or more.";
//         }
//         setErrors(newErrors);

//         if (Object.keys(newErrors).length > 0 || !numberOfGroups || !studentsPerGroup) {
//             return null;
//         }

//         // Calculation Steps
//         let baseRate = 0;
//         switch (creditPointValue) {
//             case '10 CP': baseRate = 0.02; break;
//             case '20 CP over 1 term': baseRate = 0.03; break;
//             case '20 CP over 2 terms': baseRate = 0.04; break;
//             default: baseRate = 0;
//         }
//          // This is: 0.005 * (F26 - 1)
//         const studentLoading = 0.005 * (numStudents - 1);

//         // This is: B26 * ( IF(...) + studentLoading )
//         const totalAllocation = numGroups * (baseRate + studentLoading);
        
//         return totalAllocation;

//     }, [numberOfGroups, creditPointValue, studentsPerGroup]);

//     // --- Effect to notify parent of changes ---
//     useEffect(() => {
//         // This call updates the specific state for the next page
//         if (onPerGroupAllocationChange) {
//             onPerGroupAllocationChange(perGroupAllocation);
//         }
//         // This call updates the general summary display on the current page
//         if (onAllocationChange) {
//             onAllocationChange(perGroupAllocation);
//         }

//         if (onProjectDataChange) {
//             onProjectDataChange(projectGroups, studentsPerGroup);
//         }
//     }, [perGroupAllocation, projectGroups, studentsPerGroup,onPerGroupAllocationChange, onAllocationChange, , onProjectDataChange]);

//     const handleSave = () => {
//         // Only show message if form is valid
//         if (Object.keys(errors).length === 0 && numberOfGroups && studentsPerGroup) {
//             setShowSuccessMessage(true);
//             // Hide the message after 3 seconds
//             setTimeout(() => {
//                 setShowSuccessMessage(false);
//             }, 2000);
//         }
//     };


//     return (
//         <div style={styles.container}>
//             {showSuccessMessage && (
//                 <div style={styles.toast}>
//                     Allocation details saved successfully!
//                 </div>
//             )}
//             {isInfoVisible && <InfoPopup onClose={() => setInfoVisible(false)} />}

//             {/* Output Field */}
//             <div style={styles.fieldGroup}>
//                 <label style={styles.label} htmlFor="perGroupAllocation">
//                     Per-group Allocation
//                     <InfoIcon onClick={() => setInfoVisible(true)} />
//                 </label>
//                 <input
//                     id="perGroupAllocation"
//                     type="text"
//                     style={{...styles.input, ...styles.disabledInput}}
//                     value={perGroupAllocation !== null ? `${(perGroupAllocation * 100).toFixed(1)}%` : '0.0%'}
//                     disabled
//                 />
//             </div>

//             <div style={styles.inputRow}>
//                 {/* Number of project groups */}
//                 <div style={styles.fieldGroup}>
//                     <label style={styles.label} htmlFor="numberOfGroups">Number of project groups</label>
//                     <input
//                         id="numberOfGroups"
//                         type="number"
//                         style={errors.numberOfGroups ? {...styles.input, ...styles.errorInput} : styles.input}
//                         value={numberOfGroups}
//                         onChange={(e) => setNumberOfGroups(e.target.value)}
//                     />
//                     {errors.numberOfGroups && <p style={styles.errorText}>{errors.numberOfGroups}</p>}
//                 </div>

//                 {/* Credit point value */}
//                 <div style={styles.fieldGroup}>
//                     <label style={styles.label} htmlFor="creditPointValue">Credit point value of subject</label>
//                     <select
//                         id="creditPointValue"
//                         style={styles.input}
//                         value={creditPointValue}
//                         onChange={(e) => setCreditPointValue(e.target.value)}
//                     >
//                         <option>10 CP</option>
//                         <option>20 CP over 1 term</option>
//                         <option>20 CP over 2 terms</option>
//                     </select>
//                 </div>
//             </div>

//             {/* Typical number of students */}
//             <div style={styles.fieldGroup}>
//                 <label style={styles.label} htmlFor="studentsPerGroup">Typical number of students in a group</label>
//                 <input
//                     id="studentsPerGroup"
//                     type="number"
//                     style={errors.studentsPerGroup ? {...styles.input, ...styles.errorInput} : styles.input}
//                     value={studentsPerGroup}
//                     onChange={(e) => setStudentsPerGroup(e.target.value)}
//                 />
//                 {errors.studentsPerGroup && <p style={styles.errorText}>{errors.studentsPerGroup}</p>}
//             </div>
            
//             <div style={styles.footer}>
//                 <button onClick={handleSave} style={styles.button}>
//                     Save
//                 </button>
            
//             </div>
//         </div>
//     );
// };

// // --- Inline Styles ---
// const styles = {
//     container: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6' },
//     inputRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' },
//     fieldGroup: { marginBottom: '1.5rem', display: 'flex', flexDirection: 'column' },
//     label: { display: 'flex', alignItems: 'center', fontWeight: '500', color: '#495057', marginBottom: '0.5rem', fontSize: '0.9rem' },
//     input: { width: '100%', padding: '0.75rem', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '1rem', boxSizing: 'border-box' },
//     disabledInput: { backgroundColor: '#e9ecef', color: '#495057', cursor: 'not-allowed' },
//     button: { padding: '0.6rem 1.2rem', fontSize: '1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500', backgroundColor: '#28a745', color: 'white' },
//     errorInput: { borderColor: '#dc3545', borderWidth: '1px' },
//     errorText: { color: '#dc3545', fontSize: '0.8rem', marginTop: '0.25rem', margin: 0 },
//     popupOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
//     popup: { backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', width: '90%', maxWidth: '400px' },
//     popupTitle: { marginTop: 0, color: '#343a40' },
//     popupText: { color: '#495057', lineHeight: '1.5' },
//     popupButton: { padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', backgroundColor: '#007bff', color: 'white', cursor: 'pointer', float: 'right' },
//     footer: { display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' },
//     toast: {
//         position: 'fixed',
//         bottom: '20px',
//         right: '20px',
//         backgroundColor: '#28a745',
//         color: 'white',
//         padding: '12px 20px',
//         borderRadius: '6px',
//         boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//         zIndex: 1001,
//         fontSize: '0.95rem',
//         fontWeight: '500',
//     }}

// export default PerGroupAllocationTab;
import React, { useState, useMemo, useEffect } from 'react';

// --- Main Component ---
const PerGroupAllocationTab = ({ onPerGroupAllocationChange, onProjectDataChange }) => {
    // --- State Management for Inputs ---
    const [numberOfGroups, setNumberOfGroups] = useState(5);
    const [creditPointValue, setCreditPointValue] = useState('10 CP');
    const [studentsPerGroup, setStudentsPerGroup] = useState(5);
    const [errors, setErrors] = useState({});

    // --- Calculation Logic based on your provided formula ---
    const perGroupAllocation = useMemo(() => {
        const numGroups = Number(numberOfGroups);
        const numStudents = Number(studentsPerGroup);
        const newErrors = {};

        // Validation
        if (isNaN(numGroups) || numGroups <= 0) {
            newErrors.numberOfGroups = "Invalid typical number of group. Must be a positive number.";
        }
        if (isNaN(numStudents) || numStudents < 1) {
            newErrors.studentsPerGroup = "Invalid typical number of students in a group. Must be a positive number.";
        }
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return 0; // Return 0 if there are errors
        }

        // Determine base rate from credit points
        let baseRate = 0;
        switch (creditPointValue) {
            case '10 CP': baseRate = 0.02; break;
            case '20 CP over 1 term': baseRate = 0.03; break;
            case '20 CP over 2 terms': baseRate = 0.04; break;
            default: baseRate = 0;
        }
        
        // Calculate student loading factor
        const studentLoading = numStudents > 0 ? 0.005 * (numStudents - 1) : 0;

        // Final Calculation: Number of Groups * (Base Rate + Student Loading)
        const totalAllocation = numGroups * (baseRate + studentLoading);
        
        return totalAllocation;

    }, [numberOfGroups, creditPointValue, studentsPerGroup]);

    // --- Effect to notify parent page of all changes ---
    useEffect(() => {
        // 1. Send the calculated workload allocation for this tab
        if (onPerGroupAllocationChange) {
            onPerGroupAllocationChange(perGroupAllocation);
        }
        
        // 2. Send the raw input numbers for the EFTSL calculation on the parent page
        if (onProjectDataChange) {
            onProjectDataChange(Number(numberOfGroups), Number(studentsPerGroup));
        }
    }, [perGroupAllocation, numberOfGroups, studentsPerGroup, onPerGroupAllocationChange, onProjectDataChange]);

    return (
        <div style={styles.container}>
            {/* Output Field */}
            <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="perGroupAllocation">
                    Per-group Allocation
                </label>
                <input
                    id="perGroupAllocation"
                    type="text"
                    style={{...styles.input, ...styles.disabledInput}}
                    value={`${(perGroupAllocation * 100).toFixed(1)}%`}
                    readOnly
                />
            </div>

            <div style={styles.inputRow}>
                {/* Number of project groups */}
                <div style={styles.fieldGroup}>
                    <label style={styles.label} htmlFor="numberOfGroups">Number of project groups</label>
                    <input
                        id="numberOfGroups"
                        type="number"
                        style={errors.numberOfGroups ? {...styles.input, ...styles.errorInput} : styles.input}
                        value={numberOfGroups}
                        onChange={(e) => setNumberOfGroups(e.target.value)}
                        min="1"
                    />
                    {errors.numberOfGroups && <p style={styles.errorText}>{errors.numberOfGroups}</p>}
                </div>

                {/* Credit point value */}
                <div style={styles.fieldGroup}>
                    <label style={styles.label} htmlFor="creditPointValue">Credit point value of subject</label>
                    <select
                        id="creditPointValue"
                        style={styles.input}
                        value={creditPointValue}
                        onChange={(e) => setCreditPointValue(e.target.value)}
                    >
                        <option>10 CP</option>
                        <option>20 CP over 1 term</option>
                        <option>20 CP over 2 terms</option>
                    </select>
                </div>
            </div>

            {/* Typical number of students */}
            <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="studentsPerGroup">Typical number of students in a group</label>
                <input
                    id="studentsPerGroup"
                    type="number"
                    style={errors.studentsPerGroup ? {...styles.input, ...styles.errorInput} : styles.input}
                    value={studentsPerGroup}
                    onChange={(e) => setStudentsPerGroup(e.target.value)}
                    min="1"
                />
                {errors.studentsPerGroup && <p style={styles.errorText}>{errors.studentsPerGroup}</p>}
            </div>
            
            <div style={styles.footer}>
                <button style={styles.button}>
                    Save
                </button>
            </div>
        </div>
    );
};

// --- Inline Styles ---
const styles = {
    container: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6' },
    inputRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' },
    fieldGroup: { marginBottom: '1.5rem', display: 'flex', flexDirection: 'column' },
    label: { display: 'flex', alignItems: 'center', fontWeight: '500', color: '#495057', marginBottom: '0.5rem', fontSize: '0.9rem' },
    input: { width: '100%', padding: '0.75rem', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '1rem', boxSizing: 'border-box' },
    disabledInput: { backgroundColor: '#e9ecef', color: '#495057', cursor: 'not-allowed', fontWeight: 'bold' },
    button: { padding: '0.6rem 1.2rem', fontSize: '1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500', backgroundColor: '#28a745', color: 'white' },
    errorInput: { borderColor: '#dc3545', borderWidth: '1px' },
    errorText: { color: '#dc3545', fontSize: '0.8rem', marginTop: '0.25rem', margin: 0 },
    footer: { display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' },
};

export default PerGroupAllocationTab;