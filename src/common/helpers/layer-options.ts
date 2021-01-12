import {
  RCesiumWMTSLayerOptions,
  RCesiumWMSLayerOptions,
  RCesiumXYZLayerOptions,
  RCesiumOSMLayerOptions,
} from '@map-colonies/react-components';
import CONFIG from '../config';

/* eslint-disable */
export const wmtsOptions: RCesiumWMTSLayerOptions = {
  url: CONFIG.WMTS_LAYER.URL,
  layer: CONFIG.WMTS_LAYER.LAYER,
  style: CONFIG.WMTS_LAYER.STYLE,
  format: CONFIG.WMTS_LAYER.FORMAT,
  tileMatrixSetID: CONFIG.WMTS_LAYER.MATRIX_SET,
  maximumLevel: CONFIG.WMTS_LAYER.MAXIMUM_LEVEL,
};

export const wmsOptions: RCesiumWMSLayerOptions = {
  url: CONFIG.WMS_LAYER.URL,
  layers: CONFIG.WMS_LAYER.PARAMS.LAYERS,
};

export const xyzOptions: RCesiumXYZLayerOptions = {
  url: CONFIG.XYZ_LAYER.URL,
};

export const osmOptions: RCesiumOSMLayerOptions = {
  url: CONFIG.OSM_LAYER.URL,
};
/* eslint-enable */
