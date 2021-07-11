import { 
  CategoryConfigModelType, 
  FieldConfigModelType, 
  Layer3DRecordModel, 
  LayerRasterRecordModel, 
  Layer3DRecordModelType, 
  LayerRasterRecordModelType, 
  LinkModelType 
} from '../../models';

export type FieldInfoName = keyof Layer3DRecordModelType | keyof LayerRasterRecordModelType | keyof LinkModelType;
export interface IRecordFieldInfo extends FieldConfigModelType {};
export interface IRecordCategoryFieldsInfo extends CategoryConfigModelType {};
// eslint-disable-next-line @typescript-eslint/array-type
type Layer3DRecordModelArray = Array<keyof Layer3DRecordModelType>;
// eslint-disable-next-line @typescript-eslint/array-type
type LayerRasterRecordModelArray = Array<keyof LayerRasterRecordModelType>;
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/naming-convention
export const Layer3DRecordModelKeys: Layer3DRecordModelArray = Object.keys(Layer3DRecordModel.properties) as Layer3DRecordModelArray;
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/naming-convention
export const LayerRasterRecordModelKeys: LayerRasterRecordModelArray = Object.keys(LayerRasterRecordModel.properties) as LayerRasterRecordModelArray;