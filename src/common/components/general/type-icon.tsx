/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { IconButton, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { iconsAndTooltips } from '../../../discrete-layer/models/catalogProducts';

const SIZE = 128;

interface ITypeIconProps {
  typeName: string;
  thumbnailUrl?: string;
  style?: Record<string, unknown>;
}

export const TypeIcon: React.FC<ITypeIconProps> = ({ typeName, thumbnailUrl, style }) => {
  
  const [icon, tooltip] = iconsAndTooltips[typeName] ?? ['mc-icon-Close glow-missing-icon', 'MISSING ICON'];

  const img = (url: string): JSX.Element => {
    return (<img width={SIZE} height={SIZE} src={url}/>);
  };

  return (
    <Box style={style}>
      <Tooltip content={thumbnailUrl !== undefined ? img(thumbnailUrl) : tooltip}>
        <IconButton className={icon}/>
      </Tooltip>
    </Box>
  );
};
