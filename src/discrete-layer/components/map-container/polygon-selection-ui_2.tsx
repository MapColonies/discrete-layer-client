import React from 'react';
import { IconButton } from '@map-colonies/react-core';
import { Box, DrawType, IDrawingEvent } from '@map-colonies/react-components';
import { DialogBBox } from './dialog-bbox';
import './polygon-selection-ui.css';

const WIDTH_SPACING_FACTOR = 18;

export interface PolygonSelectionUiProps {
  isSelectionEnabled: boolean;
  onStartDraw: (type: DrawType) => void;
  onCancelDraw: () => void;
  onReset: () => void;
  onPolygonUpdate: (polygon: IDrawingEvent) => void;
}

export const PolygonSelectionUi: React.FC<PolygonSelectionUiProps> = (
  props
) => {
  const {
    isSelectionEnabled,
    onCancelDraw,
    onStartDraw,
    onReset,
    onPolygonUpdate,
  } = props;

  const [open, setOpen] = React.useState(false);

  return (
    <Box position="relative">
      <IconButton style={{width: '40px'}} icon="crop_square" label="BOX" onClick={ (): void => {onStartDraw(DrawType.BOX);}}/>
      <IconButton style={{width: '40px'}} icon="format_shapes" label="POLYGON" onClick={ (): void => {onStartDraw(DrawType.POLYGON);}}/>
      <IconButton style={{width: '40px'}} icon="settings_overscan" label="BBOX_CORNERS" onClick={ (): void => {setOpen(true);}}/>
      <IconButton style={{width: '40px'}} icon="delete" label="CLEAR" onClick={onReset}/>
      <DialogBBox
        isOpen={open}
        onSetOpen={setOpen}
        onPolygonUpdate={onPolygonUpdate}
      />
    </Box>
  );
};
