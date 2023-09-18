import React, { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { observer } from 'mobx-react-lite';
import { useIntl } from "react-intl";
import { Box } from "@map-colonies/react-components";
import { Button } from "@map-colonies/react-core";
import { RecordType, useStore } from "../../../models";
import { useGetFilterableFields } from "./hooks/useGetFilterableFields";
import { CatalogFilterFormFields } from "./catalog-filter-form-fields.component";
import { getCatalogFilters } from "./utils";

import './catalog-filter-panel.css';
import { FilterField } from "../../../models/RootStore.base";
import { isEmpty } from "lodash";
interface CatalogFilterPanelProps {
    isOpen: boolean;
    onFiltersSubmit: (filters: FilterField[]) => void;
    onFiltersReset: () => void;
}
/**
 * Use react-hook-forms with validations.
 * - Get pycsw mapping field names from descriptors
 * - Create dynamic filter forms by the current catalog search entity(ies) type.
 * - Apply the selected filters to the store and re-fetch the search query (And its dependencies)
 * - Mark the filter icon as the current active filter
 * - Reset everything to the normal filters on clean, and un-mark the icon
 */
export const CatalogFilterPanel: React.FC<CatalogFilterPanelProps> = observer(
  ({ isOpen, onFiltersSubmit, onFiltersReset }) => {
    const intl = useIntl();
    const store = useStore();

    const selectedProductType = store.discreteLayersStore.searchParams.recordType;
    const filterableFields = useGetFilterableFields(selectedProductType as RecordType);

    const defaultFormValues = useMemo(() => {
      return filterableFields?.reduce((defaultValues, field) => {
        return ({...defaultValues, [field.fieldName as string]: ''})
      }, {}) ?? {}
    }, [filterableFields])

    
    const formMethods = useForm({
      mode: 'onBlur',
      reValidateMode: 'onBlur',
      // defaultValues: defaultFormValues
    });

    const handleSubmit = () => {
      const filterFormValues = formMethods.getValues();
      const filters = getCatalogFilters(filterableFields ?? [], filterFormValues);

      // console.log(filters);
      onFiltersSubmit(filters);
    };

    const watchAllFields = formMethods.watch();
    // If there is errors or if all field values are empty, then submit should be disabled
    const isSubmitFiltersDisabled = useMemo(() => !formMethods.formState.isValid || Object.values(watchAllFields).every(value => isEmpty(value)), [watchAllFields]);

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
          <Box className="catalogFiltersButtonsContainer">
            <Button
              className="catalogFiltersSubmitBtn"
              raised
              type="submit"
              form="catalogFiltersForm"
              onClick={formMethods.handleSubmit(handleSubmit)}
              disabled={isSubmitFiltersDisabled}
            >
              {intl.formatMessage({id: 'catalog-filter.filterButton.text'})}
            </Button>
            <Button
              className="catalogFiltersClearBtn"
              type="button"
              form="catalogFiltersForm"
              onClick={() => {
                // formMethods.reset(defaultFormValues);
                formMethods.reset();
                onFiltersReset();
              }}
            >
              {intl.formatMessage({id: 'catalog-filter.clearFilterButton.text'})}
            </Button>
          </Box>
        </Box>
      </FormProvider>
    );
  }
);