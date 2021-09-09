import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Box } from '@map-colonies/react-components';

interface FieldLabelProps {
  value?: string;
  isRequired?: boolean;
}

export const FieldLabelComponent: React.FC<FieldLabelProps> = ({value, isRequired}) => {
  return (
    <Box className="detailsFieldLabel">
      <FormattedMessage id={value}/>
      {
        isRequired === true && <Box style={{ display: 'inline' }}> * </Box>
      }
    </Box>
  );
}
