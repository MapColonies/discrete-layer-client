/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState, useEffect } from 'react';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';
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
  CesiumGeographicTilingScheme,
  CesiumPolylineDashMaterialProperty,
} from '@map-colonies/react-components';
import { IconButton, useTheme, Typography, Fab } from '@map-colonies/react-core';
import { Geometry, Feature, FeatureCollection, Polygon, Point } from 'geojson';
import { find } from 'lodash';
import { lineString } from '@turf/helpers';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import { version } from '../../../package.json';
import CONFIG from '../../common/config';
import { Mode } from '../../common/models/mode.enum';
import { useQuery, useStore } from '../models/RootStore';
import { SelectedLayersContainer } from '../components/map-container/selected-layers-container';
import { HighlightedLayer } from '../components/map-container/highlighted-layer';
import { LayersFootprints } from '../components/map-container/layers-footprints';
import { PolygonSelectionUi } from '../components/map-container/polygon-selection-ui_2';
import { LayersResultsComponent } from '../components/layers-results/layers-results';
import { Filters } from '../components/filters/filters';
import { LayersDetailsComponent } from '../components/layer-details/layer-details';
import { ILayerImage } from '../models/layerImage';
import { CatalogTreeComponent } from '../components/catalog-tree/catalog-tree';
import { EntityDialogComponent } from '../components/layer-details/entity-dialog';
import { SystemJobsComponent } from '../components/system-status/jobs-dialog';
import { EntityDescriptorModelType, RecordType } from '../models';

import '@material/tab-bar/dist/mdc.tab-bar.css';
import '@material/tab/dist/mdc.tab.css';
import '@material/tab-scroller/dist/mdc.tab-scroller.css';
import '@material/tab-indicator/dist/mdc.tab-indicator.css';
import './discrete-layer-view.css';

type LayerType = 'WMTS_LAYER' | 'WMS_LAYER' | 'XYZ_LAYER' | 'OSM_LAYER';
const DRAWING_MATERIAL_OPACITY = 0.5;
const DRAWING_FINAL_MATERIAL_OPACITY = 0.8;
const DRAWING_MATERIAL_COLOR = CesiumColor.YELLOW.withAlpha(DRAWING_MATERIAL_OPACITY);
const DRAWING_FINAL_MATERIAL = new CesiumPolylineDashMaterialProperty({
  color: CesiumColor.DARKSLATEGRAY.withAlpha(DRAWING_FINAL_MATERIAL_OPACITY), //new CesiumColor( 116, 135, 136, 1),
  dashLength: 5
});
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
    },
    {
      id: '4th',
      title: '4th MapProxy',
      isCurrent: true,
      thumbnail: '',
      baseRasteLayers: [
        {
          id: 'AZURE_RASTER_WMTS_FULL_IL',
          type:  'WMTS_LAYER' as LayerType,
          opacity: 1,
          zIndex: 0,
          options: {
            url: 'http://map-raster.apps.v0h0bdx6.eastus.aroapp.io/wmts/full_il/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png',
            format : 'image/png',
            layer: 'full_il',
            style: 'default',
            tileMatrixSetID: 'newGrids',
            tilingScheme: new CesiumGeographicTilingScheme()
          }
        },
        {
          id: 'AZURE_RASTER_WMTS_BLUEMARBEL_IL',
          type:  'WMTS_LAYER' as LayerType,
          opacity: 1,
          zIndex: 0,
          options: {
            url : 'http://map-raster.apps.v0h0bdx6.eastus.aroapp.io/wmts/bluemarble_il/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png',
            layer : 'bluemarble_il',
            style : 'default',
            format : 'image/png',
            tileMatrixSetID : 'newGrids',
            tilingScheme: new CesiumGeographicTilingScheme()
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
  const descriptorsQuery = useQuery((store) => store.queryEntityDescriptors({},
    ` type
    categories {
      category
      categoryTitle
      fields { 
        fieldName
        label
        fullWidth
        isManuallyEditable
        isRequired
        isAutoGenerated
        enumValues {
          dictionary 
        }
        subFields {
          fieldName
          label
          fullWidth
          isManuallyEditable
          isRequired
          isAutoGenerated
          enumValues {
            dictionary
          }
        }
      }
      __typename
    }`));
  const store = useStore();
  const theme = useTheme();
  const [center] = useState<[number, number]>(CONFIG.MAP.CENTER as [number, number]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isNewRasterEntityDialogOpen, setNewRasterEntityDialogOpen] = useState<boolean>(false);
  const [isNew3DEntityDialogOpen, setNew3DEntityDialogOpen] = useState<boolean>(false);
  const [isEditEntityDialogOpen, setEditEntityDialogOpen] = useState<boolean>(false);
  const [isSytemsJobsDialogOpen, setSytemsJobsDialogOpen] = useState<boolean>(false);
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

  useEffect(() => {
    if(!descriptorsQuery.loading){
      const descriptors = descriptorsQuery.data?.entityDescriptors as EntityDescriptorModelType[];
  
      store.discreteLayersStore.setEntityDescriptors([...descriptors]);
    }
  }, [descriptorsQuery.data, descriptorsQuery.loading, store.discreteLayersStore]);

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
      opts: {
        filter: filters
      }
    }));
  };

  const handlePolygonReset = (): void => {
    if(activeTabView === TabViews.SEARCH_RESULTS) {
      store.discreteLayersStore.searchParams.resetLocation();
      store.discreteLayersStore.clearLayersImages();
      store.discreteLayersStore.selectLayer(undefined);
  
      setDrawEntities([]);
    }
  };

  const handleNewRasterEntityDialogClick = (): void => {
    setNewRasterEntityDialogOpen(!isNewRasterEntityDialogOpen);
  };

  const handleNew3DEntityDialogClick = (): void => {
    setNew3DEntityDialogOpen(!isNew3DEntityDialogOpen);
  };

  const handleEditEntityDialogClick = (): void => {
    setEditEntityDialogOpen(!isEditEntityDialogOpen);
  };

  const handleSytemsJobsDialogClick = (): void => {
    setSytemsJobsDialogOpen(!isSytemsJobsDialogOpen);
  };


  const handleFilter = (): void => {
    setIsFilter(!isFilter);
  };

  const createDrawPrimitive = (type: DrawType): IDrawingObject => {
    return {
      type: type,
      handler: (drawing: IDrawingEvent): void => {
        const timeStamp = getTimeStamp();
        
        handleTabViewChange(TabViews.SEARCH_RESULTS);
        
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

      },
    };
  };
  
  const setDrawType = (drawType: DrawType): void =>{
    setIsDrawing(true);
    setDrawPrimitive(createDrawPrimitive(drawType));
  };

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

    handleTabViewChange(TabViews.SEARCH_RESULTS);
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
              className="operationIcon mc-icon-Search-History glow-missing-icon"
              label="NEW RASTER"
              onClick={ (): void => { handleNewRasterEntityDialogClick(); } }
            />
            {
              isNewRasterEntityDialogOpen && <EntityDialogComponent
                isOpen={isNewRasterEntityDialogOpen}
                onSetOpen={setNewRasterEntityDialogOpen}
                recordType={RecordType.RECORD_RASTER}>
              </EntityDialogComponent>
            }
            <IconButton
              className="operationIcon mc-icon-Bests glow-missing-icon"
              label="NEW 3D"
              onClick={ (): void => { handleNew3DEntityDialogClick(); } }
            />
            {
              isNew3DEntityDialogOpen && <EntityDialogComponent
                isOpen={isNew3DEntityDialogOpen}
                onSetOpen={setNew3DEntityDialogOpen}
                recordType={RecordType.RECORD_3D}>
              </EntityDialogComponent>
            }
            <IconButton 
              className="operationIcon mc-icon-Delete"
              label="DELETE"
            />
            <IconButton 
              className="operationIcon mc-icon-Filter"
              label="FILTER"
              onClick={ (): void => { handleFilter() } }
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
    store.discreteLayersStore.restoreTabviewData(targetViewIdx);
    setActiveTabView(targetViewIdx);
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
            <Box className="version">{version}</Box>
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

        <Box className="headerSystemAreaContainer">
          <IconButton
            className="operationIcon mc-icon-Search-History glow-missing-icon"
            label="SYTEM JOBS"
            onClick={ (): void => { handleSytemsJobsDialogClick() } }
          />
          {
            isSytemsJobsDialogOpen && <SystemJobsComponent
              isOpen={isSytemsJobsDialogOpen}
              onSetOpen={setSytemsJobsDialogOpen}>
            </SystemJobsComponent>
          }
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
              <PerfectScrollbar className="detailsContent">
                <CatalogTreeComponent />
              </PerfectScrollbar>
            </Box>

            {activeTabView === TabViews.SEARCH_RESULTS && <Box className="tabContentContainer">
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
            }
          </Box>
          
          <Box className="sidePanelContainer sideDetailsPanel" style={{
            backgroundColor: theme.custom?.GC_ALTERNATIVE_SURFACE as string,
            height: detailsPanelExpanded ? '50%': '25%',
          }}>
            <Box style={{display: 'flex', paddingTop: '8px'}}>
              <Typography use="headline6" tag="div" className="detailsTitle">
                {layerToPresent?.productName}
              </Typography>
              {
                layerToPresent && <IconButton
                  className="operationIcon mc-icon-Status-Approves glow-missing-icon"
                  label="EDIT"
                  onClick={ (): void => { handleEditEntityDialogClick(); } }
                />
              }
              {
                isEditEntityDialogOpen && <EntityDialogComponent
                  isOpen={isEditEntityDialogOpen}
                  onSetOpen={setEditEntityDialogOpen}
                  layerRecord={layerToPresent}>
                </EntityDialogComponent>
              }
              <IconButton 
                className={`operationIcon ${!detailsPanelExpanded ? 'mc-icon-Expand-Panel': 'mc-icon-Collapce-Panel'}`}
                label="EXPANDER"
                onClick={ (): void => {setDetailsPanelExpanded(!detailsPanelExpanded)}}
              />
            </Box>
            <PerfectScrollbar className="detailsContent">
              <LayersDetailsComponent layerRecord={layerToPresent} isBrief={!detailsPanelExpanded} mode={Mode.VIEW}/>
            </PerfectScrollbar>
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
                  drawings={activeTabView === TabViews.SEARCH_RESULTS ? drawEntities : []}
                  drawingMaterial={DRAWING_MATERIAL_COLOR}
                  drawState={{
                    drawing: isDrawing,
                    type: drawPrimitive.type,
                    handler: drawPrimitive.handler,
                  }}
                  hollow={true}
                  outlineWidth={2}
                  material={ (DRAWING_FINAL_MATERIAL as any) as CesiumColor }
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
