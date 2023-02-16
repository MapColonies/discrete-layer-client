import {
  CesiumColor,
  CesiumDrawingsDataSource,
  CesiumRectangle,
  DrawType,
  useCesiumMap,
} from '@map-colonies/react-components';
import bbox from '@turf/bbox';
import { Feature } from 'geojson';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useStore } from '../../models';

const DRAWING_MATERIAL_OPACITY = 0.5;
const DRAWING_MATERIAL_COLOR = CesiumColor.CYAN.withAlpha(DRAWING_MATERIAL_OPACITY);

export interface IDrawingState {
  drawing: boolean;
  type: DrawType;
}

const ExportDrawingHandler: React.FC = observer(() => {
  const store = useStore();
  const cesiumViewer = useCesiumMap();
  const { drawing, type } = store.exportStore.drawingState as IDrawingState;

  useEffect(() => {
    return (): void => {
      store.exportStore.resetDrawingState();
    };
  }, []);

  useEffect(() => {
    if(store.exportStore.hasExportPreviewed) {
      const selectedFeaturesRect = CesiumRectangle.fromDegrees(...bbox(store.exportStore.geometrySelectionsCollection)) as CesiumRectangle;
      cesiumViewer.camera.flyTo({ destination: selectedFeaturesRect });
    }
  }, [store.exportStore.hasExportPreviewed]);

  return (
    <CesiumDrawingsDataSource
      drawings={[]}
      drawState={{
        drawing,
        type,
        handler: (draw): void => {
          store.exportStore.setTempRawSelection(draw.geojson as Feature);
          store.exportStore.resetDrawingState();
        },
      }}
      drawingMaterial={DRAWING_MATERIAL_COLOR}
    />
  );
});

export default ExportDrawingHandler;
