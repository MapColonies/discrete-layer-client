import React from 'react';

interface NotchLabelProps {
  text: string;
}

export const NotchLabel: React.FC<NotchLabelProps> = ({ text }) => {
  return (
    <span style={{ backgroundColor: 'white', padding: '0 4px 0 4px' }}>
      { text }
    </span>
  );
}
