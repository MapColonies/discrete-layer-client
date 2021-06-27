import React from 'react';
import { get } from  'lodash';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../../common/models/mode.enum';
import { TextField } from '@map-colonies/react-core';
import { IRecordFieldInfo } from '../layer-details.field-info';

const FIRST_CHAR_IDX = 0;

interface StringValuePresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: string;
  formik?: unknown;
}

export const StringValuePresentorComponent: React.FC<StringValuePresentorProps> = ({ mode, fieldInfo, value, formik }) => {
  if (mode === Mode.VIEW || (mode === Mode.EDIT && fieldInfo.isManuallyEditable !== true)) {
    return (
      <Box className="detailsFieldValue">
        {value}
      </Box>
    );
  } else {
    // eslint-disable-next-line
    const value = get(formik,`values[${fieldInfo.fieldName as string}]`);
    return (
      <Box className="detailsFieldValue">
        <TextField
          id={fieldInfo.fieldName as string}
          name={fieldInfo.fieldName as string}
          type="text"
          value={value}
        />
      </Box>
    );
  }
}
