import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import WDBaseAllocationTab from '../component/WDBaseAllocationTab';
import WDSummaryTab from '../component/WDSummaryTab';

// --- Static UI Configuration ---
// This defines the tab structure for different delivery formats.
// It's a business rule, not dynamic data, so it can be a constant.
const UI_CONFIG = {
  deliveryFormats: {
    "Lecture-based": {
      tabs: [
        { "id": "baseAllocation", "label": "Base Allocation" },
        { "id": "perDeliveryAllocation", "label": "Per-delivery Allocation" },
        { "id": "perStudentActivityAllocation", "label": "Per-student / Per-activity Allocation" },
        { "id": "summary", "label": "Summary" }
      ],
      "defaultTab": "baseAllocation"
    },
    "Project-based": {
      tabs: [
        { "id": "baseAllocation", "label": "Base Allocation" },
        { "id": "summary", "label": "Summary" }
      ],
      "defaultTab": "baseAllocation"
    }
  }
};


// --- Icon Components ---
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
);
const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
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




const PlaceholderDistributionTab = ({ title }) => (
    <div style={styles.tabContentContainer}>
        <h3 style={styles.tabTitle}>{title}</h3>
        <p style={{color: '#6c757d'}}>Content for the {title} tab will be built here.</p>
    </div>
);


// --- Main Workload Distribution Page Component ---
export default function WorkloadDistributionPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { subject } = location.state || {}; 
    
    // 2. Add state to manage data flow between tabs
    const [baseAllocations, setBaseAllocations] = useState([]);
    const [workloadSummary, setWorkloadSummary] = useState({
        totalWorkloadAllocationForSubject: '0.0%',
        unallocatedAvailableWorkload: '0.0%',
    });

    // 3. Add callback handlers for child components to update state
    const handleBaseAllocationChange = (allocations) => {
        setBaseAllocations(allocations);
    };

    const handleSummaryChange = (summary) => {
        setWorkloadSummary({
            totalWorkloadAllocationForSubject: `${(summary.totalWorkloadAllocationsForSubject * 100).toFixed(1)}%`,
            unallocatedAvailableWorkload: `${(summary.unallocatedAvailableWorkload * 100).toFixed(1)}%`,
        });
    };

     const totalSubjectWorkload = useMemo(() => {
        return (subject?.baseAllocationFromSW || 0) + (subject?.perGroupAllocationFromSW || 0);
    }, [subject]);
    
    // Set the initial 'Unallocated' value when the component loads
    useEffect(() => {
        if(subject) {
            setWorkloadSummary(prev => ({
                ...prev,
                unallocatedAvailableWorkload: `${(totalSubjectWorkload * 100).toFixed(1)}%`
            }));
        }
    }, [totalSubjectWorkload, subject]);
    

    const TABS_CONFIG = useMemo(() => {
        if (!subject?.formatOfDelivery) return { tabs: [], defaultTab: null };
        
        const formatKey = subject.formatOfDelivery.includes('Lecture') ? 'Lecture-based' : 'Project-based';
        return UI_CONFIG.deliveryFormats[formatKey] || { tabs: [], defaultTab: null };
    }, [subject]);
    
    const [activeTab, setActiveTab] = useState(TABS_CONFIG.defaultTab);

    // Effect to reset the active tab if the subject (and thus the tab config) changes.
    useEffect(() => {
        setActiveTab(TABS_CONFIG.defaultTab);
    }, [TABS_CONFIG.defaultTab]);


    // 4. Update the TABS_CONTENT_MAP to use the new component and pass props
    const TABS_CONTENT_MAP = useMemo(() => {
        if (!subject) return {};
        return {
            baseAllocation: <WDBaseAllocationTab 
                                subject={subject} 
                                onAllocationChange={handleBaseAllocationChange} 
                            />,
            perDeliveryAllocation: <PlaceholderDistributionTab title="Per-delivery Allocation" />,
            perStudentActivityAllocation: <PlaceholderDistributionTab title="Per-student / Per-activity Allocation" />,
            summary: <WDSummaryTab 
                        totalSubjectWorkload={totalSubjectWorkload}
                        baseAllocations={baseAllocations}
                        onSummaryChange={handleSummaryChange}
                     />
        };
    }, [subject, baseAllocations, totalSubjectWorkload]);
    if (!subject) {
        return <div style={styles.container}><h1 style={styles.title}>Error</h1><p>No subject data provided. Please go back and select a subject.</p><button style={styles.button()} onClick={() => navigate('/')}>Back to List</button></div>;
    }

    // const workloadSummary = {
    //     totalWorkloadAllocationForSubject: subject.workloadDistributionSummary?.totalWorkloadAllocationForSubject || 'N/A',
    //     unallocatedAvailableWorkload: subject.workloadDistributionSummary?.unallocatedAvailableWorkload || 'N/A',
    // };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <button style={styles.backButton} onClick={() => navigate(-1)}>
                    <BackIcon /> Back
                </button>
                <h1 style={styles.title}>Workload Distribution</h1>
            </header>
            
            <div style={styles.mainLayout}>
                <div style={styles.leftColumn}>
                    <Stepper currentStep={2} />
                </div>
               <div style={styles.rightColumn}>
                    {/* 5. Ensure the info panel uses the dynamic state */}
                    <WorkloadDistributionInfoPanel subject={subject} summary={workloadSummary} />
                    
                    <div style={styles.tabsContainer}>
                        {TABS_CONFIG.tabs.map(tab => (
                            <button 
                                key={tab.id} 
                                style={activeTab === tab.id ? styles.tabButtonActive : styles.tabButton} 
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <main>
                        {TABS_CONTENT_MAP[activeTab]}
                    </main>
                </div>
            </div>
        </div>
    );
}

// --- Helper Components ---

function Stepper({ currentStep }) {
    const steps = ["Subject Workload", "Workload Distribution"];
    return (
        <div style={styles.stepperContainer}>{steps.map((step, index) => (<React.Fragment key={step}><div style={styles.step}><div style={index + 1 === currentStep ? styles.stepNumberActive : styles.stepNumber}>{index + 1}</div><div style={index + 1 === currentStep ? styles.stepLabelActive : styles.stepLabel}>{step}</div></div>{index < steps.length - 1 && <div style={styles.stepperLine} />}</React.Fragment>))}</div>
    );
}

function WorkloadDistributionInfoPanel({ subject, summary }) {
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
        "Total Workload Allocation for Subject": summary.totalWorkloadAllocationForSubject,
        "Unallocated Available Workload": summary.unallocatedAvailableWorkload,
    };

    return (
        <div style={styles.detailsPanel}>
            <h2 style={styles.detailsPanelTitle}>Subject Info</h2>
            <div style={styles.infoContainer}>
                <div style={styles.infoColumn}>
                    {Object.entries(leftColumnInfo).map(([key, value]) => (
                        <div key={key} style={styles.infoPair}><span style={styles.infoKey}>{key}:</span><span style={styles.infoValue}>{value || 'N/A'}</span></div>
                    ))}
                </div>
                <div style={styles.infoColumn}>
                    {Object.entries(rightColumnInfo).map(([key, value]) => (
                        <div key={key} style={styles.infoPair}><span style={styles.infoKey}>{key}:</span><span style={styles.infoValue}>{value || 'N/A'}</span></div>
                    ))}
                </div>
            </div>
            <hr style={styles.hr} />
            <h2 style={styles.detailsPanelTitle}>Workload Distribution Summary</h2>
            <div style={styles.summaryContainer}>
                {Object.entries(summaryData).map(([key, value]) => (
                     <div key={key} style={{...styles.infoPair, gridTemplateColumns: '280px 1fr'}}><span style={styles.infoKey}>{key}:</span><span style={styles.infoValue}>{value || 'N/A'}</span></div>
                ))}
            </div>
        </div>
    );
}

// --- Styles (copied and adapted from previous component) ---
const styles = {
    container: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', padding: '2rem', backgroundColor: '#f8f9fa', minHeight: '100vh' },
    header: { display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1.5rem' },
    title: { color: '#343a40', fontSize: '1.75rem', margin: 0 },
    button: (variant = 'primary') => ({ padding: '0.6rem 1.2rem', fontSize: '1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500', transition: 'background-color 0.2s', backgroundColor: variant === 'primary' ? '#0d0d0d' : '#6c757d', color: 'white' }),
    mainLayout: { display: 'flex', gap: '2rem', marginTop: '1.5rem', alignItems: 'flex-start' },
    leftColumn: { flex: '0 0 240px' },
    rightColumn: { flex: '1', display: 'flex', flexDirection: 'column' },
    backButton: { background: 'none', border: '1px solid #ced4da', color: '#495057', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    stepperContainer: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '1.5rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', height: '100%' },
    step: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
    stepNumber: { width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#e9ecef', color: '#6c757d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 },
    stepNumberActive: { width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 },
    stepLabel: { color: '#6c757d' },
    stepLabelActive: { color: '#343a40', fontWeight: '500' },
    stepperLine: { height: '30px', width: '2px', backgroundColor: '#e9ecef', margin: '0.5rem 0 0.5rem 11px' },
    detailsPanel: { backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '2rem' },
    detailsPanelTitle: { fontSize: '1.25rem', fontWeight: '600', color: '#343a40', margin: '0 0 1.5rem 0' },
    hr: { border: 'none', borderTop: '1px solid #e9ecef', margin: '1.5rem 0' },
    infoContainer: { display: 'flex', gap: '4rem' },
    infoColumn: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    infoPair: { display: 'grid', gridTemplateColumns: '150px 1fr', gap: '0.5rem', alignItems: 'center' },
    infoKey: { color: '#495057', fontSize: '0.9rem' },
    infoValue: { color: '#343a40', fontWeight: '600', fontSize: '0.9rem' },
    summaryContainer: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    tabsContainer: { display: 'flex', borderBottom: '2px solid #dee2e6' },
    tabButton: { background: 'none', border: 'none', padding: '1rem 1.5rem', cursor: 'pointer', fontSize: '1rem', color: '#6c757d', borderBottom: '2px solid transparent', marginBottom: '-2px' },
    tabButtonActive: { background: 'none', border: 'none', padding: '1rem 1.5rem', cursor: 'pointer', fontSize: '1rem', color: '#007bff', fontWeight: '500', borderBottom: '2px solid #007bff', marginBottom: '-2px' },
    tabContentContainer: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', marginTop: '-2px' },
    tabHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    tabTitle: { margin: 0, color: '#343a40', fontSize: '1.25rem' },
    addButton: { padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500', backgroundColor: '#0d0d0d', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHeaderRow: { borderBottom: '2px solid #343a40' },
    tableHeaderCell: { padding: '0.75rem 0.5rem', textAlign: 'left', color: '#495057', fontWeight: '600', fontSize: '0.9rem' },
    tableRow: { borderBottom: '1px solid #dee2e6' },
    tableCell: { padding: '1rem 0.5rem', color: '#343a40', verticalAlign: 'middle' },
    iconButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#495057' },
    tabFooter: { display: 'flex', justifyContent: 'flex-start', marginTop: '2rem', borderTop: '1px solid #e9ecef', paddingTop: '1.5rem' },
};