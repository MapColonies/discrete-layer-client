import React, { useState } from 'react';
import { Feature, FeatureCollection, Point, Polygon } from 'geojson';
import { find } from 'lodash';
import * as turf from '@turf/helpers';
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

interface IDrawingObject {
  type: DrawType;
  handler: (drawing: IDrawingEvent) => void;
}

const getTimeStamp = (): string => new Date().getTime().toString();
const noDrawing: IDrawingObject = {
  type: DrawType.UNKNOWN,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handler: (drawing: IDrawingEvent) => {},
}

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
  
  const createDrawPrimitive = (type: DrawType): IDrawingObject => {
    return {
      type: type,
      handler: (drawing: IDrawingEvent): void => {
        const timeStamp = getTimeStamp();

        setIsDrawing(false);

        console.log('primitive-->',drawing.primitive, 'geometry-->', (drawing.geojson as Feature).geometry);
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
    const bottomLeftPoint = find((polygon.geojson as FeatureCollection<Point>).features, (feat)=>{
      return feat.properties?.type === BboxCorner.BOTTOM_LEFT;
    });
    const rightTopPoint = find((polygon.geojson as FeatureCollection<Point>).features, (feat)=>{
      return feat.properties?.type === BboxCorner.TOP_RIGHT;
    });
    const line = turf.lineString([
      [
        (bottomLeftPoint as Feature<Point>).geometry.coordinates[0],
        (bottomLeftPoint as Feature<Point>).geometry.coordinates[1]
      ],
      [
        (rightTopPoint as Feature<Point>).geometry.coordinates[0],
        (rightTopPoint as Feature<Point>).geometry.coordinates[1],
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
        center={CONFIG.MAP.CENTER as [number,number]}
        zoom={CONFIG.MAP.ZOOM}
        sceneMode={CesiumSceneMode.SCENE2D}
      >
        {props.mapContent}
        <CesiumDrawingsDataSource
          drawings={drawEntities}
          material={CesiumColor.YELLOW.withAlpha(0.5)}
          outlineColor={CesiumColor.AQUA}
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
