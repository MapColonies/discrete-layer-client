import React from 'react';
import { RecordStatus } from '../../../../discrete-layer/models';
import { ILayerImage } from '../../../../discrete-layer/models/layerImage';
import { TypeIcon } from '../../general/type-icon';

const STATUS = 'productStatus';
const UNPUBLISHED_COLOR = 'orange';

interface ILayerImageCellRendererParams {
  data: ILayerImage;
  thumbnailUrl?: string;
}

export const ProductTypeRenderer: React.FC<ILayerImageCellRendererParams> = ({ data, thumbnailUrl }) => {

  return (
    <TypeIcon
      typeName={data.productType as string}
      thumbnailUrl={thumbnailUrl}
      style={STATUS in data && Object.values(data).includes(RecordStatus.UNPUBLISHED) ? { color: UNPUBLISHED_COLOR } : undefined}
    />
  );
  
};
