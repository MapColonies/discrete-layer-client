import React from 'react';
import { Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { ProductType } from '../../../models';

interface ProductTypeValuePresentorProps {
  value?: ProductType;
}

export const ProductTypeValuePresentorComponent: React.FC<ProductTypeValuePresentorProps> = ({ value }) => {
  return (
    <Tooltip content={value}>
      <Box className="detailsFieldValue directionHandler">
        {value}
      </Box>
    </Tooltip>
  );
}
