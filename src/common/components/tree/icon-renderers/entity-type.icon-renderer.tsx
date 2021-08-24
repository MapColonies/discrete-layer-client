import React from 'react';
import { IconButton } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { ILayerImage } from '../../../../discrete-layer/models/layerImage';

interface ILayerImageCellRendererParams {
  data: ILayerImage;
}

export const EntityTypeRenderer: React.FC<ILayerImageCellRendererParams> = ({ data }) => {
  const type = data.__typename;
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
