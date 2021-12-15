/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { IconButton, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';

interface IEntityTypeProps {
  entityType: string;
  style?: Record<string, unknown>;
}

export const EntityTypeIcon: React.FC<IEntityTypeProps> = ({ entityType, style }) => {

  interface EntityTypeIconsAndTooltips {
    [key: string]: [string, string] | undefined;
  }

  const entityTypeIconsAndTooltips: EntityTypeIconsAndTooltips = {
    'LayerRasterRecord': ['mc-icon-Map-Orthophoto', 'Orthophoto'],
    'Layer3DRecord': ['mc-icon-Map-3D', '3D'],
    'BestRecord': ['mc-icon-Bests', 'BEST'],
    'LayerDEMRecord': ['mc-icon-Map-Terrain', 'DEM'],
  };
  
  const [icon, tooltip] = entityTypeIconsAndTooltips[entityType] ?? ['mc-icon-Close glow-missing-icon', 'MISSING ICON'];

  return (
    <Box style={style}>
      <Tooltip content={tooltip}>
        <IconButton className={icon} label="ENTITY TYPE ICON"/>
      </Tooltip>
    </Box>
  );
};
