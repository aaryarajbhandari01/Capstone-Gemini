// import React, { useState, useEffect } from 'react';

// function SubjectModal({ subject, onClose, onSave }) {
//   const [formData, setFormData] = useState({
//     code: '',
//     name: '',
//     term: '',
//     coordinator: '',
//     version: 1,
//     date: new Date().toISOString().split('T')[0], // Default to today
//     delivery: 'Lecture based',
//   });
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     // If we are editing, populate the form with the subject's data
//     if (subject) {
//       setFormData({ ...subject });
//     }
//   }, [subject]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const validate = () => {
//     let tempErrors = {};
//     if (!formData.code) tempErrors.code = "Subject Code is required.";
//     if (!formData.name) tempErrors.name = "Subject Name is required.";
//     if (!formData.coordinator) tempErrors.coordinator = "Subject Coordinator is required.";
//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validate()) {
//       onSave(formData);
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h2>{subject ? 'Edit Subject' : 'Add Subject'}</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Subject Code</label>
//             <input type="text" name="code" value={formData.code} onChange={handleChange} />
//             {errors.code && <span className="error-text">{errors.code}</span>}
//           </div>
//           <div className="form-group">
//             <label>Subject Name</label>
//             <input type="text" name="name" value={formData.name} onChange={handleChange} />
//             {errors.name && <span className="error-text">{errors.name}</span>}
//           </div>
//           <div className="form-group">
//             <label>Term</label>
//             <input type="text" name="term" value={formData.term} onChange={handleChange} />
//           </div>
//           <div className="form-group">
//             <label>Subject Coordinator</label>
//             <input type="text" name="coordinator" value={formData.coordinator} onChange={handleChange} />
//             {errors.coordinator && <span className="error-text">{errors.coordinator}</span>}
//           </div>
//            <div className="form-group">
//             <label>Format of Delivery</label>
//             <select name="delivery" value={formData.delivery} onChange={handleChange}>
//                 <option value="Lecture based">Lecture based</option>
//                 <option value="Project based">Project based</option>
//                 <option value="Studio based">Studio based</option>
//             </select>
//           </div>
//           <div className="form-actions">
//             <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
//             <button type="submit" className="btn-primary">Save Subject</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default SubjectModal;

import React, { useState, useEffect } from 'react';

function SubjectModal({ subject, onClose, onSave }) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    term: '',
    coordinator: '',
    version: 1,
    date: new Date().toISOString().split('T')[0], // Default to today
    delivery: 'Lecture based',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // If we are editing, populate the form with the subject's data
    if (subject) {
      setFormData({ ...subject });
    }
  }, [subject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.code) tempErrors.code = "Subject Code is required.";
    if (!formData.name) tempErrors.name = "Subject Name is required.";
    if (!formData.coordinator) tempErrors.coordinator = "Subject Coordinator is required.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{subject ? 'Edit Subject' : 'Add Subject'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Subject Code</label>
            <input type="text" name="code" value={formData.code} onChange={handleChange} />
            {errors.code && <span className="error-text">{errors.code}</span>}
          </div>
          <div className="form-group">
            <label>Subject Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Term</label>
            <input type="text" name="term" value={formData.term} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Subject Coordinator</label>
            <input type="text" name="coordinator" value={formData.coordinator} onChange={handleChange} />
            {errors.coordinator && <span className="error-text">{errors.coordinator}</span>}
          </div>
           <div className="form-group">
            <label>Format of Delivery</label>
            <select name="delivery" value={formData.delivery} onChange={handleChange}>
                <option value="Lecture based">Lecture based</option>
                <option value="Project based">Project based</option>
                <option value="Studio based">Studio based</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save Subject</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubjectModal;