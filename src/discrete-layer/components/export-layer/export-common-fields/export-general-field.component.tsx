import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { TextField, Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { useStore } from '../../../models';

import { ExportFieldProps } from '../export-entity-selections-fields/raster-selection-field.component';
import { useFormContext } from 'react-hook-form';
import { isEmpty } from 'lodash';
import useDebounceField from '../../../../common/hooks/debounce-field.hook';
import { EntityFormikHandlers } from '../../layer-details/layer-datails-form';

const NONE = 0;

const getHelperTextValue = (helperTextValue?: string | ((value: unknown) => string), value?: string): string | undefined => {
  if(typeof helperTextValue !== 'undefined' && typeof helperTextValue !== 'string' && !isEmpty(value)) {
    return helperTextValue(value);
  }

  return !isEmpty(helperTextValue) && typeof helperTextValue === 'string' ? helperTextValue : undefined;
}

const ExportGeneralFieldComponent: React.FC<ExportFieldProps> = ({
  selectionId,
  selectionIdx,
  fieldName,
  fieldValue,
  fieldInfo: {placeholderValue, helperTextValue, rhfValidation},
  type,
}) => {
  const intl = useIntl();
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

  useEffect(() => {
    formMethods.register(fieldId, {...(rhfValidation ?? {})});
    
    // Mitigate errors on init
    formMethods.setValue(fieldId, fieldValue, { shouldValidate: fieldValue.length > NONE })

    // Trigger form validations
    // void formMethods.trigger();

    return (): void => {
      formMethods.unregister(fieldId);
    }
  }, [fieldId])

  const handleOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const newFieldVal = e.target.value;

    store.exportStore.setSelectionProperty(
      selectionId,
      fieldName,
      newFieldVal
    );

    setHelperText(getHelperTextValue(helperTextValue, newFieldVal));
    
  }, [store.exportStore.setSelectionProperty, selectionId, fieldName])

  const [innerValue, handleFieldChange] = useDebounceField({ handleChange: handleOnChange } as EntityFormikHandlers, fieldValue);

  const fieldLabel = intl.formatMessage({
    id: `export-layer.${fieldName}.field`,
  });

  return (
    <Box className="exportSelectionField" key={selectionId}>
      <Typography tag="span" className="exportFieldLabel" htmlFor={fieldId}>
        {fieldLabel}
      </Typography>
      <TextField
        dir="auto"
        className="exportGeneralField"
        name={fieldId}
        type={type}
        value={innerValue}
        onBlur={(): void => {
          formMethods.setValue(fieldId, innerValue, {shouldValidate: true});
        }}
        placeholder={placeholderVal}
        // inputRef={formMethods.register({...(rhfValidation ?? {})})}
        onChange={handleFieldChange}
        invalid={!isEmpty(formMethods.errors[fieldId])}
        // helpText={!isEmpty(helperText) && {
        //   persistent: true,
        //   children: helperText
        // }}
      />
      {<Typography tag="span" className="exportFieldHelper" htmlFor={fieldId}>
        {!isEmpty(helperText) && helperText}
      </Typography>}
    </Box>
  );
};

export default ExportGeneralFieldComponent;
