import React, { useEffect, useState } from 'react';
import { Box } from "@map-colonies/react-components";
import { Button, Typography } from "@map-colonies/react-core";
import { FormattedMessage, useIntl } from "react-intl";
import { FieldErrors, useFormContext } from 'react-hook-form';
import { isEmpty } from 'lodash';

interface ExportLayerFooterProps {
  formId: string;
}

const NONE = 0;

const ExportFormValidationErrors: React.FC<{errors: FieldErrors<Record<string, unknown>>}> = ({errors}) => {
  const intl = useIntl();
  const [validationErrors, setValidationErrors] = useState<Map<string, string[]>>(new Map<string, string[]>());

  const selectionText = intl.formatMessage({ id: 'export-layer.selection-index.text' });

  useEffect(() => {
    if(!isEmpty(errors)) {
      const errorsBySelection: Map<string, string[]> = new Map<string, string[]>();

      Object.entries(errors).forEach(([erroredFieldName, errorMsg]) => {
        const [selectionIdx, fieldName] = erroredFieldName.split('_');
        const fieldLabel = intl.formatMessage({ id: `export-layer.${fieldName}.field` });
        const selectionKey = `${selectionText} ${selectionIdx}`;
        const currentSelectionErrors = errorsBySelection.get(selectionKey) ?? [];

        errorsBySelection.set(selectionKey,[...currentSelectionErrors, `${fieldLabel}: ${errorMsg?.message as string}`]);
      });

      setValidationErrors(errorsBySelection);
    } else {
      setValidationErrors(new Map<string, string[]>());
    }
  }, [errors]);

  return (
    <Box className='validationErrorsContainer'>
      {validationErrors.size > NONE && 
        Array.from(validationErrors).map(([key, val]) => {
            return <Box className='errorSelectionContainer'>
              <Typography tag='b' className="errorSelectionText">{key}:</Typography>
              {val.map(error => <Typography tag='p' className='errorText'>{error}</Typography>)}
            </Box>
          })
      }
    </Box>
  )
}

const ExportLayerFooter: React.FC<ExportLayerFooterProps> = ({ formId }) => {
  const {formState} = useFormContext();
  return (
    <Box className="exportFooter">
      <Box className="buttonsContainer">
        <Button id="exportBtn" raised type="submit" form={formId}>
          <FormattedMessage id="export-layer.export.button" />
        </Button>
        <Button id="cancelBtn" raised type="button" onClick={(): void => {}}>
          <FormattedMessage id="general.cancel-btn.text" />
        </Button>
      </Box>
      <ExportFormValidationErrors errors={{...formState.errors}}/>
    </Box>
  );
};

export default ExportLayerFooter;