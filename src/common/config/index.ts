import { CesiumGeographicTilingScheme, Proj } from '@map-colonies/react-components';
import { IRasterLayer } from '@map-colonies/react-components/dist/cesium-map/layers-manager';
import { IBaseMaps, IBaseMap } from '@map-colonies/react-components/dist/cesium-map/settings/settings';

/*eslint-disable */
const LANGUAGE = (window as any)._env_.LANGUAGE as string;
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
const JOB_STATUS = (window as any)._env_.JOB_STATUS;
const DEFAULT_USER = (window as any)._env_.DEFAULT_USER;
const SERVED_ENTITY_TYPES = (window as any)._env_.SERVED_ENTITY_TYPES;
const BASE_MAPS = JSON.parse((window as any)._env_.BASE_MAPS);
const RUNNING_MODE = (window as any)._env_.RUNNING_MODE;
const NUMBER_OF_CHARACTERS_LIMIT = (window as any)._env_.NUMBER_OF_CHARACTERS_LIMIT;

const enreachBaseMaps = (baseMaps: IBaseMaps): IBaseMaps => {
  return {
    maps: baseMaps.maps.map((baseMap: IBaseMap) => {
      return {
        ...baseMap,
        baseRasteLayers: (baseMap.baseRasteLayers as IRasterLayer[]).map((rasterLayer)=>{
          return {
            ...rasterLayer,
            options: {
              ...rasterLayer.options,
              tilingScheme: (rasterLayer.type === 'WMTS_LAYER') ? new CesiumGeographicTilingScheme() : undefined
            }
          };
        })
      }
    })
  }
}


const systemJobsPriorityOptions =
  // Priority is an integer, normal / default value is 1000.
  // It can be lower.
  [
    {
      label: 'system-status.job-priority-highest',
      value: '2000',
      icon: 'Arrows-Right',
      iconColor: 'red',
    },
    {
      label: 'system-status.job-priority-high',
      value: '1500',
      icon: 'Arrow-Right',
      iconColor: 'green',
    },
    {
      label: 'system-status.job-priority-normal',
      value: '1000',
      icon: 'Move-Row',
      iconColor: 'blue',
    },
    {
      label: 'system-status.job-priority-low',
      value: '500',
      icon: 'Arrow-Left',
      iconColor: 'pink',
    },
    {
      label: 'system-status.job-priority-lowest',
      value: '0',
      icon: 'Arrows-Left',
      iconColor: 'orange',
    },
  ];




const DATE_FORMAT = 'DD/MM/YYYY';
const APP_CONFIG = {
  SERVICE_PROTOCOL: SERVICE_PROTOCOL,
  SERVICE_NAME: SERVICE_NAME,
  LOCALE: {
    DATE_FORMAT: DATE_FORMAT,
    DATE_TIME_FORMAT: `${DATE_FORMAT} HH:mm`,
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
  JOB_STATUS: {
    POLLING_CYCLE_INTERVAL: JOB_STATUS.pollingCycleInterval as number
  },
  DEFAULT_USER: {
    ROLE: DEFAULT_USER.role
  },
  SERVED_ENTITY_TYPES : (SERVED_ENTITY_TYPES as string).split(','),
  BASE_MAPS: enreachBaseMaps(BASE_MAPS),
  RUNNING_MODE: {
    TYPE: RUNNING_MODE.type,
    AUTOCOMPLETE: RUNNING_MODE.autocomplete,
    START_RECORD: 1,
    END_RECORD: 1000
  },
  NUMBER_OF_CHARACTERS_LIMIT: NUMBER_OF_CHARACTERS_LIMIT as number,
  SYSTEM_JOBS_PRIORITY_OPTIONS: systemJobsPriorityOptions,
};

export default APP_CONFIG;
