import React from 'react';
import {
  CesiumWMTSLayer,
  CesiumWMSLayer,
  CesiumXYZLayer,
  CesiumOSMLayer,
} from '@map-colonies/react-components';
import { Geometry } from 'geojson';
import CONFIG from '../../common/config';
import { osmOptions, wmsOptions, wmtsOptions, xyzOptions } from '../../common/helpers/layer-options';
import { useStore } from '../models/rootStore';
import { MapContainer } from '../components/map-container';

const tileOtions = { opacity: 0.5 };

const DiscreteLayerView: React.FC = () => {
  const { discreteLayersStore } = useStore();

  const handlePolygonSelected = (geometry: Geometry): void => {
    discreteLayersStore.searchParams.setLocation(geometry);
    void discreteLayersStore.getLayersImages();
  };

  const handlePolygonReset = (): void => {
    // discreteLayersStore.searchParams.resetLocation.bind(discreteLayersStore.searchParams)();
    discreteLayersStore.searchParams.resetLocation();
    discreteLayersStore.clearLayersImages();
  }

  return (
    <MapContainer
      handlePolygonSelected={handlePolygonSelected}
      handlePolygonReset={handlePolygonReset}
      mapContent={
        /* eslint-disable */
        <>
          {CONFIG.ACTIVE_LAYER === 'OSM_LAYER' && (
            <CesiumOSMLayer options={osmOptions} />
          )}
          {CONFIG.ACTIVE_LAYER === 'WMTS_LAYER' && (
            <CesiumWMTSLayer options={wmtsOptions} />
          )}
          {CONFIG.ACTIVE_LAYER === 'WMS_LAYER' && (
            <CesiumWMSLayer options={wmsOptions} alpha={tileOtions.opacity} />
          )}

          {CONFIG.ACTIVE_LAYER === 'XYZ_LAYER' && (
            <CesiumXYZLayer options={xyzOptions} alpha={tileOtions.opacity}/>
          )}
        </>
        /* eslint-enable */
      }
    />
  );
};

export default DiscreteLayerView;
