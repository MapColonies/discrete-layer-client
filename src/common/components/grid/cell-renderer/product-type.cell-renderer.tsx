/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { IconButton, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import {
  JobModelType,
  ProductType,
} from '../../../../discrete-layer/models';

interface IEntityTypeCellRendererParams extends ICellRendererParams {
  style?: Record<string, unknown>;
}

export const ProductTypeRenderer: React.FC<IEntityTypeCellRendererParams> = (
  props
) => {
  const type: ProductType = ((props.data as JobModelType).productType as ProductType);


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

  interface ProductTypeIconsAndValues {
     [key: string]: [string, string] | undefined
  }

  const productTypeIconsAndValues: ProductTypeIconsAndValues = {
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
      [PHOTO_REALISTIC_3D]: ['mc-icon-Map-3D', PHOTO_REALISTIC_3D],
  }
  
  const [icon, value] = productTypeIconsAndValues[type] ?? ['glow-missing-icon', 'MISSING_ICON'];

  return (
    <Box style={{height:'40px', width:'40px',display: 'flex', alignItems:'center', ...props.style}}>
      <Tooltip content={value}>
        <IconButton className={icon} />
      </Tooltip>
    </Box>
  );
};
