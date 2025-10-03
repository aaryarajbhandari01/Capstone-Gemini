
// import React, { useState, useMemo, useEffect } from 'react';

// // --- Helper Icon Components ---
// const InfoIcon = ({ tooltip }) => {
//     const [isTooltipVisible, setIsTooltipVisible] = useState(false);

//     return (
//         <span 
//             style={styles.infoIconContainer}
//             onMouseEnter={() => setIsTooltipVisible(true)}
//             onMouseLeave={() => setIsTooltipVisible(false)}
//         >
//             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#6c757d', cursor: 'help' }}>
//                 <circle cx="12" cy="12" r="10"></circle>
//                 <line x1="12" y1="16" x2="12" y2="12"></line>
//                 <line x1="12" y1="8" x2="12.01" y2="8"></line>
//             </svg>
//             {isTooltipVisible && (
//                 <div style={styles.tooltip}>
//                     {tooltip}
//                 </div>
//             )}
//         </span>
//     );
// };

// const SaveIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
//         <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
//         <polyline points="17 21 17 13 7 13 7 21"></polyline>
//         <polyline points="7 3 7 8 15 8"></polyline>
//     </svg>
// );

// // --- Tooltip Content ---
// const BASE_ALLOCATION_INFO = "The base allocation covers subject coordination and teaching tasks that are independent of the number of deliveries and the number of students: (i) preparation of the Learning Guide; (ii) managing the vUWS site; (iii) preparation of assessment items and tutorial/lab/practical tasks; (iv) keeping current in the relevant discipline area; (v) teaching team and assessment meetings; and (vi) any other tasks that are independent of the number of deliveries and the number of students. ";
// const ADMIN_LOADING_INFO = "If in a subject taught on campus, the School or the University requires special arrangements for offshore or online students to be made that result in substantial additional workload (e.g. creating online versions for in-class assessments), an administrative loading of up to 2% to the base allocation can be claimed. If a claim is made, provide details below. ";


// // --- Main Base Allocation Tab Component ---
// export default function SWBaseAllocationTab({  subjectCode, term, onAllocationChange, onBaseAllocationChange, ...otherProps }) {
//     const [adminLoading, setAdminLoading] = useState(0); // Stored as a decimal (e.g., 0.01 for 1%)
//     const [adminLoadingInputValue, setAdminLoadingInputValue] = useState('0.0'); // String state for the input field
//     const [details, setDetails] = useState('');
//     const [errors, setErrors] = useState({});

//     // Calculate Base Allocation based on the formula: 3% + Administrative Loading
//     const baseAllocation = useMemo(() => {
//         const fixedBase = 0.03;
//         if (subjectCode && term && !errors.administrativeLoading) {
//             return fixedBase + adminLoading;
//         }
//         return fixedBase;
//     }, [adminLoading, errors.administrativeLoading, subjectCode, term]);

//     // Run validation logic whenever relevant fields change
//     useEffect(() => {
//         const newErrors = {};
//         if (adminLoading > 0.02) {
//             newErrors.administrativeLoading = 'Administrative loading cannot exceed 2%.';
//         }
//         if (adminLoading > 0 && !details.trim()) {
//             newErrors.details = 'Details are required to justify the administrative loading claim.';
//         }
//         setErrors(newErrors);
//     }, [adminLoading, details]);

//     // Handler for the Administrative Loading input field
//     const handleAdminLoadingChange = (e) => {
//         const value = e.target.value;
//         const regex = /^[0-9]*\.?[0-9]*$/;
//         if (regex.test(value)) {
//             setAdminLoadingInputValue(value);
//             const numericValue = parseFloat(value);
//             setAdminLoading(isNaN(numericValue) ? 0 : numericValue / 100);
//         }
//     };
    
//     // Handler for saving data
//     const handleSave = () => {
//         if (Object.keys(errors).length > 0) {
//             alert("Please fix the validation errors before saving.");
//             return;
//         }
//         console.log("Saving data:", { baseAllocation, administrativeLoading: adminLoading, details });
//         alert("Workload details saved successfully!");
//     };

//     const formatPercentageForInput = (decimal) => (decimal * 100).toFixed(1);

//     return (
//         <div style={styles.container}>
//             <div style={styles.formGroup}>
//                 <label htmlFor="baseAllocation" style={styles.label}>
//                     Base Allocation
//                     <InfoIcon tooltip={BASE_ALLOCATION_INFO} />
//                 </label>
//                 <input
//                     type="text"
//                     id="baseAllocation"
//                     value={`${formatPercentageForInput(baseAllocation)}%`}
//                     readOnly
//                     style={styles.inputReadOnly}
//                 />
//             </div>

//             <div style={styles.formGroup}>
//                 <label htmlFor="adminLoading" style={styles.label}>
//                     Administrative Loading
//                     <InfoIcon tooltip={ADMIN_LOADING_INFO} />
//                 </label>
//                 <div style={styles.inputWrapper}>
//                     <input
//                         type="text"
//                         id="adminLoading"
//                         value={adminLoadingInputValue}
//                         onChange={handleAdminLoadingChange}
//                         placeholder="0.0"
//                         style={errors.administrativeLoading ? { ...styles.input, ...styles.inputError } : styles.input}
//                     />
//                     <span style={styles.percentSign}>%</span>
//                 </div>
//                 {errors.administrativeLoading && <p style={styles.errorText}>{errors.administrativeLoading}</p>}
//             </div>

//             <div style={styles.formGroup}>
//                 <label htmlFor="details" style={styles.label}>
//                     Details
//                 </label>
//                 <textarea
//                     id="details"
//                     placeholder="If a claim is made, provide details."
//                     value={details}
//                     onChange={(e) => setDetails(e.target.value)}
//                     style={errors.details ? { ...styles.textarea, ...styles.inputError } : styles.textarea}
//                     rows="4"
//                 />
//                 {errors.details && <p style={styles.errorText}>{errors.details}</p>}
//             </div>
            
//             <div style={styles.buttonContainer}>
//                  <button onClick={handleSave} style={styles.saveButton}>
//                     <SaveIcon />
//                     Save
//                 </button>
//             </div>
//         </div>
//     );
// }

// // --- Inline Styles for the Component ---
// const styles = {
//     container: { backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid #dee2e6' },
//     formGroup: { marginBottom: '1.5rem' },
//     label: { display: 'flex', alignItems: 'center', fontWeight: '500', color: '#343a40', marginBottom: '0.5rem' },
//     inputWrapper: { position: 'relative', width: '220px' },
//     input: { width: '100%', padding: '0.75rem 2rem 0.75rem 0.75rem', fontSize: '1rem', border: '1px solid #ced4da', borderRadius: '6px', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s' },
//     inputReadOnly: { width: '220px', padding: '0.75rem', fontSize: '1rem', border: '1px solid #ced4da', borderRadius: '6px', backgroundColor: '#e9ecef', color: '#495057', cursor: 'not-allowed' },
//     percentSign: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#495057', pointerEvents: 'none' },
//     inputError: { borderColor: '#dc3545', boxShadow: '0 0 0 0.2rem rgba(220, 53, 69, 0.25)' },
//     textarea: { width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid #ced4da', borderRadius: '6px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' },
//     errorText: { color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' },
//     buttonContainer: { display: 'flex', justifyContent: 'flex-start', marginTop: '1rem' },
//     saveButton: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.6rem 1.5rem', fontSize: '1rem', fontWeight: '500', color: '#fff', backgroundColor: '#28a745', border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'background-color 0.2s' },
//     // --- NEW STYLES FOR CUSTOM TOOLTIP ---
//     infoIconContainer: {
//         position: 'relative',
//         display: 'inline-flex',
//         alignItems: 'center',
//         marginLeft: '8px',
//     },
//     tooltip: {
//         position: 'absolute',
//         bottom: '140%', // Position it above the icon
//         left: '50%',
//         transform: 'translateX(-50%)',
//         backgroundColor: '#343a40',
//         color: '#fff',
//         padding: '10px 15px',
//         borderRadius: '6px',
//         width: '320px', // Set a comfortable width
//         zIndex: 10,
//         fontSize: '0.875rem',
//         textAlign: 'left',
//         lineHeight: '1.5',
//         boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//         visibility: 'visible',
//         opacity: 1,
//         transition: 'opacity 0.2s',
//     },
// };

import React, { useState, useMemo, useEffect } from 'react';

// --- Helper Icon Components ---
const InfoIcon = ({ tooltip }) => {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    return (
        <span 
            style={styles.infoIconContainer}
            onMouseEnter={() => setIsTooltipVisible(true)}
            onMouseLeave={() => setIsTooltipVisible(false)}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#6c757d', cursor: 'help' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            {isTooltipVisible && (
                <div style={styles.tooltip}>
                    {tooltip}
                </div>
            )}
        </span>
    );
};

const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
);

// --- Tooltip Content ---
const BASE_ALLOCATION_INFO = "The base allocation covers subject coordination and teaching tasks that are independent of the number of deliveries and the number of students: (i) preparation of the Learning Guide; (ii) managing the vUWS site; (iii) preparation of assessment items and tutorial/lab/practical tasks; (iv) keeping current in the relevant discipline area; (v) teaching team and assessment meetings; and (vi) any other tasks that are independent of the number of deliveries and the number of students. ";
const ADMIN_LOADING_INFO = "If in a subject taught on campus, the School or the University requires special arrangements for offshore or online students to be made that result in substantial additional workload (e.g. creating online versions for in-class assessments), an administrative loading of up to 2% to the base allocation can be claimed. If a claim is made, provide details below. ";


// --- Main Base Allocation Tab Component ---
export default function SWBaseAllocationTab({ subjectCode, term, onBaseAllocationChange }) {
    const [adminLoading, setAdminLoading] = useState(0); // Stored as a decimal (e.g., 0.01 for 1%)
    const [adminLoadingInputValue, setAdminLoadingInputValue] = useState('0.0'); // String state for the input field
    const [details, setDetails] = useState('');
    const [errors, setErrors] = useState({});

    // Calculate Base Allocation based on the formula: 3% + Administrative Loading
    const baseAllocation = useMemo(() => {
        const fixedBase = 0.03;
        if (subjectCode && term && !errors.administrativeLoading) {
            return fixedBase + adminLoading;
        }
        return fixedBase;
    }, [adminLoading, errors.administrativeLoading, subjectCode, term]);

    // --- CRUCIAL FIX ---
    // This effect ensures the parent component (SubjectWorkloadPage) is always
    // aware of the latest calculated baseAllocation value.
    useEffect(() => {
        if (onBaseAllocationChange) {
            onBaseAllocationChange(baseAllocation);
        }
    }, [baseAllocation, onBaseAllocationChange]);


    // Run validation logic whenever relevant fields change
    useEffect(() => {
        const newErrors = {};
        if (adminLoading > 0.02) {
            newErrors.administrativeLoading = 'Administrative loading cannot exceed 2%.';
        }
        if (adminLoading > 0 && !details.trim()) {
            newErrors.details = 'Details are required to justify the administrative loading claim.';
        }
        setErrors(newErrors);
    }, [adminLoading, details]);

    // Handler for the Administrative Loading input field
    const handleAdminLoadingChange = (e) => {
        const value = e.target.value;
        const regex = /^[0-9]*\.?[0-9]*$/;
        if (regex.test(value)) {
            setAdminLoadingInputValue(value);
            const numericValue = parseFloat(value);
            setAdminLoading(isNaN(numericValue) ? 0 : numericValue / 100);
        }
    };
    
    // Handler for saving data
    const handleSave = () => {
        if (Object.keys(errors).length > 0) {
            alert("Please fix the validation errors before saving.");
            return;
        }
        console.log("Saving data:", { baseAllocation, administrativeLoading: adminLoading, details });
        alert("Workload details saved successfully!");
    };

    const formatPercentageForInput = (decimal) => (decimal * 100).toFixed(1);

    return (
        <div style={styles.container}>
            <div style={styles.formGroup}>
                <label htmlFor="baseAllocation" style={styles.label}>
                    Base Allocation
                    <InfoIcon tooltip={BASE_ALLOCATION_INFO} />
                </label>
                <input
                    type="text"
                    id="baseAllocation"
                    value={`${formatPercentageForInput(baseAllocation)}%`}
                    readOnly
                    style={styles.inputReadOnly}
                />
            </div>

            <div style={styles.formGroup}>
                <label htmlFor="adminLoading" style={styles.label}>
                    Administrative Loading
                    <InfoIcon tooltip={ADMIN_LOADING_INFO} />
                </label>
                <div style={styles.inputWrapper}>
                    <input
                        type="text"
                        id="adminLoading"
                        value={adminLoadingInputValue}
                        onChange={handleAdminLoadingChange}
                        placeholder="0.0"
                        style={errors.administrativeLoading ? { ...styles.input, ...styles.inputError } : styles.input}
                    />
                    <span style={styles.percentSign}>%</span>
                </div>
                {errors.administrativeLoading && <p style={styles.errorText}>{errors.administrativeLoading}</p>}
            </div>

            <div style={styles.formGroup}>
                <label htmlFor="details" style={styles.label}>
                    Details
                </label>
                <textarea
                    id="details"
                    placeholder="If a claim is made, provide details."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    style={errors.details ? { ...styles.textarea, ...styles.inputError } : styles.textarea}
                    rows="4"
                />
                {errors.details && <p style={styles.errorText}>{errors.details}</p>}
            </div>
            
            <div style={styles.buttonContainer}>
                 <button onClick={handleSave} style={styles.saveButton}>
                    <SaveIcon />
                    Save
                </button>
            </div>
        </div>
    );
}

// --- Inline Styles for the Component ---
const styles = {
    container: { backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid #dee2e6' },
    formGroup: { marginBottom: '1.5rem' },
    label: { display: 'flex', alignItems: 'center', fontWeight: '500', color: '#343a40', marginBottom: '0.5rem' },
    inputWrapper: { position: 'relative', width: '220px' },
    input: { width: '100%', padding: '0.75rem 2rem 0.75rem 0.75rem', fontSize: '1rem', border: '1px solid #ced4da', borderRadius: '6px', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s' },
    inputReadOnly: { width: '220px', padding: '0.75rem', fontSize: '1rem', border: '1px solid #ced4da', borderRadius: '6px', backgroundColor: '#e9ecef', color: '#495057', cursor: 'not-allowed' },
    percentSign: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#495057', pointerEvents: 'none' },
    inputError: { borderColor: '#dc3545', boxShadow: '0 0 0 0.2rem rgba(220, 53, 69, 0.25)' },
    textarea: { width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid #ced4da', borderRadius: '6px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' },
    errorText: { color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' },
    buttonContainer: { display: 'flex', justifyContent: 'flex-start', marginTop: '1rem' },
    saveButton: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.6rem 1.5rem', fontSize: '1rem', fontWeight: '500', color: '#fff', backgroundColor: '#28a745', border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'background-color 0.2s' },
    // --- NEW STYLES FOR CUSTOM TOOLTIP ---
    infoIconContainer: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        marginLeft: '8px',
    },
    tooltip: {
        position: 'absolute',
        bottom: '140%', // Position it above the icon
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#343a40',
        color: '#fff',
        padding: '10px 15px',
        borderRadius: '6px',
        width: '320px', // Set a comfortable width
        zIndex: 10,
        fontSize: '0.875rem',
        textAlign: 'left',
        lineHeight: '1.5',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        visibility: 'visible',
        opacity: 1,
        transition: 'opacity 0.2s',
    },
};

