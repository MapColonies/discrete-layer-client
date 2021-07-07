import React from 'react';
import { get } from  'lodash';
import { Box } from '@map-colonies/react-components';
import { TextField } from '@map-colonies/react-core';
import { Mode } from '../../../../common/models/mode.enum';
import { IRecordFieldInfo } from '../layer-details.field-info';

interface StringValuePresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: string;
  formik?: unknown;
}

export const StringValuePresentorComponent: React.FC<StringValuePresentorProps> = ({ mode, fieldInfo, value, formik }) => {
  if (formik === undefined || mode === Mode.VIEW || (mode === Mode.EDIT && fieldInfo.isManuallyEditable !== true)) {
    return (
      <Box className="detailsFieldValue">
        {value}
      </Box>
    );
  } else {
    const value = get(formik,`values[${fieldInfo.fieldName as string}]`) as string;
    return (
      <Box className="detailsFieldValue">
        <TextField
          name={fieldInfo.fieldName as string}
          type="text"
          // eslint-disable-next-line
          onChange={(formik as any).handleChange}
          value={value}
        />
      </Box>
    );
  }
}
