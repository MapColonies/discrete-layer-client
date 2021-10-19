import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Box } from '@map-colonies/react-components';

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
      <Box style={{ flex: '0 0 8px', color: 'var(--mdc-theme-gc-error-medium)' }}>{isRequired === true ? '*' : ''}</Box>
    </>
  );
}
