import React from 'react';
import { ILayerImage } from '../../../../discrete-layer/models/layerImage';
import { getStatusColoredText } from '../../../helpers/style';
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
      style={getStatusColoredText(data as any)}
    />
  );
  
};
