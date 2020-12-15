import React, { useState, useEffect } from 'react';
import {
  Box,
  CesiumWMTSLayer,
  RCesiumWMTSLayerOptions,
  RCesiumWMSLayerOptions,
  CesiumWMSLayer,
  RCesiumXYZLayerOptions,
  CesiumXYZLayer,
  CesiumOSMLayer,
  RCesiumOSMLayerOptions,
} from '@map-colonies/react-components';
import { observer } from 'mobx-react-lite';
import { Button, Drawer, DrawerContent, DrawerHeader, DrawerSubtitle, DrawerTitle, Snackbar, SnackbarAction } from '@map-colonies/react-core';
import { DateTimeRangePickerFormControl, SupportedLocales } from '@map-colonies/react-components';
import { FormattedMessage, useIntl } from 'react-intl';
import { ResponseState } from '../../common/models/response-state.enum';
import CONFIG from '../../common/config';
import { useStore } from '../models/rootStore';
import { MapContainer } from '../components/map-container';
import { DrawerOpener } from '../components/drawer-opener/drawer-opener';
import { LayersResultsComponent } from '../components/layers-results/layers-results';
import './discrete-layer-view.css';

type ServerType = 'geoserver' | 'carmentaserver' | 'mapserver' | 'qgis';

/* eslint-disable */
const wmtsOptions: RCesiumWMTSLayerOptions = {
  url: CONFIG.WMTS_LAYER.URL,
  layer: CONFIG.WMTS_LAYER.LAYER,
  style: CONFIG.WMTS_LAYER.STYLE,
  format: CONFIG.WMTS_LAYER.FORMAT,
  tileMatrixSetID: CONFIG.WMTS_LAYER.TILE_MATRIX_SET_ID,
  maximumLevel: CONFIG.WMTS_LAYER.MAXIMUM_LEVEL,
};

const wmsOptions: RCesiumWMSLayerOptions = {
  url: CONFIG.WMS_LAYER.URL,
  layers: CONFIG.WMS_LAYER.PARAMS.LAYERS,
};

const xyzOptions: RCesiumXYZLayerOptions = {
  url: CONFIG.XYZ_LAYER.URL,
};

const osmOptions: RCesiumOSMLayerOptions = {
  url: CONFIG.OSM_LAYER.URL,
}
/* eslint-enable */

const tileOtions = { opacity: 0.5 };

const mapActionsWidth = '400px';

interface SnackDetails {
  message: string;
}

const DiscreteLayerView: React.FC = observer(() => {
  const { discreteLayersStore } = useStore();
  const [snackOpen, setSnackOpen] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [snackDetails, setSnackDetails] = useState<SnackDetails>({
    message: '',
  });
  const intl = useIntl();
  useEffect(() => {
    switch (discreteLayersStore.state) {
      case ResponseState.ERROR:
        setSnackOpen(true);
        setSnackDetails({
          message: 'snack.message.failed',
        });
        break;
      case ResponseState.DONE:
        setSnackOpen(true);
        setSnackDetails({
          message: 'snack.message.success',
        });
        break;
      default:
        break;
    }
  }, [discreteLayersStore.state]);

  return (
    <MapContainer
      handlePolygonSelected={discreteLayersStore.searchParams.setLocation}
      handlePolygonReset={discreteLayersStore.searchParams.resetLocation.bind(
        discreteLayersStore.searchParams
      )}
      mapActionsWidth={mapActionsWidth}
      handleOtherDrawers={(): void => setFiltersOpen(false)}
      filters={[
        <>
          <Button
            outlined
            theme={['primaryBg', 'onPrimary']}
            onClick={(): void => setFiltersOpen(!filtersOpen)}
            icon="filter_alt"
          >
            <FormattedMessage id="filters.title" />
          </Button>
          {filtersOpen && (
            <Box className="drawerPosition" style={{  height: '300px', width: mapActionsWidth}}>
              <Drawer dismissible open={filtersOpen}>
                <DrawerHeader>
                  <DrawerTitle>
                    <FormattedMessage id="filters.title" />
                  </DrawerTitle>
                  <DrawerSubtitle>
                    <FormattedMessage id="filters.sub-title" />
                  </DrawerSubtitle>
                </DrawerHeader>
                <DrawerContent style={{padding: '0px 16px'}}>
                  <DateTimeRangePickerFormControl 
                    width={'100%'} 
                    renderAsButton={false} 
                    onChange={(dateRange): void => {
                      console.log('DateTimeRangePickerFormControl--->',dateRange.from, dateRange.to);
                    }}
                    local={{
                      setText: intl.formatMessage({ id: 'filters.date-picker.set-btn.text' }),
                      startPlaceHolderText: intl.formatMessage({ id: 'filters.date-picker.start-time.label' }),
                      endPlaceHolderText: intl.formatMessage({ id: 'filters.date-picker.end-time.label' }),
                      calendarLocale: SupportedLocales[CONFIG.I18N.DEFAULT_LANGUAGE.toUpperCase() as keyof typeof SupportedLocales]
                    }}
                  />
                </DrawerContent>
              </Drawer>

            </Box>)
          }

          {resultsOpen && (
            <Box className="drawerPosition" style={{  height: '600px', width: mapActionsWidth, zIndex:-1}}>
              <Drawer dismissible open={resultsOpen}>
                <DrawerHeader>
                  <DrawerTitle>RESULTS</DrawerTitle>
                  <DrawerSubtitle>Subtitle</DrawerSubtitle>
                </DrawerHeader>
                <DrawerContent>
                  <LayersResultsComponent 
                    style={{height: '450px',width: '100%'}}
                  />
                </DrawerContent>
              </Drawer>
            </Box>)
          }

          <DrawerOpener
            isOpen={resultsOpen}
            onClick={setResultsOpen}
          />

          {!!snackDetails.message && (
            <Snackbar
              open={snackOpen}
              onClose={(evt): void => setSnackOpen(false)}
              message={intl.formatMessage({ id: snackDetails.message })}
              dismissesOnAction
              action={
                <SnackbarAction
                  label={intl.formatMessage({ id: 'snack.dismiss-btn.text' })}
                  onClick={(): void => console.log('dismiss clicked')}
                />
              }
            />
          )}
      </>,
      ]}
      mapContent={
        /* eslint-disable */
        <>
          {CONFIG.ACTIVE_LAYER === 'OSM_LAYER' && (
            <CesiumOSMLayer options={osmOptions} />
          )}
          {CONFIG.ACTIVE_LAYER === 'WMTS_LAYER' && (
            <CesiumWMTSLayer options={wmtsOptions} />
          )}
          {CONFIG.ACTIVE_LAYER === 'WMS_LAYER' && (
            <CesiumWMSLayer options={wmsOptions} alpha={tileOtions.opacity} />
          )}

          {CONFIG.ACTIVE_LAYER === 'XYZ_LAYER' && (
            <CesiumXYZLayer options={xyzOptions} alpha={tileOtions.opacity}/>
          )}
        </>
        /* eslint-enable */
      }
    />
  );
});

export default DiscreteLayerView;
