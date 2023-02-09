import React, { useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { TextField, Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { useStore } from '../../../models';

import { ExportFieldProps } from '../export-entity-selections-fields/raster-selection-field.component';
import { useFormContext } from 'react-hook-form';
import { isEmpty } from 'lodash';
import useDebounceField from '../../../../common/hooks/debounce-field.hook';

const NONE = 0;

const ExportGeneralFieldComponent: React.FC<ExportFieldProps> = ({
  selectionId,
  selectionIdx,
  fieldName,
  fieldValue,
  fieldInfo,
  type,
}) => {
  const intl = useIntl();
  const store = useStore();
  const formMethods = useFormContext(); 
  const fieldId = `${selectionIdx}_${fieldName}`;

  useEffect(() => {
    formMethods.register(fieldId, {...(fieldInfo.rhfValidation ?? {})});
    
    // Mitigate errors on init
    formMethods.setValue(fieldId, fieldValue, { shouldValidate: fieldValue.length > NONE })

    // Trigger form validations
    void formMethods.trigger();
  }, [])

  const handleOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    store.exportStore.setSelectionProperty(
      selectionId,
      fieldName,
      e.target.value
    );
  }, [store.exportStore.setSelectionProperty])

  // @ts-ignore
  const [innerValue, handleFieldChange] = useDebounceField({ handleChange: handleOnChange } , fieldValue);

  const fieldLabel = intl.formatMessage({
    id: `export-layer.${fieldName}.field`,
  });

  return (
    <Box className="exportSelectionField" key={selectionId}>
      <Typography tag="label" htmlFor={fieldId}>
        {fieldLabel}
      </Typography>
      <TextField
        name={fieldId}
        type={type}
        value={innerValue}
        onBlur={(): void => {
          formMethods.setValue(fieldId, innerValue, {shouldValidate: true});
        }}
        // inputRef={formMethods.register({...(fieldInfo.rhfValidation ?? {})})}
        onChange={handleFieldChange}
        invalid={!isEmpty(formMethods.errors[fieldId])}
      />
    </Box>
  );
};

export default ExportGeneralFieldComponent;
