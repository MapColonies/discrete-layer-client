import { ProductType } from '.';

// const {
//   ORTHOPHOTO,
//   ORTHOPHOTO_HISTORY,
//   ORTHOPHOTO_BEST,
//   RASTER_MAP,
//   RASTER_MAP_BEST,
//   RASTER_AID,
//   RASTER_AID_BEST,
//   RASTER_VECTOR,
//   RASTER_VECTOR_BEST,
//   VECTOR_BEST,
//   DTM,
//   DSM,
//   QUANTIZED_MESH_DTM,
//   QUANTIZED_MESH_DSM,
//   QUANTIZED_MESH_DTM_BEST,
//   QUANTIZED_MESH_DSM_BEST,
//   PHOTO_REALISTIC_3D,
//   POINT_CLOUD,
// } = ProductType;

// interface McEnumsValue {
//   enumName: string;
//   realValue: string;
//   icon: string,
//   translationKey: string;
//   parent: string;
//   properties: Record<string, unknown>;
// }

// interface McEnums {
//   [key: string]: McEnumsValue;
// }

// // A list of all catalog entity types & product types
// // Each entry is described by a triplet of:
// // icon, tooltip, parent
// // (order is important!)
// export const mcEnums: McEnums = {
//   'LayerRasterRecord': {enumName: '', realValue: '', icon: 'mc-icon-Map-Orthophoto', translationKey: 'record-type.record_raster.label', parent: '', properties: {}},
//   'Layer3DRecord': {enumName: '', realValue: '', icon: 'mc-icon-Map-3D', translationKey: 'record-type.record_3d.label', parent: '', properties: {}},
//   'LayerDemRecord': {enumName: '', realValue: '', icon: 'mc-icon-Map-Terrain', translationKey: 'record-type.record_dem.label', parent: '', properties: {}},
//   'QuantizedMeshBestRecord': {enumName: '', realValue: '', icon: 'mc-icon-Map-Terrain', translationKey: 'record-type.record_quantized_mesh.label', parent: '', properties: {}},
//   [ORTHOPHOTO]: {enumName: 'ProductType', realValue: 'Orthophoto', icon: 'mc-icon-Map-Orthophoto', translationKey: 'product-type.orthophoto.label', parent: 'LayerRasterRecord', properties: {}},
//   [ORTHOPHOTO_HISTORY]: {enumName: 'ProductType', realValue: 'OrthophotoHistory', icon: 'mc-icon-Map-Orthophoto', translationKey: 'product-type.orthophoto_history.label', parent: 'LayerRasterRecord', properties: {}},
//   [ORTHOPHOTO_BEST]: {enumName: 'ProductType', realValue: 'OrthophotoBest', icon: 'mc-icon-Map-Best-Orthophoto', translationKey: 'product-type.orthophoto_best.label', parent: 'LayerRasterRecord', properties: {}},
//   [RASTER_MAP]: {enumName: 'ProductType', realValue: 'RasterMap', icon: 'mc-icon-Map-Raster', translationKey: 'product-type.raster_map.label', parent: 'LayerRasterRecord', properties: {}},
//   [RASTER_MAP_BEST]: {enumName: 'ProductType', realValue: 'RasterMapBest', icon: 'mc-icon-Map-Best-Raster', translationKey: 'product-type.raster_map_best.label', parent: 'LayerRasterRecord', properties: {}},
//   [RASTER_AID]: {enumName: 'ProductType', realValue: 'RasterAid', icon: 'mc-icon-Map-Raster', translationKey: 'product-type.raster_aid.label', parent: 'LayerRasterRecord', properties: {}},
//   [RASTER_AID_BEST]: {enumName: 'ProductType', realValue: 'RasterAidBest', icon: 'mc-icon-Map-Best-Raster', translationKey: 'product-type.raster_aid_best.label', parent: 'LayerRasterRecord', properties: {}},
//   [RASTER_VECTOR]: {enumName: 'ProductType', realValue: 'RasterVector', icon: 'mc-icon-Map-Vector', translationKey: 'product-type.raster_vector.label', parent: 'LayerRasterRecord', properties: {}},
//   [RASTER_VECTOR_BEST]: {enumName: 'ProductType', realValue: 'RasterVectorBest', icon: 'mc-icon-Map-Vector', translationKey: 'product-type.raster_vector_best.label', parent: 'LayerRasterRecord', properties: {}},
//   [VECTOR_BEST]: {enumName: 'ProductType', realValue: 'VectorBest', icon: 'mc-icon-Map-Vector', translationKey: 'product-type.vector_best.label', parent: 'LayerRasterRecord', properties: {}},
//   [DTM]: {enumName: 'ProductType', realValue: 'DTM', icon: 'mc-icon-Map-Terrain', translationKey: 'product-type.dtm.label', parent: 'LayerDemRecord', properties: {}},
//   [DSM]: {enumName: 'ProductType', realValue: 'DSM', icon: 'mc-icon-Map-Terrain', translationKey: 'product-type.dsm.label', parent: 'LayerDemRecord', properties: {}},
//   [QUANTIZED_MESH_DTM]: {enumName: 'ProductType', realValue: 'QuantizedMeshDTM', icon: 'mc-icon-Map-Terrain', translationKey: 'product-type.quantized_mesh_dtm.label', parent: 'LayerDemRecord', properties: {}},
//   [QUANTIZED_MESH_DSM]: {enumName: 'ProductType', realValue: 'QuantizedMeshDSM', icon: 'mc-icon-Map-Terrain', translationKey: 'product-type.quantized_mesh_dsm.label', parent: 'LayerDemRecord', properties: {}},
//   [QUANTIZED_MESH_DTM_BEST]: {enumName: 'ProductType', realValue: 'QuantizedMeshDTMBest', icon: 'mc-icon-Map-Terrain', translationKey: 'product-type.quantized_mesh_dtm_best.label', parent: 'QuantizedMeshBestRecord', properties: {}},
//   [QUANTIZED_MESH_DSM_BEST]: {enumName: 'ProductType', realValue: 'QuantizedMeshDSMBest', icon: 'mc-icon-Map-Terrain', translationKey: 'product-type.quantized_mesh_dsm_best.label', parent: 'QuantizedMeshBestRecord', properties: {}},
//   [PHOTO_REALISTIC_3D]: {enumName: 'ProductType', realValue: '3DPhotoRealistic', icon: 'mc-icon-Map-3D', translationKey: 'product-type.photo_realistic_3d.label', parent: 'Layer3DRecord', properties: {}},
//   [POINT_CLOUD]: {enumName: 'ProductType', realValue: 'PointCloud', icon: 'mc-icon-Map-3D', translationKey: 'product-type.point_cloud.label', parent: 'Layer3DRecord', properties: {}},
// };
