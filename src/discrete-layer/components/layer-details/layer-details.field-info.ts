import { omit } from 'lodash';
import { 
  CategoryConfigModelType, 
  FieldConfigModelType, 
  Layer3DRecordModel, 
  LayerRasterRecordModel, 
  Layer3DRecordModelType, 
  LayerRasterRecordModelType, 
  LinkModelType, 
  BestRecordModelType,
  BestRecordModel,
} from '../../models';

export type FieldInfoName = keyof Layer3DRecordModelType | keyof LayerRasterRecordModelType | keyof BestRecordModelType | keyof LinkModelType;
export interface IRecordFieldInfo extends FieldConfigModelType {};
export interface IRecordCategoryFieldsInfo extends CategoryConfigModelType {};
// eslint-disable-next-line @typescript-eslint/array-type
type Layer3DRecordModelArray = Array<keyof Layer3DRecordModelType>;
// eslint-disable-next-line @typescript-eslint/array-type
type LayerRasterRecordModelArray = Array<keyof LayerRasterRecordModelType>;
// eslint-disable-next-line @typescript-eslint/array-type
type BestRecordModelArray = Array<keyof BestRecordModelType>;
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/naming-convention
export const Layer3DRecordModelKeys: Layer3DRecordModelArray = Object.keys(Layer3DRecordModel.properties) as Layer3DRecordModelArray;
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/naming-convention
export const LayerRasterRecordModelKeys: LayerRasterRecordModelArray = Object.keys(LayerRasterRecordModel.properties) as LayerRasterRecordModelArray;
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/naming-convention
export const BestRecordModelKeys: BestRecordModelArray = Object.keys(BestRecordModel.properties) as BestRecordModelArray;

export const cleanUpEntity = (
  data: Record<string,unknown>,
  entityKeys: BestRecordModelArray | LayerRasterRecordModelArray | Layer3DRecordModelArray): Record<string,unknown> => 
{
  const keysNotInModel = Object.keys(data).filter(key => {
    // @ts-ignore
    return !entityKeys.includes(key);
  });
  return omit(data, keysNotInModel);
};