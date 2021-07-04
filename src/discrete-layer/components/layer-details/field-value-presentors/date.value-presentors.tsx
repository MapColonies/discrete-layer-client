import React from 'react';
import moment from 'moment';
import { Box } from '@map-colonies/react-components';
import { TextField } from '@map-colonies/react-core';
import { Mode } from '../../../../common/models/mode.enum';
import { dateFormatter } from '../../layers-results/type-formatters/type-formatters';
import { IRecordFieldInfo } from '../layer-details.field-info';

interface DateValuePresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: moment.Moment;
}

export const DateValuePresentorComponent: React.FC<DateValuePresentorProps> = ({ mode, fieldInfo, value }) => {
  if (mode === Mode.VIEW || (mode === Mode.EDIT && fieldInfo.isManuallyEditable !== true)) {
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
