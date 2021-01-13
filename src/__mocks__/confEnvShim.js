if (!window._env_) {
  window._env_ = (function (undefined) {
    return {
      MAP_SERVER: 'MAP_SERVER',
      PUBLISH_POINT: 'PUBLISH_POINT',
      CHANNEL: 1002,
      VERSION: 1,
      REQUEST: 'REQUEST',
      SERVICE_PROTOCOL: 'SERVICE_PROTOCOL',
      SERVICE_NAME: 'SERVICE_NAME',
      ACTIVE_LAYER: 'ACTIVE_LAYER',
      LOCALE: {
        DATE_TIME_FORMAT: 'DD/MM/YYYY HH:mm',
      },
      ACTIVE_LAYER_PROPERTIES: {
        urlPattern:
          'arcgis/rest/services/Demographics/USA_Population_Density/MapServer/WMTS',
        urlPatternParams: {
          service: 'WMTS',
          layers: 'USGSShadedReliefOnly',
          tiled: 'true',
          matrixSet: 'default028mm',
          style: 'default',
          projection: 'EPSG:3857',
          format: 'image/png',
        },
      },
      MAP: {
        center: [34.811, 31.908],
        zoom: 14,
      },
      LOGGER: {
        level: 'warn',
        log2console: false,
        log2httpServer: {
          host: '',
          port: '',
          path: '',
        },
      },
    };
  })(void 0);
}
