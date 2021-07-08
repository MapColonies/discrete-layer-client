import React from 'react';
import moment from 'moment';
import { get } from 'lodash';
import { Box } from '@map-colonies/react-components';
import { TextField } from '@map-colonies/react-core';
import { Mode } from '../../../../common/models/mode.enum';
import { dateFormatter } from '../../layers-results/type-formatters/type-formatters';
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
      <Box className="detailsFieldValue">
        { dateFormatter(value) }
      </Box>
    );
  } else {
    const value = get(formik,`values[${fieldInfo.fieldName as string}]`) as string;
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
