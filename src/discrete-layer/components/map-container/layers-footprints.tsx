import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { CesiumGeojsonLayer } from '@map-colonies/react-components';
import { Feature, FeatureCollection, Geometry, Polygon } from 'geojson';
import polygonToLine from '@turf/polygon-to-line';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
// TODO WRAP in components
import { Color } from 'cesium';
import { useStore } from '../../models/rootStore';

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
      const footPrintsFeaturesArray = discreteLayersStore.layersImages.map((layer) => {
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
        
        const footPrint: Feature = {
          type: 'Feature',
          geometry: { 
            ...geometry,
          },
          properties: {
            name: layer.name,
            description: layer.description,
          },
        }
        return footPrint;
      });
      footprintsCollection.features.push(...footPrintsFeaturesArray);
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
  //     const footPrintsFeaturesArray = discreteLayersStore.layersImages.map((layer) => {
  //       const footPrint: Feature = {
  //         type: 'Feature',
  //         geometry: { 
  //           ...(layer.geojson as Geometry),
  //         },
  //         properties: {
  //           name: layer.name,
  //           description: layer.description,
  //         },
  //       }
  //       return footPrint;
  //     });
  //     footprintsCollection.features.push(...footPrintsFeaturesArray);
  //     setlayersFootprints(footprintsCollection);
  //   }
  // }, [discreteLayersStore.layersImages]);

  return (
    <CesiumGeojsonLayer
      data={layersFootprints}
      // markerColor={Color.RED}
      onLoad={(g): void => {
        
        // REMARK: Unified boundingboxes of footprints
        g.entities.values.forEach(item => {
          // @ts-ignore
          item.polyline.width = 6.0;
          // @ts-ignore
          item.polyline.material = Color.RED;
        });

        // REMARK: footprints as is
        // g.entities.values.forEach(item => {
        //   if(item.polygon){
        //     // @ts-ignore
        //     item.polygon.outlineColor = Color.RED;
        //     // @ts-ignore
        //     item.polygon.material = Color.fromRandom({alpha: 0.4});
        //   }
        // });


        // // @ts-ignore
        // g.entities.values[1].polygon.material = Color.TRANSPARENT; //Color.RED.withAlpha(0.4);
        // // @ts-ignore
        // g.entities.values[1].polygon.outlineColor = Color.RED;
        // // @ts-ignore
        // g.entities.values[1].polygon.outlineWidth = 6.0;
      }}
      // onError={action('onError')}
    />
  );
});
