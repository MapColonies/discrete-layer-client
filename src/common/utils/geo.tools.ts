import bbox from "@turf/bbox";
import bboxPolygon from "@turf/bbox-polygon";
import booleanContains from "@turf/boolean-contains";
import { Properties } from "@turf/helpers";
import mask from "@turf/mask";
import polygonToLine from "@turf/polygon-to-line";
import simplify from "@turf/simplify";
import { Feature, MultiPolygon, Polygon, Position, Geometry } from "geojson";

export const ZERO_MERIDIAN = 0;
export const ANTI_MERIDIAN = 180;
const checkPolygon = (coordinates: Position[][], meridian: number) => {
    for (const ring of coordinates) {
        for (let i = 0; i < ring.length - 1; i++) {
            const start = ring[i];
            const end = ring[i + 1];

            // Check if one point is on one side of the meridian and the other point is on the other side
            if ((start[0] < meridian && end[0] > meridian) || (start[0] > meridian && end[0] < meridian)) {
                return true;
            }
        }
    }
    return false;
}

export const crossesMeridian = (geometry: Polygon | MultiPolygon, meridian: number) => {
    const type = geometry.type;

    if (type === 'Polygon') {
        return checkPolygon(geometry.coordinates, meridian);
    } else if (type === 'MultiPolygon') {
        for (const polygon of geometry.coordinates) {
            if (checkPolygon(polygon, meridian)) {
                return true;
            }
        }
    }
    return false;
}

/*
****** Current solution is using TURF MASK

There is 2 alternatives to get perimeter(outlined feature)
1. Use TURF DISSOLVE and COMBINE (inspired by https://codesandbox.io/p/sandbox/beautiful-morning-iy8xj)
        turf.combine(turf.dissolve(collection));

2. Use TURF UNIN and CONVEX
        const unitedPolygon: Feature = features.reduce((acc, curr) => {
            const currUnion = union(acc,curr);
            return currUnion;
        }, features[0]);
        const convexHullFromUnion: Feature = convex(unitedPolygon.geometry);
*/
const SIMPLIFY_TOLERANCE =  0.0001; // maximum allowed deviation(degrees) of simplified points from the original geometry
// 0.0001 works good for geometries from ~200m(linear dimensions) 
// but for a large geometries number of vertices might be relatively big and not so relevant for UI 
export const getOutlinedFeature = (features: Feature<Polygon | MultiPolygon, Properties>[]) => {
    const masked = mask({
        type: 'FeatureCollection',
        features
    });
    // Remove whole world geometry
    masked.geometry.coordinates = masked.geometry.coordinates.slice(1);
    
    return simplify(
        polygonToLine(masked), 
        {tolerance: SIMPLIFY_TOLERANCE, highQuality: false}
    );
}

export const isPolygonContainsPolygon = (polygon: Feature, polygonToCheck: Feature): boolean => {
    const polygonBBox = bbox(polygon);
    const polygonBBoxPolygon = bboxPolygon(polygonBBox);

    const polygonToCheckBBox = bbox(polygonToCheck);
    const polygonToCheckBBoxPolygon = bboxPolygon(polygonToCheckBBox);
    return booleanContains(polygonBBoxPolygon, polygonToCheckBBoxPolygon);
};

export const getFirstPoint = (geojson: Geometry): Position => {
    // @ts-ignore
    const { type, coordinates } = geojson;
  
    switch (type) {
      case "Point":
        return coordinates;
  
      case "LineString":
      case "MultiPoint":
        return coordinates[0];
  
      case "Polygon":
      case "MultiLineString":
        return coordinates[0][0];
  
      case "MultiPolygon":
        return coordinates[0][0][0];
  
      default:
        throw new Error("Unsupported GeoJSON geometry type");
    }
  }