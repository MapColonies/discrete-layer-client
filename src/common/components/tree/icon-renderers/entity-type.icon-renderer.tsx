import React from 'react';
import { IconButton, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { ILayerImage } from '../../../../discrete-layer/models/layerImage';
import { LayerRasterRecordModelType } from '../../../../discrete-layer/models/LayerRasterRecordModel';

interface ILayerImageCellRendererParams {
  data: ILayerImage;
}

export const EntityTypeRenderer: React.FC<ILayerImageCellRendererParams> = ({ data }) => {
  const type = data.__typename;
  let icon: string;
  let includedInBests;
  let value = '';
  switch (type) {
    case 'LayerRasterRecord':
      includedInBests = (data as LayerRasterRecordModelType).includedInBests;
      icon = includedInBests ? 'mc-icon-Map-Best-Orthophoto' : 'mc-icon-Map-Orthophoto';
      value = `Orthophoto ${includedInBests ? (' included in: ' + includedInBests.join(' , ')) : ''}`;
      break;
    case 'Layer3DRecord':
      icon = 'mc-icon-Map-3D';
      value = '3D';
      break;
    case 'BestRecord':
      icon = 'mc-icon-Bests';
      value = 'BEST';
      break;
    default:
      icon = '';
  }

  return (
    <Box>
      <Tooltip content={value}>
        <IconButton className={icon} label="ENTITY TYPE ICON"/>
      </Tooltip>
    </Box>
  );
};
