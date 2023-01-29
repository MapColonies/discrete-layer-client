import { CesiumColor, CesiumDrawingsDataSource, DrawType } from '@map-colonies/react-components';
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
  const {drawing, type} = store.exportStore.drawingState as IDrawingState;

  useEffect(() => {
    return (): void => {
      store.exportStore.resetDrawingState();
    }
  }, [])

  return <CesiumDrawingsDataSource 
  drawings={[]}
  drawState={{
    drawing,
    type,
    handler: (draw) => {
        console.log("ADDED SELECTION", draw);
        store.exportStore.addFeatureSelection(draw.geojson as Feature);
        store.exportStore.resetDrawingState();
    },

  }}
  drawingMaterial={DRAWING_MATERIAL_COLOR}
  />;
});

export default ExportDrawingHandler;
