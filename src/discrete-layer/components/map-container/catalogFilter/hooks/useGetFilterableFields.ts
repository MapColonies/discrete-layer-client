import { FieldConfigModelType, RecordType, useStore } from "../../../../models";

const DOMAIN_TO_ENTITY_TYPES: Record<RecordType, string[]> = {
  [RecordType.RECORD_RASTER]: ['PycswLayerCatalogRecord', 'PycswBestCatalogRecord', 'PycswVectorBestCatalogRecord'],
  [RecordType.RECORD_3D]: ['Pycsw3DCatalogRecord'],
  [RecordType.RECORD_DEM]: ['PycswDemCatalogRecord', 'PycswQuantizedMeshBestCatalogRecord'],
  [RecordType.RECORD_ALL]: ['PycswLayerCatalogRecord', 'PycswBestCatalogRecord', 'PycswVectorBestCatalogRecord', 'Pycsw3DCatalogRecord', 'PycswDemCatalogRecord', 'PycswQuantizedMeshBestCatalogRecord'],
}

export const useGetFilterableFields = (recordType: RecordType, forFilterPanel = true): null | FieldConfigModelType[] => {
  const store = useStore();
  const { entityDescriptors } = store.discreteLayersStore;

  const descriptorsTypesForExtraction = DOMAIN_TO_ENTITY_TYPES[recordType];

  if(entityDescriptors) {
    const filteredDescriptors = entityDescriptors.filter(descriptor => descriptorsTypesForExtraction.includes(descriptor.type as string));
    const allFilterableDescriptorsFields: FieldConfigModelType[] = [];
    
    for(const descriptor of filteredDescriptors) {
      for(const category of descriptor.categories ?? []) {
        for(const field of category.fields as FieldConfigModelType[]) {
          if(field.isFilterable) {
            if(forFilterPanel && field.isFilterable.participateInFilterPanel) {
              allFilterableDescriptorsFields.push(field);
            } else if(!forFilterPanel) {
              allFilterableDescriptorsFields.push(field);
            }
          }
        }
      }
    }

    return allFilterableDescriptorsFields;
  }

  return null;

}