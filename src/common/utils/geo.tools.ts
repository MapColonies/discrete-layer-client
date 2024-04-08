import { Properties } from "@turf/helpers";
import mask from "@turf/mask";
import polygonToLine from "@turf/polygon-to-line";
import simplify from "@turf/simplify";
import { Feature, MultiPolygon, Polygon } from "geojson";

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