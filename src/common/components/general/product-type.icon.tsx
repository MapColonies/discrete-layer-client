/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { IconButton, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { productTypeIconsAndTooltips } from '../../../discrete-layer/models/products';

interface IProductTypeProps {
  value: string;
  style?: Record<string, unknown>;
}

export const ProductTypeIcon: React.FC<IProductTypeProps> = ({ value, style }) => {
  
  const [icon, tooltip] = productTypeIconsAndTooltips[value] ?? ['mc-icon-Close glow-missing-icon', 'MISSING ICON'];

  return (
    <Box style={style}>
      <Tooltip content={tooltip}>
        <IconButton className={icon}/>
      </Tooltip>
    </Box>
  );
};
