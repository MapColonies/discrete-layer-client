/* eslint-disable @typescript-eslint/naming-convention */
import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import EnumsMapContext, { IEnumsMapType } from '../../../../common/contexts/enumsMap.context';
import { ProductType, RecordStatus } from '../../../models';
import { useQuery, useStore } from '../../../models/RootStore';

export const MCEnumsFetcher: React.FC = observer(() => {
  const store = useStore();
  const mcEnumsQuery = useQuery((store) => store.queryGetMcEnums());
  const { setEnumsMap } = useContext(EnumsMapContext);

  useEffect(() => {
    if (!mcEnumsQuery.loading && mcEnumsQuery.data) {
      const enums = { ...(mcEnumsQuery.data.getMcEnums).enums as IEnumsMapType };

      const { PUBLISHED, UNPUBLISHED } = RecordStatus;

      enums[PUBLISHED] = { ...enums[PUBLISHED], translationKey: `${enums[PUBLISHED].enumName}.${PUBLISHED.toLowerCase()}` };
      enums[UNPUBLISHED] = { ...enums[UNPUBLISHED], translationKey: `${enums[UNPUBLISHED].enumName}.${UNPUBLISHED.toLowerCase()}` };
      
      const {
        ORTHOPHOTO,
        ORTHOPHOTO_HISTORY,
        ORTHOPHOTO_BEST,
        RASTER_MAP,
        RASTER_MAP_BEST,
        RASTER_AID,
        RASTER_AID_BEST,
        RASTER_VECTOR,
        RASTER_VECTOR_BEST,
        VECTOR_BEST,
        DTM,
        DSM,
        QUANTIZED_MESH_DTM,
        QUANTIZED_MESH_DSM,
        QUANTIZED_MESH_DTM_BEST,
        QUANTIZED_MESH_DSM_BEST,
        PHOTO_REALISTIC_3D,
        POINT_CLOUD,
      } = ProductType;

      enums['LayerRasterRecord'] = { enumName: '', realValue: '', icon: 'mc-icon-Map-Orthophoto', translationKey: 'record-type.record_raster.label', parent: '', properties: {} };
      enums['Layer3DRecord'] = { enumName: '', realValue: '', icon: 'mc-icon-Map-3D', translationKey: 'record-type.record_3d.label', parent: '', properties: {} };
      enums['LayerDemRecord'] = { enumName: '', realValue: '', icon: 'mc-icon-Map-Terrain', translationKey: 'record-type.record_dem.label', parent: '', properties: {} };
      enums['QuantizedMeshBestRecord'] = { enumName: '', realValue: '', icon: 'mc-icon-Map-Terrain', translationKey: 'record-type.record_quantized_mesh.label', parent: '', properties: {} };
      enums[ORTHOPHOTO] = { ...enums[ORTHOPHOTO], icon: 'mc-icon-Map-Orthophoto', translationKey: 'product-type.orthophoto.label', parent: 'LayerRasterRecord' };
      enums[ORTHOPHOTO_HISTORY] = { ...enums[ORTHOPHOTO_HISTORY], icon: 'mc-icon-Map-Orthophoto', translationKey: 'product-type.orthophoto_history.label', parent: 'LayerRasterRecord' };
      enums[ORTHOPHOTO_BEST] = { ...enums[ORTHOPHOTO_BEST], icon: 'mc-icon-Map-Best-Orthophoto', translationKey: 'product-type.orthophoto_best.label', parent: 'LayerRasterRecord' };
      enums[RASTER_MAP] = { ...enums[RASTER_MAP], icon: 'mc-icon-Map-Raster', translationKey: 'product-type.raster_map.label', parent: 'LayerRasterRecord' };
      enums[RASTER_MAP_BEST] = { ...enums[RASTER_MAP_BEST], icon: 'mc-icon-Map-Best-Raster', translationKey: 'product-type.raster_map_best.label', parent: 'LayerRasterRecord' };
      enums[RASTER_AID] = { ...enums[RASTER_AID], icon: 'mc-icon-Map-Raster', translationKey: 'product-type.raster_aid.label', parent: 'LayerRasterRecord' };
      enums[RASTER_AID_BEST] = { ...enums[RASTER_AID_BEST], icon: 'mc-icon-Map-Best-Raster', translationKey: 'product-type.raster_aid_best.label', parent: 'LayerRasterRecord' };
      enums[RASTER_VECTOR] = { ...enums[RASTER_VECTOR], icon: 'mc-icon-Map-Vector', translationKey: 'product-type.raster_vector.label', parent: 'LayerRasterRecord' };
      enums[RASTER_VECTOR_BEST] = { ...enums[RASTER_VECTOR_BEST], icon: 'mc-icon-Map-Vector', translationKey: 'product-type.raster_vector_best.label', parent: 'LayerRasterRecord' };
      enums[VECTOR_BEST] = { ...enums[VECTOR_BEST], icon: 'mc-icon-Map-Vector', translationKey: 'product-type.vector_best.label', parent: 'LayerRasterRecord' };
      enums[DTM] = { ...enums[DTM], icon: 'mc-icon-Map-Terrain', translationKey: 'product-type.dtm.label', parent: 'LayerDemRecord' };
      enums[DSM] = { ...enums[DSM], icon: 'mc-icon-Map-Terrain', translationKey: 'product-type.dsm.label', parent: 'LayerDemRecord' };
      enums[QUANTIZED_MESH_DTM] = { ...enums[QUANTIZED_MESH_DTM], icon: 'mc-icon-Map-Terrain', translationKey: 'product-type.quantized_mesh_dtm.label', parent: 'LayerDemRecord' };
      enums[QUANTIZED_MESH_DSM] = { ...enums[QUANTIZED_MESH_DSM], icon: 'mc-icon-Map-Terrain', translationKey: 'product-type.quantized_mesh_dsm.label', parent: 'LayerDemRecord' };
      enums[QUANTIZED_MESH_DTM_BEST] = { ...enums[QUANTIZED_MESH_DTM_BEST], icon: 'mc-icon-Map-Terrain', translationKey: 'product-type.quantized_mesh_dtm_best.label', parent: 'QuantizedMeshBestRecord' };
      enums[QUANTIZED_MESH_DSM_BEST] = { ...enums[QUANTIZED_MESH_DSM_BEST], icon: 'mc-icon-Map-Terrain', translationKey: 'product-type.quantized_mesh_dsm_best.label', parent: 'QuantizedMeshBestRecord' };
      enums[PHOTO_REALISTIC_3D] = { ...enums[PHOTO_REALISTIC_3D], icon: 'mc-icon-Map-3D', translationKey: 'product-type.photo_realistic_3d.label', parent: 'Layer3DRecord' };
      enums[POINT_CLOUD] = { ...enums[POINT_CLOUD], icon: 'mc-icon-Map-3D', translationKey: 'product-type.point_cloud.label', parent: 'Layer3DRecord' };

      setEnumsMap(enums);
    }
  }, [mcEnumsQuery.data, mcEnumsQuery.loading, store.discreteLayersStore]);
  
  return null;
});
