import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Box } from '@map-colonies/react-components';

interface FieldLabelProps {
  value?: string;
}

export const FieldLabelComponent: React.FC<FieldLabelProps> = ({value}) => {
  return (
    <Box className="detailsFieldLabel">
      <FormattedMessage id={value} />:
    </Box>
  );
}
