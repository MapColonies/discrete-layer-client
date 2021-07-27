import React from 'react';
import moment from 'moment';
import { get } from 'lodash';
import { TextField, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../../common/models/mode.enum';
import { dateFormatter } from '../../../../common/helpers/type-formatters';
import { IRecordFieldInfo } from '../layer-details.field-info';

interface DateValuePresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: moment.Moment;
  formik?: unknown;
}

export const DateValuePresentorComponent: React.FC<DateValuePresentorProps> = ({ mode, fieldInfo, value, formik }) => {
  if (mode === Mode.VIEW || (mode === Mode.EDIT && fieldInfo.isManuallyEditable !== true)) {
    return (
      <Tooltip content={ dateFormatter(value) }>
        <Box className="detailsFieldValue">
          { dateFormatter(value) }
        </Box>
      </Tooltip>
    );
  } else {
    const value = get(formik,`values[${fieldInfo.fieldName as string}]`) as string;
    if (fieldInfo.isRequired === true) {
      return (
        <Box className="detailsFieldValue">
          <TextField
            name={fieldInfo.fieldName as string}
            type="date"
            // eslint-disable-next-line
            onChange={(formik as any).handleChange}
            value={value}
            required
          />
        </Box>
      );
    }
    return (
      <Box className="detailsFieldValue">
        <TextField
          name={fieldInfo.fieldName as string}
          type="date"
          // eslint-disable-next-line
          onChange={(formik as any).handleChange}
          value={value}
        />
      </Box>
    );
  }
}
