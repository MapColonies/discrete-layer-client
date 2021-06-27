import { CategoryConfigModelType, FieldConfigModelType } from '../../models';
import { Layer3DRecordModelType } from '../../models/Layer3DRecordModel';
import { LayerRasterRecordModelType } from '../../models/LayerRasterRecordModel';
import { LinkModelType } from '../../models/LinkModel';

export type FieldInfoName = keyof Layer3DRecordModelType | keyof LayerRasterRecordModelType | keyof LinkModelType;

export interface IRecordFieldInfo extends FieldConfigModelType {};

export interface IRecordCategoryFieldsInfo extends CategoryConfigModelType {};
