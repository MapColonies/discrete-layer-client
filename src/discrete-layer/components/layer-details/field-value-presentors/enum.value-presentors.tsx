import React from 'react';
import { get } from  'lodash';
import { TextField, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../../common/models/mode.enum';
import { IRecordFieldInfo } from '../layer-details.field-info';

interface EnumValuePresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: string;
  formik?: unknown;
}

export const EnumValuePresentorComponent: React.FC<EnumValuePresentorProps> = ({ mode, fieldInfo, value, formik }) => {
  if (formik === undefined || mode === Mode.VIEW || (mode === Mode.EDIT && fieldInfo.isManuallyEditable !== true)) {
    return (
      <Tooltip content={value}>
        <Box className="detailsFieldValue">
          {value}
        </Box>
      </Tooltip>
    );
  } else {
    const value = get(formik,`values[${fieldInfo.fieldName as string}]`) as string;
    return (
      <Box className="detailsFieldValue">
        <TextField
          id={fieldInfo.fieldName as string}
          name={fieldInfo.fieldName as string}
          type="text"
          // eslint-disable-next-line
          onChange={(formik as any).handleChange}
          // eslint-disable-next-line
          onBlur={(formik as any).handleBlur}
          value={value}
          required={fieldInfo.isRequired === true}
        />
      </Box>
    );
  }
}
