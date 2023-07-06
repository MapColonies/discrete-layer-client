import React, {useState, useMemo} from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash';
import { IconButton, Select, TextField, Tooltip, useTheme } from '@map-colonies/react-core';
import { Box, DrawType, IDrawingEvent } from '@map-colonies/react-components';
import CONFIG from '../../../common/config';
import { useStore } from '../../models/RootStore';
import { RecordType } from '../../models/RecordTypeEnum';
import { BBoxCorners, BBoxDialog } from './bbox.dialog';
import { IPOI, PoiDialog } from './poi.dialog';

import './polygon-selection-ui.css';

export const Divider: React.FC = () => {
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
  isSystemFreeTextSearchEnabled: boolean;
  onStartDraw: (type: DrawType) => void;
  onCancelDraw: () => void;
  onReset: () => void;
  onPolygonUpdate: (polygon: IDrawingEvent) => void;
  onPoiUpdate: (longitude: number, latitude: number) => void;
  poi?: IPOI;
  corners?: BBoxCorners;
  disabled?: boolean;
}

export const PolygonSelectionUi: React.FC<PolygonSelectionUiProps> = (props) => {
  const {
    isSystemFreeTextSearchEnabled,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isSelectionEnabled,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onCancelDraw,
    onStartDraw,
    onReset,
    onPolygonUpdate,
    onPoiUpdate,
    poi,
    corners,
    disabled,
  } = props;

  const intl = useIntl();
  const { discreteLayersStore } = useStore();
  const [open, setOpen] = useState(false);
  const [openPoiDialog, setOpenPoiDialog] = useState(false);
  const recordTypeOptions = useMemo(() => {
    return CONFIG.SERVED_ENTITY_TYPES.map((entity) => {
      const value = entity as keyof typeof RecordType;
      return {
        label: intl.formatMessage({id: `record-type.${RecordType[value].toLowerCase()}.label`}),
        value: RecordType[value]
      };
    });
  
  }, []);

  return (
    <Box 
      id="searchContainer"
      position="relative" 
      style={{
        height: '100%',
        display: 'flex',
        gap: '4px',
        alignItems: 'center',
        padding: '0 16px 0 16px',
        opacity: disabled as boolean ? '0.3' : '1',
        pointerEvents: disabled as boolean ? 'none' : 'unset',
      }}
    >
      <Tooltip content={intl.formatMessage({ id: 'action.point.tooltip' })}>
        <IconButton 
          className="mc-icon-POI"
          label="POINT"
          onClick={(): void => {setOpenPoiDialog(true);}}/>
      </Tooltip>
      <Divider/>
      <Tooltip content={intl.formatMessage({ id: 'action.box.tooltip' })}>
        <IconButton 
          className="mc-icon-Rectangle"
          label="BOX" 
          onClick={(): void => {onStartDraw(DrawType.BOX);}}/>
      </Tooltip>
      <Tooltip content={intl.formatMessage({ id: 'action.polygon.tooltip' })}>
        <IconButton 
          className="mc-icon-Polygon"
          label="POLYGON" 
          onClick={(): void => {onStartDraw(DrawType.POLYGON);}}/>
      </Tooltip>
      <Tooltip content={intl.formatMessage({ id: 'action.bbox-corners.tooltip' })}>
        <IconButton 
          className="mc-icon-Coordinates" 
          label="BBOX CORNERS" 
          onClick={(): void => {setOpen(true);}}/>
      </Tooltip>
      <Divider/>
      <Tooltip content={intl.formatMessage({ id: 'action.clear.tooltip' })}>
        <IconButton className="mc-icon-Delete" label="CLEAR" onClick={onReset}/>
      </Tooltip>
      <Divider/>
      <Box className="filterByCatalogEntitySelect">
        <Select
          enhanced
          defaultValue={recordTypeOptions[0].value}
          options={recordTypeOptions}
          onChange={
            (evt): void => {
              discreteLayersStore.searchParams.setRecordType(get(evt,'currentTarget.value'));
            }
          }
        />
      </Box>
      <Box id="searchTerm">
        <TextField disabled={!isSystemFreeTextSearchEnabled} style={{padding: '0 6px 0 6px'}}/>
      </Box>
      <Tooltip content={intl.formatMessage({ id: 'action.search.tooltip' })}>
        <IconButton disabled={!isSystemFreeTextSearchEnabled} icon="search" label="SEARCH" className="searchIconBtn"/>
      </Tooltip>
      {
        open &&
        <BBoxDialog
          isOpen={open}
          onSetOpen={setOpen}
          onPolygonUpdate={onPolygonUpdate}
          corners={corners}
        />
      }
      {
        openPoiDialog &&
        <PoiDialog
          isOpen={openPoiDialog}
          onSetOpen={setOpenPoiDialog}
          onPoiUpdate={onPoiUpdate}
          poi={poi}
        />
      }
    </Box>
  );
};
