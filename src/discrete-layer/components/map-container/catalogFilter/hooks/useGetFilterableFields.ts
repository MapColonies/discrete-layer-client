import { FieldConfigModelType, RecordType, useStore } from "../../../../models";

/**
 *  This is a dictionary between the current selected domain and the representing entity types of that domain. 
 *  We only choose one entity type for each domain in order to create a baseline of common fields across each domain.
 */ 
const DOMAIN_TO_PRIMARY_ENTITY_TYPE: Record<RecordType, string[]> = {
  [RecordType.RECORD_RASTER]: ['PycswLayerCatalogRecord'],
  [RecordType.RECORD_3D]: ['Pycsw3DCatalogRecord'],
  [RecordType.RECORD_DEM]: ['PycswDemCatalogRecord'],
  [RecordType.RECORD_ALL]: ['PycswLayerCatalogRecord', 'Pycsw3DCatalogRecord', 'PycswDemCatalogRecord'],
}

export const useGetFilterableFields = (recordType: RecordType, forFilterPanel = true): null | FieldConfigModelType[] => {
  const store = useStore();
  const { entityDescriptors } = store.discreteLayersStore;

  const descriptorsTypesForExtraction = DOMAIN_TO_PRIMARY_ENTITY_TYPE[recordType];

  if(entityDescriptors) {
    const filteredDescriptors = entityDescriptors.filter(descriptor => descriptorsTypesForExtraction.includes(descriptor.type as string));
    const allFilterableDescriptorsFields: FieldConfigModelType[] = [];
    
    for(const descriptor of filteredDescriptors) {
      for(const category of descriptor.categories ?? []) {
        for(const field of category.fields as FieldConfigModelType[]) {
          if(field.isFilterable) {
            if((forFilterPanel && field.isFilterable.participateInFilterPanel) || (!forFilterPanel && !field.isFilterable.participateInFilterPanel)) {  
              // Prevent fields duplications in final array
              if(!allFilterableDescriptorsFields.some(filterableField => field.fieldName === filterableField.fieldName)){
                allFilterableDescriptorsFields.push(field);
              }
            }
          }
        }
      }
    }

    return allFilterableDescriptorsFields;
  }

  return null;

}