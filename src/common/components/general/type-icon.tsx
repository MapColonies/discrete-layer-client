/* eslint-disable @typescript-eslint/naming-convention */
import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import EnumsMapContext, { DEFAULT_ENUM_DESCRIPTOR } from '../../contexts/enumsMap.context';

const SIZE = 128;

interface ITypeIconProps {
  typeName: string;
  thumbnailUrl?: string;
  style?: Record<string, unknown>;
}

export const TypeIcon: React.FC<ITypeIconProps> = ({ typeName, thumbnailUrl, style }) => {
  const { enumsMap } = useContext(EnumsMapContext);
  
  const { icon, translationKey: tooltip } = enumsMap?.[typeName] ?? DEFAULT_ENUM_DESCRIPTOR;

  const img = (url: string): JSX.Element => {
    return (<img width={SIZE} height={SIZE} src={url}/>);
  };

  return (
    <Box style={style}>
      <Tooltip content={thumbnailUrl !== undefined ? img(thumbnailUrl) : tooltip}>
        <IconButton className={icon} style={'color' in (style ?? {}) ? { color: style?.color as string } : undefined}/>
      </Tooltip>
    </Box>
  );
};
