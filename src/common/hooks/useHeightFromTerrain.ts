import { CesiumCartesian2, CesiumCartographic, cesiumSampleTerrainMostDetailed, useCesiumMap } from "@map-colonies/react-components";
import { useEffect, useState } from "react";
import { isEmpty } from 'lodash';


export interface IPosition {
  latitude: number,
  longitude: number
}
interface UseHeightFromTerrainProps {
    position: IPosition[];
}

interface IHeightFromTerrain {
  newPositions?: CesiumCartographic[];
  setCoordinates: (pos: IPosition[]) => void; 
}

export const useHeightFromTerrain = (options?: UseHeightFromTerrainProps): IHeightFromTerrain => {
    const mapViewer = useCesiumMap();
    const [newPositions, setNewPositions] = useState<CesiumCartographic[]>();
    const [coordinates, setCoordinates] = useState<IPosition[]>();

    useEffect(() => {
      if(options) {
        setCoordinates(options.position);
      }
    }, [])


    useEffect(() => {
      if(coordinates) {
        const cartographicArr = coordinates.map(coord => CesiumCartographic.fromDegrees(coord.longitude, coord.latitude));

        void cesiumSampleTerrainMostDetailed(
            mapViewer.terrainProvider,
            cartographicArr
          ).then(
            (updatedPositions) => {
              if (!isEmpty(updatedPositions)) {
                setNewPositions([...updatedPositions] as CesiumCartographic[]);
              }
            }
          );
      }
    }, [coordinates])

    return { newPositions, setCoordinates }
}