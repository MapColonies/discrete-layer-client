/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { IconButton, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { iconsAndTooltips } from '../../../discrete-layer/models/catalogProducts';

interface ITypeIconProps {
  typeName: string;
  style?: Record<string, unknown>;
}

export const TypeIcon: React.FC<ITypeIconProps> = ({ typeName, style }) => {
  
  const [icon, tooltip] = iconsAndTooltips[typeName] ?? ['mc-icon-Close glow-missing-icon', 'MISSING ICON'];

  return (
    <Box style={style}>
      <Tooltip content={tooltip}>
        <IconButton className={icon}/>
      </Tooltip>
    </Box>
  );
};
