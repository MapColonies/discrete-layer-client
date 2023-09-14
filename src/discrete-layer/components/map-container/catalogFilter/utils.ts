import { get } from "lodash";
import { FieldConfigModelType, FilterableFieldConfigModelType } from "../../../models";
import { FilterField } from "../../../models/RootStore.base";

export enum CustomFilterOperations {
  DATE_RANGE = 'dateRange',
}

const buildFieldFilter = (filterableField: FieldConfigModelType, fieldValue: unknown): FilterField[] => {

  const CUSTOM_OPERATIONS: string[] = [CustomFilterOperations.DATE_RANGE];
  const fieldFilterConfig = (filterableField.isFilterable ?? {}) as FilterableFieldConfigModelType;
  
  if(!CUSTOM_OPERATIONS.includes(fieldFilterConfig.operation ?? '')) {
    // We can use the operation as is, just return the filter
    const filter: FilterField = {
      field: filterableField.queryableName ?? '',
      [fieldFilterConfig.operation ?? '']: fieldValue
    };

    return [filter];
  }

  // Custom operations handling
  switch(fieldFilterConfig.operation) {
    case CustomFilterOperations.DATE_RANGE: {
      const filterStart: FilterField = {
        field: filterableField.queryableName ?? '',
        gteq: get(fieldValue,'startDate')
      };

      const filterEnd: FilterField = {
        field: filterableField.queryableName ?? '',
        lteq: get(fieldValue,'endDate')
      };

      return [filterStart, filterEnd];
    }
    default:
      return [];
  }
}

export const getCatalogFilters = (filterableFields: FieldConfigModelType[], catalogFilterFormValues: Record<string, unknown>): FilterField[] => {
  const fieldsFilters = [];

  for(const field of filterableFields) {
    const fieldFilterValue = catalogFilterFormValues[field.fieldName ?? ''];
    
    // Undefined value means that the user didn't choose to filter on this field
    if(typeof fieldFilterValue !== 'undefined') {
      fieldsFilters.push(...buildFieldFilter(field, fieldFilterValue));
    }
  }

  return fieldsFilters;
}