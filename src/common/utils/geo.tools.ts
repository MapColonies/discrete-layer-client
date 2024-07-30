import { Properties } from "@turf/helpers";
import mask from "@turf/mask";
import polygonToLine from "@turf/polygon-to-line";
import simplify from "@turf/simplify";
import { Feature, MultiPolygon, Polygon, Position } from "geojson";

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

export const getOutlinedFeature = (features: Feature<Polygon | MultiPolygon, Properties>[]) => {
    const masked = mask({
        type: 'FeatureCollection',
        features
    });
    // Remove whole world geometry
    masked.geometry.coordinates = masked.geometry.coordinates.slice(1);
    
    return simplify(
        polygonToLine(masked), 
        {tolerance: 0.01, highQuality: false}
    );
}