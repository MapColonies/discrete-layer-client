import React, { useEffect } from 'react';
import {
  CesiumCesiumTerrainProvider,
  CesiumEllipsoidTerrainProvider,
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
          new CesiumCesiumTerrainProvider({
            url: getTokenResource(CONFIG.DEFAULT_TERRAIN_PROVIDER_URL),
          }) :
          new CesiumEllipsoidTerrainProvider({});
    } else {
      mapViewer.terrainProvider = new CesiumEllipsoidTerrainProvider({});
    }
  };

  useEffect(() => {
    mapViewer.scene.morphComplete.addEventListener(setTerrainProvider);
  }, []);

  return <></>;
};
