import React, {useState} from 'react';
import { IconButton, Select, TextField, useTheme } from '@map-colonies/react-core';
import { Box, DrawType, IDrawingEvent } from '@map-colonies/react-components';
import { DialogBBox } from './dialog-bbox';
import './polygon-selection-ui.css';

export const Devider: React.FC = () => {
  const theme = useTheme();
  return (
    <Box style={{
      width:'1px',
      borderWidth:'0 0 0 1px',
      borderColor: theme.textIconOnDark as string,
      borderStyle: 'solid',
      height: '70%',
    }}/>
  );
}

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

  const [open, setOpen] = useState(false);

  return (
    <Box 
      id="searchContainer"
      position="relative" 
      style={{
        height: '100%',
        display: 'flex',
        gap: '4px',
        alignItems: 'center',
        padding: '0 16px 0 16px'
      }}
    >
      <IconButton 
        className="mc-icon-Coordinates"
        label="POINT"/>
      <Devider/>
      <IconButton 
        className="mc-icon-Rectangle"
        label="BOX" 
        onClick={ (): void => {onStartDraw(DrawType.BOX);}}/>
      <IconButton 
        className="mc-icon-Polygon"
        label="POLYGON" 
        onClick={ (): void => {onStartDraw(DrawType.POLYGON);}}/>
      <IconButton 
        icon="settings_overscan" 
        label="BBOX_CORNERS" 
        onClick={ (): void => {setOpen(true);}}/>
      <Devider/>
      <IconButton icon="delete" label="CLEAR" onClick={onReset}/>
      <Devider/>
      <Box style={{width: '120px', padding: '0 6px 0 6px'}}>
        <Select
          enhanced
          options={['Cookies', 'Pizza', 'Icecream']}
        />
      </Box>
      <TextField fullwidth style={{padding: '0 6px 0 6px'}}/>
      <IconButton icon="search" label="SEARCH" className="searcIconBtn"/>
      <DialogBBox
        isOpen={open}
        onSetOpen={setOpen}
        onPolygonUpdate={onPolygonUpdate}
      />
    </Box>
  );
};
