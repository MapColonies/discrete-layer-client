import {
  CesiumCartesian3,
  CesiumCartographic,
  CesiumColor,
  CesiumConstantProperty,
  CesiumGeojsonLayer,
  CesiumMath,
} from '@map-colonies/react-components';
import center from '@turf/center';
import { points } from '@turf/helpers';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../models';

const SELECTION_POLYGON_OUTLINE_COLOR = '#22ABDD';
const SELECTION_POLYGON_OPACITY = 0.5;
const SELECTION_POLYGON_LINE_WIDTH = 2;

const ExportPolygonsRenderer: React.FC = observer(() => {
  const store = useStore();
  const exportGeometrySelections =
    store.exportStore.geometrySelectionsCollection;
  return (
    <CesiumGeojsonLayer
      data={exportGeometrySelections}
      onLoad={(geoJsonDataSource): void => {
        console.log(geoJsonDataSource);

        geoJsonDataSource.entities.values.forEach((item) => {
          if (item.polygon) {
            // @ts-ignore
            (item.polygon.outlineColor as CesiumConstantProperty).setValue(CesiumColor.fromCssColorString(SELECTION_POLYGON_OUTLINE_COLOR));
            (item.polygon.outlineWidth as CesiumConstantProperty).setValue(SELECTION_POLYGON_LINE_WIDTH);
            
            // @ts-ignore
            item.polygon.material = CesiumColor.CYAN.withAlpha(SELECTION_POLYGON_OPACITY);

            const centerInDegrees = center(
              points(
                // @ts-ignore
                ((item.polygon.hierarchy.getValue() as Record<string, unknown>)
                  .positions as CesiumCartesian3[]).map((pos) => {
                  const cartographicPos = CesiumCartographic.fromCartesian(pos);
                  return [
                    CesiumMath.toDegrees(cartographicPos.latitude),
                    CesiumMath.toDegrees(cartographicPos.longitude),
                  ];
                })
              )
            ).geometry.coordinates;

            // @ts-ignore
            item.position = CesiumCartesian3.fromDegrees(centerInDegrees[1], centerInDegrees[0]); // [lon, lat]

            const label = {
              text: 'ZOOM LEVEL HERE',
              font: '12px Roboto, Helvetica, Arial, sans-serif',
              fillColor: CesiumColor.WHITE,
              outlineColor: CesiumColor.BLACK,
              outlineWidth: 2,
              showBackground: true,
            };

            // @ts-ignore
            item.label = label;
          }
        });
      }}
    />
  );
});

export default ExportPolygonsRenderer;
