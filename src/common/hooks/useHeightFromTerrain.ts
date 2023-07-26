import { CesiumCartographic, cesiumSampleTerrainMostDetailed, useCesiumMap } from "@map-colonies/react-components";
import { useEffect, useRef, useState } from "react";
import _, { isEmpty } from 'lodash';


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
  isLoadingData: boolean;
}
const isArrayEqual = (x: Array<unknown>, y: Array<unknown>) => {
  return _(x).differenceWith(y, _.isEqual).isEmpty();
};

export const useHeightFromTerrain = (options?: UseHeightFromTerrainProps): IHeightFromTerrain => {
    const mapViewer = useCesiumMap();
    const [newPositions, setNewPositions] = useState<CesiumCartographic[]>();
    const [coordinates, setCoordinates] = useState<IPosition[]>();
    const [isLoadingData, setIsLoadingData] = useState(true);
    const prevPositions = useRef<IPosition[]>();


    useEffect(() => {
      if(options && (!prevPositions.current || !isArrayEqual(prevPositions.current, options.position))) {
        prevPositions.current = options.position;
        setCoordinates(options.position);
      }
    }, [options?.position])


    useEffect(() => {
      if(coordinates) {
        const cartographicArr = coordinates.map(coord => CesiumCartographic.fromDegrees(coord.longitude, coord.latitude));
        setIsLoadingData(true);

        void cesiumSampleTerrainMostDetailed(
            mapViewer.terrainProvider,
            cartographicArr
          ).then(
            (updatedPositions) => {
              if (!isEmpty(updatedPositions)) {
                setNewPositions([...updatedPositions] as CesiumCartographic[]);
              }
            },
            () => {
              setNewPositions(cartographicArr);
            }
          ).finally(() => {
            setIsLoadingData(false);
          });
      }
    }, [coordinates])

    return { newPositions, setCoordinates, isLoadingData };
}