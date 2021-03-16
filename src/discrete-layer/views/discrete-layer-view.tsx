import React, { useMemo, useState } from 'react';
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
} from '@map-colonies/react-components';
import { Geometry, Feature, FeatureCollection, Polygon, Point } from 'geojson';
import { find } from 'lodash';
import { lineString } from '@turf/helpers';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import CONFIG from '../../common/config';
import { osmOptions, wmsOptions, wmtsOptions, xyzOptions } from '../../common/helpers/layer-options';
import { useStore } from '../models/rootStore';
import { MapContainer } from '../components/map-container';
import { IconButton, TabBar, Tab } from '@map-colonies/react-core';
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

const DRAWING_MATERIAL_OPACITY = 0.5;
const DRAWING_MATERIAL_COLOR = CesiumColor.YELLOW.withAlpha(DRAWING_MATERIAL_OPACITY);

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

const DiscreteLayerView: React.FC = () => {
  const { discreteLayersStore } = useStore();
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
      <SelectedLayersContainer/>
      <HighlightedLayer/>
      <LayersFootprints/>
    </>
  );
  }, [CONFIG.ACTIVE_LAYER]);

  const [activeTabView, setActiveTabView] = React.useState(0);

  const handlePolygonSelected = (geometry: Geometry): void => {
    discreteLayersStore.searchParams.setLocation(geometry);
    void discreteLayersStore.clearLayersImages();
    void discreteLayersStore.getLayersImages();
  };

  const handlePolygonReset = (): void => {
    discreteLayersStore.searchParams.resetLocation();
    discreteLayersStore.clearLayersImages();

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

  return (
    <>
      <div style={{height: '44px', display: 'flex', alignItems: 'center'}}>
        <TabBar
          activeTabIndex={activeTabView}
          onActivate={evt => setActiveTabView(evt.detail.index)}
          style={{width: '180px'}}
        >
          <Tab icon="star_border" />
          <Tab icon="favorite_border" />
        </TabBar>

        <div style={{paddingLeft: '400px'}}>
          <PolygonSelectionUi
            onCancelDraw={()=>{}}
            onReset={handlePolygonReset}
            onStartDraw={setDrawType}
            isSelectionEnabled={isDrawing}
            onPolygonUpdate={onPolygonSelection}
          />

          {/* <IconButton style={{width: '40px'}} icon="crop_square" label="Filter" onClick={ (): void => {setDrawType(DrawType.BOX)}}/>
          <IconButton style={{width: '40px'}} icon="format_shapes" label="Filter" onClick={ (): void => {setDrawType(DrawType.POLYGON)}}/>
          <IconButton style={{width: '40px'}} icon="settings_overscan" label="Filter" onClick={ (): void => {}}/>
          <IconButton style={{width: '40px'}} icon="delete" label="Filter" onClick={ handlePolygonReset }/> */}
        </div>

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
      
      </div>
      <div style={{display: 'flex', position: 'relative', height: 'calc(100vh - 44px)'}}>
        <div style={{width: '20%', height: '100%', backgroundColor: 'red', position: 'relative'}}>

          <IconButton style={{position: 'absolute', top: '20px', right: '20px', width: '40px'}} icon="filter_list" label="FILTER" onClick={ (): void => {handleFilter()}}/>
          
          <div style={{display: activeTabView === 0 ? 'block': 'none'}}>
            <h1>CATALOG</h1>
          </div>

          <div style={{display: activeTabView === 1 ? 'block': 'none'}}>
            <h1>
              SEARCH RESULTS
            </h1>
            <LayersResultsComponent 
              style={{height: '450px',width: '100%'}}
            />
          </div>

        </div>
        <div style={{left: '20%', width: '80%', position: 'absolute', height: '100%'}}>
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
        </div>      
        
        <Filters isFiltersOpened={isFilter} filtersView={activeTabView}/>

      </div>


    </>
  );
};

export default DiscreteLayerView;
