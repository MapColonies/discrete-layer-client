/* eslint-disable @typescript-eslint/naming-convention */
import { ProductType } from '.';

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

interface IconsAndTooltips {
  [key: string]: [string, string] | undefined;
}

export const iconsAndTooltips: IconsAndTooltips = {
  'LayerRasterRecord': ['mc-icon-Map-Orthophoto', 'Orthophoto'],
  'Layer3DRecord': ['mc-icon-Map-3D', '3D'],
  'LayerDEMRecord': ['mc-icon-Map-Terrain', 'DEM'],
  'BestRecord': ['mc-icon-Bests', 'BEST'],
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