/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { IconButton, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { iconsAndTooltips } from '../../../discrete-layer/models/catalogProducts';

interface ITypeIconProps {
  typeName: string;
  preview?: string;
  style?: Record<string, unknown>;
}

export const TypeIcon: React.FC<ITypeIconProps> = ({ typeName, preview, style }) => {
  
  const [icon, tooltip] = iconsAndTooltips[typeName] ?? ['mc-icon-Close glow-missing-icon', 'MISSING ICON'];

  const img = (url: string): JSX.Element => {
    return (<img width="128" height="128" src={url} alt="Thumbnail"/>);
  };

  return (
    <Box style={style}>
      <Tooltip content={preview !== undefined ? img(preview) : tooltip}>
        <IconButton className={icon}/>
      </Tooltip>
    </Box>
  );
};
