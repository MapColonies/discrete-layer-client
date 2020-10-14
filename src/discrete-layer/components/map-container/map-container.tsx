import React, { useState } from 'react';
import { Polygon } from 'geojson';
import { DrawType } from  '@map-colonies/react-components'; 
import { PolygonSelectionUi } from './polygon-selection-ui';
import { MapWrapper } from './map-wrapper';
import './map-container.css';

export interface MapContainerProps {
  handlePolygonSelected: (polygon: Polygon) => void;
  handlePolygonReset: () => void;
  mapContent?: React.ReactNode;
  filters?: React.ReactNode[];
}

export const MapContainer: React.FC<MapContainerProps> = (
  props
) => {
  const [drawType, setDrawType] = useState<DrawType>();
  const [selectionPolygon, setSelectionPolygon] = useState<Polygon>();

  const onPolygonSelection = (polygon: Polygon): void => {
    setSelectionPolygon(polygon);
    setDrawType(undefined);
    props.handlePolygonSelected(polygon);
  };

  const onReset = (): void => {
    setSelectionPolygon(undefined);
    props.handlePolygonReset();
  };

  return (
    <div className="map">
      <div className="filtersPosition">
        <div className="filtersContainer">
          <PolygonSelectionUi
            onCancelDraw={(): void => setDrawType(undefined)}
            onReset={onReset}
            onStartDraw={setDrawType}
            isSelectionEnabled={drawType !== undefined}
            onPolygonUpdate={onPolygonSelection}
          />
          {props.filters?.map((filter, index) => (
            <div key={index} className="filtersMargin">
              {filter}
            </div>
          ))}
        </div>
      </div>
      <MapWrapper
        children={props.mapContent}
        onPolygonSelection={onPolygonSelection}
        drawType={drawType}
        selectionPolygon={selectionPolygon}
      />
    </div>
  );
};
