import React, { createContext, useContext, useState } from 'react';

// 1. Create the context object
const WorkloadContext = createContext();

// 2. Create a custom hook to make it easy to use the context
export const useWorkload = () => {
    return useContext(WorkloadContext);
};

// 3. Create the Provider component that will manage the shared state
export const WorkloadProvider = ({ children }) => {
    // This 'deliveries' state will be shared across all components
    const [deliveries, setDeliveries] = useState([
        { id: 1, deliveryLocation: 'CTN', lecturer: 'Mary', weeklyLectureTime: 2, earlyCareerLoading: 'No' },
        { id: 2, deliveryLocation: 'PEN', lecturer: 'Mary', weeklyLectureTime: 0, earlyCareerLoading: 'No' },
        { id: 3, deliveryLocation: 'KWD', lecturer: 'Mary', weeklyLectureTime: 0, earlyCareerLoading: 'No' },
    ]);
    // ADD THIS STATE to the context
    const [firstOfferingOfYear, setFirstOfferingOfYear] = useState('Yes');


    // The 'value' object makes the state and the function to update it available
    const value = {
        deliveries,
        setDeliveries,
        firstOfferingOfYear,      // ADD THIS
        setFirstOfferingOfYear    // ADD THIS
    };

    return (
        <WorkloadContext.Provider value={value}>
            {children}
        </WorkloadContext.Provider>
    );
};