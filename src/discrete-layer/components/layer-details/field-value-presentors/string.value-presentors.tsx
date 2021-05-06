import React from 'react';
import { Box } from '@map-colonies/react-components';

interface StringValuePresentorProps {
  value?: string;
}

export const StringValuePresentorComponent: React.FC<StringValuePresentorProps> = ({value}) => {
  return (
    <Box className="detailsFieldValue">
      {value}
    </Box>
  );
}
