/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState, useEffect } from 'react';
import { find, get } from 'lodash';
import { FormattedMessage, useIntl } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { observer } from 'mobx-react-lite';
import { Geometry, Feature, FeatureCollection, Polygon, Point } from 'geojson';
import { lineString } from '@turf/helpers';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import { 
  IconButton,
  useTheme,
  Typography,
  Fab,
  MenuSurfaceAnchor,
  MenuSurface,
  Tooltip,
  Drawer,
  DrawerContent,
  Avatar
} from '@map-colonies/react-core';
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
import { version } from '../../../package.json';
import CONFIG from '../../common/config';
import { Mode } from '../../common/models/mode.enum';
import { useQuery, useStore } from '../models/RootStore';
import { SelectedLayersContainer } from '../components/map-container/selected-layers-container';
import { HighlightedLayer } from '../components/map-container/highlighted-layer';
import { LayersFootprints } from '../components/map-container/layers-footprints';
import { PolygonSelectionUi } from '../components/map-container/polygon-selection-ui_2';
import { Filters } from '../components/filters/filters';
import { LayersDetailsComponent } from '../components/layer-details/layer-details';
import { ILayerImage } from '../models/layerImage';
import { CatalogTreeComponent } from '../components/catalog-tree/catalog-tree';
import { LayersResultsComponent } from '../components/layers-results/layers-results';
import { EntityDialogComponent } from '../components/layer-details/entity-dialog';
import { SystemJobsComponent } from '../components/system-status/jobs-dialog';
import { BestRecordModel, EntityDescriptorModelType, LayerMetadataMixedUnion, ProductType, RecordType } from '../models';
import { BestEditComponent } from '../components/best-management/best-edit';
import { BestRecordModelType } from '../models/BestRecordModel';
import { DiscreteOrder } from '../models/DiscreteOrder';
import { FilterField } from '../models/RootStore.base';
import { BestRecordModelKeys } from '../components/layer-details/layer-details.field-info';
import { BestLayersPresentor } from '../components/best-management/best-layers-presentor';
import { UserAction } from '../models/userStore';
import { TabViews } from './tab-views';

import '@material/tab-bar/dist/mdc.tab-bar.css';
import '@material/tab/dist/mdc.tab.css';
import '@material/tab-scroller/dist/mdc.tab-scroller.css';
import '@material/tab-indicator/dist/mdc.tab-indicator.css';
import './discrete-layer-view.css';
import { IDispatchAction } from '../models/actionDispatcherStore';
import { hasOwnProperty } from '../../common/helpers/object';

type LayerType = 'WMTS_LAYER' | 'WMS_LAYER' | 'XYZ_LAYER' | 'OSM_LAYER';
const START_IDX = 0;
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

const tileOptions = { opacity: 0.5 };

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
  const intl = useIntl();
  const [center] = useState<[number, number]>(CONFIG.MAP.CENTER as [number, number]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isNewRasterEntityDialogOpen, setNewRasterEntityDialogOpen] = useState<boolean>(false);
  const [isNew3DEntityDialogOpen, setNew3DEntityDialogOpen] = useState<boolean>(false);
  const [isEditEntityDialogOpen, setEditEntityDialogOpen] = useState<boolean>(false);
  const [isSystemsJobsDialogOpen, setSystemsJobsDialogOpen] = useState<boolean>(false);
  const [openNew, setOpenNew] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [tabsPanelExpanded, setTabsPanelExpanded] = useState<boolean>(false);
  const [detailsPanelExpanded, setDetailsPanelExpanded] = useState<boolean>(false);
  const [activeTabView, setActiveTabView] = useState(TabViews.CATALOG);
  const [drawPrimitive, setDrawPrimitive] = useState<IDrawingObject>(noDrawing);
  const [openImportFromCatalog, setOpenImportFromCatalog] = useState<boolean>(false);
  const [catalogRefresh, setCatalogRefresh] = useState<number>(START_IDX);
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
      <BestLayersPresentor/>
    </>
  );
  }, []);

  const layerToPresent = store.discreteLayersStore.selectedLayer;
  const editingBest = store.bestStore.editingBest;

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

  const handleTabViewChange = (targetViewIdx: TabViews): void => {
    if(activeTabView !== targetViewIdx){
      store.discreteLayersStore.setTabviewData(activeTabView);
      store.discreteLayersStore.restoreTabviewData(targetViewIdx);
  
      if(activeTabView === TabViews.CREATE_BEST){
        store.bestStore.preserveData();
        store.bestStore.resetData();
      }
  
      if(targetViewIdx === TabViews.CREATE_BEST){
        store.bestStore.restoreData();
      }
  
      setActiveTabView(targetViewIdx);
    }
  };

  useEffect(() => {
    if(editingBest !== undefined){
      handleTabViewChange(TabViews.CREATE_BEST);
    } else {
      handleTabViewChange(TabViews.CATALOG);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingBest]);

  const buildFilters =  (): FilterField[]  => {
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

  useEffect(()=>{
    if(store.actionDispatcherStore.action !== undefined){
      const { action, data } = store.actionDispatcherStore.action as IDispatchAction;
      console.log(`RESOVING ${action} EVENT`, data);

      switch(action){
        case 'BestRecord.edit':
          // @ts-ignore
          store.bestStore.editBest(data as BestRecordModelType);
          break;
        case 'LayerRasterRecord.edit':
        case 'Layer3DRecord.edit':
          // @ts-ignore        
          store.discreteLayersStore.selectLayer(data as LayerMetadataMixedUnion);
          setEditEntityDialogOpen(!isEditEntityDialogOpen);
          break
        default:
          break;
      }
    }
  }, [store.actionDispatcherStore.action, store.discreteLayersStore, store.bestStore]);

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
    if (activeTabView === TabViews.SEARCH_RESULTS) {
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

  const handleCreateBestDraft = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const record = {} as Record<string, any>;
    BestRecordModelKeys.forEach(key => {
      record[key as string] = undefined;
    });
    const timestamp = new Date().getTime().toString();
    record.id = 'DEFAULT_BEST_ID_' + timestamp;
    record.productName = 'DRAFT_OF_BEST_' + timestamp;
    record.productType = ProductType.BEST_ORTHOPHOTO;
    record.isDraft = true;
    record['__typename'] = BestRecordModel.properties['__typename'].name.replaceAll('"','');
    record.discretes = [
      {
        id: '6ac605c4-da38-11eb-8d19-0242ac130003',
        zOrder: 0
      },
      {
        id: '7c6dfeb2-da38-11eb-8d19-0242ac130003',
        zOrder: 1
      }
    ] as DiscreteOrder[];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    store.bestStore.saveDraft(record as BestRecordModelType);

    store.bestStore.editBest(record as BestRecordModelType);
  };

  const handleEditEntityDialogClick = (): void => {
    if (hasOwnProperty(layerToPresent as any,'isDraft')) {
      store.bestStore.editBest(layerToPresent as BestRecordModelType);
    } else {
      setEditEntityDialogOpen(!isEditEntityDialogOpen);
    }
  };

  const handleSystemsJobsDialogClick = (): void => {
    setSystemsJobsDialogOpen(!isSystemsJobsDialogOpen);
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
    },
    {
      idx: TabViews.CREATE_BEST,
      title: 'tab-views.create-best',
      iconClassName: 'mc-icon-Bests',
    }
  ];

  const permissions = useMemo(() => {
    return {
      isSystemsJobsAllowed: store.userStore.isActionAllowed(UserAction.ACTION_SYSTEMJOBS),
      isLayerRasterRecordIngestAllowed: store.userStore.isActionAllowed(UserAction.ENTITY_ACTION_LAYERRASTERRECORD_CREATE),
      isLayer3DRecordIngestAllowed: store.userStore.isActionAllowed(UserAction.ENTITY_ACTION_LAYER3DRECORD_CREATE),
      isBestRecordCreateAllowed: store.userStore.isActionAllowed(UserAction.ENTITY_ACTION_BESTRECORD_CREATE),
    }
  }, 
  [store.userStore]);

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
            {
              (tabIdx === TabViews.CATALOG) && 
                <Tooltip content={intl.formatMessage({ id: 'action.refresh.tooltip' })}>
                  <IconButton icon="autorenew" className="operationIcon" onClick={(): void => { setCatalogRefresh(catalogRefresh + 1) }}/>
                </Tooltip>
            }
            {
              (tabIdx === TabViews.CATALOG) && 
              (permissions.isLayerRasterRecordIngestAllowed || permissions.isLayer3DRecordIngestAllowed || permissions.isBestRecordCreateAllowed) && 
              <MenuSurfaceAnchor id="newContainer">
                <MenuSurface open={openNew} onClose={evt => setOpenNew(false)}>
                  {/* {
                    permissions.isLayerRasterRecordIngestAllowed && <Tooltip content={intl.formatMessage({ id: 'tab-views.catalog.actions.ingest_raster' })}>
                      <IconButton
                        className="operationIcon mc-icon-Search-History glow-missing-icon"
                        label="NEW RASTER"
                        onClick={ (): void => { setOpenNew(false); handleNewRasterEntityDialogClick(); } }
                      />
                    </Tooltip>
                  } */}
                  {
                    permissions.isLayer3DRecordIngestAllowed && <Tooltip content={intl.formatMessage({ id: 'tab-views.catalog.actions.ingest_3d' })}>
                      <IconButton
                        className="operationIcon mc-icon-Bests glow-missing-icon"
                        label="NEW 3D"
                        onClick={ (): void => { setOpenNew(false); handleNew3DEntityDialogClick(); } }
                      />
                    </Tooltip>
                  }
                  {
                    permissions.isBestRecordCreateAllowed && <Tooltip content={intl.formatMessage({ id: 'tab-views.catalog.actions.new_best' })}>
                      <IconButton
                        className="operationIcon mc-icon-Bests"
                        label="NEW BEST"
                        onClick={ (): void => { setOpenNew(false); handleCreateBestDraft(); } }
                      />
                    </Tooltip>
                  }                  
                </MenuSurface>
                <Tooltip content={intl.formatMessage({ id: 'action.operations.tooltip' })}>
                  <IconButton className="operationIcon mc-icon-Search-History glow-missing-icon" onClick={evt => setOpenNew(!openNew)}/>
                </Tooltip>
              </MenuSurfaceAnchor>
            }
            { 
            (tabIdx === TabViews.CREATE_BEST) && <>
              <Tooltip content={intl.formatMessage({ id: 'tab-views.best-edit.actions.add' })}>
                <IconButton
                  className="operationIcon glow-missing-icon"
                  icon="add"
                  label="NEW BEST"
                  onClick={ (): void => { setOpenImportFromCatalog(!openImportFromCatalog); } }
                />
              </Tooltip>
            </>
            }
            {/* <Tooltip content={intl.formatMessage({ id: 'action.delete.tooltip' })}>
              <IconButton 
                className="operationIcon mc-icon-Delete"
                label="DELETE"
              />
            </Tooltip> */}
            <Tooltip content={intl.formatMessage({ id: 'action.filter.tooltip' })}>
              <IconButton 
                className="operationIcon mc-icon-Filter"
                label="FILTER"
                onClick={ (): void => { handleFilter() } }
              />
            </Tooltip>
            <Tooltip content={intl.formatMessage({ id: `${!tabsPanelExpanded ? 'action.expand.tooltip' : 'action.collapse.tooltip'}` })}>
              <IconButton 
                className={`operationIcon ${!tabsPanelExpanded ? 'mc-icon-Arrows-Right' : 'mc-icon-Arrows-Left'}`}
                label="EXPANDER"
                onClick={ (): void => {setTabsPanelExpanded(!tabsPanelExpanded);}}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    );
  };
 
  const availableTabs = (editingBest !== undefined) ? tabViews : tabViews.filter((tab) => tab.idx !== TabViews.CREATE_BEST);

  return (
    <>
      <Box className="headerContainer">
        <Box className="headerViewsSwitcher">
          <Box style={{padding: '0 12px 0 12px'}}>
            <Typography use="body2">Catalog App</Typography>
            <Tooltip content={`${intl.formatMessage({ id: 'general.version.text' })} ${version}`}>
              <Box className="version">{version}</Box>
            </Tooltip>
          </Box>
          <Box className="headerViewsSwitcherContainer">
            {
              availableTabs.map((tab) => {
                return <Tooltip key={`tabView_${tab.idx}`} content={intl.formatMessage({ id: `action.${tab.title}.tooltip` })}>
                  <Fab 
                    key={tab.idx}
                    className={`${tab.iconClassName} tabViewIcon`}
                    mini 
                    onClick={(evt): void => handleTabViewChange(tab.idx)}
                    style={{ 
                      backgroundColor: (activeTabView === tab.idx ? theme.custom?.GC_SELECTION_BACKGROUND : theme.custom?.GC_ALTERNATIVE_SURFACE) as string, 
                    }}
                    theme={[activeTabView === tab.idx ? 'onPrimary' : 'onSurface']}
                  />
                </Tooltip>;
              })
            }
          </Box>
        </Box>

        <Box className="headerSearchOptionsContainer">
          <PolygonSelectionUi
            onCancelDraw={(): void=>{ console.log('****** onCancelDraw ****** called')}}
            onReset={handlePolygonReset}
            onStartDraw={setDrawType}
            isSelectionEnabled={isDrawing}
            onPolygonUpdate={onPolygonSelection}
          />
        </Box>

        <Box className="headerSystemAreaContainer">
          <Tooltip content={intl.formatMessage({ id: 'general.login-user.tooltip' },{user: store.userStore.user?.role})}>
            <Avatar className="avatar" name={store.userStore.user?.role} size="large" />
          </Tooltip>
          {
            permissions.isSystemsJobsAllowed && <Tooltip content={intl.formatMessage({ id: 'action.system-jobs.tooltip' })}>
              <IconButton
                className="operationIcon systemJobsIcon mc-icon-Search-History glow-missing-icon"
                label="SYSTEM JOBS"
                onClick={ (): void => { handleSystemsJobsDialogClick(); } }
              />
            </Tooltip>
          }
          {
            isSystemsJobsDialogOpen && <SystemJobsComponent
              isOpen={isSystemsJobsDialogOpen}
              onSetOpen={setSystemsJobsDialogOpen}>
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
              height: detailsPanelExpanded ? '50%' : '75%'
            }}
          >
            <Box className="tabContentContainer" style={{display: activeTabView === TabViews.CATALOG ? 'block': 'none'}}>
              {
                getActiveTabHeader(activeTabView)
              }
              <Box className="detailsContent" style={{ overflow: 'hidden'}}>
                <CatalogTreeComponent refresh={catalogRefresh}/>
              </Box>
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

            {activeTabView === TabViews.CREATE_BEST && <Box className="tabContentContainer">
              {
                getActiveTabHeader(activeTabView)
              }
              <Box 
                style={{
                  height: 'calc(100% - 50px)',
                  width: 'calc(100% - 8px)',
                  position: 'relative'
                }}
              >
                <BestEditComponent 
                  openImport={openImportFromCatalog} 
                  handleCloseImport={setOpenImportFromCatalog}
                  best={editingBest}/>
              </Box>
            </Box>
            }
          </Box>
          
          <Box className="sidePanelContainer sideDetailsPanel" style={{
            backgroundColor: theme.custom?.GC_ALTERNATIVE_SURFACE as string,
            height: detailsPanelExpanded ? '50%' : '25%',
          }}>
            <Box style={{display: 'flex', paddingTop: '8px'}}>
              <Typography use="headline6" tag="div" className="detailsTitle">
                {layerToPresent?.productName}
              </Typography>
              {
                layerToPresent && 
                store.userStore.isActionAllowed(`entity_action.${layerToPresent.__typename}.edit`) &&
                <Tooltip content={intl.formatMessage({ id: 'action.edit.tooltip' })}>
                  <IconButton
                    className="operationIcon mc-icon-Status-Approves glow-missing-icon"
                    label="EDIT"
                    onClick={ (): void => { handleEditEntityDialogClick(); } }
                  />
                </Tooltip>
              }
              {
                isEditEntityDialogOpen && <EntityDialogComponent
                  isOpen={isEditEntityDialogOpen}
                  onSetOpen={setEditEntityDialogOpen}
                  layerRecord={layerToPresent}>
                </EntityDialogComponent>
              }
              <Tooltip content={intl.formatMessage({ id: `${!detailsPanelExpanded ? 'action.expand.tooltip' : 'action.collapse.tooltip'}` })}>
                <IconButton 
                  className={`operationIcon ${!detailsPanelExpanded ? 'mc-icon-Expand-Panel' : 'mc-icon-Collapce-Panel'}`}
                  label="EXPANDER"
                  onClick={ (): void => {setDetailsPanelExpanded(!detailsPanelExpanded);}}
                />
              </Tooltip>
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
        {
          isNewRasterEntityDialogOpen && <EntityDialogComponent
            isOpen={isNewRasterEntityDialogOpen}
            onSetOpen={setNewRasterEntityDialogOpen}
            recordType={RecordType.RECORD_RASTER}>
          </EntityDialogComponent>
        }
        {
          isNew3DEntityDialogOpen && <EntityDialogComponent
            isOpen={isNew3DEntityDialogOpen}
            onSetOpen={setNew3DEntityDialogOpen}
            recordType={RecordType.RECORD_3D}>
          </EntityDialogComponent>
        }
      </Box>
    </>
  );
});

export default DiscreteLayerView;
