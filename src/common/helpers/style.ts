import { RecordStatus } from '../../discrete-layer/models';
import CONFIG from '../config';

const STATUS = 'productStatus';
const POLYGON_PARTS_SHOWN = 'polygonPartsShown';
const POLYGON_PARTS_SHOWN_COLOR = CONFIG.CONTEXT_MENUS.MAP.POLYGON_PARTS_FEATURE_CONFIG.outlineColor;
const UNPUBLISHED_COLOR = 'var(--mdc-theme-gc-warning-high)';
const ERROR_COLOR = 'var(--mdc-theme-gc-error-high)';

export const existStatus = (data: Record<string, unknown>): boolean => {
  return STATUS in data;
};

export const existPolygonParts = (data: Record<string, unknown>): boolean => {
  return POLYGON_PARTS_SHOWN in data;
};

export const isUnpublished = (data: Record<string, unknown>): boolean => {
  return Object.keys(data).includes(STATUS) && Object.values(data).includes(RecordStatus.UNPUBLISHED);
};

export const isPolygonPartsShown = (data: Record<string, unknown>): boolean => {
  return Object.keys(data).includes(POLYGON_PARTS_SHOWN) && data[POLYGON_PARTS_SHOWN] === true;
};

export const isUnpublishedValue = (value: string): boolean => {
  return value === RecordStatus.UNPUBLISHED;
};

export const getStatusStyle = (
  data: Record<string, unknown>, 
  property: 'color' | 'backgroundColor'
): Record<string, unknown> | undefined => {
  if (data.layerURLMissing) {
    return { [property]: ERROR_COLOR };
  }
  if (existStatus(data) && isUnpublished(data)) {
    return { [property]: UNPUBLISHED_COLOR };
  }
  if (existPolygonParts(data) && isPolygonPartsShown(data)) {
    return { [property]: POLYGON_PARTS_SHOWN_COLOR };
  }
  return undefined;
};
