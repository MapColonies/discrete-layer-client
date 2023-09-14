import React, {useState, useMemo, useEffect} from 'react';
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
import { CatalogFilterPanel } from './catalogFilter/catalog-filter-panel.component';
import { FilterField } from '../../models/RootStore.base';

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
  onFiltersApply: (filters: FilterField[]) => void;
  onFiltersReset: () => void;
  poi?: IPOI;
  corners?: BBoxCorners;
  disabled?: boolean;
}

enum PolygonSelectionsLabels {
  BOX = 'BOX',
  POLYGON = 'POLYGON',
  BBOX = 'BBOX',
  POI = 'POI',
  FILTER = 'FILTER'
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
    onFiltersApply,
    onFiltersReset,
    poi,
    corners,
    disabled,
  } = props;

  const intl = useIntl();
  // const { discreteLayersStore } = useStore();
  const [open, setOpen] = useState(false);
  const [openPoiDialog, setOpenPoiDialog] = useState(false);
  const [activeSelection, setActiveSelection] = useState<PolygonSelectionsLabels | ''>('');
  const [lastDrawingSelectionType, setLastDrawingSelectionType] = useState<PolygonSelectionsLabels | ''>('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  useEffect(() => {
    if(poi) {
      setActiveSelection(PolygonSelectionsLabels.POI);
    } else if(corners) {
      setActiveSelection(PolygonSelectionsLabels.BBOX);
    } else if(isSelectionEnabled && lastDrawingSelectionType) {
      setActiveSelection(lastDrawingSelectionType);
      setLastDrawingSelectionType('');
    }
  }, [isSelectionEnabled, poi, corners])

  const getActiveClass = (className: string, selectionLabel: PolygonSelectionsLabels) => {
    return `${className} ${activeSelection === selectionLabel ? 'active': ''}`;
  }

  return (
    <>
    
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
            className={getActiveClass("mc-icon-POI", PolygonSelectionsLabels.POI)}
            label={PolygonSelectionsLabels.POI}
            onClick={(): void => {
              setOpenPoiDialog(true);
            }}/>
        </Tooltip>
        <Divider/>
        <Tooltip content={intl.formatMessage({ id: 'action.box.tooltip' })}>
          <IconButton 
            className={getActiveClass("mc-icon-Rectangle", PolygonSelectionsLabels.BOX)}
            label={PolygonSelectionsLabels.BOX}
            onClick={(): void => {
              setLastDrawingSelectionType(PolygonSelectionsLabels.BOX);
              onStartDraw(DrawType.BOX);
            }}/>
        </Tooltip>
        <Tooltip content={intl.formatMessage({ id: 'action.polygon.tooltip' })}>
          <IconButton 
            className={getActiveClass("mc-icon-Polygon", PolygonSelectionsLabels.POLYGON)}
            label={PolygonSelectionsLabels.POLYGON} 
            onClick={(): void => {
              setLastDrawingSelectionType(PolygonSelectionsLabels.POLYGON);
              onStartDraw(DrawType.POLYGON);
            }}/>
        </Tooltip>
        <Tooltip content={intl.formatMessage({ id: 'action.bbox-corners.tooltip' })}>
          <IconButton 
            className={getActiveClass("mc-icon-Coordinates", PolygonSelectionsLabels.BBOX)} 
            label={PolygonSelectionsLabels.BBOX}
            onClick={(): void => {
              setOpen(true);
            }}/>
        </Tooltip>
        <Divider/>
        <Tooltip content={intl.formatMessage({ id: 'action.clear.tooltip' })}>
          <IconButton className="mc-icon-Delete" label="CLEAR" onClick={() => {
            setActiveSelection('');
            onReset();
          }}/>
        </Tooltip>
        <Divider/>
        <Tooltip content={intl.formatMessage({ id: 'action.filter.tooltip' })}>
            <IconButton 
              className={getActiveClass("mc-icon-Filter", PolygonSelectionsLabels.FILTER)}
              label={PolygonSelectionsLabels.FILTER}
              onClick={() => {
                setIsFilterPanelOpen((currFilterOpen) => !currFilterOpen)
              }}
            />
        </Tooltip>
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
      <CatalogFilterPanel onFiltersReset={onFiltersReset} onFiltersSubmit={onFiltersApply} isOpen={isFilterPanelOpen} />
      </Box>
    </>
  );
};
