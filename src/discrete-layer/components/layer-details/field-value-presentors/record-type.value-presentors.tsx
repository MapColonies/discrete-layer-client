import React from 'react';
import { Box } from '@map-colonies/react-components';
import { RecordType } from '../../../models';

interface RecordTypeValuePresentorProps {
  value?: RecordType;
}

export const RecordTypeValuePresentorComponent: React.FC<RecordTypeValuePresentorProps> = ({value}) => {
  return (
    <Box className="detailsFieldValue">
      {value}
    </Box>
  );
}
