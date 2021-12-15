/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { IconButton, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { ILayerImage } from '../../../discrete-layer/models/layerImage';
import { ProductType } from '../../../discrete-layer/models';

interface IProductTypeProps {
  data: ILayerImage;
  style?: Record<string, unknown>;
}

export const ProductTypeIcon: React.FC<IProductTypeProps> = ({ data, style }) => {

  const type = data.productType as ProductType;

  const {
    ORTHOPHOTO,
    ORTHOPHOTO_HISTORY,
    ORTHOPHOTO_BEST,
    RASTER_MAP,
    RASTER_MAP_BEST,
    RASTER_AID,
    RASTER_AID_BEST,
    RASTER_VECTOR,
    RASTER_VECTOR_BEST,
    VECTOR_BEST,
    DTM,
    DSM,
    QUANTIZED_MESH,
    PHOTO_REALISTIC_3D,
    POINT_CLOUD,
  } = ProductType;

  interface ProductTypeIconsAndTooltips {
    [key: string]: [string, string] | undefined;
  }
  
  const productTypeIconsAndTooltips: ProductTypeIconsAndTooltips = {
    [ORTHOPHOTO]: ['mc-icon-Map-Orthophoto', ORTHOPHOTO],
    [ORTHOPHOTO_HISTORY]: ['mc-icon-Map-Orthophoto', ORTHOPHOTO_HISTORY],
    [ORTHOPHOTO_BEST]: ['mc-icon-Map-Best-Orthophoto', ORTHOPHOTO_BEST],
    [RASTER_MAP]: ['mc-icon-Map-Raster', RASTER_MAP],
    [RASTER_MAP_BEST]: ['mc-icon-Map-Best-Raster', RASTER_MAP_BEST],
    [RASTER_AID]: ['mc-icon-Map-Raster', RASTER_AID],
    [RASTER_AID_BEST]: ['mc-icon-Map-Best-Raster', RASTER_AID_BEST],
    [RASTER_VECTOR]: ['mc-icon-Map-Vector', RASTER_VECTOR],
    [RASTER_VECTOR_BEST]: ['mc-icon-Map-Vector', RASTER_VECTOR_BEST],
    [VECTOR_BEST]: ['mc-icon-Map-Vector', VECTOR_BEST],
    [DTM]: ['mc-icon-Map-Terrain', DTM],
    [DSM]: ['mc-icon-Map-Terrain', DSM],
    [QUANTIZED_MESH]: ['mc-icon-Map-Terrain', QUANTIZED_MESH],
    [PHOTO_REALISTIC_3D]: ['mc-icon-Map-3D', PHOTO_REALISTIC_3D],
    [POINT_CLOUD]: ['mc-icon-Map-3D', POINT_CLOUD],
  };
  
  const [icon, tooltip] = productTypeIconsAndTooltips[type] ?? ['mc-icon-Close glow-missing-icon', 'MISSING ICON'];

  return (
    <Box style={style}>
      <Tooltip content={tooltip}>
        <IconButton className={icon} label="PRODUCT TYPE ICON"/>
      </Tooltip>
    </Box>
  );
};
