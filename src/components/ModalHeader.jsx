import React from 'react';

const ModalHeader = ({ title, onClose }) => {
  return (
    <div className="modal-header">
      <h2 className="modal-title">{title}</h2>
      <button className="close-btn" onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default ModalHeader;
