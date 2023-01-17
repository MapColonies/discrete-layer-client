/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { find, get } from 'lodash';
import { observer } from 'mobx-react-lite';
import { Geometry, Feature, FeatureCollection, Polygon, Point } from 'geojson';
import { lineString } from '@turf/helpers';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import { 
  IconButton,
  useTheme,
  Typography,
  MenuSurfaceAnchor,
  MenuSurface,
  Tooltip,
  Avatar
} from '@map-colonies/react-core';
import {
  BboxCorner,
  Box,
  CesiumColor,
  CesiumConstantProperty,
  CesiumDrawingsDataSource,
  CesiumGeojsonLayer,
  CesiumMap,
  CesiumPolylineDashMaterialProperty,
  CesiumRectangle,
  CesiumSceneMode,
  DrawType,
  IContextMenuData,
  IDrawing,
  IDrawingEvent
} from '@map-colonies/react-components';
import { IMapLegend } from '@map-colonies/react-components/dist/cesium-map/map-legend';
import CONFIG from '../../common/config';
// import { BrowserCompatibilityChecker } from '../../common/components/browser-compatibility-checker/browser-compatibility-checker';
import { LinkType } from '../../common/models/link-type.enum';
import { SelectedLayersContainer } from '../components/map-container/selected-layers-container';
import { HighlightedLayer } from '../components/map-container/highlighted-layer';
import { LayersFootprints } from '../components/map-container/layers-footprints';
import { PolygonSelectionUi } from '../components/map-container/polygon-selection-ui_2';
import { Filters } from '../components/filters/filters';
import { CatalogTreeComponent } from '../components/catalog-tree/catalog-tree';
import { LayersResultsComponent } from '../components/layers-results/layers-results';
import { EntityDialog } from '../components/layer-details/entity.dialog';
// import { BestRecordModelKeys } from '../components/layer-details/entity-types-keys';
import { JobsDialog } from '../components/job-manager/jobs.dialog';
import { BestEditComponent } from '../components/best-management/best-edit';
import { BestLayersPresentor } from '../components/best-management/best-layers-presentor';
import {
  // BestRecordModel,
  LayerMetadataMixedUnion,
  LinkModelType,
  // ProductType,
  RecordType
} from '../models';
// import { BestRecordModelType } from '../models/BestRecordModel';
// import { DiscreteOrder } from '../models/DiscreteOrder';
import { ILayerImage } from '../models/layerImage';
import { useQuery, useStore } from '../models/RootStore';
import { FilterField } from '../models/RootStore.base';
import { UserAction, UserRole } from '../models/userStore';
import { BestMapContextMenu } from '../components/map-container/contextMenus/best-map-context-menu';
import { BBoxCorners } from '../components/map-container/bbox.dialog';
import { FlyTo } from '../components/map-container/fly-to';
import { ActionResolver } from './components/action-resolver.component';
import { DetailsPanel } from './components/details-panel.component';
import { IPOI } from '../components/map-container/poi.dialog';
import { PoiEntity } from '../components/map-container/poi-entity';
import { Terrain } from '../components/map-container/terrain';
import { SystemCoreInfoDialog } from '../components/system-status/system-core-info/system-core-info.dialog';
import { TabViewsSwitcher } from './components/tabs-views-switcher.component';
import AppTitle from './components/app-title/app-title.component';
import UserModeSwitch from './components/user-mode-switch/user-mode-switch.component';
import { TabViews } from './tab-views';

import '@material/tab-bar/dist/mdc.tab-bar.css';
import '@material/tab/dist/mdc.tab.css';
import '@material/tab-scroller/dist/mdc.tab-scroller.css';
import '@material/tab-indicator/dist/mdc.tab-indicator.css';

import './discrete-layer-view.css';
import { IDispatchAction } from '../models/actionDispatcherStore';
import { ActionsContextMenu } from '../components/map-container/contextMenus/actions.context-menu';
import useGetMenuProperties from '../../common/hooks/mapMenus/useGetMenuProperties.hook';
import { MapMenusIds } from '../models/mapMenusManagerStore';
import useGetMenuDimensions, { MenuDimensions } from '../../common/hooks/mapMenus/useGetMenuDimensions';
import { WfsFeature } from '../components/map-container/wfs-feature.component';

type LayerType = 'WMTS_LAYER' | 'WMS_LAYER' | 'XYZ_LAYER' | 'OSM_LAYER';
const START_IDX = 0;
const DELTA = 0.00001;
const DRAWING_MATERIAL_OPACITY = 0.5;
const DRAWING_FINAL_MATERIAL_OPACITY = 0.8;
const DRAWING_MATERIAL_COLOR = CesiumColor.YELLOW.withAlpha(DRAWING_MATERIAL_OPACITY);
const DRAWING_FINAL_MATERIAL = new CesiumPolylineDashMaterialProperty({
  color: CesiumColor.DARKSLATEGRAY.withAlpha(DRAWING_FINAL_MATERIAL_OPACITY), //new CesiumColor( 116, 135, 136, 1),
  dashLength: 5
});

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

const DiscreteLayerView: React.FC = observer(() => {
  // eslint-disable-next-line
  const { loading: searchLoading, error: searchError, data, query, setQuery } = useQuery();
  const store = useStore();
  const theme = useTheme();
  const intl = useIntl();
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isNewRasterEntityDialogOpen, setNewRasterEntityDialogOpen] = useState<boolean>(false);
  const [isNew3DEntityDialogOpen, setNew3DEntityDialogOpen] = useState<boolean>(false);
  const [isNewDemEntityDialogOpen, setNewDemEntityDialogOpen] = useState<boolean>(false);
  const [isEditEntityDialogOpen, setEditEntityDialogOpen] = useState<boolean>(false);
  const [isSystemsJobsDialogOpen, setSystemsJobsDialogOpen] = useState<boolean>(false);
  const [isSystemCoreInfoDialogOpen, setSystemCoreInfoDialogOpen] = useState<boolean>(false);
  const [openNew, setOpenNew] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [tabsPanelExpanded, setTabsPanelExpanded] = useState<boolean>(false);
  const [detailsPanelExpanded, setDetailsPanelExpanded] = useState<boolean>(false);
  const [activeTabView, setActiveTabView] = useState(TabViews.CATALOG);
  const [drawPrimitive, setDrawPrimitive] = useState<IDrawingObject>(noDrawing);
  const [openImportFromCatalog, setOpenImportFromCatalog] = useState<boolean>(false);
  const [catalogRefresh, setCatalogRefresh] = useState<number>(START_IDX);
  const [rect, setRect] = useState<CesiumRectangle | undefined>(undefined);
  const [poi, setPoi] = useState<IPOI | undefined>(undefined);
  const [corners, setCorners] = useState<BBoxCorners | undefined>(undefined);
  const [userRole, setUserRole] = useState<UserRole>(store.userStore.user?.role ?? CONFIG.DEFAULT_USER.ROLE);
  const [drawEntities, setDrawEntities] = useState<IDrawing[]>([{
    coordinates: [],
    name: '',
    id: '',
    type: DrawType.UNKNOWN,
  }]);

  const actionsMenuDynamicHeight = 30;
  const actionsContextMenuProperties = useGetMenuProperties(MapMenusIds.ActionsMenu);
  const actionsContextMenuDimensions = useGetMenuDimensions(MapMenusIds.ActionsMenu, actionsMenuDynamicHeight);
  
  useEffect(() => {
    store.discreteLayersStore.resetTabView([TabViews.SEARCH_RESULTS]);
    store.discreteLayersStore.clearLayersImages();

    store.discreteLayersStore.selectLayer(undefined);
    setDrawEntities([]);
    setPoi(undefined);
    setCorners(undefined);
  }, [store.discreteLayersStore.searchParams.geojson])

  const dispatchAction = (action: Record<string,unknown>): void => {
    store.actionDispatcherStore.dispatchAction(
      {
        action: action.action,
        data: action.data,
      } as IDispatchAction
    );
  };
  
  /* eslint-disable */
  const mapSettingsLocale = useMemo(() => ({
    MAP_SETTINGS_DIALOG_TITLE:  intl.formatMessage({ id: 'map-settings.dialog.title' }),
    MAP_SETTINGS_SCENE_MODE_TITLE: intl.formatMessage({ id: 'map-settings.base-map.scene-mode.title' }),
    MAP_SETTINGS_BASE_MAP_TITLE: intl.formatMessage({ id: 'map-settings.base-map.title' })
  }), [intl]);
  /* eslint-enable */

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

  useEffect(() => {
    const layers = get(data, 'search', []) as ILayerImage[];
    store.discreteLayersStore.setLayersImages([...layers]);
  }, [data, store.discreteLayersStore]);

  
  const handleTabViewChange = (targetViewIdx: TabViews): void => {
    if (activeTabView !== targetViewIdx) {
      store.discreteLayersStore.setTabviewData(activeTabView);
      store.discreteLayersStore.restoreTabviewData(targetViewIdx);
  
      if (activeTabView === TabViews.CREATE_BEST) {
        store.bestStore.preserveData();
        store.bestStore.resetData();
      }
  
      if (targetViewIdx === TabViews.CREATE_BEST) {
        store.bestStore.restoreData();
      }
  
      setActiveTabView(targetViewIdx);
    }
  };

  const buildFilters = (): FilterField[] => {
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

    // TODO: build query params: FILTERS and SORTS
    const filters = buildFilters();
    setQuery(store.querySearch({
      opts: {
        filter: filters
      },
      end: CONFIG.RUNNING_MODE.END_RECORD,
      start: CONFIG.RUNNING_MODE.START_RECORD,
    }));
  };

  const handlePolygonReset = (): void => {
    if (activeTabView === TabViews.SEARCH_RESULTS) {
      store.discreteLayersStore.searchParams.resetLocation();
    }

    store.mapMenusManagerStore.resetCurrentWfsFeatureInfo();
  };

  useEffect(() => {
    if(activeTabView !== TabViews.CATALOG) {
      handlePolygonReset();
      setActiveTabView(TabViews.CATALOG);
    }
  }, [userRole])

  const handleNewEntityDialogClick = (recordType: RecordType): void => {
    switch (recordType) {
      case RecordType.RECORD_RASTER:
        setNewRasterEntityDialogOpen(!isNewRasterEntityDialogOpen);
        break;
      case RecordType.RECORD_3D:
        setNew3DEntityDialogOpen(!isNew3DEntityDialogOpen);
        break;
      case RecordType.RECORD_DEM:
        setNewDemEntityDialogOpen(!isNewDemEntityDialogOpen);
        break;
      default:
        break;
    }
  };

  /*const handleCreateBestDraft = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const record = {} as Record<string, any>;
    BestRecordModelKeys.forEach(key => {
      record[key as string] = undefined;
    });
    const timestamp = new Date().getTime().toString();
    record.id = 'DEFAULT_BEST_ID_' + timestamp;
    record.type = RecordType.RECORD_RASTER;
    record.productName = 'DRAFT_OF_BEST_' + timestamp;
    record.productType = ProductType.ORTHOPHOTO_BEST;
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
    store.bestStore.editBest(record as BestRecordModelType);
    // @ts-ignore
    store.discreteLayersStore.selectLayer(record as LayerMetadataMixedUnion);
    setEditEntityDialogOpen(!isEditEntityDialogOpen);
  };*/

  const handleSystemsJobsDialogClick = (): void => {
    setSystemsJobsDialogOpen(!isSystemsJobsDialogOpen);
  };
  
  const handleSystemsCoreInfoDialogClick = (): void => {
    setSystemCoreInfoDialogOpen(!isSystemCoreInfoDialogOpen);
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
        handlePolygonSelected((drawing.geojson as Feature).geometry as Polygon);
        setIsDrawing(false);
        
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
  
  const setDrawType = (drawType: DrawType): void => {
    setIsDrawing(true);
    setDrawPrimitive(createDrawPrimitive(drawType));
  };

  const onPoiSelection = (lon: number, lat: number): void => {
    onPolygonSelection({
      primitive: undefined,
      type: DrawType.BOX,
      geojson: {
        type : 'FeatureCollection',
        features: [
          { 
            type : 'Feature',
            properties : {  
              type : BboxCorner.TOP_RIGHT,
            }, 
            geometry : { 
              type : 'Point',
              coordinates : [ lon + DELTA, lat + DELTA ] 
            }
          },
          { 
            type : 'Feature',
            properties : {  
              type : BboxCorner.BOTTOM_LEFT
            }, 
            geometry : { 
              type : 'Point',
              coordinates : [ lon - DELTA, lat - DELTA ]  
            }
          }
        ]
      }
    });
    setPoi({lon, lat});
  };

  const onPolygonSelection = (polygon: IDrawingEvent): void => {
    const timeStamp = getTimeStamp();
    const bottomLeftPoint = find((polygon.geojson as FeatureCollection<Point>).features, (feat: Feature<Point>)=>{
      return feat.properties?.type === BboxCorner.BOTTOM_LEFT;
    }) as Feature<Point>;
    const rightTopPoint = find((polygon.geojson as FeatureCollection<Point>).features, (feat: Feature<Point>)=>{
      return feat.properties?.type === BboxCorner.TOP_RIGHT;
    }) as Feature<Point>;
    setCorners({
      topRightLat: rightTopPoint.geometry.coordinates[1],
      topRightLon: rightTopPoint.geometry.coordinates[0],
      bottomLeftLat: bottomLeftPoint.geometry.coordinates[1],
      bottomLeftLon: bottomLeftPoint.geometry.coordinates[0],
    });
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
    
    handleTabViewChange(TabViews.SEARCH_RESULTS);

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
  };

  const onFlyTo = useCallback((): void => {
    setRect( new CesiumRectangle());
    dispatchAction({
      action: UserAction.SYSTEM_CALLBACK_FLYTO,
      data: { selectedLayer: store.discreteLayersStore.selectedLayer }
    });
  }, []);

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
      isSystemJobsAllowed: store.userStore.isActionAllowed(UserAction.SYSTEM_ACTION_JOBS),
      isSystemCoreInfoAllowed: store.userStore.isActionAllowed(UserAction.SYSTEM_ACTION_COREINFO),
      isSystemFilterEnabled: store.userStore.isActionAllowed(UserAction.SYSTEM_ACTION_FILTER),
      isSystemFreeTextSearchEnabled: store.userStore.isActionAllowed(UserAction.SYSTEM_ACTION_FREETEXTSEARCH),
      isSystemSidebarCollapseEnabled: store.userStore.isActionAllowed(UserAction.SYSTEM_ACTION_SIDEBARCOLLAPSEEXPAND),
      isLayerRasterRecordIngestAllowed: store.userStore.isActionAllowed(UserAction.ENTITY_ACTION_LAYERRASTERRECORD_CREATE),
      isLayer3DRecordIngestAllowed: store.userStore.isActionAllowed(UserAction.ENTITY_ACTION_LAYER3DRECORD_CREATE),
      isLayerDemRecordIngestAllowed: store.userStore.isActionAllowed(UserAction.ENTITY_ACTION_LAYERDEMRECORD_CREATE),
      isBestRecordCreateAllowed: store.userStore.isActionAllowed(UserAction.ENTITY_ACTION_BESTRECORD_CREATE),
      isBestRecordEditAllowed: store.userStore.isActionAllowed(UserAction.ENTITY_ACTION_BESTRECORD_EDIT),
    }
  }, [store.userStore.user]);

  const getActiveTabHeader = (tabIdx: number): JSX.Element => {

    const tabView = find(tabViews, (tab) => {
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
              label="TAB ICON"
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
              tabIdx === TabViews.CATALOG && 
              <Tooltip content={intl.formatMessage({ id: 'action.refresh.tooltip' })}>
                <IconButton className="operationIcon mc-icon-Refresh" onClick={(): void => { setCatalogRefresh(catalogRefresh + 1) }}/>
              </Tooltip>
            }
            {
              tabIdx === TabViews.CATALOG && 
              (permissions.isLayerRasterRecordIngestAllowed as boolean || permissions.isLayer3DRecordIngestAllowed || permissions.isLayerDemRecordIngestAllowed || permissions.isBestRecordCreateAllowed) && 
              <MenuSurfaceAnchor id="newContainer">
                <MenuSurface open={openNew} onClose={(evt): void => setOpenNew(false)}>
                  {
                    CONFIG.SERVED_ENTITY_TYPES.includes('RECORD_RASTER') &&
                    permissions.isLayerRasterRecordIngestAllowed &&
                    <Tooltip content={intl.formatMessage({ id: 'tab-views.catalog.actions.ingest_raster' })}>
                      <IconButton
                        className="operationIcon mc-icon-Map-Orthophoto"
                        label="NEW RASTER"
                        onClick={ (): void => { setOpenNew(false); handleNewEntityDialogClick(RecordType.RECORD_RASTER); } }
                      />
                    </Tooltip>
                  }
                  {
                    CONFIG.SERVED_ENTITY_TYPES.includes('RECORD_3D') &&
                    permissions.isLayer3DRecordIngestAllowed &&
                    <Tooltip content={intl.formatMessage({ id: 'tab-views.catalog.actions.ingest_3d' })}>
                      <IconButton
                        className="operationIcon mc-icon-Map-3D"
                        label="NEW 3D"
                        onClick={ (): void => { setOpenNew(false); handleNewEntityDialogClick(RecordType.RECORD_3D); } }
                      />
                    </Tooltip>
                  }
                  {
                    CONFIG.SERVED_ENTITY_TYPES.includes('RECORD_DEM') &&
                    permissions.isLayerDemRecordIngestAllowed &&
                    <Tooltip content={intl.formatMessage({ id: 'tab-views.catalog.actions.ingest_dem' })}>
                      <IconButton
                        className="operationIcon mc-icon-Map-Terrain"
                        label="NEW DEM"
                        onClick={ (): void => { setOpenNew(false); handleNewEntityDialogClick(RecordType.RECORD_DEM); } }
                      />
                    </Tooltip>
                  }
                  {/*
                    CONFIG.SERVED_ENTITY_TYPES.includes('RECORD_RASTER') &&
                    permissions.isBestRecordCreateAllowed &&
                    <Tooltip content={intl.formatMessage({ id: 'tab-views.catalog.actions.new_best' })}>
                      <IconButton
                        className="operationIcon mc-icon-Bests"
                        label="NEW BEST"
                        onClick={ (): void => {
                          setOpenNew(false);
                          handleCreateBestDraft();
                        } }
                      />
                    </Tooltip>
                  */}
                </MenuSurface>
                <Tooltip content={intl.formatMessage({ id: 'action.operations.tooltip' })}>
                  <IconButton className="operationIcon mc-icon-Property-1Add" onClick={(evt): void => setOpenNew(!openNew)}/>
                </Tooltip>
              </MenuSurfaceAnchor>
            }
            { 
              (tabIdx === TabViews.CREATE_BEST) && permissions.isBestRecordEditAllowed && 
              <>
                <Tooltip content={intl.formatMessage({ id: 'tab-views.best-edit.actions.edit' })}>
                  <IconButton
                    className="operationIcon mc-icon-Edit"
                    label="EDIT"
                    onClick={(): void => {
                      store.discreteLayersStore.selectLayer(undefined);
                      setEditEntityDialogOpen(!isEditEntityDialogOpen);
                    }}
                  />
                </Tooltip>
                <Tooltip content={intl.formatMessage({ id: 'tab-views.best-edit.actions.import' })}>
                  <IconButton
                    className="operationIcon mc-icon-Property-1Add"
                    label="ADD TO BEST"
                    onClick={ (): void => { setOpenImportFromCatalog(!openImportFromCatalog); } }
                  />
                </Tooltip>
              </>
            }
            {/*<Tooltip content={intl.formatMessage({ id: 'action.delete.tooltip' })}>
              <IconButton 
                className="operationIcon mc-icon-Delete"
                label="DELETE"
              />
            </Tooltip>*/}
            <Tooltip content={intl.formatMessage({ id: 'action.filter.tooltip' })}>
              <IconButton 
                className="operationIcon mc-icon-Filter"
                disabled={!(permissions.isSystemFilterEnabled as boolean)}
                label="FILTER"
                onClick={ (): void => { handleFilter(); } }
              />
            </Tooltip>
            <Tooltip content={intl.formatMessage({ id: `${!tabsPanelExpanded ? 'action.expand.tooltip' : 'action.collapse.tooltip'}` })}>
              <IconButton 
                className={`operationIcon ${!tabsPanelExpanded ? 'mc-icon-Arrows-Right' : 'mc-icon-Arrows-Left'}`}
                label="PANEL EXPANDER"
                disabled={!(permissions.isSystemSidebarCollapseEnabled as boolean)}
                onClick={ (): void => {setTabsPanelExpanded(!tabsPanelExpanded);}}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    );
  };

  const mapLegendsExtractor = useCallback((layers: (ILayerImage & { meta: unknown })[]): IMapLegend[] => {
    const legendDocProtocol = LinkType.LEGEND_DOC;
    const legendImgProtocol = LinkType.LEGEND_IMG;
    const legendObjProtocol = LinkType.LEGEND;
    const legendsProtocols = [legendDocProtocol, legendImgProtocol, legendObjProtocol];

    return layers.reduce((legendsList, cesiumLayer): IMapLegend[] => {
      if (typeof get(cesiumLayer.meta, 'layerRecord.links') !== 'undefined') {
        const cesiumLayerLinks = get(cesiumLayer,'meta.layerRecord.links') as LinkModelType[];

        const layerLegendLinks = cesiumLayerLinks.reduce((legendsByProtocol, link) => {
          const isLegendLink = legendsProtocols.includes(link.protocol as LinkType);

          if (isLegendLink) {
            return { ...legendsByProtocol, [link.protocol as LinkType]: link };
          }
          return legendsByProtocol;
        }, {} as Record<LinkType, LinkModelType>)
        
        const layerLegend: IMapLegend = {
          layer: get(cesiumLayer, 'meta.layerRecord.productName') as string,
          legend: get(cesiumLayer, 'layerLegendsLinks.LEGEND') as Record<string, unknown>[],
          legendDoc: get(layerLegendLinks,'LEGEND_DOC.url') as string,
          legendImg: get(layerLegendLinks,'LEGEND_IMG.url') as string,
        };
        
        const {legendDoc, legendImg} = layerLegend;

        const shouldAddLegend = typeof legendDoc !== 'undefined' || typeof legendImg !== 'undefined';

        if (!shouldAddLegend) {
          return legendsList;
        }

        return [...legendsList, layerLegend];
      }

      return legendsList;
    
    }, [] as IMapLegend[]);

  }, []);

  useEffect(() => {
    if (typeof store.userStore.user?.role !== 'undefined') {
      setUserRole(store.userStore.user.role);
    }
  }, [store.userStore.user]);

  const ContextMenuByTab: React.FC<IContextMenuData> = (props) => {
    if (activeTabView === TabViews.CREATE_BEST) {
      return <BestMapContextMenu {...props} entityTypeName="BestRecord" />;
    }
    // Should add global flag or find the proper condition to whether show the context menu or not.
    return <ActionsContextMenu {...props} menuItems={actionsContextMenuProperties?.itemsList}/>;
  };

  const getContextMenuSizeTab = (): MenuDimensions => {
    if (activeTabView === TabViews.CREATE_BEST) {
      return { height: 212, width: 260, dynamicHeightIncrement: 120 };
    }

    return actionsContextMenuDimensions as MenuDimensions;
  };
 
  return (
    <>
      <ActionResolver
        handleOpenEntityDialog = {setEditEntityDialogOpen}
        handleFlyTo = {onFlyTo}
      />
      <Box className="headerContainer">
        <Box className="headerViewsSwitcher">
          <Box style={{padding: '0 12px 0 12px'}}>
           <AppTitle />
          </Box>
          <TabViewsSwitcher
            handleTabViewChange = {handleTabViewChange}
            activeTabView = {activeTabView}
          />
        </Box>
        <Box className="headerSearchOptionsContainer">
          <PolygonSelectionUi
            onCancelDraw={(): void=>{ console.log('****** onCancelDraw ****** called')}}
            onReset={handlePolygonReset}
            onStartDraw={setDrawType}
            isSelectionEnabled={isDrawing}
            isSystemFreeTextSearchEnabled={(permissions.isSystemFreeTextSearchEnabled as boolean)}
            onPolygonUpdate={onPolygonSelection}
            onPoiUpdate={onPoiSelection}
            poi={poi}
            corners={corners}
          />
        </Box>
        <Box className="headerSystemAreaContainer">
          <Tooltip content={intl.formatMessage({ id: 'general.login-user.tooltip' }, { user: store.userStore.user?.role })}>
            <Avatar className="avatar" name={store.userStore.user?.role} size="large" />
          </Tooltip>
          <Box className="headerUserModeSwitchContainer">
            <UserModeSwitch userRole={userRole} setUserRole={store.userStore.changeUserRole}/>
          </Box>
          {
            permissions.isSystemJobsAllowed as boolean &&
            <Tooltip content={intl.formatMessage({ id: 'action.system-jobs.tooltip' })}>
              <IconButton
                className="operationIcon mc-icon-System-Missions"
                label="SYSTEM JOBS"
                onClick={ (): void => { handleSystemsJobsDialogClick(); } }
              />
            </Tooltip>
          }
          {
            permissions.isSystemCoreInfoAllowed as boolean &&
            <Tooltip content={intl.formatMessage({ id: 'action.system-core-info.tooltip' })}>
              <IconButton
                className="operationIcon mc-icon-System-Missions glow-missing-icon"
                label="SYSTEM CORE INFO"
                onClick={ (): void => { handleSystemsCoreInfoDialogClick(); } }
              />
            </Tooltip>
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
            <Box className="tabContentContainer" style={{display: activeTabView === TabViews.CATALOG ? 'block' : 'none'}}>
              {
                getActiveTabHeader(activeTabView)
              }
              <Box className="panelContent" style={{ overflow: 'hidden' }}>
                <CatalogTreeComponent refresh={catalogRefresh}/>
              </Box>
            </Box>
            {
              activeTabView === TabViews.SEARCH_RESULTS &&
              <Box className="tabContentContainer">
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
            {
              activeTabView === TabViews.CREATE_BEST &&
              <Box className="tabContentContainer">
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
                    handleCloseImport={setOpenImportFromCatalog}/>
                </Box>
              </Box>
            }
          </Box>
          <Box className="sidePanelContainer sideDetailsPanel" style={{
            backgroundColor: theme.custom?.GC_ALTERNATIVE_SURFACE as string,
            height: detailsPanelExpanded ? '50%' : '25%',
          }}>
            <DetailsPanel
              isEditEntityDialogOpen = {isEditEntityDialogOpen}
              setEditEntityDialogOpen = {setEditEntityDialogOpen}
              detailsPanelExpanded = {detailsPanelExpanded}
              setDetailsPanelExpanded = {setDetailsPanelExpanded} 
            />
          </Box>
        </Box>
        <Box className="mapAppContainer">
          <CesiumMap 
            projection={CONFIG.MAP.PROJECTION}  
            center={CONFIG.MAP.CENTER}
            zoom={CONFIG.MAP.ZOOM}
            sceneMode={CesiumSceneMode.SCENE2D}
            imageryProvider={false}
            locale = {mapSettingsLocale}
            baseMaps={store.discreteLayersStore.baseMaps}
            // @ts-ignore
            imageryContextMenu={<ContextMenuByTab />}
            imageryContextMenuSize={getContextMenuSizeTab()}
            legends={{
              mapLegendsExtractor,
              title: intl.formatMessage({ id: 'map-legends.sidebar-title' }),
              emptyText: intl.formatMessage({ id: 'map-legends.empty-text' }),
              actionsTexts: {
                docText: intl.formatMessage({ id: 'map-legends.actions.doc' }),
                imgText: intl.formatMessage({ id: 'map-legends.actions.img' }),
              }
            }}
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
                material={ (DRAWING_FINAL_MATERIAL as unknown) as CesiumColor }
              />
              <Terrain/>
              <WfsFeature />
              {
                poi && activeTabView === TabViews.SEARCH_RESULTS && <PoiEntity longitude={poi.lon} latitude={poi.lat}/>
              }
              {
                rect && <FlyTo setRect={setRect} layer={store.discreteLayersStore.selectedLayer as LayerMetadataMixedUnion}/>
              }
          </CesiumMap>
          {/* <BrowserCompatibilityChecker />  Should talk about if we need it or not anymore. */}
        </Box>

        <Filters isFiltersOpened={isFilter} filtersView={activeTabView}/>
        {
          isNewRasterEntityDialogOpen &&
          <EntityDialog
            isOpen={isNewRasterEntityDialogOpen}
            onSetOpen={setNewRasterEntityDialogOpen}
            recordType={RecordType.RECORD_RASTER}
          />
        }
        {
          isNew3DEntityDialogOpen &&
          <EntityDialog
            isOpen={isNew3DEntityDialogOpen}
            onSetOpen={setNew3DEntityDialogOpen}
            recordType={RecordType.RECORD_3D}
          />
        }
        {
          isNewDemEntityDialogOpen &&
          <EntityDialog
            isOpen={isNewDemEntityDialogOpen}
            onSetOpen={setNewDemEntityDialogOpen}
            recordType={RecordType.RECORD_DEM}
          />
        }
        {
          isSystemsJobsDialogOpen &&
          <JobsDialog
            isOpen={isSystemsJobsDialogOpen}
            onSetOpen={setSystemsJobsDialogOpen}
          />
        }
        {
          isSystemCoreInfoDialogOpen &&
          <SystemCoreInfoDialog
            isOpen={isSystemCoreInfoDialogOpen}
            onSetOpen={setSystemCoreInfoDialogOpen}
          />
        }
      </Box>
    </>
  );
});

export default DiscreteLayerView;
