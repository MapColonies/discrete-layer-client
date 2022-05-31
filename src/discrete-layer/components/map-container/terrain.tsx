import React, { useEffect } from 'react';
import { CesiumTerrainProvider, EllipsoidTerrainProvider } from 'cesium';
import {
  CesiumSceneMode,
  useCesiumMap
} from '@map-colonies/react-components';
import CONFIG from '../../../common/config';
import { getTokenResource } from '../helpers/layersUtils';

interface TerrainProps {
}

export const Terrain: React.FC<TerrainProps> = () => {
  const mapViewer = useCesiumMap();

  // eslint-disable-next-line
  const setTerrainProvider = () => {
    if (mapViewer.scene.mode === CesiumSceneMode.SCENE3D || mapViewer.scene.mode === CesiumSceneMode.COLUMBUS_VIEW) {
      mapViewer.terrainProvider =
        // eslint-disable-next-line
        CONFIG.DEFAULT_TERRAIN_PROVIDER_URL ?
          new CesiumTerrainProvider({
            url: getTokenResource(CONFIG.DEFAULT_TERRAIN_PROVIDER_URL),
          }) :
          new EllipsoidTerrainProvider({});
    } else {
      mapViewer.terrainProvider = new EllipsoidTerrainProvider({});
    }
  };

  useEffect(() => {
    mapViewer.scene.morphComplete.addEventListener(setTerrainProvider);
  
  }, []);

  return <></>;
};
