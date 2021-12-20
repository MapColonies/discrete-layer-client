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
  [key: string]: [string, string, string] | undefined;
}

export const iconsAndTooltips: IconsAndTooltips = {
  'LayerRasterRecord': ['mc-icon-Map-Orthophoto', 'Orthophoto', ''],
  'Layer3DRecord': ['mc-icon-Map-3D', '3D', ''],
  'LayerDemRecord': ['mc-icon-Map-Terrain', 'DEM', ''],
  'BestRecord': ['mc-icon-Bests', 'BEST', ''],
  [ORTHOPHOTO]: ['mc-icon-Map-Orthophoto', ORTHOPHOTO, 'LayerRasterRecord'],
  [ORTHOPHOTO_HISTORY]: ['mc-icon-Map-Orthophoto', ORTHOPHOTO_HISTORY, 'LayerRasterRecord'],
  [ORTHOPHOTO_BEST]: ['mc-icon-Map-Best-Orthophoto', ORTHOPHOTO_BEST, 'BestRecord'],
  [RASTER_MAP]: ['mc-icon-Map-Raster', RASTER_MAP, 'LayerRasterRecord'],
  [RASTER_MAP_BEST]: ['mc-icon-Map-Best-Raster', RASTER_MAP_BEST, 'BestRecord'],
  [RASTER_AID]: ['mc-icon-Map-Raster', RASTER_AID, 'LayerRasterRecord'],
  [RASTER_AID_BEST]: ['mc-icon-Map-Best-Raster', RASTER_AID_BEST, 'BestRecord'],
  [RASTER_VECTOR]: ['mc-icon-Map-Vector', RASTER_VECTOR, 'LayerRasterRecord'],
  [RASTER_VECTOR_BEST]: ['mc-icon-Map-Vector', RASTER_VECTOR_BEST, 'BestRecord'],
  [VECTOR_BEST]: ['mc-icon-Map-Vector', VECTOR_BEST, 'BestRecord'],
  [DTM]: ['mc-icon-Map-Terrain', DTM, 'LayerDemRecord'],
  [DSM]: ['mc-icon-Map-Terrain', DSM, 'LayerDemRecord'],
  [QUANTIZED_MESH]: ['mc-icon-Map-Terrain', QUANTIZED_MESH, 'LayerDemRecord'],
  [PHOTO_REALISTIC_3D]: ['mc-icon-Map-3D', PHOTO_REALISTIC_3D, 'Layer3DRecord'],
  [POINT_CLOUD]: ['mc-icon-Map-3D', POINT_CLOUD, 'Layer3DRecord'],
};

interface CatalogProductItem {
  label: string;
  value: string;
  icon: string;
  children?: CatalogProductItem[];
}

interface CatalogProductTree {
  [key: string]: CatalogProductItem;
}

export const getCatalogProductsHierarchy = (): unknown => {
  const productsList: CatalogProductTree = {};
  Object.keys(iconsAndTooltips).forEach((key: string) => {
    const value = iconsAndTooltips[key] as string[];
    const [icon, tooltip, parent] = value;
    if (parent === '') {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (productsList[key] === undefined) {
        productsList[key] = { label: tooltip, value: tooltip, icon: icon, children: [] };
      } else {
        productsList[key].label = tooltip;
        productsList[key].value = tooltip;
        productsList[key].icon = icon;
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (productsList[parent] === undefined) {
        productsList[parent] = { label: '', value: '', icon: '', children: [] };
      }
      productsList[parent].children?.push({ label: tooltip, value: tooltip, icon: icon });
    }
  });
  return productsList;
};

export const getCatalogProductsByEntityType = (entityType: string): unknown => {
  return Object.values(iconsAndTooltips).filter((item) => {
    const [,,parent] = item as string[];
    return parent === entityType;
  });
};
