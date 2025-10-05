import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SWBaseAllocationTab from '../component/SWBaseAllocationTab';
import PerGroupAllocationTab from '../component/PerGroupAllocationTab'; 
import PerDeliveryAllocationTab from '../component/PerDeliveryAllocationTab'; 

// --- Placeholder Tab Content Components ---
// These components are placeholders for the actual content of each tab.

const PlaceholderTabContent = ({ title }) => (
  <div style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6' }}>
    <h3 style={{ marginTop: 0, color: '#495057' }}>{title}</h3>
    <p style={{ color: '#6c757d' }}>Content for this section will be built out here.</p>
  </div>
);
// const BaseAllocationTab = () => <PlaceholderTabContent title="Base Allocation" />;

// const PerDeliveryAllocationTab = () => <PlaceholderTabContent title="Per-delivery Allocation" />;
const StaffRolesTab = () => <PlaceholderTabContent title="Staff Roles" />;
const PerStudentAllocationTab = () => <PlaceholderTabContent title="Per-student Allocation" />;
const ActivityAllocationTab = () => <PlaceholderTabContent title="Activity Allocation" />;
// const PerGroupAllocationTab = () => <PlaceholderTabContent title="Per-group Allocation" />;

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
    const { subject } = location.state || {};
    
    // State to store the base allocation calculated in the child tab
    const [baseAllocationValue, setBaseAllocationValue] = useState(0);
    const [perGroupAllocationValue, setPerGroupAllocationValue] = useState(0);
    const [perDeliveryAllocationValue, setPerDeliveryAllocationValue] = useState(0);


    // State for the summary panel and tab status
    
    // Handler to update the base allocation state
    // const handleBaseAllocationChange = (calculatedValue) => {
    //     setBaseAllocationValue(calculatedValue);
    // };
    const handleBaseAllocationChange = (value) => setBaseAllocationValue(value);
    const handlePerGroupAllocationChange = (value) => setPerGroupAllocationValue(value);
    const handlePerDeliveryAllocationChange = (value) => setPerDeliveryAllocationValue(value);

    const [subjectWorkloadStatus, setSubjectWorkloadStatus] = useState('incomplete');
    const [summaryData, setSummaryData] = useState({
        total_subject_workload: subject?.totalSubjectWorkload || '0.0%',
        total_eftsl_for_subject: "12.5",
        total_administrative_loadings: "0.0%"
    });

    // Callback function to update the summary
    const handleAllocationChange = (allocationValue) => {
        const workloadPercentage = allocationValue !== null ? (allocationValue * 100).toFixed(1) : 0.0;
        setSummaryData(prevData => ({
            ...prevData,
            total_subject_workload: `${workloadPercentage}%`
        }));
    };
    const TABS_CONFIG = useMemo(() => {
        if (!subject) return {};
        const isLectureBased = subject.formatOfDelivery.toLowerCase().includes('lecture');
        
        if (isLectureBased) {
            return {
                "Base Allocation": <SWBaseAllocationTab subjectCode={subject.subjectCode} term={subject.term}   onBaseAllocationChange={handleBaseAllocationChange} />,
                "Per-delivery Allocation": <PerDeliveryAllocationTab term={subject.term} onAllocationChange={handlePerDeliveryAllocationChange} />,
                "Staff Roles": <StaffRolesTab />,
                "Staff Roles": <StaffRolesTab />,
                "Per-student Allocation": <PerStudentAllocationTab />,
                "Activity Allocation": <ActivityAllocationTab />
            };
        } else {
            return {
                "Base Allocation": <SWBaseAllocationTab subjectCode={subject.subjectCode} term={subject.term} onBaseAllocationChange={handleBaseAllocationChange} />,
                "Per-group Allocation": <PerGroupAllocationTab onPerGroupAllocationChange={handlePerGroupAllocationChange} onAllocationChange={handleAllocationChange}/>
            };
        }
    }, [subject]);


    const tabNames = Object.keys(TABS_CONFIG);
    const [activeTab, setActiveTab] = useState(tabNames.length > 0 ? tabNames[0] : null);

    const subjectSummaryData = { total_subject_workload: subject?.totalSubjectWorkload || 'N/A', total_eftsl_for_subject: "12.5", total_administrative_loadings: "0.0%" };

    if (!subject) {
        return <div style={styles.container}><h1 style={styles.title}>Error</h1><p>No subject data provided. Please go back to the subject list and select a subject.</p><button style={styles.button()} onClick={() => navigate('/')}>Back to List</button></div>;
    }
    
    const isNextDisabled = subjectWorkloadStatus === 'incomplete';
    
    return (
        <div style={styles.container}>
            <header style={styles.header}><button style={styles.backButton} onClick={() => navigate('/')}><BackIcon /> Back to Subject List</button><h1 style={styles.title}>Subject Workload - {subject.formatOfDelivery}</h1></header>
            
            <div style={styles.mainLayout}>
                <div style={styles.leftColumn}>
                    <Stepper currentStep={1} />
                </div>
                <div style={styles.rightColumn}>
                     {/* Pass the dynamic summaryData state to the panel */}
                    <SubjectDetailsPanel subject={subject} summary={summaryData} />
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
                                onClick={() => {
                                    // Create an updated subject object for the next page
                                    const subjectForNextPage = {
                                        ...subject,
                                        // Use the dynamic value from state
                                        baseAllocationFromSW: baseAllocationValue,
                                        perGroupAllocationFromSW: perGroupAllocationValue,
                                        // This can remain 0 unless you calculate a value for it
                                        increaseToBaseAllocation: 0,
                                    };

                                    // Navigate with the updated state
                                    navigate('/workload-distribution', { state: { subject: subjectForNextPage } });
                                }}
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

