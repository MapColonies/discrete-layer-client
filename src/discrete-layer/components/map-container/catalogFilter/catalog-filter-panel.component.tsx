import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Box, DateRangePicker } from "@map-colonies/react-components";
import { observer } from 'mobx-react-lite';
import { RecordType, useStore } from "../../../models";
import { useGetFilterableFields } from "./hooks/useGetFilterableFields";

import './catalog-filter-panel.css';
import { CatalogFilterGeneralField } from "./fields/catalog-filter-general-field.component";
import { CatalogFilterFormFields } from "./catalog-filter-form-fields.component";
import { Button } from "@map-colonies/react-core";
interface CatalogFilterPanelProps {
    isOpen: boolean;
}
/**
 * Use react-hook-forms with Yup schemas for validation.
 * - Get pycsw mapping field names from descriptors
 * - Use a declarative approach to configure the type, form control and validation for each "filterable" field. (Yup schemas)
 * - Create dynamic filter forms by the current catalog search entity(ies) type.
 * - Apply the selected filters to the store and re-fetch the search query (And its dependencies)
 * - Mark the filter icon as the current active filter
 * - Reset everything to the normal filters on clean, and un-mark the icon
 */
export const CatalogFilterPanel: React.FC<CatalogFilterPanelProps> = observer(
  ({ isOpen }) => {
    const store = useStore();
    const formMethods = useForm({
      mode: 'onBlur',
      reValidateMode: 'onBlur',
    });

    const selectedProductType =
      store.discreteLayersStore.searchParams.recordType;
    const filterableFields = useGetFilterableFields(
      selectedProductType as RecordType
    );
    console.log(filterableFields);

    const handleSubmit = () => {
      console.log(formMethods.getValues());
    };

    return (
      <FormProvider {...formMethods}>
        <Box
          className={`catalogFilterPanelContainer ${isOpen ? 'open' : 'close'}`}
        >
          <Box className="catalogFilterFormContainer">
            {filterableFields?.length && (
              <form className="catalogFiltersForm" id={'catalogFiltersForm'}>
                <CatalogFilterFormFields filterableFields={filterableFields} />
              </form>
            )}
          </Box>
          <Button
            raised
            type="submit"
            form="catalogFiltersForm"
            onClick={formMethods.handleSubmit(handleSubmit)}
          >
            {'filter'}
          </Button>
        </Box>
      </FormProvider>
    );
  }
);