import React, { useMemo } from 'react';
import { ILayerImage } from '../../../../discrete-layer/models/layerImage';
import { LayerRasterRecordModelType } from '../../../../discrete-layer/models';
import { getStatusStyle } from '../../../helpers/style';
import { TypeIcon } from '../../shared/type-icon';

interface IProductTypeCellRendererParams {
  data: ILayerImage;
  thumbnailUrl?: string;
  onClick?: (data: ILayerImage, value: boolean) => void;
}

export const ProductTypeRenderer: React.FC<IProductTypeCellRendererParams> = ({ data, thumbnailUrl, onClick }) => {

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(data, !(data as LayerRasterRecordModelType).polygonPartsShown);
    }
  };

  const computedStyle = useMemo(() => {
    return {
      ...(getStatusStyle(data as any, 'color') ?? {})
    };
  }, [data]);

  return (
    <TypeIcon
      typeName={data.productType as string}
      thumbnailUrl={thumbnailUrl}
      style={computedStyle}
      onClick={data.__typename === "LayerRasterRecord" ? handleClick : undefined}
    />
  );
  
};