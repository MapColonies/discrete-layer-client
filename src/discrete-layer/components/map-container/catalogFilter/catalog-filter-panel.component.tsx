import React, { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { observer } from 'mobx-react-lite';
import { useIntl } from "react-intl";
import { Box } from "@map-colonies/react-components";
import { Button } from "@map-colonies/react-core";
import { RecordType, useStore } from "../../../models";
import { useGetFilterableFields } from "./hooks/useGetFilterableFields";
import { CatalogFilterFormFields } from "./catalog-filter-form-fields.component";

import './catalog-filter-panel.css';
interface CatalogFilterPanelProps {
    isOpen: boolean;
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
  ({ isOpen }) => {
    const intl = useIntl();
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

    const watchAllFields = formMethods.watch();
    // If there is errors or if all field values are undefined, then submit should be disabled
    const isSubmitFiltersDisabled = useMemo(() => !formMethods.formState.isValid || Object.values(watchAllFields).every(value => typeof value === 'undefined'), [watchAllFields]);

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
            disabled={isSubmitFiltersDisabled}
          >
            {intl.formatMessage({id: 'catalog-filter.filterButton.text'})}
          </Button>
        </Box>
      </FormProvider>
    );
  }
);