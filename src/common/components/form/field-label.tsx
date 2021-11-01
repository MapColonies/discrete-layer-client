import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Box } from '@map-colonies/react-components';

import './field-label.css';

interface FieldLabelProps {
  value?: string;
  isRequired?: boolean;
  customClassName?: string;
}

export const FieldLabelComponent: React.FC<FieldLabelProps> = ({value, isRequired, customClassName}) => {
  return (
    <>
      <Box className={customClassName !== undefined ? customClassName : 'detailsFieldLabel'}>
        <FormattedMessage id={value}/>
      </Box>
      <Box className="requiredAsterisk">{isRequired === true ? '*' : ''}</Box>
    </>
  );
}
