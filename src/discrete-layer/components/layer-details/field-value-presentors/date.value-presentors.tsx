import React from 'react';
import moment from 'moment';
import { Box } from '@map-colonies/react-components';
import { dateFormatter } from '../../layers-results/type-formatters/type-formatters';
import { Mode } from '../../../../common/helpers/mode.enum';
import { TextField } from '@map-colonies/react-core';

interface DateValuePresentorProps {
  value?: moment.Moment;
  fieldName: string;
  mode: Mode;
}

export const DateValuePresentorComponent: React.FC<DateValuePresentorProps> = ({ value, fieldName, mode }) => {
  if (mode === Mode.VIEW) {
    return (
      <Box className="detailsFieldValue">
        { dateFormatter(value) }
      </Box>
    );
  } else {
    return (
      <Box className="detailsFieldValue">
        <TextField
          id={fieldName}
          name={fieldName}
          type="datetime-local"
          value={value !== undefined ? dateFormatter(value) : ''}
        />
      </Box>
    );
  }
}
