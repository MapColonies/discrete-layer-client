import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { CesiumGeojsonLayer, CesiumColor } from '@map-colonies/react-components';
import { Feature, FeatureCollection, Geometry, Polygon } from 'geojson';
import { ConstantProperty } from 'cesium';
import polygonToLine from '@turf/polygon-to-line';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import { useStore } from '../../models/rootStore';

const FOOTPRINT_BORDER_COLOR = CesiumColor.RED;
const FOOTPRINT_BORDER_WIDTH = 6.0;

export const LayersFootprints: React.FC = observer(() => {
  const { discreteLayersStore } = useStore();
  const [layersFootprints, setlayersFootprints] = useState<FeatureCollection>();

  // REMARK: Layers footprint boundingboxes  
  useEffect(() => {
    if (discreteLayersStore.layersImages) {
      const footprintsCollection: FeatureCollection = {
        type: 'FeatureCollection',
        features: []
      }
      const footprintsFeaturesArray = discreteLayersStore.layersImages.map((layer) => {
        let geometry: Geometry = layer.geojson as Geometry;
        switch(layer.geojson?.type){
          case 'Polygon':
            geometry = (polygonToLine(geometry as Polygon) as Feature).geometry;
            break;
          case 'MultiPolygon':
            //get bbox of feture, then convert it to polygon and finally get linestring of polygon
            geometry = (polygonToLine(bboxPolygon(bbox(geometry))) as Feature).geometry;
            break;
          default:
            break;
        }
        
        const footprint: Feature = {
          type: 'Feature',
          geometry: { 
            ...geometry,
          },
          properties: {
            name: layer.name,
            description: layer.description,
          },
        }
        return footprint;
      });
      footprintsCollection.features.push(...footprintsFeaturesArray);
      setlayersFootprints(footprintsCollection);
    }
  }, [discreteLayersStore.layersImages]);

  // REMARK: Layers feature footprint as is
  // useEffect(() => {
  //   if (discreteLayersStore.layersImages) {
  //     const footprintsCollection: FeatureCollection = {
  //       type: 'FeatureCollection',
  //       features: []
  //     }
  //     const footprintsFeaturesArray = discreteLayersStore.layersImages.map((layer) => {
  //       const footprint: Feature = {
  //         type: 'Feature',
  //         geometry: { 
  //           ...(layer.geojson as Geometry),
  //         },
  //         properties: {
  //           name: layer.name,
  //           description: layer.description,
  //         },
  //       }
  //       return footprint;
  //     });
  //     footprintsCollection.features.push(...footprintsFeaturesArray);
  //     setlayersFootprints(footprintsCollection);
  //   }
  // }, [discreteLayersStore.layersImages]);

  return (
    <CesiumGeojsonLayer
      data={layersFootprints}
      onLoad={(geoJsonDataSouce): void => {
        
        // REMARK: Unified boundingboxes of footprints
        geoJsonDataSouce.entities.values.forEach(item => {
          if(item.polyline) {
            (item.polyline.width as ConstantProperty).setValue(FOOTPRINT_BORDER_WIDTH);
            // typings issue in CESIUM for refference https://github.com/CesiumGS/cesium/issues/8898
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            item.polyline.material = FOOTPRINT_BORDER_COLOR;
          }
        });

        // REMARK: footprints as is
        // geoJsonDataSouce.entities.values.forEach(item => {
        //   if(item.polygon){
        //     // @ts-ignore
        //     item.polygon.outlineColor = FOOTPRINT_BORDER_COLOR;
        //     // @ts-ignore
        //     item.polygon.material = CesiumColor.fromRandom({alpha: 0.4});
        //   }
        // });


        // // @ts-ignore
        // geoJsonDataSouce.entities.values[1].polygon.material = CesiumColor.TRANSPARENT; //CesiumColor.RED.withAlpha(0.4);
        // // @ts-ignore
        // geoJsonDataSouce.entities.values[1].polygon.outlineColor = FOOTPRINT_BORDER_COLOR;
        // // @ts-ignore
        // geoJsonDataSouce.entities.values[1].polygon.outlineWidth = 6.0;
      }}
      // onError={action('onError')}
    />
  );
});
