import { Proj } from '@map-colonies/react-components';

/*eslint-disable */
const LANGUAGE = (window as any)._env_.LANGUAGE;
const MAP_SERVER = (window as any)._env_.MAP_SERVER;
const PUBLISH_POINT = (window as any)._env_.PUBLISH_POINT;
const CHANNEL = (window as any)._env_.CHANNEL;
const VERSION = (window as any)._env_.VERSION;
const REQUEST = (window as any)._env_.REQUEST;
const SERVICE_PROTOCOL = (window as any)._env_.SERVICE_PROTOCOL;
const SERVICE_NAME = (window as any)._env_.SERVICE_NAME;
const ACTIVE_LAYER = (window as any)._env_.ACTIVE_LAYER;
const ACTIVE_LAYER_PROPERTIES = (window as any)._env_.ACTIVE_LAYER_PROPERTIES;
const MAP = (window as any)._env_.MAP;

const EXPORTER_CONFIG = {
  SERVICE_PROTOCOL: SERVICE_PROTOCOL,
  SERVICE_NAME: SERVICE_NAME,
  LOCALE: {
    DATE_TIME_FORMAT: 'DD/MM/YYYY HH:mm',
  },
  I18N: {
    DEFAULT_LANGUAGE: LANGUAGE,
  },
  BOUNDARIES: {
    MAX_X_KM: 100,
    MAX_Y_KM: 100,
  },
  EXPORT: {
    AVG_TILE_SIZE_MB: 0.02,
    MIN_ZOOM: 1,
    MAX_ZOOM: 21,
  },
  MAP: {
    CENTER: MAP.center as [number, number],
    ZOOM: MAP.zoom as number,
    PROJECTION: Proj.WGS84,
  },
  ACTIVE_LAYER: ACTIVE_LAYER, // | 'WMTS_LAYER' | 'WMS_LAYER' | 'XYZ_LAYER' | 'OSM_LAYER'
  ACTIVE_LAYER_PROPERTIES: ACTIVE_LAYER_PROPERTIES,
  WMTS_LAYER: {
    ATTRIBUTIONS:
      'Tiles © <a href="http://basemap.nationalmap.gov">basemap</a>',
    URL: `${MAP_SERVER}/${ACTIVE_LAYER_PROPERTIES.urlPattern}`,
    LAYER: `${PUBLISH_POINT}`,
    STYLE: `${ACTIVE_LAYER_PROPERTIES.urlPatternParams.style}`,
    PROJECTION: `${ACTIVE_LAYER_PROPERTIES.urlPatternParams.projection}`,
    FORMAT: `${ACTIVE_LAYER_PROPERTIES.urlPatternParams.format}`,
    MATRIX_SET: `${ACTIVE_LAYER_PROPERTIES.urlPatternParams.matrixSet}`,
    MAXIMUM_LEVEL: 19,
  },
  WMS_LAYER: {
    ATTRIBUTIONS: `Tiles © <a href="${MAP_SERVER}">GEE</a>`,
    URL: `${ACTIVE_LAYER_PROPERTIES.urlPattern}`,
    PARAMS: { ...ACTIVE_LAYER_PROPERTIES.urlPatternParams },
    SERVERTYPE: 'geoserver',
    TRANSITION: 0.5,
  },
  XYZ_LAYER: {
    ATTRIBUTIONS: `Tiles © <a href="${MAP_SERVER}">GEE</a>`,
    URL: `${MAP_SERVER}/${PUBLISH_POINT}/query?request=${REQUEST}&channel=${CHANNEL}&version=${VERSION}&x={x}&y={y}&z={z}`,
  },
  OSM_LAYER: {
    URL: `https://a.tile.openstreetmap.org/`,
  },
};

export default EXPORTER_CONFIG;
