import React from 'react';
import { ILayerImage } from '../../../../discrete-layer/models/layerImage';
import { getStatusStyle } from '../../../helpers/style';
import { TypeIcon } from '../../general/type-icon';

interface IProductTypeCellRendererParams {
  data: ILayerImage;
  thumbnailUrl?: string;
}

export const ProductTypeRenderer: React.FC<IProductTypeCellRendererParams> = ({ data, thumbnailUrl }) => {

  return (
    <TypeIcon
      typeName={data.productType as string}
      thumbnailUrl={thumbnailUrl}
      style={getStatusStyle(data as any)}
    />
  );
  
};
