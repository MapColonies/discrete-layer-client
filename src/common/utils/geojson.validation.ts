import bolleanValid from '@turf/boolean-valid';
import kinks from '@turf/kinks';
import { Geometry, Position } from 'geojson';

export type severityLevel = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
export type geoJSONValidation = {valid: boolean, severity_level: severityLevel, reason: string};
export const EMPTY_JSON_STRING_VALUE = '{}';

const MAX_VERTECES = 100;

const hasTooManyVerteces = (geom: Geometry): boolean => {
  let totalVertices = 0;
  if (geom.type === 'Polygon' || geom.type === 'MultiPolygon') {
    const polygons = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;

    polygons.forEach(polygon => {
      (polygon as Position[][]).forEach(ring => {
        totalVertices += ring.length;
      });
    });

  }
  return totalVertices >= MAX_VERTECES ;
}

const hasSelfIntersections = (json: Geometry): boolean => {
  return kinks(json as any).features.length > 0;
}

const isValidGeometryType = (json: Geometry): boolean => {
    return json.type === 'Polygon' ||  json.type === 'MultiPolygon';
  }
    

export const validateGeoJSONString = (jsonValue: string):geoJSONValidation => {
  const res = {
    valid: jsonValue !== undefined && jsonValue !== EMPTY_JSON_STRING_VALUE && jsonValue !== '',
    severity_level: 'INFO',
    reason: ''
  } as geoJSONValidation;
  
  try{
    if(res.valid){
      const geoJson = JSON.parse(jsonValue);
      if(!bolleanValid(geoJson)){
        return {
          valid: false,
          severity_level: 'ERROR',
          reason: 'not-geo_json'
        }
      }
      if(!isValidGeometryType(geoJson)){
        return {
          valid: false,
          severity_level: 'ERROR',
          reason: 'geo_json-geometry-not-supported'
        }
      }
      if(hasTooManyVerteces(geoJson)) {
        return {
          valid: true,
          severity_level: 'WARN',
          reason: 'geo_json-too_many_verteces'
        }
      }
      if(hasSelfIntersections(geoJson)) {
        return {
          valid: true,
          severity_level: 'WARN',
          reason: 'geo_json-has_self_intersections'
        }
      }
    }
  }
  catch (e){
    return {
      valid: false,
      severity_level: 'ERROR',
      reason: 'not-json'
    }
  }
  return res;
};