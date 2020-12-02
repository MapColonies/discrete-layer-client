import React from 'react';
import { Geometry } from 'geojson';
import rewind from '@turf/rewind';
import { Polygon } from 'geojson';
import {
  Map,
  VectorSource,
  GeoJSONFeature,
  VectorLayer,
  DrawInteraction,
  DrawType,
} from '@map-colonies/react-components';
import './map-wrapper.css';

import { CesiumMap, CesiumDrawingsDataSource, CesiumColor, Proj } from '@map-colonies/react-components';

interface MapWrapperProps {
  drawType?: DrawType;
  selectionPolygon?: Polygon;
  onPolygonSelection: (polygon: Polygon) => void;
}

export const MapWrapper: React.FC<MapWrapperProps> = (props) => {
  const handlePolygonSelected = (geometry: Geometry): void => {
    const rewindedPolygon = rewind(geometry as Polygon);
    props.onPolygonSelection(rewindedPolygon);
  };

  return (
      <CesiumMap projection={Proj.WGS84}>
        <CesiumDrawingsDataSource
          drawings={[]}
          material={CesiumColor.YELLOW.withAlpha(0.5)}
          outlineColor={CesiumColor.AQUA}
          drawState={{
            drawing: false,
            type: DrawType.UNKNOWN,
            handler: ()=>{},
          }}
        />
      </CesiumMap>
    // <Map allowFullScreen={true} showMousePosition={true}>
    //   {props.selectionPolygon && (
    //     <VectorLayer>
    //       <VectorSource>
    //         <GeoJSONFeature geometry={props.selectionPolygon} />
    //       </VectorSource>
    //     </VectorLayer>
    //   )}
    //   {props.children}
    //   {props.drawType !== undefined && (
    //     <DrawInteraction
    //       drawType={props.drawType}
    //       onPolygonSelected={handlePolygonSelected}
    //     />
    //   )}
    // </Map>
  );
};
