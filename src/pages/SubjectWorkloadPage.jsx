import React, { useState, useMemo, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SWBaseAllocationTab from '../component/SWBaseAllocationTab';
import PerGroupAllocationTab from '../component/PerGroupAllocationTab'; 
import PerDeliveryAllocationTab from '../component/PerDeliveryAllocationTab'; 
import StaffRolesTab from '../component/StaffRolesTab';
import PerStudentAllocationTab from '../component/PerStudentAllocationTab';
import { StaffRolesContext, StaffRolesProvider } from '../StaffRolesContext';
import ActivityAllocationTab from '../component/ActivityAllocationTab';
import { useWorkload } from '../WorkloadContext';
// --- Placeholder Tab Content Components ---
// These components are placeholders for the actual content of each tab.

const PlaceholderTabContent = ({ title }) => (
  <div style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6' }}>
    <h3 style={{ marginTop: 0, color: '#495057' }}>{title}</h3>
    <p style={{ color: '#6c757d' }}>Content for this section will be built out here.</p>
  </div>
);

// --- Icon and Helper Components ---
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
    </svg>
);

// --- Main Subject Workload Page Component ---
export default function SubjectWorkloadPage() {
    const navigate = useNavigate();
    const location = useLocation();
    // Get roles directly from the context
    const { definedRoles } = useContext(StaffRolesContext);
    //const { subject } = location.state || {};
        const { subject: initialSubject } = location.state || {};
     // --- 2. Get SHARED state from the context ---
    const { 
        deliveries, 
        firstOfferingOfYear,
    } = useWorkload();
    

    // State to store the base allocation calculated in the child tab
    const [baseAllocationValue, setBaseAllocationValue] = useState(0);
    const [adminLoadingValue, setAdminLoadingValue] = useState(0);
    const [perGroupAllocationValue, setPerGroupAllocationValue] = useState(0);
    const [perDeliveryAllocationValue, setPerDeliveryAllocationValue] = useState(0);
    //const [staffRoles, setStaffRoles] = useState([]);
    const [perStudentAllocationValue, setPerStudentAllocationValue] = useState(0);
    const [activityAllocationValue, setActivityAllocationValue] = useState(0);
    const [numberOfStudents, setNumberOfStudents] = useState(100);
    
    
    // FIX: Add state for project-based EFTSL calculation inputs
    const [numberOfProjectGroups, setNumberOfProjectGroups] = useState(25); // Default from spreadsheet
    const [studentsPerGroup, setStudentsPerGroup] = useState(10); // Default from spreadsheet

    
    const [subjectWorkloadStatus, setSubjectWorkloadStatus] = useState('incomplete');
     // 1. ADD NEW STATE FOR ACTIVITY DATA
    const [activityDataForValidation, setActivityDataForValidation] = useState([]);

    const [perStudentRoleAllocations, setPerStudentRoleAllocations] = useState([]);
    const [activityAllocationData, setActivityAllocationData] = useState([]);


    const [summaryData, setSummaryData] = useState({
        total_subject_workload: initialSubject?.totalSubjectWorkload || '0.0%',
        total_eftsl_for_subject: "0.0",
        total_administrative_loadings: "0.0%"
    });


    // State for the summary panel and tab status
    
    // Handler to update the base allocation state
    // const handleBaseAllocationChange = (calculatedValue) => {
    //     setBaseAllocationValue(calculatedValue);
    // };
    const handleBaseAllocationChange = (value) => setBaseAllocationValue(value);
    const handlePerGroupAllocationChange = (value) => setPerGroupAllocationValue(value);
    const handlePerDeliveryAllocationChange = (value) => setPerDeliveryAllocationValue(value);
    const handlePerStudentAllocationChange = (value) => setPerStudentAllocationValue(value); 
   // const handleRolesChange = (updatedRoles) => {setStaffRoles(updatedRoles);};
    const handleActivityAllocationChange = (value) => setActivityAllocationValue(value); // NEW: Handler for Activity Allocation

// FIX: Add handler to get data from PerGroupAllocationTab for EFTSL calculation
    const handleProjectDataChange = (groups, students) => {
        setNumberOfProjectGroups(groups);
        setStudentsPerGroup(students);
    };
    

    // useEffect(() => {
    //     const totalWorkload = (baseAllocationValue || 0) + 
    //                           (perGroupAllocationValue || 0) + 
    //                           (perDeliveryAllocationValue || 0) +
    //                           (perStudentAllocationValue || 0) +
    //                           (activityAllocationValue || 0);

    //     const workloadPercentage = (totalWorkload * 100).toFixed(1);
        
    //     setSummaryData(prevData => ({
    //         ...prevData,
    //         total_subject_workload: `${workloadPercentage}%`
    //     }));
    // }, [baseAllocationValue, perGroupAllocationValue, perDeliveryAllocationValue, perStudentAllocationValue, activityAllocationValue]);


    // --- MAIN CALCULATION LOGIC ---
    useEffect(() => {
        const isLectureBased = initialSubject?.formatOfDelivery.toLowerCase().includes('lecture');

        // 1. Calculate Total Subject Workload
        const totalWorkload = (baseAllocationValue || 0) +
                              (perGroupAllocationValue || 0) +
                              (perDeliveryAllocationValue || 0) +
                              (perStudentAllocationValue || 0) +
                              (activityAllocationValue || 0);

        // 2. Calculate Total EFTSL based on delivery format
        let totalEftsl = 0;
        if (isLectureBased) {
            const FULL_TIME_ANNUAL_HOURS = 1200;
            const totalStudentHours = initialSubject?.calculationInputs?.totalStudentHours || 150;
            const eftslPerStudent = totalStudentHours / FULL_TIME_ANNUAL_HOURS;
            totalEftsl = eftslPerStudent * numberOfStudents;
        } else { // Project-based logic
            totalEftsl = (numberOfProjectGroups * studentsPerGroup) / 8;
        }

        // 3. Determine Administrative Loading based on delivery format
        const adminLoadingDisplay = isLectureBased ? (adminLoadingValue * 100).toFixed(1) : '0.0';

        // 4. Update Summary State
        setSummaryData({
            total_subject_workload: `${(totalWorkload * 100).toFixed(1)}%`,
            total_eftsl_for_subject: totalEftsl.toFixed(1),
            total_administrative_loadings: `${adminLoadingDisplay}%`
        });

    }, [
        baseAllocationValue, perGroupAllocationValue, perDeliveryAllocationValue, perStudentAllocationValue, activityAllocationValue,
        numberOfStudents, adminLoadingValue, initialSubject,
        numberOfProjectGroups, studentsPerGroup // FIX: Add new dependencies
    ]);
const handleNext = () => {
        // Create the complete object for the next page
        const subjectForNextPage = {
            ...initialSubject,
            
            // 1. Values from this page's LOCAL state
            baseAllocationFromSW: baseAllocationValue,
            perGroupAllocationFromSW: perGroupAllocationValue,
            activityAllocationFromSW: activityAllocationValue,
            
            // 2. Values from the SHARED context
            firstOfferingOfYear: firstOfferingOfYear,
            perDeliveryAllocationData: deliveries, // This is the full, enriched array
            
           // validation data for per student per activity allocation
            validationData: {
                totalStudents: numberOfStudents,
                activityGroups: activityDataForValidation,
            },

            sourceData: {
                totalStudents: numberOfStudents,
                perStudentAllocations: perStudentRoleAllocations,
                activityAllocations: activityAllocationData,
                definedRoles: definedRoles,
            },

            // 3. Static or other required values
            increaseToBaseAllocation: 0,
            calculationInputs: {
                isManagedBySCDMS: 'Yes',
                totalStudentHours: 150, // This should ideally come from state if it's dynamic
            }
        };

        // Navigate with the complete state object
        navigate('/workload-distribution', { state: { subject: subjectForNextPage } });
    };

    // Callback function to update the summary
    const handleAllocationChange = (allocationValue) => {
        const workloadPercentage = allocationValue !== null ? (allocationValue * 100).toFixed(1) : 0.0;
        setSummaryData(prevData => ({
            ...prevData,
            total_subject_workload: `${workloadPercentage}%`
        }));
    };
    // const TABS_CONFIG = useMemo(() => {
    //     if (!subject) return {};
    //     const isLectureBased = subject.formatOfDelivery.toLowerCase().includes('lecture');
        
    //     if (isLectureBased) {
    //         return {
    //             "Base Allocation": <SWBaseAllocationTab subjectCode={subject.subjectCode} term={subject.term}   onBaseAllocationChange={handleBaseAllocationChange} />,
    //             "Per-delivery Allocation": <PerDeliveryAllocationTab term={subject.term} onAllocationChange={handlePerDeliveryAllocationChange} />,
    //             // "Staff Roles": <StaffRolesTab />,
    //             "Staff Roles": <StaffRolesTab />,
    //             "Per-student Allocation": <PerStudentAllocationTab 
    //             term={subject.term} 
    //                 onAllocationChange={handlePerStudentAllocationChange} 
    //                 onStudentsChange={setNumberOfStudents} 
    //                 numberOfStudents={numberOfStudents}
    //                 />,
    //             "Activity Allocation": <ActivityAllocationTab 
    //                 term={subject.term} 
    //                 onAllocationChange={handleActivityAllocationChange}
    //                 numberOfStudents={numberOfStudents} />
    //         };
    //     } else {
    //         return {
    //             "Base Allocation": <SWBaseAllocationTab subjectCode={subject.subjectCode} term={subject.term} onBaseAllocationChange={handleBaseAllocationChange} />,
    //             "Per-group Allocation": <PerGroupAllocationTab onPerGroupAllocationChange={handlePerGroupAllocationChange} onAllocationChange={handleAllocationChange} numberOfStudents={numberOfStudents}/>
    //         };
    //     }
    // }, [subject,numberOfStudents]);

    const TABS_CONFIG = useMemo(() => {
        if (!initialSubject) return {};
        const isLectureBased = initialSubject.formatOfDelivery.toLowerCase().includes('lecture');
        
        if (isLectureBased) {
            return {
                "Base Allocation": <SWBaseAllocationTab subjectCode={initialSubject.subjectCode} term={initialSubject.term} onBaseAllocationChange={handleBaseAllocationChange} />,
                "Per-delivery Allocation": <PerDeliveryAllocationTab term={initialSubject.term} onAllocationChange={handlePerDeliveryAllocationChange} />,
                "Staff Roles": <StaffRolesTab />,
                "Per-student Allocation": <PerStudentAllocationTab 
                    term={initialSubject.term} 
                    onAllocationChange={handlePerStudentAllocationChange} 
                    onStudentsChange={setNumberOfStudents} 
                    numberOfStudents={numberOfStudents}
                    onAllocationDataChange={setPerStudentRoleAllocations} 
                />,
                "Activity Allocation": <ActivityAllocationTab 
                    term={initialSubject.term} 
                    onAllocationChange={handleActivityAllocationChange}
                    numberOfStudents={numberOfStudents} 
                  // onActivityDataChange={setActivityDataForValidation}
                    onActivityDataChange={setActivityAllocationData}
                />
            };
        } else {
            return {
                "Base Allocation": <SWBaseAllocationTab subjectCode={initialSubject.subjectCode} term={initialSubject.term} onBaseAllocationChange={handleBaseAllocationChange} />,
                "Per-group Allocation": <PerGroupAllocationTab 
                onPerGroupAllocationChange={handlePerGroupAllocationChange} 
                onAllocationChange={handleAllocationChange} 
                numberOfStudents={numberOfStudents}
                 onProjectDataChange={handleProjectDataChange} />
            };
        }
    }, [initialSubject, numberOfStudents]);


    const tabNames = Object.keys(TABS_CONFIG);
    const [activeTab, setActiveTab] = useState(tabNames.length > 0 ? tabNames[0] : null);

    const subjectSummaryData = { total_subject_workload: initialSubject?.totalSubjectWorkload || 'N/A', total_eftsl_for_subject: "N/A", total_administrative_loadings: "N/A" };

    // if (!subject) {
     if (!initialSubject) {
        return <div style={styles.container}><h1 style={styles.title}>Error</h1><p>No subject data provided. Please go back to the subject list and select a subject.</p><button style={styles.button()} onClick={() => navigate('/')}>Back to List</button></div>;
    }
    
    const isNextDisabled = subjectWorkloadStatus === 'incomplete';
    
    return (
       
        <div style={styles.container}>
            <header style={styles.header}><button style={styles.backButton} onClick={() => navigate('/')}><BackIcon /> Back to Subject List</button><h1 style={styles.title}>Subject Workload - {initialSubject.formatOfDelivery}</h1></header>
            
            <div style={styles.mainLayout}>
                <div style={styles.leftColumn}>
                    <Stepper currentStep={1} />
                </div>
                <div style={styles.rightColumn}>
                     {/* Pass the dynamic summaryData state to the panel */}
                    <SubjectDetailsPanel subject={initialSubject} summary={summaryData} />
                <div style={styles.tabsContainer}>{tabNames.map(tabName => (<button key={tabName} style={activeTab === tabName ? styles.tabButtonActive : styles.tabButton} onClick={() => setActiveTab(tabName)}>{tabName}</button>))}</div>
                    <main style={styles.tabContent}>{TABS_CONFIG[activeTab]}</main>
                    
                    <footer style={styles.footer}>
{/* 
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><input type="checkbox" id="statusToggle" checked={subjectWorkloadStatus === 'complete'} onChange={(e) => setSubjectWorkloadStatus(e.target.checked ? 'complete' : 'incomplete')} /><label htmlFor="statusToggle" style={{color: '#495057'}}>Mark as Complete</label></div>
                        <div><button style={styles.button('secondary')}>Save & Exit</button><button style={{...styles.button('primary'), marginLeft: '1rem', opacity: isNextDisabled ? 0.5 : 1}} disabled={isNextDisabled}>Next: Workload Distribution</button></div>
                     */}
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <input 
                            type="checkbox" 
                            id="statusToggle" 
                            checked={subjectWorkloadStatus === 'complete'} 
                            onChange={(e) => setSubjectWorkloadStatus(e.target.checked ? 'complete' : 'incomplete')} 
                        />
                        <label htmlFor="statusToggle" style={{color: '#495057'}}>Mark as Complete</label>
                    </div>
                    <div>
                        <button style={styles.button('secondary')}>Save & Exit</button>
                        
                            <button
                                style={{ ...styles.button('primary'), marginLeft: '1rem', opacity: isNextDisabled ? 0.5 : 1 }}
                                disabled={isNextDisabled}
                                onClick={handleNext}
            //                     onClick={() => {
            //                         // Create an updated subject object for the next page
            //                         const subjectForNextPage = {
            //                             ...subject,
            //                             // Use the dynamic value from state
            //                             baseAllocationFromSW: baseAllocationValue,
            //                             perGroupAllocationFromSW: perGroupAllocationValue,
            //                             // This can remain 0 unless you calculate a value for it
            //                             increaseToBaseAllocation: 0,
            //                             // staffRoles: staffRoles 
            //                             activityAllocationFromSW: activityAllocationValue,
            //                              // Values from SHARED context
            // firstOfferingOfYear: firstOfferingOfYear,
            // perDeliveryAllocationData: deliveries, // The full, enriched deliveries array
         
            //                         };

            //                         // Navigate with the updated state
            //                         navigate('/workload-distribution', { state: { subject: subjectForNextPage } });
            //                     }}
                            >
                    Next: Workload Distribution
                </button>

                    </div>
                    </footer>
                </div>
            </div>
        </div>
       
    );
}

function Stepper({ currentStep }) {
    const steps = ["Subject Workload", "Workload Distribution"];
    return (
        <div style={styles.stepperContainer}>{steps.map((step, index) => (<React.Fragment key={step}><div style={styles.step}><div style={index + 1 <= currentStep ? styles.stepNumberActive : styles.stepNumber}>{index + 1}</div><div style={index + 1 <= currentStep ? styles.stepLabelActive : styles.stepLabel}>{step}</div></div>{index < steps.length - 1 && <div style={styles.stepperLine} />}</React.Fragment>))}</div>
    );
}

function SubjectDetailsPanel({ subject, summary }) {
    const leftColumnInfo = {
        "Subject Code": subject.subjectCode,
        "Subject Name": subject.subjectName,
        "Term": subject.term,
        "Subject Coordinator": subject.subjectCoordinator,
    };
    const rightColumnInfo = {
        "Version": subject.version,
        "Date": subject.date,
        "Format of delivery": subject.formatOfDelivery,
    };
    const summaryData = {
        "Total Subject Workload": summary.total_subject_workload,
        "Total EFTSL for Subject": summary.total_eftsl_for_subject,
        "Total administrative loadings for Subject": summary.total_administrative_loadings,
    };

    return (
        <div style={styles.detailsPanel}>
            <h2 style={styles.detailsPanelTitle}>Subject Info</h2>
            <div style={styles.infoContainer}>
                <div style={styles.infoColumn}>
                    {Object.entries(leftColumnInfo).map(([key, value]) => (
                        <div key={key} style={styles.infoPair}>
                            <span style={styles.infoKey}>{key}:</span>
                            <span style={styles.infoValue}>{value}</span>
                        </div>
                    ))}
                </div>
                <div style={styles.infoColumn}>
                    {Object.entries(rightColumnInfo).map(([key, value]) => (
                        <div key={key} style={styles.infoPair}>
                            <span style={styles.infoKey}>{key}:</span>
                            <span style={styles.infoValue}>{value}</span>
                        </div>
                    ))}
                </div>
            </div>
            <hr style={styles.hr} />
            <h2 style={styles.detailsPanelTitle}>Subject Workload Summary</h2>
            <div style={styles.summaryContainer}>
                {Object.entries(summaryData).map(([key, value]) => (
                     <div key={key} style={styles.infoPair}>
                        <span style={styles.infoKey}>{key}:</span>
                        <span style={styles.infoValue}>{value}</span>
                    </div>
                ))}
            </div>
        </div>
      
    );
}

const styles = {
    // Shared styles
    container: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', padding: '2rem', backgroundColor: '#f8f9fa', minHeight: '100vh' },
    header: { display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1.5rem' },
    title: { color: '#343a40', fontSize: '1.75rem', margin: 0 },
    button: (variant = 'primary') => ({ padding: '0.6rem 1.2rem', fontSize: '1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500', transition: 'background-color 0.2s, box-shadow 0.2s, opacity 0.2s', backgroundColor: variant === 'primary' ? '#007bff' : '#6c757d', color: 'white' }),

    // Page 2: Workload Page Specific Styles
    mainLayout: { display: 'flex', gap: '2rem', marginTop: '1.5rem', alignItems: 'flex-start' },
    leftColumn: { flex: '0 0 240px' },
    rightColumn: { flex: '1', display: 'flex', flexDirection: 'column' },
    backButton: { background: 'none', border: '1px solid #ced4da', color: '#495057', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'background-color 0.2s' },
    stepperContainer: { 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start',
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        height: '100%'
    },
    step: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
    stepNumber: { width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#e9ecef', color: '#6c757d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 },
    stepNumberActive: { width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 },
    stepLabel: { color: '#6c757d' },
    stepLabelActive: { color: '#007bff', fontWeight: '500' },
    stepperLine: { 
        height: '30px', 
        width: '2px', 
        backgroundColor: '#e9ecef', 
        margin: '0.5rem 0 0.5rem 11px'
    },
    detailsPanel: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        marginBottom: '2rem'
    },
    detailsPanelTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#343a40',
        margin: '0 0 1.5rem 0',
    },
    hr: {
        border: 'none',
        borderTop: '1px solid #e9ecef',
        margin: '1.5rem 0'
    },
    infoContainer: {
        display: 'flex',
        gap: '4rem'
    },
    infoColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
    },
    infoPair: {
        display: 'grid',
        gridTemplateColumns: '150px 1fr',
        gap: '0.5rem'
    },
    infoKey: {
        color: '#343a40',
        fontSize: '0.9rem'
    },
    infoValue: {
        color: '#343a40',
        fontWeight: '600',
        fontSize: '0.9rem'
    },
    summaryContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
    },
    tabsContainer: { display: 'flex', borderBottom: '2px solid #dee2e6', marginBottom: '1.5rem' },
    tabButton: { background: 'none', border: 'none', padding: '1rem 1.5rem', cursor: 'pointer', fontSize: '1rem', color: '#6c757d', borderBottom: '2px solid transparent', marginBottom: '-2px' },
    tabButtonActive: { background: 'none', border: 'none', padding: '1rem 1.5rem', cursor: 'pointer', fontSize: '1rem', color: '#007bff', fontWeight: '500', borderBottom: '2px solid #007bff', marginBottom: '-2px' },
    tabContent: { minHeight: '200px' },
    footer: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: 'auto', 
        borderTop: '1px solid #e9ecef', 
        paddingTop: '1.5rem' 
    },
};

