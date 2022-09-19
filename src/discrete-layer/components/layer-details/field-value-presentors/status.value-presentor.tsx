/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react';
import TooltippedValue from '../../../../common/components/form/tooltipped.value';

import './status.value-presentor.css';

interface StatusValuePresentorProps {
  value?: string;
}

export const StatusValuePresentorComponent: React.FC<StatusValuePresentorProps> = ({
  value,
}) => {
  return (
    <TooltippedValue className="detailsFieldValue warning">{value}</TooltippedValue>
  );
};
