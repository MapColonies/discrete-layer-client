import React from 'react';
import { useIntl } from 'react-intl';
import { TextField, Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { useStore } from '../../../models';

import { ExportFieldProps } from '../export-entity-selections-fields/raster-selection-field.component';


const ExportStringFieldComponent: React.FC<ExportFieldProps> = ({
  selectionId,
  fieldName,
  fieldValue,
  fieldInfo,
}) => {
  const intl = useIntl();
  const store = useStore();

  const fieldLabel = intl.formatMessage({
    id: `export-layer.${fieldName}.field`,
  });

  return (
    <Box className="exportSelectionField" key={selectionId}>
      <Typography tag="label" htmlFor={fieldName}>
        {fieldLabel}
      </Typography>

      <TextField
        value={fieldValue}
        id={fieldName}
        name={fieldName}
        type="text"
        // eslint-disable-next-line
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
          store.exportStore.setSelectionProperty(
            selectionId,
            fieldName,
            e.target.value
          );
        }}
        // eslint-disable-next-line
        // onBlur={formik?.handleBlur}
        // disabled={mode === Mode.UPDATE && ((fieldInfo.updateRules as UpdateRulesModelType | undefined | null)?.freeze) as boolean}
        // placeholder={placeholder}
        // required={fieldInfo.isRequired === true}
      />
    </Box>
  );
};

export default ExportStringFieldComponent;
