import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-background rounded-lg shadow-custom ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};