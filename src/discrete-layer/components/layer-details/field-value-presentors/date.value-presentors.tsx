import React from 'react';
import moment from 'moment';
import { Box } from '@map-colonies/react-components';
import { dateFormatter } from '../../layers-results/type-formatters/type-formatters';

interface DateValuePresentorProps {
  value?: moment.Moment;
}

export const DateValuePresentorComponent: React.FC<DateValuePresentorProps> = ({value}) => {
  return (
    <Box className="detailsFieldValue">
      {dateFormatter(value)}
    </Box>
  );
}
