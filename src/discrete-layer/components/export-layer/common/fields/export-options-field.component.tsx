import { Box } from '@map-colonies/react-components';
import { MenuItem, Select } from '@map-colonies/react-core';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useStore } from '../../../../models';
import { ExportFieldProps } from '../../export-entity-selections-fields/raster-selection-field.component';
import ExportFieldLabel from '../export-field-label.component';

interface ExportOptionsFieldProps extends ExportFieldProps {
  options: string[];
  defaultValue?: string;
}

const NONE = 0;

const ExportOptionsField: React.FC<ExportOptionsFieldProps> = ({
  options,
  defaultValue,
  selectionId,
  selectionIdx,
  fieldName,
  fieldValue,
  fieldInfo: { placeholderValue, helperTextValue, rhfValidation },
  type,
}) => {
  const store = useStore();
  const formMethods = useFormContext();
  const [innerValue, setInnerValue] = useState(fieldValue);
  const fieldId = `${selectionIdx}_${fieldName}_${selectionId}`;

  useEffect(() => {
    formMethods.register(fieldId, {...(rhfValidation ?? {})});
    
    // Mitigate errors on init
    formMethods.setValue(fieldId, innerValue, { shouldValidate: fieldValue.length > NONE })

    // Trigger form validations
    // void formMethods.trigger();

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
          const newFieldVal = e.currentTarget.value;

          store.exportStore.setSelectionProperty(
            selectionId,
            fieldName,
            newFieldVal
          );

          formMethods.setValue(fieldId, newFieldVal, { shouldValidate: true });
          setInnerValue(newFieldVal);
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
    </Box>
  );
};

export default ExportOptionsField;
