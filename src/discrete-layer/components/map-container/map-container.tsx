import React, { useState } from 'react';
import { Feature, Polygon } from 'geojson';
import { DrawType } from '@map-colonies/react-components';
import { useTheme } from '@map-colonies/react-core';
import { PolygonSelectionUi } from './polygon-selection-ui';
import { MapWrapper } from './map-wrapper';
import './map-container.css';

// CESIUM START 
import { CesiumMap, 
        CesiumDrawingsDataSource,
        CesiumColor,
        CesiumSceneMode,
        Proj,
        IDrawingEvent,
        IDrawing
       } from '@map-colonies/react-components';

interface IDrawingObject {
  type: DrawType;
  handler: (drawing: IDrawingEvent) => void;
}
// CESIUM END

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
  const [drawPrimitive, setDrawPrimitive] = useState<IDrawingObject>({
    type: DrawType.UNKNOWN,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    handler: (drawing: IDrawingEvent) => {},
  });
  const [drawEntities, setDrawEntities] = useState<IDrawing[]>([
    {
      coordinates: [],
      name: '',
      id: '',
      type: DrawType.UNKNOWN,
    },
  ]);
  
  const getTimeStamp = (): string => new Date().getTime().toString();

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

  // const [drawType, setDrawType] = useState<DrawType>();
  // const [selectionPolygon, setSelectionPolygon] = useState<Polygon>();
  const theme = useTheme();
  
  const onPolygonSelection = (polygon: IDrawingEvent): void => {
    // setSelectionPolygon(polygon);
    // setDrawType(undefined); 

    const timeStamp = getTimeStamp();
    setDrawEntities([
      {
        coordinates: polygon.primitive,
        name: `${DrawType.BOX.toString()}_${timeStamp}`,
        id: timeStamp,
        type: DrawType.BOX,
        geojson: polygon.geojson,
      },
    ]);
    props.handlePolygonSelected((polygon.geojson as Feature).geometry as Polygon); 
  };

  const onReset = (): void => {
    // setSelectionPolygon(undefined);
    props.handlePolygonReset();
  };

  const onCancelDraw = (): void => {
    setIsDrawing(false);
    setDrawPrimitive({
      type: DrawType.UNKNOWN,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      handler: (drawing: IDrawingEvent) => {}
    });
  };


  return (
    <div className="map">
      <div className="filtersPosition" style={{backgroundColor: theme.primary, width: props.mapActionsWidth}}>
        <div className="filtersContainer">
          <PolygonSelectionUi
            onCancelDraw={onCancelDraw}
            onReset={onReset}
            onStartDraw={setDrawType}
            // isSelectionEnabled={drawType !== undefined}
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
        projection={Proj.WGS84}  
        center={[34.9578094, 32.8178637]}
        zoom={8}
        sceneMode={CesiumSceneMode.SCENE2D}
      >
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


// export const MapContainerOL: React.FC<MapContainerProps> = (props) => {
//   const [drawType, setDrawType] = useState<DrawType>();
//   const [selectionPolygon, setSelectionPolygon] = useState<Polygon>();
//   const theme = useTheme();
  
//   const onPolygonSelection = (polygon: Polygon): void => {
//     setSelectionPolygon(polygon);
//     setDrawType(undefined);
//     props.handlePolygonSelected(polygon);
//   };

//   const onReset = (): void => {
//     setSelectionPolygon(undefined);
//     props.handlePolygonReset();
//   };

//   return (
//     <div className="map">
//       <div className="filtersPosition" style={{backgroundColor: theme.primary, width: props.mapActionsWidth}}>
//         <div className="filtersContainer">
//           <PolygonSelectionUi
//             onCancelDraw={(): void => setDrawType(undefined)}
//             onReset={onReset}
//             onStartDraw={setDrawType}
//             isSelectionEnabled={drawType !== undefined}
//             onPolygonUpdate={onPolygonSelection}
//             mapActionsWidth = {props.mapActionsWidth}
//             handleOtherDrawers={props.handleOtherDrawers}
//           />
//           {props.filters?.map((filter, index) => (
//             <div key={index} className="filtersMargin">
//               {filter}
//             </div>
//           ))}
//         </div>
//       </div>
//       <MapWrapper
//         children={props.mapContent}
//         onPolygonSelection={onPolygonSelection}
//         drawType={drawType}
//         selectionPolygon={selectionPolygon}
//       />
//     </div>
//   );
// };
