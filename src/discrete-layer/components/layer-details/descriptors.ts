import { get } from 'lodash';
import { CategoryConfigModelType, EntityDescriptorModelType, FieldConfigModelType, LayerMetadataMixedUnion } from '../../models';
import { IRecordCategoryFieldsInfo } from './layer-details.field-info';

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
