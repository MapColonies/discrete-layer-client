/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { IconButton, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { entityTypeIconsAndTooltips } from '../../../discrete-layer/models/products';

interface IEntityTypeProps {
  value: string;
  style?: Record<string, unknown>;
}

export const EntityTypeIcon: React.FC<IEntityTypeProps> = ({ value, style }) => {
  
  const [icon, tooltip] = entityTypeIconsAndTooltips[value] ?? ['mc-icon-Close glow-missing-icon', 'MISSING ICON'];

  return (
    <Box style={style}>
      <Tooltip content={tooltip}>
        <IconButton className={icon}/>
      </Tooltip>
    </Box>
  );
};
