import React from 'react';
import { X } from 'lucide-react';

const ViewFriends = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 relative w-11/12 max-w-lg">
        <button onClick={onClose} className="absolute top-3 right-3">
          <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
        </button>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default ViewFriends;
