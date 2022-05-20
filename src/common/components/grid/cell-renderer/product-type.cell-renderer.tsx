import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { ILayerImage } from '../../../../discrete-layer/models/layerImage';
import { TypeIcon } from '../../general/type-icon';

interface IEntityTypeCellRendererParams extends ICellRendererParams {
  style?: Record<string, unknown>;
}

export const ProductTypeRenderer: React.FC<IEntityTypeCellRendererParams> = (props) => {

  const data = props.data as ILayerImage;

  return (
    <TypeIcon typeName={data.productType as string} style={props.style}/>
  );
  
};
