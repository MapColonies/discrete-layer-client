import React, { useEffect } from 'react';
import { Rectangle } from 'cesium';
import { useCesiumMap } from '@map-colonies/react-components';

interface FlyToProps {
  rect: Rectangle;
  setRect: (rect: Rectangle | undefined) => void;
}

export const FlyTo: React.FC<FlyToProps> = ({ rect, setRect}): JSX.Element => {
  const mapViewer = useCesiumMap();

  useEffect(() => {
    mapViewer.camera.flyTo({ destination: rect });
    setRect(undefined);
  }, []);

  return <></>;
};
