import React, { useEffect } from 'react';
import { CesiumRectangle, useCesiumMap } from '@map-colonies/react-components';

interface FlyToProps {
  rect: CesiumRectangle;
  setRect: (rect: CesiumRectangle | undefined) => void;
}

export const FlyTo: React.FC<FlyToProps> = ({ rect, setRect}): JSX.Element => {
  const mapViewer = useCesiumMap();

  useEffect(() => {
    mapViewer.camera.flyTo({ destination: rect });
    setRect(undefined);
  }, []);

  return <></>;
};
