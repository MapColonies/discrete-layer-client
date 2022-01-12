import { 
  CategoryConfigModelType,
  FieldConfigModelType,
  Layer3DRecordModelType,
  LayerRasterRecordModelType,
  LinkModelType,
  BestRecordModelType,
  LayerDemRecordModelType,
} from '../../models';


export type FieldInfoName = keyof LayerDemRecordModelType | keyof Layer3DRecordModelType | keyof LayerRasterRecordModelType | keyof BestRecordModelType | keyof LinkModelType;
export interface IRecordFieldInfo extends FieldConfigModelType {};
export interface IRecordCategoryFieldsInfo extends CategoryConfigModelType {};

