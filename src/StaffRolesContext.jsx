// StaffRolesContext.js

import React, { createContext, useState } from 'react';

// 1. Create the context
export const StaffRolesContext = createContext();

// 2. Create the Provider component that will hold the state
export const StaffRolesProvider = ({ children }) => {
    const [definedRoles, setDefinedRoles] = useState([
        { id: 1, name: 'Assistant subject coordinator' },
        { id: 2, name: 'Tutor' },
        { id: 3, name: 'Exam marker' },
    ]);

    return (
        <StaffRolesContext.Provider value={{ definedRoles, setDefinedRoles }}>
            {children}
        </StaffRolesContext.Provider>
    );
};