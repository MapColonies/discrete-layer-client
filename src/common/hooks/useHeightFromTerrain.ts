import { CesiumCartographic, cesiumSampleTerrainMostDetailed, useCesiumMap } from "@map-colonies/react-components";
import { useEffect, useState } from "react";
import { isEmpty } from 'lodash';


interface UseHeightFromTerrainProps {
    longitude: number;
    latitude: number;
    precision?: number;
  }

export const useHeightFromTerrain = ({ longitude, latitude, precision }: UseHeightFromTerrainProps): number | undefined => {
    const mapViewer = useCesiumMap();
    const [height, setHeight] = useState<number>();

    useEffect(() => {
      if(latitude && longitude) {
        void cesiumSampleTerrainMostDetailed(
            mapViewer.terrainProvider,
            [ CesiumCartographic.fromDegrees(longitude, latitude) ]
          ).then(
            (updatedPositions) => {
              if (!isEmpty(updatedPositions)) {
                setHeight(updatedPositions[0].height);
              }
            }
          );
      }
    }, [longitude, latitude])

    return typeof precision !== 'undefined' ? Number(height?.toFixed(precision)) : height;
}