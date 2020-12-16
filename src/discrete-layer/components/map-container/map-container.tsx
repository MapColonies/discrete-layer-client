import React, { useState } from 'react';
import { Feature, FeatureCollection, Point, Polygon } from 'geojson';
import { find } from 'lodash';
import { lineString } from '@turf/helpers';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import { 
  DrawType, 
  BboxCorner,
  CesiumMap, 
  CesiumDrawingsDataSource,
  CesiumColor,
  CesiumSceneMode,
  IDrawingEvent,
  IDrawing
} from '@map-colonies/react-components';
import { useTheme } from '@map-colonies/react-core';
import CONFIG from '../../../common/config';
import { PolygonSelectionUi } from './polygon-selection-ui';
import './map-container.css';
import { MOCK_DATA_IMAGERY_LAYERS_ISRAEL } from '../../../__mocks-data__/search-results.mock';
import { CesiumXYZLayer } from '@map-colonies/react-components/dist/cesium-map/layers/xyz.layer';

interface IDrawingObject {
  type: DrawType;
  handler: (drawing: IDrawingEvent) => void;
}

const getTimeStamp = (): string => new Date().getTime().toString();
const noDrawing: IDrawingObject = {
  type: DrawType.UNKNOWN,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handler: (drawing: IDrawingEvent) => {},
};
const DRAWING_MATERIAL_OPACITY = 0.5;
const DRAWING_MATERIAL_COLOR = CesiumColor.YELLOW.withAlpha(DRAWING_MATERIAL_OPACITY);
const DRAWING_OUTLINE_COLOR = CesiumColor.AQUA;

export interface MapContainerProps {
  handlePolygonSelected: (polygon: Polygon) => void;
  handlePolygonReset: () => void;
  handleOtherDrawers: () => void;
  mapActionsWidth: string;
  mapContent?: React.ReactNode;
  filters?: React.ReactNode[];
}

export const MapContainer: React.FC<MapContainerProps> = (props) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawPrimitive, setDrawPrimitive] = useState<IDrawingObject>(noDrawing);
  const [drawEntities, setDrawEntities] = useState<IDrawing[]>([
    {
      coordinates: [],
      name: '',
      id: '',
      type: DrawType.UNKNOWN,
    },
  ]);
  const theme = useTheme();
  const [center] = useState<[number, number]>(CONFIG.MAP.CENTER as [number, number]);
  // const [showDefaulImagery] = useState<false | undefined>(CONFIG.ACTIVE_LAYER === 'OSM_LAYER'? undefined: false);
  
  const createDrawPrimitive = (type: DrawType): IDrawingObject => {
    return {
      type: type,
      handler: (drawing: IDrawingEvent): void => {
        const timeStamp = getTimeStamp();

        setIsDrawing(false);

        props.handlePolygonSelected((drawing.geojson as Feature).geometry as Polygon);

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

    setDrawEntities([
      {
        coordinates: polygon.primitive,
        name: `${DrawType.BOX.toString()}_${timeStamp}`,
        id: timeStamp,
        type: DrawType.BOX,
        geojson: polygon.geojson,
      },
    ]);

    props.handlePolygonSelected((boxPolygon as Feature).geometry as Polygon); 
  };

  const onReset = (): void => {
    setDrawEntities([]);
    props.handlePolygonReset();
  };

  const onCancelDraw = (): void => {
    setIsDrawing(false);
    setDrawPrimitive(noDrawing);
  };

  const generateSelectedLayers = ():JSX.Element[] => {
    const arr = MOCK_DATA_IMAGERY_LAYERS_ISRAEL.map((layer)=>{
      return <CesiumXYZLayer key={layer.id} options={{url: layer.properties.url}}/>
    });

    return arr;
  };

  return (
    <div className="map">
      <div className="filtersPosition" style={{backgroundColor: theme.primary, width: props.mapActionsWidth}}>
        <div className="filtersContainer">
          <PolygonSelectionUi
            onCancelDraw={onCancelDraw}
            onReset={onReset}
            onStartDraw={setDrawType}
            isSelectionEnabled={isDrawing}
            onPolygonUpdate={onPolygonSelection}
            mapActionsWidth = {props.mapActionsWidth}
            handleOtherDrawers={props.handleOtherDrawers}
          />
          {props.filters?.map((filter, index) => (
            <div key={index} className="filtersMargin">
              {filter}
            </div>
          ))}
        </div>
      </div>
      <CesiumMap 
        projection={CONFIG.MAP.PROJECTION}  
        center={center}
        zoom={CONFIG.MAP.ZOOM}
        sceneMode={CesiumSceneMode.SCENE2D}
        imageryProvider={false}
      >
        {props.mapContent}
        {generateSelectedLayers()}
        <CesiumDrawingsDataSource
          drawings={drawEntities}
          material={DRAWING_MATERIAL_COLOR}
          outlineColor={DRAWING_OUTLINE_COLOR}
          drawState={{
            drawing: isDrawing,
            type: drawPrimitive.type,
            handler: drawPrimitive.handler,
          }}
        />
      </CesiumMap>
    </div>
  );
};
