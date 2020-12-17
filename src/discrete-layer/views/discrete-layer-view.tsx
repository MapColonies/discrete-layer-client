import React, { useEffect } from 'react';
import {
  CesiumWMTSLayer,
  CesiumWMSLayer,
  CesiumXYZLayer,
  CesiumOSMLayer,
} from '@map-colonies/react-components';
import { observer } from 'mobx-react-lite';
import CONFIG from '../../common/config';
import { MOCK_DATA_IMAGERY_LAYERS_ISRAEL } from '../../__mocks-data__/search-results.mock';
import { osmOptions, wmsOptions, wmtsOptions, xyzOptions } from '../../common/helpers/layer-options';
import { useStore } from '../models/rootStore';
import { MapContainer } from '../components/map-container';

const tileOtions = { opacity: 0.5 };

const DiscreteLayerView: React.FC = observer(() => {
  const { discreteLayersStore } = useStore();

  // TODO REMOVE: EXAMLPE HOW TO TRIGGER SNACK  
  useEffect(()=>{
    setTimeout(()=>{
      discreteLayersStore.getLayersImages();
    }, 7000); 
  },[]);

  return (
    <MapContainer
      handlePolygonSelected={discreteLayersStore.searchParams.setLocation}
      handlePolygonReset={discreteLayersStore.searchParams.resetLocation.bind(
        discreteLayersStore.searchParams
      )}
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
          {
            MOCK_DATA_IMAGERY_LAYERS_ISRAEL.map((layer)=>{
              return <CesiumXYZLayer key={layer.id} options={{url: layer.properties.url}}/>
            })
          }
        </>
        /* eslint-enable */
      }
    />
  );
});

export default DiscreteLayerView;
