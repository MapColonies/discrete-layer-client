import React from 'react';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../../common/helpers/mode.enum';
import { TextField } from '@map-colonies/react-core';

interface StringValuePresentorProps {
  value?: string;
  fieldName: string;
  mode: Mode;
}

export const StringValuePresentorComponent: React.FC<StringValuePresentorProps> = ({ value, fieldName, mode }) => {
  if (mode === Mode.VIEW) {
    return (
      <Box className="detailsFieldValue">
        {value}
      </Box>
    );
  } else {
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
}
