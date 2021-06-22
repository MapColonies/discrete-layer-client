import React from 'react';
import { Box } from '@map-colonies/react-components';
import { TextField } from '@map-colonies/react-core';

interface StringInputPresentorProps {
  value?: string;
  fieldName: string;
}

export const StringInputPresentorComponent: React.FC<StringInputPresentorProps> = ({ value, fieldName }) => {
  return (
    <Box className="detailsFieldValue">
      <TextField
        id={fieldName}
        name={fieldName}
        type="text"
        value={value !== undefined ? value : ''}
      />
    </Box>
  );
}
