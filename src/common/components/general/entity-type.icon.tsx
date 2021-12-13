/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { IconButton, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { ILayerImage } from '../../../discrete-layer/models/layerImage';
import { LayerRasterRecordModelType } from '../../../discrete-layer/models';

interface IEntityTypeProps {
  data: ILayerImage;
  style?: Record<string, unknown>;
}

export const EntityTypeIcon: React.FC<IEntityTypeProps> = ({ data, style }) => {

  const type = data.__typename;

  interface EntityTypeIconsAndTooltips {
    [key: string]: [string, string] | undefined;
  }

  let includedInBests;
  if (type === 'LayerRasterRecord') {
    includedInBests = (data as LayerRasterRecordModelType).includedInBests;
  }

  const entityTypeIconsAndTooltips: EntityTypeIconsAndTooltips = {
    'LayerRasterRecord': [
      includedInBests ? 'mc-icon-Map-Best-Orthophoto' : 'mc-icon-Map-Orthophoto',
      `Orthophoto ${includedInBests ? (' included in: ' + includedInBests.join(' , ')) : ''}`
    ],
    'Layer3DRecord': ['mc-icon-Map-3D', '3D'],
    'BestRecord': ['mc-icon-Bests', 'BEST'],
    'LayerDEMRecord': ['mc-icon-Map-Terrain', 'DEM'],
  };
  
  const [icon, tooltip] = entityTypeIconsAndTooltips[type] ?? ['mc-icon-Close glow-missing-icon', 'MISSING ICON'];

  return (
    <Box style={style}>
      <Tooltip content={tooltip}>
        <IconButton className={icon} label="ENTITY TYPE ICON"/>
      </Tooltip>
    </Box>
  );
};
