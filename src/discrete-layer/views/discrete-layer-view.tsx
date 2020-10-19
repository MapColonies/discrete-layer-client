import React, { useState, useEffect } from 'react';
import {
  TileLayer,
  TileWMTS,
  TileWMS,
  TileXYZ,
  TileOsm,
  getWMTSOptions,
  getWMSOptions,
  getXYZOptions,
  Box,
} from '@map-colonies/react-components';
import { observer } from 'mobx-react-lite';
import { Button, Drawer, DrawerContent, DrawerHeader, DrawerSubtitle, DrawerTitle, Snackbar, SnackbarAction } from '@map-colonies/react-core';
import { useIntl } from 'react-intl';
import { useStore } from '../models/rootStore';
import { MapContainer } from '../components/map-container';
import CONFIG from '../../common/config';
import { ResponseState } from '../../common/models/response-state.enum';
import { DrawerOpener } from '../components/drawer-opener/drawer-opener';
import './discrete-layer-view.css';

type ServerType = 'geoserver' | 'carmentaserver' | 'mapserver' | 'qgis';

/* eslint-disable */
const wmtsOptions = getWMTSOptions({
  attributions: CONFIG.WMTS_LAYER.ATTRIBUTIONS,
  url: CONFIG.WMTS_LAYER.URL,
  layer: CONFIG.WMTS_LAYER.LAYER,
  projection: CONFIG.WMTS_LAYER.PROJECTION,
  format: CONFIG.WMTS_LAYER.FORMAT,
});

const wmsOptions = getWMSOptions({
  attributions: CONFIG.WMS_LAYER.ATTRIBUTIONS,
  url: CONFIG.WMS_LAYER.URL,
  params: CONFIG.WMS_LAYER.PARAMS,
  serverType: CONFIG.WMS_LAYER.SERVERTYPE as ServerType,
  transition: CONFIG.WMS_LAYER.TRANSITION,
});

const xyzOptions = getXYZOptions({
  attributions: CONFIG.XYZ_LAYER.ATTRIBUTIONS,
  url: CONFIG.XYZ_LAYER.URL,
});
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
          >
            FILTERS
          </Button>
          {filtersOpen && (
            <Box className="drawerPosition" style={{  height: '300px', width: mapActionsWidth}}>
              <Drawer dismissible open={filtersOpen}>
                <DrawerHeader>
                  <DrawerTitle>FILTERS</DrawerTitle>
                  <DrawerSubtitle>Subtitle</DrawerSubtitle>
                </DrawerHeader>
                <DrawerContent>
                  <div style={{backgroundColor: 'green', height: '100%', width:'100%'}}></div>
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
                  <div style={{backgroundColor: 'red', height: '100%', width:'100%'}}></div>
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
          {CONFIG.ACTIVE_LAYER === 'OSM_DEFAULT' && (
            <TileLayer>
              <TileOsm />
            </TileLayer>
          )}
          {CONFIG.ACTIVE_LAYER === 'WMTS_LAYER' && (
            <TileLayer>
              <TileWMTS options={wmtsOptions} />
            </TileLayer>
          )}
          {CONFIG.ACTIVE_LAYER === 'WMS_LAYER' && (
            <TileLayer options={tileOtions}>
              <TileWMS options={wmsOptions} />
            </TileLayer>
          )}

          {CONFIG.ACTIVE_LAYER === 'XYZ_LAYER' && (
            <TileLayer options={tileOtions}>
              <TileXYZ options={xyzOptions} />
            </TileLayer>
          )}
        </>
        /* eslint-enable */
      }
    />
  );
});

export default DiscreteLayerView;
