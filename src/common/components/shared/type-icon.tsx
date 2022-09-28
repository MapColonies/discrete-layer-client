/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { useIntl } from 'react-intl';
import { IconButton, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { mcEnums } from '../../../discrete-layer/models/catalogProducts';

const SIZE = 128;

interface ITypeIconProps {
  typeName: string;
  thumbnailUrl?: string;
  style?: Record<string, unknown>;
}

export const TypeIcon: React.FC<ITypeIconProps> = ({ typeName, thumbnailUrl, style }) => {

  const intl = useIntl();
  
  const { icon, translationKey } = mcEnums[typeName];

  const img = (url: string): JSX.Element => {
    return (<img width={SIZE} height={SIZE} src={url}/>);
  };

  const tooltip = intl.formatMessage({ id: translationKey });

  return (
    <Box style={style}>
      <Tooltip content={thumbnailUrl !== undefined ? img(thumbnailUrl) : tooltip}>
        <IconButton className={icon} style={'color' in (style ?? {}) ? { color: style?.color as string } : undefined}/>
      </Tooltip>
    </Box>
  );
};
