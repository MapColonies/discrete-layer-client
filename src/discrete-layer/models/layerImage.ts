import { Feature, Geometry, Polygon } from 'geojson';
import { types, Instance } from 'mobx-state-tree';
import polygonToLine from '@turf/polygon-to-line';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';

export const layerImage = types.model({
  id: types.string,
  name: types.string,
  description: types.string,
  geojson: types.maybe(types.frozen<Geometry>()),
  referenceSystem: types.string,
  imagingTimeStart: types.Date,
  imagingTimeEnd: types.Date,
  creationDate: types.Date,
  type: types.string,
  source: types.string,
  category: types.string,
  thumbnail: types.string,
  properties: types.maybe(types.frozen<{
    protocol: 'WMTS_LAYER' | 'WMS_LAYER' | 'XYZ_LAYER' | 'OSM_LAYER',
    url: string,
    meta?: string,
  }>()),
  selected: types.maybe(types.boolean),
});

export interface ILayerImage extends Instance<typeof layerImage> {}

export const getLayerFootprint = (layer: ILayerImage, isBbox: boolean) : Feature => {
  if(isBbox){
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
    
    return {
      type: 'Feature',
      geometry: { 
        ...geometry,
      },
      properties: {
        id: layer.id,
        name: layer.name,
        description: layer.description,
      }
    };
  }
  else {
    return {
      type: 'Feature',
      geometry: { 
        ...(layer.geojson as Geometry),
      },
      properties: {
        id: layer.id,
        name: layer.name,
        description: layer.description,
      },
    };
  }
}
