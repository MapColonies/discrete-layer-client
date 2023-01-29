import { CesiumGeojsonLayer } from '@map-colonies/react-components';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../models';

const ExportPolygonsRenderer: React.FC = observer(() => {
  const store = useStore();
  const exportGeometrySelections = store.exportStore.geometrySelectionsCollection;
  return (
    <CesiumGeojsonLayer data={exportGeometrySelections} onLoad={(geoJsonDataSource): void => {
        console.log(geoJsonDataSource);
    }} />
  );
});


export default ExportPolygonsRenderer;