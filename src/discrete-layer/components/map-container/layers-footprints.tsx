import React, { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { CesiumGeojsonLayer, CesiumColor } from '@map-colonies/react-components';
import { FeatureCollection } from 'geojson';
import { ConstantProperty } from 'cesium';
import { usePrevious } from '../../../common/hooks/previous.hook';
import { useStore } from '../../models/rootStore';
import { getLayerFootprint } from '../../models/layerImage';

const FOOTPRINT_BORDER_COLOR = CesiumColor.RED;
const FOOTPRINT_BORDER_WIDTH = 6.0;

export const LayersFootprints: React.FC = observer(() => {
  const { discreteLayersStore } = useStore();
  const [layersFootprints, setlayersFootprints] = useState<FeatureCollection>();

  const prevLayersFootprints = usePrevious<FeatureCollection | undefined>(layersFootprints);
  const cacheRef = useRef({} as FeatureCollection | undefined);

  useEffect(() => {
    if (discreteLayersStore.layersImages) {
      const footprintsCollection: FeatureCollection = {
        type: 'FeatureCollection',
        features: []
      }
      const footprintsFeaturesArray = discreteLayersStore.layersImages.map((layer) => {
        return getLayerFootprint(layer, false);
      });
      footprintsCollection.features.push(...footprintsFeaturesArray);
      setlayersFootprints(footprintsCollection);
    }
  }, [discreteLayersStore.layersImages]);

  const getFootprints = (): FeatureCollection | undefined => {
    let cache = cacheRef.current;
    if (prevLayersFootprints?.features.length === layersFootprints?.features.length) {
      return cache;
    } else {
      cache = layersFootprints;
      return cache;
    }
  }

  return (
    <CesiumGeojsonLayer
      data={getFootprints()}
      onLoad={(geoJsonDataSouce): void => {
        
        geoJsonDataSouce.entities.values.forEach(item => {
          if(item.polyline) {
            (item.polyline.width as ConstantProperty).setValue(FOOTPRINT_BORDER_WIDTH);
            // typings issue in CESIUM for refference https://github.com/CesiumGS/cesium/issues/8898
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            item.polyline.material = FOOTPRINT_BORDER_COLOR;
          }
          if(item.polygon){
            (item.polygon.outlineColor as ConstantProperty).setValue(FOOTPRINT_BORDER_COLOR);
            // typings issue in CESIUM for refference https://github.com/CesiumGS/cesium/issues/8898
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            item.polygon.material = CesiumColor.fromRandom({alpha: 0.4});
          }
        });
      }}
      // onError={action('onError')}
    />
  );
});
