import React from 'react';
import TooltippedValue from './tooltipped.value';

interface UnknownValuePresentorProps {
  value?: string;
}

export const UnknownValuePresentorComponent: React.FC<UnknownValuePresentorProps> = ({ value }) => {
  return (
    <TooltippedValue className="detailsFieldValue"> *UNKNOWN TYPE* {value}</TooltippedValue>
  );
}
