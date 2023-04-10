import { Box } from '@map-colonies/react-components';
import { MenuItem, Select, Typography } from '@map-colonies/react-core';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useStore } from '../../../../models';
import { ExportFieldProps } from '../../types/interfaces';
import ExportFieldLabel from '../export-field-label.component';

interface ExportOptionsFieldProps extends ExportFieldProps {
  options: string[];
  defaultValue?: string;
}

const NONE = 0;

const getHelperTextValue = (helperTextValue?: string | ((value: unknown) => string), value?: string): string | undefined => {
  if(typeof helperTextValue !== 'undefined' && typeof helperTextValue !== 'string' && !isEmpty(value?.toString())) {
    return helperTextValue(value);
  }

  return !isEmpty(helperTextValue) && typeof helperTextValue === 'string' ? helperTextValue : undefined;
}

const ExportOptionsField: React.FC<ExportOptionsFieldProps> = ({
  options,
  defaultValue,
  selectionId,
  selectionIdx,
  fieldName,
  fieldValue,
  fieldInfo: { placeholderValue, helperTextValue, rhfValidation, validationAgainstField },
  type,
}) => {
  const store = useStore();
  const formMethods = useFormContext();
  const [innerValue, setInnerValue] = useState(isEmpty(fieldValue) ? defaultValue ?? '' : fieldValue);
  const [helperText, setHelperText] = useState<string | undefined>(getHelperTextValue(helperTextValue, fieldValue));

  const getFormFieldId = (name: string): string => {
    return `${selectionIdx}_${name}_${selectionId}`
  }
  const fieldId = getFormFieldId(fieldName);

  useEffect(() => {
    const registerValidation = {
      ...(rhfValidation ?? {}),
      validate: {
        ...((rhfValidation?.validate) ?? {}),
        validationAgainstField: (value: unknown): string | boolean |undefined => {
          if(typeof validationAgainstField !== 'undefined') {
            return validationAgainstField.validate(value, formMethods.watch(getFormFieldId(validationAgainstField.watch)));
          }
        }
      },
    };
    
    formMethods.register(fieldId, {...registerValidation});
    
    // Mitigate errors on init
    formMethods.setValue(fieldId, innerValue, { shouldValidate: innerValue.length > NONE });

    // Revalidate fields
    void formMethods.trigger();

    return (): void => {
      formMethods.unregister(fieldId);
    }
  }, [fieldId]);

  return (
    <Box className="exportSelectionField selectOptionsContainer">
      <ExportFieldLabel required={!isEmpty(rhfValidation?.required)} fieldId={fieldId} fieldName={fieldName} />
      <Select
        value={innerValue}
        defaultValue={defaultValue}
        id={fieldId}
        name={fieldId}
        onChange={(e: React.FormEvent<HTMLSelectElement>): void => {
          const newFieldVal = rhfValidation?.valueAsNumber as boolean ? Number(e.currentTarget.value) : e.currentTarget.value;

          store.exportStore.setSelectionProperty(
            selectionId,
            fieldName,
            newFieldVal
          );

          setHelperText(getHelperTextValue(helperTextValue, `${newFieldVal}`));

          formMethods.setValue(fieldId, newFieldVal, { shouldValidate: true });
          setInnerValue(e.currentTarget.value);
        }}
        onBlur={(): void => {
          void formMethods.trigger(fieldId);
        }}
        invalid={!isEmpty(formMethods.errors[fieldId])}
        outlined
        enhanced
        className="exportOptionsSelect"
      >
        {options.map((option, i) => {
          return (
            <MenuItem key={i} value={option}>
              {option}
            </MenuItem>
          );
        })}
      </Select>
      {typeof helperText !== 'undefined' && (
        <Typography tag="span" className="exportFieldHelper" htmlFor={fieldId}>
          {!isEmpty(helperText) && helperText}
        </Typography>
      )}
    </Box>
  );
};

export default ExportOptionsField;
