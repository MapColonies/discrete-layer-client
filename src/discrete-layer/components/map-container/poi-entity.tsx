import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import {
  CesiumCartesian3,
  CesiumCartographic,
  CesiumEntity,
  cesiumSampleTerrainMostDetailed,
  CesiumVerticalOrigin,
  useCesiumMap
} from '@map-colonies/react-components';

const DEFAULT_HEIGHT = 100;

interface PoiEntityProps {
  longitude: number;
  latitude: number;
}

export const PoiEntity: React.FC<PoiEntityProps> = ({longitude, latitude}) => {
  const intl = useIntl();
  const mapViewer = useCesiumMap();
  const [position, setPosition] = useState<CesiumCartesian3 | undefined>();
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [title] = useState(intl.formatMessage({ id: 'poi.dialog.description.title' }));
  const [longitudeStr] = useState(intl.formatMessage({ id: 'poi.dialog.description.longitude' }));
  const [latitudeStr] = useState(intl.formatMessage({ id: 'poi.dialog.description.latitude' }));
  const [heightStr] = useState(intl.formatMessage({ id: 'poi.dialog.description.height' }));

  useEffect(() => {
    // eslint-disable-next-line
    const promise = cesiumSampleTerrainMostDetailed(
      mapViewer.terrainProvider,
      // eslint-disable-next-line
      [ CesiumCartographic.fromDegrees(longitude, latitude) ]
    );
    // eslint-disable-next-line
    void promise.then(
      (updatedPositions) => {
        setHeight(updatedPositions[0].height);
      }
    );
    setPosition(CesiumCartesian3.fromDegrees(longitude, latitude, height));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [longitude, latitude, height]);

  return (
    <>
    {
      position !== undefined &&
      <CesiumEntity
        name={title}
        position={position}
        billboard={{
          verticalOrigin: CesiumVerticalOrigin.BOTTOM,
          scale: 0.7,
          image: 'assets/img/map-marker.gif',
        }}
        description={`
          ${longitudeStr}: ${position.x} </br>
          ${latitudeStr}: ${position.y} </br>
          ${heightStr}: <span style="font-weight: 500">${position.z}</span>
        `}
      />
    }
    </>
  );
};