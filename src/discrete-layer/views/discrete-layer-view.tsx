/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState, useEffect } from 'react';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { observer } from 'mobx-react-lite';
import {
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
import { IconButton, useTheme, Typography, Fab } from '@map-colonies/react-core';
import { Geometry, Feature, FeatureCollection, Polygon, Point } from 'geojson';
import { find } from 'lodash';
import { lineString } from '@turf/helpers';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import CONFIG from '../../common/config';
import { useQuery, useStore } from "../models/RootStore"
import { SelectedLayersContainer } from '../components/map-container/selected-layers-container';
import { HighlightedLayer } from '../components/map-container/highlighted-layer';
import { LayersFootprints } from '../components/map-container/layers-footprints';
import { PolygonSelectionUi } from '../components/map-container/polygon-selection-ui_2';
import { LayersResultsComponent } from '../components/layers-results/layers-results';
import { Filters } from '../components/filters/filters';
import { LayersDetailsComponent } from '../components/layer-details/layer-details';
import { ILayerImage } from '../models/layerImage';
import { Home } from './test/Home';

import '@material/tab-bar/dist/mdc.tab-bar.css';
import '@material/tab/dist/mdc.tab.css';
import '@material/tab-scroller/dist/mdc.tab-scroller.css';
import '@material/tab-indicator/dist/mdc.tab-indicator.css';
import './discrete-layer-view.css';

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
        // {
        //   id: 'AZURE_RASTER_WMTS',
        //   type:  'WMTS_LAYER' as LayerType,
        //   opacity: 1,
        //   zIndex: 0,
        //   options: {
        //     url: 'http://map-raster.apps.v0h0bdx6.eastus.aroapp.io/wmts/full_il/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png',
        //     format: 'png',
        //     layer: 'full_il',
        //     style: 'default',
        //     tileMatrixSetID: 'newGrids'
        //   }
        // },
        // {
        //   id: 'AZURE_RASTER_WMTS_BLUEMARBEL_IL',
        //   type:  'WMTS_LAYER' as LayerType,
        //   opacity: 1,
        //   zIndex: 0,
        //   options: {
        //     url: 'http://map-raster.apps.v0h0bdx6.eastus.aroapp.io/wmts/bluemarble_il/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png',
        //     format: 'png',
        //     layer: 'bluemarble_il',
        //     style: 'default',
        //     tileMatrixSetID: 'newGrids'
        //   }
        // },
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

export enum TabViews {
  CATALOG,
  SEARCH_RESULTS,
}

const DiscreteLayerView: React.FC = observer(() => {
  // eslint-disable-next-line
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
      <SelectedLayersContainer/>
      <HighlightedLayer/>
      <LayersFootprints/>
    </>
  );
  }, []);

  const [activeTabView, setActiveTabView] = React.useState(TabViews.CATALOG);
  const [detailsPanelExpanded, setDetailsPanelExpanded] = React.useState(false);

  useEffect(() => {
    const layers = get(data,'search', []) as ILayerImage[];

    store.discreteLayersStore.setLayersImages([...layers]);
  }, [data, store.discreteLayersStore]);

  const buildFilters =  () => {
    const coordinates = (store.discreteLayersStore.searchParams.geojson as Polygon).coordinates[0];
    return [
      {
        field: 'mc:boundingBox',
        bbox: {
          llon: coordinates[0][0],
          llat: coordinates[0][1],
          ulon: coordinates[2][0],
          ulat: coordinates[2][1],
        },
      },
      {
        field: 'mc:type',
        eq: store.discreteLayersStore.searchParams.recordType,
      },
    ];
  };

  const handlePolygonSelected = (geometry: Geometry): void => {
    store.discreteLayersStore.searchParams.setLocation(geometry);
    void store.discreteLayersStore.clearLayersImages();
    // void store.discreteLayersStore.getLayersImages();

    // TODO: build query params: FILTERS and SORTS
    const filters = buildFilters();
    setQuery(store.querySearch({
      start: 1,
      end: 10,
      opts: {
        filter: filters
      }
    }));
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

        setActiveTabView(TabViews.SEARCH_RESULTS);
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

    setActiveTabView(TabViews.SEARCH_RESULTS);
  };

  const tabViews = [
    {
      idx: TabViews.CATALOG,
      title: 'tab-views.catalog',
      iconClassName: 'mc-icon-Catalog',
    },
    {
      idx: TabViews.SEARCH_RESULTS,
      title: 'tab-views.search-results',
      iconClassName: 'mc-icon-Search-History',
    }
  ];

  const getActiveTabHeader = (tabIdx: number): JSX.Element => {
    const tabView = find(tabViews, (tab)=>{
      return tab.idx === tabIdx;
    });
    return (
      <div className="tabHeaderContainer">
        <div className="tabTitleContainer" style={{backgroundColor: theme.custom?.GC_TAB_ACTIVE_BACKGROUND as string}}>
          <div className="tabTitle" style={{
            backgroundColor: theme.custom?.GC_ALTERNATIVE_SURFACE as string,
            borderBottomColor: theme.custom?.GC_TAB_ACTIVE_BACKGROUND as string
          }}>
            <IconButton 
              className={`operationIcon ${tabView?.iconClassName as string}`}
              label="TABICON"
            />
            <Typography use="headline6" tag="span">
              <FormattedMessage id={tabView?.title}></FormattedMessage>
            </Typography>
          </div>
        </div>

        <div className="tabOperationsContainer" style={{backgroundColor: theme.custom?.GC_ALTERNATIVE_SURFACE as string}}>
          <div className="tabOperations" style={{
            backgroundColor: theme.custom?.GC_TAB_ACTIVE_BACKGROUND as string,
            borderTopColor: theme.custom?.GC_TAB_ACTIVE_BACKGROUND as string
          }}>
            <IconButton 
              className="operationIcon mc-icon-Delete"
              label="DELETE"
            />
            <IconButton 
              className="operationIcon mc-icon-Filter"
              label="FILTER"
              onClick={ (): void => {handleFilter()}}
            />
            <IconButton 
              className="operationIcon mc-icon-Arrows-Left"
              label="EXPANDER"
            />
          </div>
        </div>
      </div>
    );
  };

  const handleTabViewChange = (targetViewIdx: TabViews): void => {
    store.discreteLayersStore.setTabviewData(activeTabView);
    setActiveTabView(targetViewIdx);
    store.discreteLayersStore.restoreTabviewData(targetViewIdx);
  };

  // TODO: should be taken from selected item in store
  // const [layerToPresent, setLayerToPresent] = useState<ILayerImage | null>(null);
  // useEffect(() => {
  //   // @ts-ignore
  //   setLayerToPresent(store.discreteLayersStore.highlightedLayer); 
  // }, [store.discreteLayersStore.highlightedLayer]);
  
  // const layerToPresent = store.discreteLayersStore.highlightedLayer;
  // const layerToPresent = (store.discreteLayersStore !== null && store.discreteLayersStore.layersImages !== undefined) ? store.discreteLayersStore.layersImages[0] : null;
  const layerToPresent = store.discreteLayersStore.selectedLayer;
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
                onClick={(evt): void => handleTabViewChange(tab.idx)}
                style={{ 
                  backgroundColor: (activeTabView === tab.idx ? theme.custom?.GC_SELECTION_BACKGROUND : theme.custom?.GC_ALTERNATIVE_SURFACE) as string, 
                }}
                theme={[activeTabView === tab.idx ? 'onPrimary' : 'onSurface']}
              />;
            })}
          </Box>
        </Box>

        <Box className="headerSearchOptionsContainer">
          <PolygonSelectionUi
            onCancelDraw={(): void=>{ console.log('****** onCancelDraw  **** called')}}
            onReset={handlePolygonReset}
            onStartDraw={setDrawType}
            isSelectionEnabled={isDrawing}
            onPolygonUpdate={onPolygonSelection}
          />
        </Box>
      </Box>
      <Box className="mainViewContainer">
        <Box className="sidePanelParentContainer">
          <Box 
            className="sidePanelContainer"
            style={{
              backgroundColor: theme.custom?.GC_ALTERNATIVE_SURFACE as string,
              height: detailsPanelExpanded ? '50%': '75%'
            }}
          >
            <Box className="tabContentContainer" style={{display: activeTabView === TabViews.CATALOG ? 'block': 'none'}}>
              {
                getActiveTabHeader(activeTabView)
              }
              <Home />
            </Box>

            <Box className="tabContentContainer"  style={{display: activeTabView === TabViews.SEARCH_RESULTS ? 'block': 'none'}}>
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
            backgroundColor: theme.custom?.GC_ALTERNATIVE_SURFACE as string,
            height: detailsPanelExpanded ? '50%': '25%',
          }}>
            <Box style={{display: 'flex', paddingTop: '8px'}}>
              <Typography use="headline6" tag="div" className="detailsTitle">
                {layerToPresent?.productName}
              </Typography>
              <IconButton 
                className={`operationIcon ${!detailsPanelExpanded ? 'mc-icon-Expand-Panel': 'mc-icon-Collapce-Panel'}`}
                label="EXPANDER"
                onClick={ (): void => {setDetailsPanelExpanded(!detailsPanelExpanded)}}
              />
            </Box>
            <Box className="detailsContent">
              <LayersDetailsComponent layerRecord={layerToPresent} isBrief={!detailsPanelExpanded}/>
            </Box>
          </Box>
        </Box>
        
        <Box className="mapAppContainer">
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
