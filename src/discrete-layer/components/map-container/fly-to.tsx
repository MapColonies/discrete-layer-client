import React, { useEffect } from 'react';
import { CesiumRectangle, useCesiumMap } from '@map-colonies/react-components';

interface FlyToProps {
  rect: CesiumRectangle;
  setRect: (rect: CesiumRectangle | undefined) => void;
  is3D: boolean;
}

export const FlyTo: React.FC<FlyToProps> = ({ rect, setRect, is3D}): JSX.Element => {
  const mapViewer = useCesiumMap();

  useEffect(() => {
    mapViewer.camera.flyTo({ destination: rect });
    setRect(undefined);
    if (is3D) {
      mapViewer.scene.morphTo3D(0);
    }
  }, []);

  return <></>;
};
