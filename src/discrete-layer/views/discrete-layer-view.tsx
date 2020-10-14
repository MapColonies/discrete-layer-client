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
} from '@map-colonies/react-components';
import { observer } from 'mobx-react-lite';
import { Snackbar, SnackbarAction } from '@map-colonies/react-core';
import { useIntl } from 'react-intl';
import { useStore } from '../models/rootStore';
import { MapContainer } from '../components/map-container';
import CONFIG from '../../common/config';
import { ResponseState } from '../../common/models/ResponseState';

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

interface SnackDetails {
  message: string;
}

const DiscreteLayerView: React.FC = observer(() => {
  const { discreteLayersStore: discreteLayersStore } = useStore();
  const [snackOpen, setSnackOpen] = useState(false);
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
      filters={[
        <>
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
