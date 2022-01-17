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
    VectorBestRecordModel
  } from '../../models';

// eslint-disable-next-line @typescript-eslint/array-type
export type LayerDemRecordModelArray = Array<keyof LayerDemRecordModelType>;
// eslint-disable-next-line @typescript-eslint/array-type
export type Layer3DRecordModelArray = Array<keyof Layer3DRecordModelType>;
// eslint-disable-next-line @typescript-eslint/array-type
export type LayerRasterRecordModelArray = Array<keyof LayerRasterRecordModelType>;
// eslint-disable-next-line @typescript-eslint/array-type
export type BestRecordModelArray = Array<keyof BestRecordModelType>;
// eslint-disable-next-line @typescript-eslint/array-type
export type VectorBestRecordModelArray = Array<keyof VectorBestRecordModelType>;
// eslint-disable-next-line @typescript-eslint/array-type
export type FieldConfigModelArray = Array<keyof FieldConfigModelType>;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const LayerDemRecordModelKeys: LayerDemRecordModelArray = Object.keys(LayerDemRecordModel.properties) as LayerDemRecordModelArray;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Layer3DRecordModelKeys: Layer3DRecordModelArray = Object.keys(Layer3DRecordModel.properties) as Layer3DRecordModelArray;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const LayerRasterRecordModelKeys: LayerRasterRecordModelArray = Object.keys(LayerRasterRecordModel.properties) as LayerRasterRecordModelArray;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const BestRecordModelKeys: BestRecordModelArray = Object.keys(BestRecordModel.properties) as BestRecordModelArray;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const VectorBestRecordModelKeys: VectorBestRecordModelArray = Object.keys(VectorBestRecordModel.properties) as VectorBestRecordModelArray;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const FieldConfigModelKeys: FieldConfigModelArray = Object.keys(FieldConfigModel.properties) as FieldConfigModelArray;
