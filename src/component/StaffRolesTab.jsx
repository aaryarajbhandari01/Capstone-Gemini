import React, { useState, useEffect, useContext } from 'react';
import { StaffRolesContext } from '../StaffRolesContext';

// --- Icon & UI Helper Components (EditIcon, DeleteIcon, Toast, Modal) remain the same ---
// (Your existing Icon and UI Helper Components go here)
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

const Toast = ({ message, type, onHide }) => {
    useEffect(() => {
        const timer = setTimeout(onHide, 3000);
        return () => clearTimeout(timer);
    }, [onHide]);

    const toastStyle = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        backgroundColor: type === 'success' ? '#28a745' : '#dc3545',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        zIndex: 1050,
        transition: 'opacity 0.5s ease-in-out',
    };

    return <div style={toastStyle}>{message}</div>;
};

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    const modalStyles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        content: {
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%',
            boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
            position: 'relative',
        },
        closeButton: {
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#6c757d',
        },
        body: {
            maxHeight: '70vh',
            overflowY: 'auto',
            lineHeight: '1.6',
            color: '#343a40',
        },
         footer: {
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e9ecef',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
        },
        button: (variant = 'primary') => ({
            padding: '0.6rem 1.2rem',
            fontSize: '1rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500',
            backgroundColor: variant === 'danger' ? '#dc3545' : '#6c757d',
            color: 'white',
        }),
    };

    return (
        <div style={modalStyles.overlay} onClick={onClose}>
            <div style={modalStyles.content} onClick={e => e.stopPropagation()}>
                {onClose && <button style={modalStyles.closeButton} onClick={onClose}>&times;</button>}
                <div style={modalStyles.body}>{children}</div>
            </div>
        </div>
    );
};

// --- Main Staff Roles Tab Component ---
// ✨ 1. Accept onRolesChange from props
export default function StaffRolesTab() {
    // const [roles, setRoles] = useState([
    //     { id: 1, name: 'Assistant subject coordinator' },
    //     { id: 2, name: 'Tutor' },
    //     { id: 3, name: 'Exam marker' },
    // ]);
    const { definedRoles: roles, setDefinedRoles: setRoles } = useContext(StaffRolesContext);

    const [editingId, setEditingId] = useState(null);
    const [tempName, setTempName] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [isInfoModalOpen, setInfoModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);

    // ✨ 2. Use useEffect to notify the parent component whenever roles change
    // useEffect(() => {
    //     if (onRolesChange) {
    //         onRolesChange(roles);
    //     }
    // }, [roles, onRolesChange]);

    const showToast = (message, type = 'error') => {
        setToast({ show: true, message, type });
    };

    const handleAddRole = () => {
        if (roles.length >= 4) {
            showToast('You can define a maximum of 4 staff roles.');
            return;
        }
        const newId = Date.now();
        setRoles([...roles, { id: newId, name: '' }]);
        setEditingId(newId);
        setTempName('');
    };
    
    const handleEdit = (role) => {
        setEditingId(role.id);
        setTempName(role.name);
    };
    
    const handleSaveRole = (id) => {
        const trimmedName = tempName.trim();
        if (!trimmedName) {
            showToast('Role name cannot be blank.');
            return;
        }
        const validCharRegex = /^[a-zA-Z\s]*$/;
        if (!validCharRegex.test(trimmedName)) {
            showToast('Role name can only contain letters and spaces.');
            return;
        }
        const isDuplicate = roles.some(role => role.id !== id && role.name.toLowerCase() === trimmedName.toLowerCase());
        if (isDuplicate) {
            showToast('Duplicate role names are not allowed.');
            return;
        }

        setRoles(roles.map(role => role.id === id ? { ...role, name: trimmedName } : role));
        setEditingId(null);
    };
    
    const handleCancelEdit = (role) => {
        if (!role.name) {
            setRoles(roles.filter(r => r.id !== role.id));
        }
        setEditingId(null);
    };

    const handleDelete = (id) => {
        setRoles(roles.filter(role => role.id !== id));
        setRoleToDelete(null);
        showToast('Role deleted successfully.', 'success');
    };

    const handleSaveAll = () => {
        if (editingId !== null) {
            showToast('Please save or cancel the role you are currently editing.');
            return;
        }
        showToast('Staff roles saved successfully!', 'success');
    };

    const isAddButtonDisabled = roles.length >= 4 || editingId !== null;

    const styles = {
        container: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
        titleContainer: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
        title: { fontSize: '1.25rem', fontWeight: '600', color: '#343a40', margin: 0 },
        infoIcon: { cursor: 'pointer', color: '#6c757d', fontSize: '1.2rem' },
        addButton: { padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500', backgroundColor: '#007bff', color: 'white' },
        tableHeader: { display: 'flex', borderBottom: '1px solid #dee2e6', paddingBottom: '0.5rem', marginBottom: '0.5rem', color: '#6c757d', fontWeight: '500', fontSize: '0.9rem' },
        row: { display: 'flex', alignItems: 'center', borderBottom: '1px solid #e9ecef', padding: '0.75rem 0' },
        actionsCell: { flex: '0 0 100px', display: 'flex', gap: '1rem', paddingLeft: '0.5rem' },
        roleCell: { flex: '1' },
        roleInput: { width: '90%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', fontSize: '1rem' },
        iconButton: { background: 'none', border: 'none', cursor: 'pointer', color: '#495057', padding: 0 },
        saveFooter: { display: 'flex', justifyContent: 'flex-start', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e9ecef' },
        saveButton: { padding: '0.6rem 1.2rem', fontSize: '1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500', backgroundColor: '#28a745', color: 'white' },
        modalFooter: {
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e9ecef',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
        },
        modalButton: (variant = 'secondary') => ({
            padding: '0.5rem 1rem',
            fontSize: '0.9rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500',
            backgroundColor: variant === 'danger' ? '#dc3545' : '#6c757d',
            color: 'white',
        }),
    };

    return (
        <>
            {toast.show && <Toast message={toast.message} type={toast.type} onHide={() => setToast({ ...toast, show: false })} />}
            
            <Modal isOpen={isInfoModalOpen} onClose={() => setInfoModalOpen(false)}>
                <h4>Staff Role Information</h4>
                <p>You can define up to 4 roles of staff involved in the offering, which will be used to distribute the per-student and per-activity allocations.</p>
                <p>Together with the role of Subject Coordinator, these roles should capture everyone involved in tasks covered by these allocations, including casual staff. For example: Role A = lecturer; Role B = exam marker; Role C = tutor.</p>
                <p>If subject coordination tasks are delegated to staff other than the subject coordinator, you must define a suitable role here to capture these tasks.</p>
            </Modal>

            <Modal isOpen={roleToDelete !== null} onClose={() => setRoleToDelete(null)}>
                <h4>Confirm Deletion</h4>
                <p>Are you sure you want to delete this staff role? This action cannot be undone.</p>
                <div style={styles.modalFooter}>
                    <button style={styles.modalButton('secondary')} onClick={() => setRoleToDelete(null)}>Cancel</button>
                    <button style={styles.modalButton('danger')} onClick={() => handleDelete(roleToDelete)}>Delete</button>
                </div>
            </Modal>

            <div style={styles.container}>
                <div style={styles.header}>
                    <div style={styles.titleContainer}>
                        <h3 style={styles.title}>Staff Roles</h3>
                        <span style={styles.infoIcon} onClick={() => setInfoModalOpen(true)}>ⓘ</span>
                    </div>
                    <button 
                        style={{...styles.addButton, opacity: isAddButtonDisabled ? 0.6 : 1, cursor: isAddButtonDisabled ? 'not-allowed' : 'pointer'}} 
                        onClick={handleAddRole}
                        disabled={isAddButtonDisabled}
                    >
                        + Add
                    </button>
                </div>

                <div>
                    <div style={styles.tableHeader}>
                        <div style={{ flex: '0 0 100px', paddingLeft: '0.5rem' }}>Actions</div>
                        <div style={{ flex: '1' }}>Staff Role</div>
                    </div>
                    {roles.map(role => (
                        <div key={role.id} style={styles.row}>
                            <div style={styles.actionsCell}>
                                {editingId === role.id ? (
                                    <>
                                        <button onClick={() => handleSaveRole(role.id)} style={{...styles.iconButton, color: '#28a745', fontSize: '1.2rem'}} title="Save">✓</button>
                                        <button onClick={() => handleCancelEdit(role)} style={{...styles.iconButton, color: '#dc3545', fontSize: '1.2rem'}} title="Cancel">✕</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(role)} style={{...styles.iconButton, opacity: editingId ? 0.5 : 1, cursor: editingId ? 'not-allowed' : 'pointer'}} disabled={editingId !== null} title="Edit"><EditIcon /></button>
                                        <button onClick={() => setRoleToDelete(role.id)} style={{...styles.iconButton, opacity: editingId ? 0.5 : 1, cursor: editingId ? 'not-allowed' : 'pointer'}} disabled={editingId !== null} title="Delete"><DeleteIcon /></button>
                                    </>
                                )}
                            </div>
                            <div style={styles.roleCell}>
                                {editingId === role.id ? (
                                    <input 
                                        type="text" 
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        style={styles.roleInput}
                                        placeholder="Enter role name"
                                        autoFocus
                                    />
                                ) : (
                                    <span>{role.name}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={styles.saveFooter}>
                    <button style={styles.saveButton} onClick={handleSaveAll}>Save</button>
                </div>
            </div>
        </>
    );
}