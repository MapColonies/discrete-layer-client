import React from 'react';
import { Box } from '@map-colonies/react-components';

interface UnknownValuePresentorProps {
  value?: string;
}

export const UnknownValuePresentorComponent: React.FC<UnknownValuePresentorProps> = ({ value }) => {
  return (
    <Box className="detailsFieldValue">
      *UNKNOWN TYPE* {value}
    </Box>
  );
}
