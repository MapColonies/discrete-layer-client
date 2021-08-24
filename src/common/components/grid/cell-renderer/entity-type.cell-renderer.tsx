import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { IconButton } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { ILayerImage } from '../../../../discrete-layer/models/layerImage';

export const EntityTypeRenderer: React.FC<ICellRendererParams> = (props) => {
  const type = (props.data as ILayerImage).__typename;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const icon = type === 'LayerRasterRecord' ? 'mc-icon-Map-Orthophoto' : ( type === 'Layer3DRecord' ? 'mc-icon-Map-3D' : ( type === 'BestRecord' ? 'mc-icon-Bests' : '' ) );

  return (
    <Box>
      <IconButton 
        className={icon}
        label="ENTITY TYPE ICON"
      />
    </Box>
  );
};
