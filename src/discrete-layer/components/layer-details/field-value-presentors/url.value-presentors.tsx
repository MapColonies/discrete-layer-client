import React from 'react';
import { Box } from '@map-colonies/react-components';

import './url.value-presentors.css';

interface UrlValuePresentorProps {
  value?: string;
}

export const UrlValuePresentorComponent: React.FC<UrlValuePresentorProps> = ({value}) => {
  return (
    <Box className="detailsFieldValue detailsUrlFieldValue">
      {value}
    </Box> 
  );
}
