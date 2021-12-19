import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { JobModelType } from '../../../../discrete-layer/models';
import { TypeIcon } from '../../general/type-icon';

interface IProductTypeCellRendererParams extends ICellRendererParams {
  style?: Record<string, unknown>;
}

export const ProductTypeRenderer: React.FC<IProductTypeCellRendererParams> = (props) => {

  const data = props.data as JobModelType;

  return (
    <TypeIcon typeName={data.productType as string} style={props.style}/>
  );
  
};
