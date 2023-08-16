import { CesiumMath, CesiumGeojsonLayer, CesiumConstantProperty, CesiumColor } from "@map-colonies/react-components";
import { polygonToLine } from "@turf/polygon-to-line";
import { Feature, LineString, Polygon } from "geojson";
import { useState, useEffect } from "react";
import { useHeightFromTerrain, IPosition } from "../../../common/hooks/useHeightFromTerrain";
import { IFeatureConfig } from "../../views/components/data-fetchers/wfs-features-fetcher.component";

interface FeatureConfig extends IFeatureConfig {}

export const GeojsonFeature: React.FC<{feature: Feature<LineString | Polygon>, featureConfig?: FeatureConfig ,isPolylined?: boolean}> =
 ({ feature, featureConfig, isPolylined = false }) => {
    const [featureWithHeight, setFeatureWithHeight] = useState<Feature<LineString | Polygon>>();
    const [transformedFeature, setTransformedFeature] = useState<Feature<LineString | Polygon>>();
    const { setCoordinates, newPositions } = useHeightFromTerrain();
    
    useEffect(() => {
      if (isPolylined && feature.geometry.type === 'Polygon') {
        /* Polyline features fixes cesium bug with polygon visualization, Also allows us to clamp it to ground (Using terrain). */
        setTransformedFeature(polygonToLine(feature.geometry) as Feature<LineString>);
      } else {
        setTransformedFeature(feature);
      }
    }, [feature])

    useEffect(() => {
      if(transformedFeature) {
        switch(transformedFeature.geometry.type) {
          case "LineString": {
            const posArr: IPosition[] = transformedFeature.geometry.coordinates.map(coord => ({ longitude: coord[0], latitude: coord[1] }));
            setCoordinates(posArr);
            break;
          }
  
          case "Polygon":{
            // NOTICE THE coordinates[0].
            const posArr: IPosition[] = transformedFeature.geometry.coordinates[0].map(coord => ({ longitude: coord[0], latitude: coord[1] }));
            setCoordinates(posArr);
            break;
          }
  
          default:
            break;
        }
      }
    }, [transformedFeature])

    useEffect(() => {
      if(newPositions && transformedFeature) {
        const newCoordinates = newPositions.map(cartographic => {
          return [CesiumMath.toDegrees(cartographic.longitude), CesiumMath.toDegrees(cartographic.latitude), cartographic.height]
        });

        setFeatureWithHeight({
          ...transformedFeature,
          // @ts-ignore
          geometry: {
            ...transformedFeature.geometry,
            coordinates: transformedFeature.geometry.type === 'LineString' ? newCoordinates : [newCoordinates]
          }
        })
      }
    }, [newPositions, transformedFeature])

    if(!featureWithHeight) return null;

    console.log("featureWithHeight.geometry", featureWithHeight.geometry)
    return <CesiumGeojsonLayer
              clampToGround={true}
              key={featureWithHeight.id}
              data={featureWithHeight.geometry}
              onLoad={(geoJsonDataSource): void => {
                const featureFillColor = featureConfig?.color;
                const featureOutlineColor = featureConfig?.outlineColor;
                const lineWidth = featureConfig?.outlineWidth;
                const outlineWidth = featureConfig?.outlineWidth;

                geoJsonDataSource.entities.values.forEach((item) => {
                  if (item.polyline) {
                    // @ts-ignore
                    item.polyline.material = CesiumColor.fromCssColorString(featureFillColor);
                    (item.polyline.width as CesiumConstantProperty).setValue(lineWidth);
                    (item.polyline.clampToGround as CesiumConstantProperty).setValue(true);
                  }
                  
                  if (item.polygon) {  
                    // @ts-ignore
                    (item.polygon.outlineColor as CesiumConstantProperty).setValue(CesiumColor.fromCssColorString(featureOutlineColor));
                    (item.polygon.outlineWidth as CesiumConstantProperty).setValue(outlineWidth); 
                    

                    // @ts-ignore
                    item.polygon.material = CesiumColor.fromCssColorString(featureFillColor);
                  }
                });
              }}                    
            />
  }
