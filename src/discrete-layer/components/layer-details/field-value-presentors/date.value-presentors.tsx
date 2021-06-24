import React from 'react';
import moment from 'moment';
import { Box } from '@map-colonies/react-components';
import { dateFormatter } from '../../layers-results/type-formatters/type-formatters';
import { Mode } from '../../../../common/models/mode.enum';
import { TextField } from '@map-colonies/react-core';
import { IRecordFieldInfo } from '../layer-details.field-info';

interface DateValuePresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: moment.Moment;
}

export const DateValuePresentorComponent: React.FC<DateValuePresentorProps> = ({ mode, fieldInfo, value }) => {
  if (mode === Mode.VIEW || fieldInfo.isManuallyEditable !== true) {
    return (
      <Box className="detailsFieldValue">
        { dateFormatter(value) }
      </Box>
    );
  } else {
    return (
      <Box className="detailsFieldValue">
        <TextField
          id={fieldInfo.fieldName as string}
          name={fieldInfo.fieldName as string}
          type="datetime-local"
          value={value !== undefined ? dateFormatter(value) : ''}
        />
      </Box>
    );
  }
}
