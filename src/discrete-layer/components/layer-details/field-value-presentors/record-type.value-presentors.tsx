import React from 'react';
import { Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { RecordType } from '../../../models';

interface RecordTypeValuePresentorProps {
  value?: RecordType;
}

export const RecordTypeValuePresentorComponent: React.FC<RecordTypeValuePresentorProps> = ({ value }) => {
  return (
    <Tooltip content={value}>
      <Box className="detailsFieldValue">
        {value}
      </Box>
    </Tooltip>
  );
}
