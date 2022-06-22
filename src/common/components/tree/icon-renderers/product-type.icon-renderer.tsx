import React from 'react';
import { ILayerImage } from '../../../../discrete-layer/models/layerImage';
import { TypeIcon } from '../../general/type-icon';

interface ILayerImageCellRendererParams {
  data: ILayerImage;
  preview?: string;
}

export const ProductTypeRenderer: React.FC<ILayerImageCellRendererParams> = ({ data, preview }) => {

  return (
    <TypeIcon typeName={data.productType as string} preview={preview}/>
  );
  
};
