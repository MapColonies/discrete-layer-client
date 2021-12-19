import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { ILayerImage } from '../../../../discrete-layer/models/layerImage';
import { TypeIcon } from '../../general/type-icon';

interface IEntityTypeCellRendererParams extends ICellRendererParams {
  style?: Record<string, unknown>;
}

export const EntityTypeRenderer: React.FC<IEntityTypeCellRendererParams> = (props) => {

  const data = props.data as ILayerImage;

  return (
    <TypeIcon typeName={data.__typename} style={props.style}/>
  );
  
};
