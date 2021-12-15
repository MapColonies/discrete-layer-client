import React from 'react';
import { ILayerImage } from '../../../../discrete-layer/models/layerImage';
import { EntityTypeIcon } from '../../general/entity-type.icon';

interface ILayerImageCellRendererParams {
  data: ILayerImage;
}

export const EntityTypeRenderer: React.FC<ILayerImageCellRendererParams> = ({ data }) => {
  return (
    <EntityTypeIcon entityType={data.__typename}/>
  );
};
