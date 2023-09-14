import React, { useEffect, useMemo } from 'react';
import { FieldConfigModelType, FilterFieldValidationModelType } from '../../../../models';
import { RegisterOptions, useFormContext } from 'react-hook-form';
import { TextField } from '@map-colonies/react-core';
import CatalogFilterFieldLabel from './catalog-filter-field-label.component';
import { isEmpty } from 'lodash';
import { useIntl } from 'react-intl';
import { Box } from '@map-colonies/react-components';

interface CatalogFilterGeneralFieldProps {
  fieldDescriptor: FieldConfigModelType;
  placeholder?: string;
}

export const CatalogFilterGeneralField: React.FC<CatalogFilterGeneralFieldProps> = ({ fieldDescriptor, placeholder }) => {
  const intl = useIntl();
  const formMethods = useFormContext();
  const fieldId = fieldDescriptor.fieldName ?? '';

  const fieldValidation: FilterFieldValidationModelType = {
    ...fieldDescriptor.isFilterable.validation,
    pattern: fieldDescriptor?.isFilterable?.validation?.pattern
      ? {
          value: new RegExp(fieldDescriptor.isFilterable.validation.pattern),
          message: intl.formatMessage({id: `catalog-filter.${fieldId}.validation-error`}),
        }
      : undefined,
  };


  useEffect(() => {
    formMethods.register(fieldId, {...(fieldValidation as RegisterOptions)});

    return (): void => {
      formMethods.unregister(fieldId);
    }
  }, [fieldId])


  return (
    <Box className={'catalogFilterFieldContainer'} key={fieldId + '_fieldContainer'}>
      <CatalogFilterFieldLabel
        fieldName={fieldId}
        labelTranslationId={fieldDescriptor.label ?? ''}
      />
      <TextField
        dir="auto"
        className="catalogFilterGeneralField"
        maxLength={fieldValidation?.maxLength ?? undefined}
        name={fieldId}
        type={fieldValidation.valueAsNumber ? 'number': 'text'}
        value={formMethods.watch('fieldId')}
        placeholder={placeholder}
        invalid={!isEmpty(formMethods.errors[fieldId])}
        onBlur={() => {
          formMethods.trigger(fieldId);
        }}
        onChange={(e) => {
          const value = e.currentTarget.value.length === 0 ? undefined : e.currentTarget.value;
          formMethods.setValue(fieldId, value);
        }}
      />
      <span className="catalogFilterFieldError">{formMethods.errors[fieldId]?.message ?? undefined}</span>
    </Box>
  );
}