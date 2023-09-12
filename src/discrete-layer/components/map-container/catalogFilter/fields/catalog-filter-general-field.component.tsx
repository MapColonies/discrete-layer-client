import React, { useEffect, useMemo } from 'react';
import { FieldConfigModelType, FilterFieldValidationModelType } from '../../../../models';
import { RegisterOptions, useFormContext } from 'react-hook-form';
import { TextField } from '@map-colonies/react-core';
import CatalogFilterFieldLabel from './catalog-filter-field-label.component';
import { Box } from '@material-ui/core';
import { isEmpty } from 'lodash';

interface CatalogFilterGeneralFieldProps {
  fieldDescriptor: FieldConfigModelType;
  placeholder?: string;
}

export const CatalogFilterGeneralField: React.FC<CatalogFilterGeneralFieldProps> = ({ fieldDescriptor, placeholder }) => {
  const formMethods = useFormContext();
  const fieldValidation: FilterFieldValidationModelType = {
    ...fieldDescriptor.isFilterable.validation,
    pattern: fieldDescriptor?.isFilterable?.validation?.pattern
      ? {
          value: new RegExp(fieldDescriptor.isFilterable.validation.pattern),
          message: 'Invalid pattern',
        }
      : undefined,
  };

  const fieldId = fieldDescriptor.fieldName ?? '';

  useEffect(() => {
    formMethods.register(fieldId, {...(fieldValidation as RegisterOptions)});

    return (): void => {
      formMethods.unregister(fieldId);
    }
  }, [fieldId])

  const hasValidations = useMemo(() => Object.values(fieldValidation).some(validation => !!validation), [fieldDescriptor]);

  return (
    <Box className={'catalogFilterFieldContainer' + hasValidations ? ' withErrorMessage' : ''} key={fieldId + '_fieldContainer'}>
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
        placeholder={placeholder}
        invalid={!isEmpty(formMethods.errors[fieldId])}
        onBlur={() => {
          formMethods.trigger(fieldId);
        }}
        onChange={(e) => {
          formMethods.setValue(fieldId, e.currentTarget.value);
        }}
      />
      <span className="catalogFilterFieldError">{formMethods.errors[fieldId]?.message ?? undefined}</span>
    </Box>
  );
}