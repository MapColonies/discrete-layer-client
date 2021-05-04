/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { observer } from 'mobx-react-lite';
import {
  CesiumWMTSLayer,
  CesiumWMSLayer,
  CesiumXYZLayer,
  CesiumOSMLayer,
  DrawType,
  IDrawingEvent,
  IDrawing,
  CesiumDrawingsDataSource,
  CesiumColor,
  CesiumMap,
  CesiumSceneMode,
  BboxCorner,
  Box,
} from '@map-colonies/react-components';
import { Geometry, Feature, FeatureCollection, Polygon, Point } from 'geojson';
import { find } from 'lodash';
import { lineString } from '@turf/helpers';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import CONFIG from '../../common/config';
import { osmOptions, wmsOptions, wmtsOptions, xyzOptions } from '../../common/helpers/layer-options';
import { useQuery, useStore } from "../models/RootStore"
import { MapContainer } from '../components/map-container';
import { IconButton, Icon, TabBar, Tab, useTheme, Typography, Fab } from '@map-colonies/react-core';
import { SelectedLayersContainer } from '../components/map-container/selected-layers-container';
import { HighlightedLayer } from '../components/map-container/highlighted-layer';
import { LayersFootprints } from '../components/map-container/layers-footprints';
import { PolygonSelectionUi } from '../components/map-container/polygon-selection-ui_2';
import { LayersResultsComponent } from '../components/layers-results/layers-results';

import '@material/tab-bar/dist/mdc.tab-bar.css';
import '@material/tab/dist/mdc.tab.css';
import '@material/tab-scroller/dist/mdc.tab-scroller.css';
import '@material/tab-indicator/dist/mdc.tab-indicator.css';
import { Filters } from '../components/filters/filters';
import { ILayerImage } from '../models/layerImage';
import { Home } from './test/Home';
import './discrete-layer-view.css';
import { LayersDetailsComponent } from '../components/layer-details/layer-details';

type LayerType = 'WMTS_LAYER' | 'WMS_LAYER' | 'XYZ_LAYER' | 'OSM_LAYER';
const DRAWING_MATERIAL_OPACITY = 0.5;
const DRAWING_MATERIAL_COLOR = CesiumColor.YELLOW.withAlpha(DRAWING_MATERIAL_OPACITY);
const BASE_MAPS = {
  maps: [
    {
      id: '1st',
      title: '1st Map Title',
      thumbnail: 'https://nsw.digitaltwin.terria.io/build/3456d1802ab2ef330ae2732387726771.png',
      baseRasteLayers: [
        {
          id: 'GOOGLE_TERRAIN',
          type:  'XYZ_LAYER' as LayerType,
          opacity: 1,
          zIndex: 0,
          options: {
            url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
            layers: '',
            credit: 'GOOGLE',
          }
        },
        {
          id: 'INFRARED_RASTER',
          type:  'WMS_LAYER' as LayerType,
          opacity: 0.6,
          zIndex: 1,
          options: {
            url: 'https://mesonet.agron.iastate.edu/cgi-bin/wms/goes/conus_ir.cgi?',
            layers: 'goes_conus_ir',
            credit: 'Infrared data courtesy Iowa Environmental Mesonet',
            parameters: {
              transparent: 'true',
              format: 'image/png',
            },
          }
        }
      ],
      baseVectorLayers: [],
    },
    {
      id: '2nd',
      title: '2nd Map Title',
      thumbnail: 'https://nsw.digitaltwin.terria.io/build/efa2f6c408eb790753a9b5fb2f3dc678.png',
      baseRasteLayers: [
        {
          id: 'RADAR_RASTER',
          type:  'WMS_LAYER' as LayerType,
          opacity: 0.6,
          zIndex: 1,
          options: {
            url: 'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi?',
            layers: 'nexrad-n0r',
            credit: 'Radar data courtesy Iowa Environmental Mesonet',
            parameters: {
              transparent: 'true',
              format: 'image/png',
            },
          }
        },
        {
          id: 'GOOGLE_TERRAIN',
          type:  'XYZ_LAYER' as LayerType,
          opacity: 1,
          zIndex: 0,
          options: {
            url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
            layers: '',
            credit: 'GOOGLE',
          }
        },
        {
          id: 'VECTOR_TILES_GPS',
          type:  'XYZ_LAYER' as LayerType,
          opacity: 1,
          zIndex: 2,
          options: {
            url: 'https://gps.tile.openstreetmap.org/lines/{z}/{x}/{y}.png',
            layers: '',
            credit: 'openstreetmap',
          }
        },
      ],
      baseVectorLayers: [],
    },
    {
      id: '3rd',
      title: '3rd Map Title',
      isCurrent: true,
      thumbnail: 'https://nsw.digitaltwin.terria.io/build/d8b97d3e38a0d43e5a06dea9aae17a3e.png',
      baseRasteLayers: [
        {
          id: 'VECTOR_TILES',
          type:  'XYZ_LAYER' as LayerType,
          opacity: 1,
          zIndex: 0,
          options: {
            url: 'https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38',
            layers: '',
            credit: 'thunderforest',
          }
        },
        {
          id: 'VECTOR_TILES_GPS_1',
          type:  'XYZ_LAYER' as LayerType,
          opacity: 1,
          zIndex: 1,
          options: {
            url: 'https://gps.tile.openstreetmap.org/lines/{z}/{x}/{y}.png',
            layers: '',
            credit: 'openstreetmap',
          }
        },
      ],
      baseVectorLayers: [],
    }
  ]
};

interface IDrawingObject {
  type: DrawType;
  handler: (drawing: IDrawingEvent) => void;
}

const noDrawing: IDrawingObject = {
  type: DrawType.UNKNOWN,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handler: (drawing: IDrawingEvent) => {},
};

const getTimeStamp = (): string => new Date().getTime().toString();

const tileOtions = { opacity: 0.5 };

const DiscreteLayerView: React.FC = observer(() => {
  const { loading, error, data, query, setQuery } = useQuery();
  const store = useStore();
  const theme = useTheme();
  const [center] = useState<[number, number]>(CONFIG.MAP.CENTER as [number, number]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [drawPrimitive, setDrawPrimitive] = useState<IDrawingObject>(noDrawing);
  const [drawEntities, setDrawEntities] = useState<IDrawing[]>([
    {
      coordinates: [],
      name: '',
      id: '',
      type: DrawType.UNKNOWN,
    },
  ]);
  const memoizedLayers =  useMemo(() => {
    return(
    <>
      {/* {CONFIG.ACTIVE_LAYER === 'OSM_LAYER' && (
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
      )} */}

      <SelectedLayersContainer/>
      <HighlightedLayer/>
      <LayersFootprints/>
    </>
  );
  }, [CONFIG.ACTIVE_LAYER]);

  const [activeTabView, setActiveTabView] = React.useState(0);
  const [detailsPanelExpanded, setDetailsPanelExpanded] = React.useState(false);

  useEffect(() => {
    const layers: ILayerImage[] = ((data as any)?.catalogItems || []) as ILayerImage[];

    store.discreteLayersStore.setLayersImages(layers);
  }, [data]);

  const handlePolygonSelected = (geometry: Geometry): void => {
    store.discreteLayersStore.searchParams.setLocation(geometry);
    void store.discreteLayersStore.clearLayersImages();
    // void store.discreteLayersStore.getLayersImages();

    setQuery(store.queryCatalogItems());
  };

  const handlePolygonReset = (): void => {
    store.discreteLayersStore.searchParams.resetLocation();
    store.discreteLayersStore.clearLayersImages();

    setDrawEntities([]);
  }

  const handleFilter = (): void => {
    setIsFilter(!isFilter);
  }

  const createDrawPrimitive = (type: DrawType): IDrawingObject => {
    return {
      type: type,
      handler: (drawing: IDrawingEvent): void => {
        const timeStamp = getTimeStamp();

        setIsDrawing(false);
        
        handlePolygonSelected((drawing.geojson as Feature).geometry as Polygon);

        setDrawEntities([
          {
            coordinates: drawing.primitive,
            name: `${type.toString()}_${timeStamp}`,
            id: timeStamp,
            type: drawing.type,
          },
        ]);

        setActiveTabView(1);
      },
    };
  };
  
  const setDrawType = (drawType: DrawType): void =>{
    setIsDrawing(true);
    setDrawPrimitive(createDrawPrimitive(drawType));
  }

  const onPolygonSelection = (polygon: IDrawingEvent): void => {
    const timeStamp = getTimeStamp();
    const bottomLeftPoint = find((polygon.geojson as FeatureCollection<Point>).features, (feat: Feature<Point>)=>{
      return feat.properties?.type === BboxCorner.BOTTOM_LEFT;
    }) as Feature<Point>;
    const rightTopPoint = find((polygon.geojson as FeatureCollection<Point>).features, (feat: Feature<Point>)=>{
      return feat.properties?.type === BboxCorner.TOP_RIGHT;
    }) as Feature<Point>;
    const line = lineString([
      [
        bottomLeftPoint.geometry.coordinates[0],
        bottomLeftPoint.geometry.coordinates[1]
      ],
      [
        rightTopPoint.geometry.coordinates[0],
        rightTopPoint.geometry.coordinates[1],
      ],
    ]);
    const boxPolygon = bboxPolygon(bbox(line));

    handlePolygonSelected((boxPolygon as Feature).geometry as Polygon); 

    setDrawEntities([
      {
        coordinates: polygon.primitive,
        name: `${DrawType.BOX.toString()}_${timeStamp}`,
        id: timeStamp,
        type: DrawType.BOX,
        geojson: polygon.geojson,
      },
    ]);

    setActiveTabView(1);
  };

  const tabViews = [
    {
      idx: 0,
      title: 'tab-views.catalog',
      iconClassName: 'mc-icon-Catalog',
    },
    {
      idx: 1,
      title: 'tab-views.search-results',
      iconClassName: 'mc-icon-Search-History',
    }
  ];

  const getActiveTabHeader = (tabIdx: number) => {
    const tabView = find(tabViews, (tab)=>{
      return tab.idx === tabIdx;
    });
    return (
      <div className="tabHeaderContainer">
        <div className="tabTitleContainer" style={{backgroundColor: theme.custom?.GC_TAB_ACTIVE_BACKGROUND}}>
          <div className="tabTitle" style={{
            backgroundColor: theme.custom?.GC_ALTERNATIVE_SURFACE,
            borderBottomColor: theme.custom?.GC_TAB_ACTIVE_BACKGROUND
          }}>
            <IconButton 
              className={`operationIcon ${tabView?.iconClassName}`}
              label="TABICON"
              onClick={ (): void => {}}
            />
            <Typography use="headline6" tag="span">
              <FormattedMessage id={tabView?.title}></FormattedMessage>
            </Typography>
          </div>
        </div>

        <div className="tabOperationsContainer" style={{backgroundColor: theme.custom?.GC_ALTERNATIVE_SURFACE}}>
          <div className="tabOperations" style={{
            backgroundColor: theme.custom?.GC_TAB_ACTIVE_BACKGROUND,
            borderTopColor: theme.custom?.GC_TAB_ACTIVE_BACKGROUND
          }}>
            <IconButton 
              className="operationIcon mc-icon-Delete"
              label="DELETE"
              onClick={ (): void => {}}
            />
            <IconButton 
              className="operationIcon mc-icon-Filter"
              // icon="filter_list" 
              label="FILTER"
              onClick={ (): void => {handleFilter()}}
            />
            <IconButton 
              className="operationIcon mc-icon-Arrows-Left"
              label="EXPANDER"
              onClick={ (): void => {}}
            />
          </div>
        </div>
      </div>
    );
  };

  // TODO: should be taken from selected item in store
  // const [layerToPresent, setLayerToPresent] = useState<ILayerImage | null>(null);
  // useEffect(() => {
  //   // @ts-ignore
  //   setLayerToPresent(store.discreteLayersStore.highlightedLayer); 
  // }, [store.discreteLayersStore.highlightedLayer]);
  
  const layerToPresent = store.discreteLayersStore.highlightedLayer;
  // const layerToPresent = (store.discreteLayersStore !== null && store.discreteLayersStore.layersImages !== undefined) ? store.discreteLayersStore.layersImages[0] : null;

  return (
    <>
      <Box className="headerContainer">
        <Box className="headerViewsSwitcher">
          <Box style={{padding: '0 12px 0 12px'}}>
            <Typography use="body2">Catalog App</Typography>
          </Box>
          <Box className="headerViewsSwitcherContainer">
            {tabViews.map((tab) => {
              return <Fab 
                key={tab.idx}
                className={`${tab.iconClassName} tabViewIcon`}
                mini 
                onClick={(evt): void => setActiveTabView(tab.idx)}
                style={{ 
                  backgroundColor: activeTabView === tab.idx ? theme.custom?.GC_SELECTION_BACKGROUND : theme.custom?.GC_ALTERNATIVE_SURFACE, 
                }}
                theme={[activeTabView === tab.idx ? 'onPrimary' : 'onSurface']}
              />;
            })}
          </Box>
        </Box>
        {/* <TabBar
          activeTabIndex={activeTabView}
          onActivate={(evt): void => setActiveTabView(evt.detail.index)}
          style={{
            width: '180px',
            // @ts-ignore
            '--gc-tab-active-background': theme.custom?.GC_TAB_ACTIVE_BACKGROUND
          }}
        >
          <Tab icon="star_border" style={{
            // background: `linear-gradient(to top,rgba(0, 0, 0, 0.25),rgba(0, 0, 0, 0.25)) ${theme.background}`
          }}/>
          <Tab icon="favorite_border" />
        </TabBar> */}

        <Box className="headerSearchOptionsContainer">
          <PolygonSelectionUi
            onCancelDraw={()=>{}}
            onReset={handlePolygonReset}
            onStartDraw={setDrawType}
            isSelectionEnabled={isDrawing}
            onPolygonUpdate={onPolygonSelection}
          />
        </Box>

        { 
        // <PolygonSelectionUi
        //   // onCancelDraw={onCancelDraw}
        //   // onReset={onReset}
        //   // onStartDraw={setDrawType}
        //   // isSelectionEnabled={isDrawing}
        //   // onPolygonUpdate={onPolygonSelection}
        //   // mapActionsWidth = {mapActionsWidth}
        //   // handleOtherDrawers={(): void => setFiltersOpen(false)}
        //   onCancelDraw={()=>{}}
        //   onReset={()=>{}}
        //   onStartDraw={setDrawType}
        //   isSelectionEnabled={isDrawing}
        //   onPolygonUpdate={()=>{}}
        //   mapActionsWidth = {'400px'}
        //   handleOtherDrawers={(): void => {}}

        // /> 
        }
      
      </Box>
      <Box className="mainViewContainer">
        <Box className="sidePanelParentContainer">
          <Box 
            className="sidePanelContainer"
            style={{
              backgroundColor: theme.custom?.GC_ALTERNATIVE_SURFACE,
              height: detailsPanelExpanded ? '50%': '75%'
            }}
          >
            <Box className="tabContentContainer" style={{display: activeTabView === 0 ? 'block': 'none'}}>
              {
                getActiveTabHeader(activeTabView)
              }
              <Home />
            </Box>

            <Box className="tabContentContainer"  style={{display: activeTabView === 1 ? 'block': 'none'}}>
              {
                getActiveTabHeader(activeTabView)
              }
              <LayersResultsComponent 
                style={{
                  height: 'calc(100% - 50px)',
                  width: 'calc(100% - 8px)'
                }}
              />
            </Box>
          </Box>
          
          <Box className="sidePanelContainer sideDetailsPanel" style={{
            backgroundColor: theme.custom?.GC_ALTERNATIVE_SURFACE,
            height: detailsPanelExpanded ? '50%': '25%',
          }}>
            <Box style={{display: 'flex', paddingTop: '8px'}}>
              <Typography use="headline6" tag="div" className="detailsTitle">
                {layerToPresent?.sourceName}
              </Typography>
              <IconButton 
                className={`operationIcon ${!detailsPanelExpanded ? 'mc-icon-Expand-Panel': 'mc-icon-Collapce-Panel'}`}
                label="EXPANDER"
                onClick={ (): void => {setDetailsPanelExpanded(!detailsPanelExpanded)}}
              />
            </Box>
            <LayersDetailsComponent layerRecord={layerToPresent} isBrief={!detailsPanelExpanded}/>
          </Box>
        </Box>
        
        <Box className="mapAppContainer">
          {
          // <MapContainer
          //   handlePolygonSelected={handlePolygonSelected}
          //   handlePolygonReset={handlePolygonReset}
          //   mapContent={
          //     /* eslint-disable */
          //     <>
          //       {CONFIG.ACTIVE_LAYER === 'OSM_LAYER' && (
          //         <CesiumOSMLayer options={osmOptions} />
          //       )}
          //       {CONFIG.ACTIVE_LAYER === 'WMTS_LAYER' && (
          //         <CesiumWMTSLayer options={wmtsOptions} />
          //       )}
          //       {CONFIG.ACTIVE_LAYER === 'WMS_LAYER' && (
          //         <CesiumWMSLayer options={wmsOptions} alpha={tileOtions.opacity} />
          //       )}

          //       {CONFIG.ACTIVE_LAYER === 'XYZ_LAYER' && (
          //         <CesiumXYZLayer options={xyzOptions} alpha={tileOtions.opacity}/>
          //       )}
          //     </>
          //     /* eslint-enable */
          //   }
          // />
          }
          {
            <CesiumMap 
              projection={CONFIG.MAP.PROJECTION}  
              center={center}
              zoom={CONFIG.MAP.ZOOM}
              sceneMode={CesiumSceneMode.SCENE2D}
              imageryProvider={false}
              baseMaps={BASE_MAPS}
              >
                {memoizedLayers}
                <CesiumDrawingsDataSource
                  drawings={drawEntities}
                  drawingMaterial={DRAWING_MATERIAL_COLOR}
                  drawState={{
                    drawing: isDrawing,
                    type: drawPrimitive.type,
                    handler: drawPrimitive.handler,
                  }}
                />
            </CesiumMap>
          }
        </Box>      
        
        <Filters isFiltersOpened={isFilter} filtersView={activeTabView}/>

      </Box>


    </>
  );
});

export default DiscreteLayerView;
