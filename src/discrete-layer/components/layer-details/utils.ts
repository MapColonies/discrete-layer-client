import { get } from 'lodash';
import { BestRecordModel,
  CategoryConfigModelType,
  EntityDescriptorModelType,
  FieldConfigModelType,
  Layer3DRecordModel,
  LayerMetadataMixedUnion,
  LayerRasterRecordModel,
  LinkModel
} from '../../models';
import { FieldInfoName, IRecordCategoryFieldsInfo } from './layer-details.field-info';

export const getEntityDescriptors = (layerRecord: LayerMetadataMixedUnion, entityDescriptors: EntityDescriptorModelType[]): IRecordCategoryFieldsInfo[] => {
  let entityDesc;
  switch(layerRecord.__typename){
    case 'Layer3DRecord':
      entityDesc = entityDescriptors.find(descriptor => descriptor.type === 'Pycsw3DCatalogRecord')
      break;
    case 'BestRecord':
      entityDesc = entityDescriptors.find(descriptor => descriptor.type === 'PycswBestCatalogRecord')
      break;
    default:
      entityDesc = entityDescriptors.find(descriptor => descriptor.type === 'PycswLayerCatalogRecord')
      break;
  }
  return get(entityDesc, 'categories') as IRecordCategoryFieldsInfo[];
};

export const getFlatEntityDescriptors = (layerRecord: LayerMetadataMixedUnion, entityDescriptors: EntityDescriptorModelType[]): FieldConfigModelType[] => {
  const descriptors = getEntityDescriptors(layerRecord, entityDescriptors);
  const flat: FieldConfigModelType[] = [];
  descriptors.forEach((category: CategoryConfigModelType) => {
    category.fields?.forEach((field: FieldConfigModelType) => {
      flat.push(field);
    });
  });
  return flat;
};

export const getBasicType = (fieldName: FieldInfoName, typename: string): string => {
  let recordModel;
  switch(typename) {
    case 'Layer3DRecord':
      recordModel = Layer3DRecordModel;
      break;
    case 'BestRecord':
      recordModel = BestRecordModel;
      break;
    case 'Link':
      recordModel = LinkModel;
      break;
    default:
      recordModel = LayerRasterRecordModel;
      break;
  }
  const fieldNameStr = fieldName as string;
  const typeString = get(recordModel,`properties.${fieldNameStr}.name`) as string;
  if (typeString) {
    if (fieldNameStr.toLowerCase().includes('url')) {
      return 'url';
    }
    else if (fieldNameStr.toLowerCase().includes('links')) {
      return 'links';
    }
    else if (fieldNameStr.toLowerCase().includes('sensortype')) {
      return 'SensorType';
    }
    else {
      return typeString.replaceAll('(','').replaceAll(')','').replaceAll(' | ','').replaceAll('null','').replaceAll('undefined','');
    }
  }
  return 'string';
};