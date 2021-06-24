import React from 'react';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../../common/models/mode.enum';
import { TextField } from '@map-colonies/react-core';
import { IRecordFieldInfo } from '../layer-details.field-info';

interface StringValuePresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: string;
}

export const StringValuePresentorComponent: React.FC<StringValuePresentorProps> = ({ mode, fieldInfo, value }) => {
  if (mode === Mode.VIEW || fieldInfo.isManuallyEditable !== true) {
    return (
      <Box className="detailsFieldValue">
        {value}
      </Box>
    );
  } else {
    return (
      <Box className="detailsFieldValue">
        <TextField
          id={fieldInfo.fieldName as string}
          name={fieldInfo.fieldName as string}
          type="text"
          value={value !== undefined ? value : ''}
        />
      </Box>
    );
  }
}
