import React, { useEffect } from 'react';
import { CesiumColor, CesiumRectangle, CesiumSceneMode, useCesiumMap } from '@map-colonies/react-components';
import { LayerMetadataMixedUnion, RecordType } from '../../models';

const IMMEDIATELY = 0;
const TRANSPARENT = 0.0;

interface FlyToProps {
  rect: CesiumRectangle;
  setRect: (rect: CesiumRectangle | undefined) => void;
  layer: LayerMetadataMixedUnion;
}

export const FlyTo: React.FC<FlyToProps> = ({ rect, setRect, layer}): JSX.Element => {
  const mapViewer = useCesiumMap();

  useEffect(() => {
    if (mapViewer.scene.mode !== CesiumSceneMode.SCENE3D && layer.type === RecordType.RECORD_3D) {
      mapViewer.scene.morphTo3D(IMMEDIATELY);
    }

    const rectangle = mapViewer.entities.add({
      rectangle: {
        coordinates: rect,
        material: CesiumColor.PURPLE.withAlpha(TRANSPARENT)
      },
    });
    
    void mapViewer.flyTo(
      rectangle,
    ).then(() => {
      mapViewer.entities.remove(rectangle);
    });

    setRect(undefined);
  }, []);

  return <></>;
};
