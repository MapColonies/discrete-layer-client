import React, { useState, useEffect } from 'react';
import {
  Box,
  CesiumWMTSLayer,
  CesiumWMSLayer,
  CesiumXYZLayer,
  CesiumOSMLayer,
} from '@map-colonies/react-components';
import { observer } from 'mobx-react-lite';
import { Button, Drawer, DrawerContent, DrawerHeader, DrawerSubtitle, DrawerTitle } from '@map-colonies/react-core';
import { DateTimeRangePickerFormControl, SupportedLocales } from '@map-colonies/react-components';
import { FormattedMessage, useIntl } from 'react-intl';
import CONFIG from '../../common/config';
import { MOCK_DATA_IMAGERY_LAYERS_ISRAEL } from '../../__mocks-data__/search-results.mock';
import { osmOptions, wmsOptions, wmtsOptions, xyzOptions } from '../../common/helpers/layer-options';
import { useStore } from '../models/rootStore';
import { MapContainer } from '../components/map-container';
import { DrawerOpener } from '../components/drawer-opener/drawer-opener';
import { LayersResultsComponent } from '../components/layers-results/layers-results';
import './discrete-layer-view.css';

const tileOtions = { opacity: 0.5 };

const mapActionsWidth = '400px';

const DiscreteLayerView: React.FC = observer(() => {
  const { discreteLayersStore } = useStore();
  const [resultsOpen, setResultsOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const intl = useIntl();

  // TODO REMOVE: EXAMLPE HOW TO TRIGGER SNACK  
  useEffect(()=>{
    setTimeout(()=>{
      discreteLayersStore.getLayersImages();
    }, 7000); 
  },[]);

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
              {/* <div style={{  height: '300px', width: '300px', backgroundColor:'red'}}></div> */}
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
          {
            MOCK_DATA_IMAGERY_LAYERS_ISRAEL.map((layer)=>{
              return <CesiumXYZLayer key={layer.id} options={{url: layer.properties.url}}/>
            })
          }
        </>
        /* eslint-enable */
      }
    />
  );
});

export default DiscreteLayerView;
