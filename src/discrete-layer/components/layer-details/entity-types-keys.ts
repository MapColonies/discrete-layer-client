/* eslint-disable @typescript-eslint/array-type */
/* eslint-disable @typescript-eslint/naming-convention */
import { 
    FieldConfigModelType,
    FieldConfigModel,
    Layer3DRecordModel,
    LayerRasterRecordModel,
    Layer3DRecordModelType,
    LayerRasterRecordModelType,
    BestRecordModelType,
    BestRecordModel,
    LayerDemRecordModelType,
    LayerDemRecordModel,
    VectorBestRecordModelType,
    VectorBestRecordModel,
    QuantizedMeshBestRecordModelType,
    QuantizedMeshBestRecordModel
  } from '../../models';

export type LayerDemRecordModelArray = Array<keyof LayerDemRecordModelType>;
export type Layer3DRecordModelArray = Array<keyof Layer3DRecordModelType>;
export type LayerRasterRecordModelArray = Array<keyof LayerRasterRecordModelType>;
export type BestRecordModelArray = Array<keyof BestRecordModelType>;
export type VectorBestRecordModelArray = Array<keyof VectorBestRecordModelType>;
export type QuantizedMeshBestRecordModelArray = Array<keyof QuantizedMeshBestRecordModelType>;
export type FieldConfigModelArray = Array<keyof FieldConfigModelType>;

export const LayerDemRecordModelKeys: LayerDemRecordModelArray = Object.keys(LayerDemRecordModel.properties) as LayerDemRecordModelArray;

export const Layer3DRecordModelKeys: Layer3DRecordModelArray = Object.keys(Layer3DRecordModel.properties) as Layer3DRecordModelArray;

export const LayerRasterRecordModelKeys: LayerRasterRecordModelArray = Object.keys(LayerRasterRecordModel.properties) as LayerRasterRecordModelArray;

export const BestRecordModelKeys: BestRecordModelArray = Object.keys(BestRecordModel.properties) as BestRecordModelArray;

export const VectorBestRecordModelKeys: VectorBestRecordModelArray = Object.keys(VectorBestRecordModel.properties) as VectorBestRecordModelArray;

export const QuantizedMeshBestRecordModelKeys: QuantizedMeshBestRecordModelArray = Object.keys(QuantizedMeshBestRecordModel.properties) as QuantizedMeshBestRecordModelArray;

export const FieldConfigModelKeys: FieldConfigModelArray = Object.keys(FieldConfigModel.properties) as FieldConfigModelArray;
