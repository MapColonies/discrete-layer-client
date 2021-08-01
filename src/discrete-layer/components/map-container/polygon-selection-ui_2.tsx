import React, {useState, useMemo} from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash';
import { IconButton, Select, TextField, Tooltip, useTheme } from '@map-colonies/react-core';
import { Box, DrawType, IDrawingEvent } from '@map-colonies/react-components';
import { enumKeys } from '../../../common/helpers/enums';
import { useStore } from '../../models/RootStore';
import { RecordType } from '../../models/RecordTypeEnum';
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

  const intl = useIntl();
  const { discreteLayersStore } = useStore();
  const [open, setOpen] = useState(false);
  const recordTypeOptions = useMemo(() => {
    const options = [];
    for (const value of enumKeys(RecordType)) {
      options.push({
          label: intl.formatMessage({id: `record-type.${RecordType[value].toLowerCase()}.label`}),
          value: RecordType[value]
      });
    }
    return options;
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
        padding: '0 16px 0 16px'
      }}
    >
      <Tooltip content={intl.formatMessage({ id: 'action.point.tooltip' })}>
        <IconButton 
          className="mc-icon-Coordinates"
          label="POINT"/>
      </Tooltip>
      <Devider/>
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
          icon="settings_overscan" 
          label="BBOX_CORNERS" 
          onClick={ (): void => {setOpen(true);}}/>
      </Tooltip>
      <Devider/>
      <Tooltip content={intl.formatMessage({ id: 'action.delete.tooltip' })}>
        <IconButton icon="delete" label="CLEAR" onClick={onReset}/>
      </Tooltip>
      <Devider/>
      <Tooltip content={intl.formatMessage({ id: 'action.type-select.tooltip' })}>
        <Box style={{width: '120px', padding: '0 6px 0 6px'}}>
          <Select
            enhanced
            defaultValue={RecordType.RECORD_ALL.toString()}
            options={recordTypeOptions}
            onChange={
              (evt): void => {
                discreteLayersStore.searchParams.setRecordType(get(evt,'currentTarget.value'));
              }
            }
          />
        </Box>
      </Tooltip>
      <Box id="searchTerm">
        <TextField fullwidth style={{padding: '0 6px 0 6px'}}/>
      </Box>
      <Tooltip content={intl.formatMessage({ id: 'action.search.tooltip' })}>
        <IconButton icon="search" label="SEARCH" className="searcIconBtn"/>
      </Tooltip>
      <DialogBBox
        isOpen={open}
        onSetOpen={setOpen}
        onPolygonUpdate={onPolygonUpdate}
      />
    </Box>
  );
};
