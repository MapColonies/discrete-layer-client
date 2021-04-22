import { Feature, Geometry } from 'geojson';
import polygonToLine from '@turf/polygon-to-line';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import convex from '@turf/convex';
import { LayerMetadataMixedUnion } from './LayerMetadataMixedModelSelector';

export type ILayerImage = LayerMetadataMixedUnion

export const getLayerFootprint = (layer: ILayerImage, isBbox: boolean) : Feature => {
  if(isBbox){
    let geometry: Geometry = layer.geometry as Geometry;
    switch(geometry.type){
      case 'Polygon':
        geometry = (polygonToLine(geometry) as Feature).geometry;
        break;
      case 'MultiPolygon':
        //get bbox of feture, then convert it to polygon and finally get linestring of polygon
        geometry = (polygonToLine(bboxPolygon(bbox(geometry))) as Feature).geometry;
        break;
      default:
        break;
    }
    
    return {
      type: 'Feature',
      geometry: { 
        ...geometry,
      },
      properties: {
        id: layer.id,
        name: layer.sourceName,
        description: layer.dsc,
      }
    };
  }
  else {
    let geometry: Geometry = layer.geometry as Geometry;
    // @ts-ignore
    geometry = (polygonToLine(convex(geometry)) as Feature).geometry;
    return {
      type: 'Feature',
      geometry: { 
        ...geometry,
      },
      properties: {
        id: layer.id,
        name: layer.sourceName,
        description: layer.dsc,
      },
    };
  }
}
