import { FieldConfigModelType } from "../../../models"
import { CatalogFilterDateRangeField } from "./fields/catalog-filter-date-range-field.component";
import { CatalogFilterGeneralField } from "./fields/catalog-filter-general-field.component";

interface CatalogFilterFormFieldProps {
  filterableFields: FieldConfigModelType[];
}

export const CatalogFilterFormFields: React.FC<CatalogFilterFormFieldProps> = ({ filterableFields }) => {

  return <>
    {filterableFields.length > 0 && filterableFields.map((filterField, i) => {
      const filterOperation = filterField.isFilterable.operation;
      const fieldIndex = `${filterField.fieldName ?? ''}_${i}`;

      switch(filterOperation) {
        case "like":
        case "eq":
          return <CatalogFilterGeneralField key={fieldIndex} fieldDescriptor={filterField} />
        case "range":
          return <CatalogFilterDateRangeField key={fieldIndex} fieldDescriptor={filterField} />
        default:
          return <CatalogFilterGeneralField key={fieldIndex} fieldDescriptor={filterField} />
      }
      
    })}
  
  </>

}