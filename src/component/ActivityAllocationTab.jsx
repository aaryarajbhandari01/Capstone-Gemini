

// import React, { useState, useMemo, useEffect, useContext } from 'react';

// import { StaffRolesContext } from '../StaffRolesContext'; // Ensure this path is correct


// // --- SVG ICONS ---
// const InfoIcon = ({ onClick }) => (
//     <svg 
//         onClick={onClick}
//         width="22" height="22" viewBox="0 0 24 24" 
//         fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" 
//         style={{ color: '#6c757d', marginTop: '2px', cursor: 'pointer' }} >
//         <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
//     </svg>
// );
// const EditIcon = ({ onClick }) => ( <span onClick={onClick} style={{ cursor: 'pointer', fontSize: '18px' }}>✏️</span> );
// const SaveRowIcon = ({ onClick }) => ( <span onClick={onClick} style={{ cursor: 'pointer', fontSize: '18px', color: '#28a745' }}>✓</span> );
// const CancelIcon = ({ onClick }) => ( <span onClick={onClick} style={{ cursor: 'pointer', fontSize: '18px', color: '#dc3545' }}>✗</span> );


// const ActivityAllocationTab = ({ term = 'Autumn', onAllocationChange = () => {}, numberOfStudents = 100, onActivityDataChange = () => {} }) => {
//     const { definedRoles: staffRoles } = useContext(StaffRolesContext);

//     const [activities, setActivities] = useState([
//         { id: 1, activityName: 'Tutorial', numberOfGroups: 5, maxGroupSize: 25, weeklyClassTime: 2, justification: '', notes: '', distribution: {'Subject Coordinator': {'Preparation / Setup': 0.000, 'Delivery / Supervision': 0.000}} },
//         { id: 2, activityName: 'Practical', numberOfGroups: '', maxGroupSize: '', weeklyClassTime: '', justification: '', notes: '', distribution: {} },
//         { id: 3, activityName: 'Lab', numberOfGroups: '', maxGroupSize: '', weeklyClassTime: '', justification: '', notes: '', distribution: {} },
//     ]);
    
//     // --- STATE VARIABLES ---
//     const [activeActivityId, setActiveActivityId] = useState(activities.length > 0 ? activities[0].id : null);
//     const [editingRole, setEditingRole] = useState(null); 
//     const [tempDistribution, setTempDistribution] = useState(null);
//     const [showSuccessMessage, setShowSuccessMessage] = useState(false);
//     const [isInfoVisible, setIsInfoVisible] = useState(false);
//     const [errors, setErrors] = useState({});

//     const staffColumns = useMemo(() => {
//         const rolesFromContext = staffRoles || [];
//         return ['Subject Coordinator', ...rolesFromContext.map(r => r.name)];
//     }, [staffRoles]);
    
//     const activeActivity = activities.find(a => a.id === activeActivityId);

//     // --- VALIDATION LOGIC ---
//     useEffect(() => {
//         const newErrors = {};
//         if (activeActivity) {
//             const maxGroupSize = Number(activeActivity.maxGroupSize) || 0;
//             const actualGroups = Number(activeActivity.numberOfGroups) || 0;
//             const justification = activeActivity.justification.trim();

//             // Validation: Justification is needed if the number of groups is higher than theoretically required.
//             if (maxGroupSize > 0 && actualGroups > 0 && numberOfStudents > 0) {
//                 // CEILING((B$55/D66*1.1),1) -> CEILING((students/maxSize)*1.1, 1)
//                 const requiredGroups = Math.ceil((numberOfStudents / maxGroupSize) * 1.1);
                
//                 if (actualGroups > requiredGroups && justification === '') {
//                     newErrors.justification = `Justification is required because the number of groups (${actualGroups}) exceeds the calculated need of ${requiredGroups} for ${numberOfStudents} students.`;
//                 }
//             }
//         }
//         setErrors(newErrors);
//     }, [activeActivity, numberOfStudents]);

//     // // ADD THIS NEW useEffect HOOK for per stud per act allocation
//     // useEffect(() => {
//     //     // We only need to pass the essential data for validation
//     //     const validationData = activities.map(act => ({
//     //         id: act.id,
//     //         name: act.activityName,
//     //         numberOfGroups: parseInt(act.numberOfGroups, 10) || 0,
//     //     }));
//     //     onActivityDataChange(validationData);
//     // }, [activities, onActivityDataChange]);

//     const calculatedData = useMemo(() => {
//         const termMultiplier = term === 'Autumn' ? 1.0 : 0.923;
//         let grandTotal = 0;
//         const activityAllocations = activities.map(activity => {
//             const numGroups = Number(activity.numberOfGroups) || 0;
//             const classTime = Number(activity.weeklyClassTime) || 0;
//             const allocation = numGroups * classTime * termMultiplier * 0.0125;
//             grandTotal += allocation;
//             return { id: activity.id, allocation };
//         });
//         return { grandTotal, activityAllocations };
//     }, [activities, term]);

//     useEffect(() => {
//         if (onAllocationChange) {
//             onAllocationChange(calculatedData.grandTotal);
//         }
//     }, [calculatedData.grandTotal, onAllocationChange]);

//     //Update the existing useEffect to send the full 'activities' object
//     useEffect(() => {
//         onActivityDataChange(activities); // Send the complete data
//     }, [activities, onActivityDataChange]);
    
//     // --- INPUT HANDLERS ---
//     const handleInputChange = (id, field, value) => {
//         setActivities(prev =>
//             prev.map(activity =>
//                 activity.id === id ? { ...activity, [field]: value } : activity
//             )
//         );
//     };

//     const handleAddActivity = () => {
//         const newId = activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1;
//         const newActivity = {
//             id: newId,
//             activityName: `Activity ${activities.length + 1}`,
//             numberOfGroups: '', maxGroupSize: '', weeklyClassTime: '', justification: '', notes: '', distribution: {},
//         };
//         setActivities(prev => [...prev, newActivity]);
//         setActiveActivityId(newId);
//     };
    
//     // --- EDITING HANDLERS ---
//     const handleEditRow = (role, currentDistribution) => {
//         setEditingRole(role);
//         const prepValue = currentDistribution?.['Preparation / Setup'] || 0;
//         const deliveryValue = currentDistribution?.['Delivery / Supervision'] || 0;
//         setTempDistribution({ 
//             'Preparation / Setup': (prepValue * 100).toString(), 
//             'Delivery / Supervision': (deliveryValue * 100).toString() 
//         });
//     };
    
//     const handleCancelEdit = () => { setEditingRole(null); setTempDistribution(null); };
    
//     const handleTempDistChange = (task, value) => {
//         // This regex ensures only numbers and a single decimal point can be entered
//         if (/^[0-9]*\.?[0-9]*$/.test(value)) {
//             setTempDistribution(prev => ({ ...prev, [task]: value }));
//         }
//     };

//     const handleSaveRow = (activityId, role) => {
//         setActivities(prev =>
//             prev.map(act => {
//                 if (act.id !== activityId) return act;
//                 const newDistribution = { ...(act.distribution || {}) };
//                 if (!newDistribution[role]) newDistribution[role] = {};
                
//                 // Convert the stored text back to a decimal number
//                 const prepValue = parseFloat(tempDistribution['Preparation / Setup']) || 0;
//                 const deliveryValue = parseFloat(tempDistribution['Delivery / Supervision']) || 0;

//                 newDistribution[role]['Preparation / Setup'] = prepValue / 100;
//                 newDistribution[role]['Delivery / Supervision'] = deliveryValue / 100;
//                 return { ...act, distribution: newDistribution };
//             })
//         );
//         handleCancelEdit(); 
//     };

//     const handleSaveChanges = () => {
//         console.log("Saving data:", activities);
//         setShowSuccessMessage(true);
//         setTimeout(() => { setShowSuccessMessage(false); }, 3000);
//     };
    
//     const activityAllocation = activeActivity ? calculatedData.activityAllocations.find(a => a.id === activeActivity.id)?.allocation || 0 : 0;
//     const isSaveDisabled = Object.keys(errors).length > 0;
    
//     return (
//         <div style={styles.container}>
//             <div style={styles.header}>
//                 <div style={styles.titleContainer}>
//                     <h3 style={styles.title}>Activity Allocation</h3>
//                     <InfoIcon onClick={() => setIsInfoVisible(true)} />
//                     {isInfoVisible && (
//                         <div style={styles.infoPopup}>
//                              <button style={styles.infoCloseButton} onClick={() => setIsInfoVisible(false)}>&times;</button>
//                              <p style={styles.infoText}>
//                                 For each small-group activity (such as tutorials, practicals or labs), enter the maximal number of students per group as per curriculum approval documents, the weekly class time per group, and the number of groups...
//                              </p>
//                         </div>
//                     )}
//                 </div>
//                 <button style={styles.addButton} onClick={handleAddActivity}>+ Add</button>
//             </div>

//             <div style={styles.activityTabsContainer}>
//                 {activities.map((activity, index) => (
//                     <button
//                         key={activity.id}
//                         style={{...styles.activityTab, ...(activity.id === activeActivityId ? styles.activityTabActive : {}), ...(index === activities.length - 1 ? { borderRight: 'none' } : {})}}
//                         onClick={() => setActiveActivityId(activity.id)} >
//                        <span style={styles.tabTextBold}>{`Activity ${index + 1}`}</span>
//                        <span style={styles.tabTextNormal}>{activity.activityName}</span>
//                     </button>
//                 ))}
//             </div>
            
//             <div style={styles.contentBody}>
//                 {activeActivity && (
//                     <>
//                         <div style={styles.inputGrid}>
//                             <div>
//                                 <label style={styles.label}>{`${activeActivity.activityName} Allocation`}</label>
//                                 {/* ✅ FIX 2a: Round the allocation value to 1 decimal place */}
//                                 <input style={styles.inputReadOnly} type="text" readOnly value={`${(activityAllocation * 100).toFixed(1)}%`} />
//                             </div>
//                             <div>
//                                 <label style={styles.label}>Number of groups</label>
//                                 <input style={styles.input} type="number" min="0" value={activeActivity.numberOfGroups} onChange={(e) => handleInputChange(activeActivity.id, 'numberOfGroups', e.target.value)} />
//                             </div>
//                             <div>
//                                 <label style={styles.label}>Max group size per curriculum approval documents</label>
//                                 <input style={styles.input} type="number" min="0" value={activeActivity.maxGroupSize} onChange={(e) => handleInputChange(activeActivity.id, 'maxGroupSize', e.target.value)} />
//                             </div>
//                             <div>
//                                 <label style={styles.label}>Weekly class time per group over 12 weeks in hours</label>
//                                 <input style={styles.input} type="number" min="0" step="0.5" value={activeActivity.weeklyClassTime} onChange={(e) => handleInputChange(activeActivity.id, 'weeklyClassTime', e.target.value)} />
//                             </div>
//                         </div>

//                         <div style={styles.justificationContainer}>
//                             <label style={styles.label}>If a justification for the number of groups is required for any activity, provide details below.</label>
//                             <textarea style={{...styles.textarea, ...(errors.justification && styles.errorBorder)}} value={activeActivity.justification} onChange={(e) => handleInputChange(activeActivity.id, 'justification', e.target.value)} rows="3" />
//                             {errors.justification && <div style={styles.errorText}>{errors.justification}</div>}
//                         </div>

//                         <hr style={styles.hr} />
//                         <h4 style={styles.subHeader}>Allocation per weekly hour per group</h4>
                        
//                         <table style={styles.table}>
//                            <thead>
//                                 <tr>
//                                     <th style={{...styles.th, width: '100px'}}>Actions</th>
//                                     <th style={styles.th}>Staff Role</th>
//                                     <th style={{...styles.th, textAlign: 'right'}}>Preparation / Setup</th>
//                                     <th style={{...styles.th, textAlign: 'right'}}>Delivery / Supervision</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {staffColumns.map(role => {
//                                     const isEditing = editingRole === role;
//                                     const currentDistribution = activeActivity.distribution?.[role];
                                    
//                                     // ✅ FIX 2b: Round the display values to 3 decimal places
//                                     const formatDisplayValue = (val) => val === '' ? '0.000%' : `${(Number(val) * 100).toFixed(3)}%`;
                                    
//                                     return (
//                                         <tr key={role}>
//                                             <td style={styles.td}>
//                                                 <div style={styles.actionCell}>{isEditing ? (<><SaveRowIcon onClick={() => handleSaveRow(activeActivity.id, role)} /><CancelIcon onClick={handleCancelEdit} /></>) : (<EditIcon onClick={() => handleEditRow(role, currentDistribution)} />)}</div>
//                                             </td>
//                                             <td style={styles.td}>{role}</td>
                                            
//                                             {/* ✅ FIX 1d: Update the inputs to use the new string-based state */}
//                                             <td style={styles.td}>{isEditing ? ( <input type="text" style={styles.tableInput} value={tempDistribution['Preparation / Setup']} onChange={(e) => handleTempDistChange('Preparation / Setup', e.target.value)} autoFocus /> ) : ( <div style={styles.tableText}>{formatDisplayValue(currentDistribution?.['Preparation / Setup'] || 0)}</div> )}</td>
//                                             <td style={styles.td}>{isEditing ? ( <input type="text" style={styles.tableInput} value={tempDistribution['Delivery / Supervision']} onChange={(e) => handleTempDistChange('Delivery / Supervision', e.target.value)} /> ) : ( <div style={styles.tableText}>{formatDisplayValue(currentDistribution?.['Delivery / Supervision'] || 0)}</div> )}</td>
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>
//                     </>
//                 )}
//             </div>

//             <div style={styles.footer}>
//                 <button style={{...styles.saveButton, ...(isSaveDisabled && styles.disabledButton)}} onClick={handleSaveChanges} disabled={isSaveDisabled}>💾 Save</button>
//                 {showSuccessMessage && ( <div style={styles.successMessage}>✓ Successfully saved!</div> )}
//             </div>
//         </div>

             
//     );
// };

// // --- STYLES ---
// const styles = {
//     container: { padding: '2.5rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0', fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'`, },
//     header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', },
//     titleContainer: { position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem', },
//     title: { margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#212529', },
//     infoPopup: { position: 'absolute', top: 'calc(100% + 10px)', left: 0, width: '400px', backgroundColor: '#fff', border: '1px solid #ced4da', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, },
//     infoCloseButton: { position: 'absolute', top: '8px', right: '12px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6c757d' },
//     infoText: { margin: 0, fontSize: '14px', color: '#495057', lineHeight: 1.6 },
//     addButton: { padding: '0.6rem 1.25rem', fontSize: '0.9rem', backgroundColor: '#212529', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', },
//     activityTabsContainer: { display: 'inline-flex', border: '1px solid #adb5bd', borderRadius: '100px', overflow: 'hidden', },
//     activityTab: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#ffffff', border: 'none', borderRight: '1px solid #adb5bd', padding: '0.5rem 1.25rem', cursor: 'pointer', color: '#212529', transition: 'background-color 0.2s', },
//     activityTabActive: { background: '#212529', color: '#ffffff', },
//     tabTextBold: { fontWeight: 'bold', fontSize: '12px', },
//     tabTextNormal: { fontWeight: '500', fontSize: '14px', marginTop: '2px', },
//     contentBody: { paddingTop: '2rem', },
//     inputGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem 2rem', },
//     label: { display: 'block', marginBottom: '0.5rem', color: '#495057', fontSize: '13px', fontWeight: '500', },
//     input: { width: '100%', padding: '0.9rem 1rem', border: '1px solid #ced4da', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box', },
//     inputReadOnly: { width: '100%', padding: '0.9rem 1rem', border: '1px solid #ced4da', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box', backgroundColor: '#f0f0f0', fontWeight: 'bold', color: '#212529' },
//     justificationContainer: { marginTop: '1.5rem', },
//     textarea: { width: '100%', padding: '0.9rem 1rem', border: '1px solid #ced4da', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box', fontFamily: `inherit`, resize: 'vertical', backgroundColor: '#f8f9fa' },
//     hr: { border: 'none', borderTop: '1px solid #e0e0e0', margin: '2.5rem 0', },
//     subHeader: { fontSize: '1.25rem', fontWeight: '600', color: '#212529', margin: '0 0 1.5rem 0', },
//     table: { width: '100%', borderCollapse: 'collapse', },
//     th: { textAlign: 'left', padding: '0.75rem 1rem', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #e0e0e0', color: '#495057', fontWeight: 'normal', fontSize: '14px' },
//     td: { padding: '0.5rem 1rem', border: 'none', borderBottom: '1px solid #e0e0e0', verticalAlign: 'middle', },
//     actionCell: { display: 'flex', gap: '1rem', alignItems: 'center' },
//     tableInput: { width: '100%', padding: '0.5rem', border: '1px solid #007bff', borderRadius: '4px', backgroundColor: '#f8f9fa', textAlign: 'right', fontSize: '1rem', color: '#212529', outline: 'none', boxSizing: 'border-box', },
//     tableText: { width: '100%', padding: '0.5rem', textAlign: 'right', fontSize: '1rem', color: '#212529', boxSizing: 'border-box', },
//     footer: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '2.5rem', paddingTop: '1.5rem', gap: '1rem' },
//     saveButton: { padding: '0.7rem 1.5rem', fontSize: '0.9rem', backgroundColor: '#212529', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', transition: 'background-color 0.2s' },
//     disabledButton: { backgroundColor: '#6c757d', cursor: 'not-allowed' },
//     successMessage: { padding: '0.7rem 1.5rem', backgroundColor: '#e9f7ef', color: '#28a745', border: '1px solid #a3e9a4', borderRadius: '8px', fontWeight: '500', animation: 'fadeInOut 3s forwards' },
//     errorText: { color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' },
//     errorBorder: { border: '1px solid #dc3545' }
// };

// const styleSheet = document.createElement("style");
// styleSheet.type = "text/css";
// styleSheet.innerText = `@keyframes fadeInOut { 0% { opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; } }`;
// document.head.appendChild(styleSheet);

// export default ActivityAllocationTab;

import React, { useState, useMemo, useEffect, useContext } from 'react';
import { StaffRolesContext } from '../StaffRolesContext';
// --- SVG ICONS ---
const InfoIcon = ({ onClick }) => (
    <svg
        onClick={onClick}
        width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ color: '#6c757d', marginTop: '2px', cursor: 'pointer' }} >
        <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);
const EditIcon = ({ onClick }) => ( <span onClick={onClick} style={{ cursor: 'pointer', fontSize: '18px' }}>✏️</span> );
const SaveRowIcon = ({ onClick }) => ( <span onClick={onClick} style={{ cursor: 'pointer', fontSize: '18px', color: '#28a745' }}>✓</span> );
const CancelIcon = ({ onClick }) => ( <span onClick={onClick} style={{ cursor: 'pointer', fontSize: '18px', color: '#dc3545' }}>✗</span> );

const ActivityAllocationTab = ({ term = 'Autumn', onAllocationChange = () => {}, numberOfStudents = 100 }) => {
    const { definedRoles: staffRoles } = useContext(StaffRolesContext);
    const [activities, setActivities] = useState([
        { id: 1, activityName: 'Tutorial', numberOfGroups: 5, maxGroupSize: 25, weeklyClassTime: 2, justification: '', notes: '', distribution: {'Subject Coordinator': {'Preparation / Setup': 0.000, 'Delivery / Supervision': 0.000}} },
        { id: 2, activityName: 'Practical', numberOfGroups: '', maxGroupSize: '', weeklyClassTime: '', justification: '', notes: '', distribution: {} },
        { id: 3, activityName: 'Lab', numberOfGroups: '', maxGroupSize: '', weeklyClassTime: '', justification: '', notes: '', distribution: {} },
    ]);
    const [activeActivityId, setActiveActivityId] = useState(activities.length > 0 ? activities[0].id : null);
    const [editingRole, setEditingRole] = useState(null);
    const [tempDistribution, setTempDistribution] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isInfoVisible, setIsInfoVisible] = useState(false);
    const [errors, setErrors] = useState({});

    const staffColumns = useMemo(() => {
        const rolesFromContext = staffRoles || [];
        return ['Subject Coordinator', ...rolesFromContext.map(r => r.name)];
    }, [staffRoles]);

    const activeActivity = activities.find(a => a.id === activeActivityId);

    // --- VALIDATION LOGIC ---
    useEffect(() => {
        const newErrors = {};
        if (activeActivity) {
            const maxGroupSize = Number(activeActivity.maxGroupSize) || 0;
            const actualGroups = Number(activeActivity.numberOfGroups) || 0;
            const justification = activeActivity.justification.trim();
            if (maxGroupSize > 0 && actualGroups > 0 && numberOfStudents > 0) {
                const requiredGroups = Math.ceil((numberOfStudents / maxGroupSize) * 1.1);
                if (actualGroups > requiredGroups && justification === '') {
                    newErrors.justification = `Justification is required because the number of groups (${actualGroups}) exceeds the calculated need of ${requiredGroups} for ${numberOfStudents} students.`;
                }
            }
        }
        setErrors(newErrors);
    }, [activeActivity, numberOfStudents]);

    const calculatedData = useMemo(() => {
        const termMultiplier = term === 'Autumn' ? 1.0 : 0.923;
        let grandTotal = 0;
        const activityAllocations = activities.map(activity => {
            const numGroups = Number(activity.numberOfGroups) || 0;
            const classTime = Number(activity.weeklyClassTime) || 0;
            const allocation = numGroups * classTime * termMultiplier * 0.0125;
            grandTotal += allocation;
            return { id: activity.id, allocation };
        });
        return { grandTotal, activityAllocations };
    }, [activities, term]);

    useEffect(() => {
        if (onAllocationChange) {
            onAllocationChange(calculatedData.grandTotal);
        }
    }, [calculatedData.grandTotal, onAllocationChange]);

    const handleInputChange = (id, field, value) => {
        setActivities(prev =>
            prev.map(activity =>
                activity.id === id ? { ...activity, [field]: value } : activity
            )
        );
    };

    const handleAddActivity = () => {
        const newId = activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1;
        const newActivity = {
            id: newId,
            activityName: `Activity ${activities.length + 1}`,
            numberOfGroups: '', maxGroupSize: '', weeklyClassTime: '', justification: '', notes: '', distribution: {},
        };
        setActivities(prev => [...prev, newActivity]);
        setActiveActivityId(newId);
    };

    const handleEditRow = (role, currentDistribution) => {
        setEditingRole(role);
        const prepValue = currentDistribution?.['Preparation / Setup'] || 0;
        const deliveryValue = currentDistribution?.['Delivery / Supervision'] || 0;
        setTempDistribution({
            'Preparation / Setup': (prepValue * 100).toString(),
            'Delivery / Supervision': (deliveryValue * 100).toString()
        });
    };

    const handleCancelEdit = () => { setEditingRole(null); setTempDistribution(null); };

    const handleTempDistChange = (task, value) => {
        if (/^[0-9]*\.?[0-9]*$/.test(value)) {
            setTempDistribution(prev => ({ ...prev, [task]: value }));
        }
    };

    const handleSaveRow = (activityId, role) => {
        setActivities(prev =>
            prev.map(act => {
                if (act.id !== activityId) return act;
                const newDistribution = { ...(act.distribution || {}) };
                if (!newDistribution[role]) newDistribution[role] = {};
                const prepValue = parseFloat(tempDistribution['Preparation / Setup']) || 0;
                const deliveryValue = parseFloat(tempDistribution['Delivery / Supervision']) || 0;
                newDistribution[role]['Preparation / Setup'] = prepValue / 100;
                newDistribution[role]['Delivery / Supervision'] = deliveryValue / 100;
                return { ...act, distribution: newDistribution };
            })
        );
        handleCancelEdit();
    };

    const handleSaveChanges = () => {
        console.log("Saving data:", activities);
        setShowSuccessMessage(true);
        setTimeout(() => { setShowSuccessMessage(false); }, 3000);
    };

    const activityAllocation = activeActivity ? calculatedData.activityAllocations.find(a => a.id === activeActivity.id)?.allocation || 0 : 0;
    const isSaveDisabled = Object.keys(errors).length > 0;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.titleContainer}>
                    <h3 style={styles.title}>Activity Allocation</h3>
                    <InfoIcon onClick={() => setIsInfoVisible(true)} />
                    {isInfoVisible && (
                        <div style={styles.infoPopup}>
                            <button style={styles.infoCloseButton} onClick={() => setIsInfoVisible(false)}>&times;</button>
                            <p style={styles.infoText}>
                                For each small-group activity (such as tutorials, practicals or labs), enter the maximal number of students per group as per curriculum approval documents, the weekly class time per group, and the number of groups...
                            </p>
                        </div>
                    )}
                </div>
                <button style={styles.addButton} onClick={handleAddActivity}>+ Add</button>
            </div>

            <div style={styles.activityTabsContainer}>
                {activities.map((activity, index) => (
                    <button
                        key={activity.id}
                        style={{...styles.activityTab, ...(activity.id === activeActivityId ? styles.activityTabActive : {}), ...(index === activities.length - 1 ? { borderRight: 'none' } : {})}}
                        onClick={() => setActiveActivityId(activity.id)} >
                       <span style={styles.tabTextBold}>{`Activity ${index + 1}`}</span>
                       <span style={styles.tabTextNormal}>{activity.activityName}</span>
                    </button>
                ))}
            </div>

            <div style={styles.contentBody}>
                {activeActivity && (
                    <>
                        <div style={styles.inputGrid}>
                            <div>
                                <label style={styles.label}>{`${activeActivity.activityName} Allocation`}</label>
                                <input style={styles.inputReadOnly} type="text" readOnly value={`${(activityAllocation * 100).toFixed(1)}%`} />
                            </div>
                            <div>
                                <label style={styles.label}>Number of groups</label>
                                <input style={styles.input} type="number" min="0" value={activeActivity.numberOfGroups} onChange={(e) => handleInputChange(activeActivity.id, 'numberOfGroups', e.target.value)} />
                            </div>
                            <div>
                                <label style={styles.label}>Max group size per curriculum approval documents</label>
                                <input style={styles.input} type="number" min="0" value={activeActivity.maxGroupSize} onChange={(e) => handleInputChange(activeActivity.id, 'maxGroupSize', e.target.value)} />
                            </div>
                            <div>
                                <label style={styles.label}>Weekly class time per group over 12 weeks in hours</label>
                                <input style={styles.input} type="number" min="0" step="0.5" value={activeActivity.weeklyClassTime} onChange={(e) => handleInputChange(activeActivity.id, 'weeklyClassTime', e.target.value)} />
                            </div>
                        </div>

                        <div style={styles.justificationContainer}>
                            <label style={styles.label}>If a justification for the number of groups is required for any activity, provide details below.</label>
                            <textarea style={{...styles.textarea, ...(errors.justification && styles.errorBorder)}} value={activeActivity.justification} onChange={(e) => handleInputChange(activeActivity.id, 'justification', e.target.value)} rows="3" />
                            {errors.justification && <div style={styles.errorText}>{errors.justification}</div>}
                        </div>

                        <hr style={styles.hr} />
                        <h4 style={styles.subHeader}>Allocation per weekly hour per group</h4>

                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={{...styles.th, width: '100px'}}>Actions</th>
                                    <th style={styles.th}>Staff Role</th>
                                    <th style={{...styles.th, textAlign: 'right'}}>Preparation / Setup</th>
                                    <th style={{...styles.th, textAlign: 'right'}}>Delivery / Supervision</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staffColumns.map(role => {
                                    const isEditing = editingRole === role;
                                    const currentDistribution = activeActivity.distribution?.[role];
                                    const formatDisplayValue = (val) => val === '' ? '0.000%' : `${(Number(val) * 100).toFixed(3)}%`;
                                    return (
                                        <tr key={role}>
                                            <td style={styles.td}>
                                                <div style={styles.actionCell}>{isEditing ? (<><SaveRowIcon onClick={() => handleSaveRow(activeActivity.id, role)} /><CancelIcon onClick={handleCancelEdit} /></>) : (<EditIcon onClick={() => handleEditRow(role, currentDistribution)} />)}</div>
                                            </td>
                                            <td style={styles.td}>{role}</td>
                                            <td style={styles.td}>{isEditing ? ( <input type="text" style={styles.tableInput} value={tempDistribution['Preparation / Setup']} onChange={(e) => handleTempDistChange('Preparation / Setup', e.target.value)} autoFocus /> ) : ( <div style={styles.tableText}>{formatDisplayValue(currentDistribution?.['Preparation / Setup'] || 0)}</div> )}</td>
                                            <td style={styles.td}>{isEditing ? ( <input type="text" style={styles.tableInput} value={tempDistribution['Delivery / Supervision']} onChange={(e) => handleTempDistChange('Delivery / Supervision', e.target.value)} /> ) : ( <div style={styles.tableText}>{formatDisplayValue(currentDistribution?.['Delivery / Supervision'] || 0)}</div> )}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </>
                )}
            </div>

            <div style={styles.footer}>
                <button style={{...styles.saveButton, ...(isSaveDisabled && styles.disabledButton)}} onClick={handleSaveChanges} disabled={isSaveDisabled}>💾 Save</button>
                {showSuccessMessage && ( <div style={styles.successMessage}>✓ Successfully saved!</div> )}
            </div>
        </div>
    );
};

// --- STYLES ---
const styles = {
    container: { padding: '2.5rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0', fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'`, },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', },
    titleContainer: { position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem', },
    title: { margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#212529', },
    infoPopup: { position: 'absolute', top: 'calc(100% + 10px)', left: 0, width: '400px', backgroundColor: '#fff', border: '1px solid #ced4da', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, },
    infoCloseButton: { position: 'absolute', top: '8px', right: '12px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6c757d' },
    infoText: { margin: 0, fontSize: '14px', color: '#495057', lineHeight: 1.6 },
    addButton: { padding: '0.6rem 1.25rem', fontSize: '0.9rem', backgroundColor: '#212529', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', },
    activityTabsContainer: { display: 'inline-flex', border: '1px solid #adb5bd', borderRadius: '100px', overflow: 'hidden', },
    activityTab: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#ffffff', border: 'none', borderRight: '1px solid #adb5bd', padding: '0.5rem 1.25rem', cursor: 'pointer', color: '#212529', transition: 'background-color 0.2s', },
    activityTabActive: { background: '#212529', color: '#ffffff', },
    tabTextBold: { fontWeight: 'bold', fontSize: '12px', },
    tabTextNormal: { fontWeight: '500', fontSize: '14px', marginTop: '2px', },
    contentBody: { paddingTop: '2rem', },
    inputGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem 2rem', },
    label: { display: 'block', marginBottom: '0.5rem', color: '#495057', fontSize: '13px', fontWeight: '500', },
    input: { width: '100%', padding: '0.9rem 1rem', border: '1px solid #ced4da', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box', },
    inputReadOnly: { width: '100%', padding: '0.9rem 1rem', border: '1px solid #ced4da', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box', backgroundColor: '#f0f0f0', fontWeight: 'bold', color: '#212529' },
    justificationContainer: { marginTop: '1.5rem', },
    textarea: { width: '100%', padding: '0.9rem 1rem', border: '1px solid #ced4da', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box', fontFamily: `inherit`, resize: 'vertical', backgroundColor: '#f8f9fa' },
    hr: { border: 'none', borderTop: '1px solid #e0e0e0', margin: '2.5rem 0', },
    subHeader: { fontSize: '1.25rem', fontWeight: '600', color: '#212529', margin: '0 0 1.5rem 0', },
    table: { width: '100%', borderCollapse: 'collapse', },
    th: { textAlign: 'left', padding: '0.75rem 1rem', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #e0e0e0', color: '#495057', fontWeight: 'normal', fontSize: '14px' },
    td: { padding: '0.5rem 1rem', border: 'none', borderBottom: '1px solid #e0e0e0', verticalAlign: 'middle', },
    actionCell: { display: 'flex', gap: '1rem', alignItems: 'center' },
    tableInput: { width: '100%', padding: '0.5rem', border: '1px solid #007bff', borderRadius: '4px', backgroundColor: '#f8f9fa', textAlign: 'right', fontSize: '1rem', color: '#212529', outline: 'none', boxSizing: 'border-box', },
    tableText: { width: '100%', padding: '0.5rem', textAlign: 'right', fontSize: '1rem', color: '#212529', boxSizing: 'border-box', },
    footer: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '2.5rem', paddingTop: '1.5rem', gap: '1rem' },
    saveButton: { padding: '0.7rem 1.5rem', fontSize: '0.9rem', backgroundColor: '#212529', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', transition: 'background-color 0.2s' },
    disabledButton: { backgroundColor: '#6c757d', cursor: 'not-allowed' },
    successMessage: { padding: '0.7rem 1.5rem', backgroundColor: '#e9f7ef', color: '#28a745', border: '1px solid #a3e9a4', borderRadius: '8px', fontWeight: '500', animation: 'fadeInOut 3s forwards' },
    errorText: { color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' },
    errorBorder: { border: '1px solid #dc3545' }
};

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `@keyframes fadeInOut { 0% { opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; } }`;
document.head.appendChild(styleSheet);

export default ActivityAllocationTab;