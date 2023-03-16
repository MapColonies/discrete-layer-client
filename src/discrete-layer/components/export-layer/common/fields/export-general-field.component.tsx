import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TextField, Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { useStore } from '../../../../models';
import { ExportFieldProps } from '../../export-entity-selections-fields/raster-selection-field.component';
import { useFormContext } from 'react-hook-form';
import { isEmpty } from 'lodash';
import useDebounceField from '../../../../../common/hooks/debounce-field.hook';
import { EntityFormikHandlers } from '../../../layer-details/layer-datails-form';
import ExportFieldLabel from '../export-field-label.component';

const NONE = 0;

const getHelperTextValue = (helperTextValue?: string | ((value: unknown) => string), value?: string): string | undefined => {
  if(typeof helperTextValue !== 'undefined' && typeof helperTextValue !== 'string' && !isEmpty(value?.toString())) {
    return helperTextValue(value);
  }

  return !isEmpty(helperTextValue) && typeof helperTextValue === 'string' ? helperTextValue : undefined;
}

const ExportGeneralFieldComponent: React.FC<ExportFieldProps> = ({
  selectionId,
  selectionIdx,
  fieldName,
  fieldValue,
  fieldInfo: {placeholderValue, helperTextValue, rhfValidation, rows, maxLength},
  type,
}) => {
  const store = useStore();
  const formMethods = useFormContext();
  const [helperText, setHelperText] = useState<string | undefined>(getHelperTextValue(helperTextValue, fieldValue));
  const fieldId = `${selectionIdx}_${fieldName}_${selectionId}`;
  const placeholderVal = useMemo(() =>
    typeof placeholderValue !== 'undefined'
      ? typeof placeholderValue === 'string'
        ? placeholderValue
        : placeholderValue()
      : '',
    [placeholderValue]
  );

  const handleOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const newFieldVal = rhfValidation?.valueAsNumber as boolean ? e.target.valueAsNumber : e.target.value;

    store.exportStore.setSelectionProperty(
      selectionId,
      fieldName,
      newFieldVal
    );

    setHelperText(getHelperTextValue(helperTextValue, `${newFieldVal}`));
    
  }, [store.exportStore.setSelectionProperty, selectionId, fieldName])

  const [innerValue, handleFieldChange] = useDebounceField({ handleChange: handleOnChange } as EntityFormikHandlers, fieldValue);

  useEffect(() => {
    formMethods.register(fieldId, {...(rhfValidation ?? {})});
    
    // Mitigate errors on init
    formMethods.setValue(fieldId, fieldValue, { shouldValidate: fieldValue.length > NONE });

    return (): void => {
      formMethods.unregister(fieldId);
    }
  }, [fieldId])


  return (
    <Box className="exportSelectionField" key={selectionId}>
      <ExportFieldLabel required={!isEmpty(rhfValidation?.required)} fieldId={fieldId} fieldName={fieldName} />
      <TextField
        dir="auto"
        className="exportGeneralField"
        textarea={(rows ?? NONE) > 1}
        rows={rows}
        maxLength={maxLength}
        name={fieldId}
        type={type}
        value={innerValue}
        onBlur={(): void => {
          formMethods.setValue(fieldId, innerValue, {shouldValidate: true});
        }}
        placeholder={placeholderVal}
        onChange={handleFieldChange}
        invalid={!isEmpty(formMethods.errors[fieldId])}
      />
      {<Typography tag="span" className="exportFieldHelper" htmlFor={fieldId}>
        {!isEmpty(helperText) && helperText}
      </Typography>}
    </Box>
  );
};

export default ExportGeneralFieldComponent;
