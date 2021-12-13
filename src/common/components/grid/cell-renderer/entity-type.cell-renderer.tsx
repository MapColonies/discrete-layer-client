import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { ILayerImage } from '../../../../discrete-layer/models/layerImage';
import { EntityTypeIcon } from '../../general/entity-type.icon';

interface IEntityTypeCellRendererParams extends ICellRendererParams {
  style?: Record<string, unknown>;
}

export const EntityTypeRenderer: React.FC<IEntityTypeCellRendererParams> = (props) => {
  return (
    <EntityTypeIcon data={props.data as ILayerImage} style={props.style}/>
  );
};
