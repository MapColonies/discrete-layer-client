import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from "@map-colonies/react-components";
import { Button, Typography } from "@map-colonies/react-core";
import { FormattedMessage, useIntl } from "react-intl";
import { FieldErrors, useFormContext } from 'react-hook-form';
import { isEmpty } from 'lodash';
import { useStore } from '../../models';
import { observer } from 'mobx-react-lite';
import { TabViews } from '../../views/tab-views';

interface ExportLayerFooterProps {
  handleTabViewChange: (tabView: TabViews) => void;
}

export enum ExportMode {
  PREVIEW = "preview",
  EXPORT = "export",
}

const NONE = 0;
const GENERAL_FIELDS_IDX = 0;

const ExportFormValidationErrors: React.FC<{errors: FieldErrors<Record<string, unknown>>}> = ({errors}) => {
  const intl = useIntl();
  const [validationErrors, setValidationErrors] = useState<Map<string, string[]>>(new Map<string, string[]>());

  const selectionText = intl.formatMessage({ id: 'export-layer.selection-index.text' });
  const generalFieldsText = intl.formatMessage({ id: 'export-layer.generalFields.text' });

  useEffect(() => {
    if(!isEmpty(errors)) {
      const errorsBySelection: Map<string, string[]> = new Map<string, string[]>();

      Object.entries(errors).forEach(([erroredFieldName, errorMsg]) => {
        const [selectionIdx, fieldName] = erroredFieldName.split('_');
        const fieldLabel = intl.formatMessage({ id: `export-layer.${fieldName}.field` });
        const selectionKey = +selectionIdx === GENERAL_FIELDS_IDX ? generalFieldsText : `${selectionText} ${selectionIdx}`;
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
        Array.from(validationErrors).map(([key, val], i) => {
            return <Box key={`${key}_${i}`} className='errorSelectionContainer'>
              <Typography tag='b' className="errorSelectionText">{key}:</Typography>
              {val.map(error => <Typography key={`${error}`} tag='p' className='errorText'>{error}</Typography>)}
            </Box>
          })
      }
    </Box>
  )
}


const ExportImportedFileError: React.FC<{error: string | null}> = ({error}) => {
  const intl = useIntl();
  const importedFileErrorTitle = intl.formatMessage({ id: 'export-layer.fileError.text' });

  return (
    <Box className='validationErrorsContainer'>
      {
      error && <Box className='errorSelectionContainer'>
              <Typography tag='b' className="errorSelectionText">{importedFileErrorTitle}:</Typography>
              <Typography tag='p' className='errorText'>{error}</Typography>
            </Box>
      }
    </Box>
  )
}

const ExportLayerFooter: React.FC<ExportLayerFooterProps> = observer(({ handleTabViewChange }) => {
  const { formState, handleSubmit } = useFormContext();
  const { exportStore, discreteLayersStore } = useStore();
  const mode = exportStore.hasExportPreviewed ? ExportMode.EXPORT : ExportMode.PREVIEW;

  const endExportSession = useCallback(() => {
    discreteLayersStore.resetTabView([TabViews.EXPORT_LAYER]);
    exportStore.reset();
    handleTabViewChange(TabViews.CATALOG);
  }, []);

  const renderPreviewOrSubmit = useMemo((): JSX.Element => {
    const handleButtonClick = (): void => {
      if (exportStore.hasExportPreviewed) {
        const formSubmitHandler = handleSubmit((data) => {
          // Submit logic
          endExportSession();
        });

        void formSubmitHandler();

        return;
      }

      // Handle Preview logic such as estimated size and free disk space
      exportStore.setHasExportPreviewed(true);

    };

    return (
      <Button
        id="exportBtn"
        raised
        type='button'
        disabled={
          isEmpty(exportStore.geometrySelectionsCollection.features) || !isEmpty(formState.errors)
        }
        onClick={handleButtonClick}
      >
        <FormattedMessage id={`export-layer.${mode}.button`} />
      </Button>
    );
  }, [mode, handleSubmit, formState, exportStore.geometrySelectionsCollection]);

  return (
    <Box className="exportFooter">
      <Box className="buttonsContainer">
        {renderPreviewOrSubmit}
        <Button id="cancelBtn" raised type="button" onClick={endExportSession}>
          <FormattedMessage id="general.cancel-btn.text" />
        </Button>
      </Box>
      <ExportImportedFileError error={exportStore.importedFileError} />
      <ExportFormValidationErrors errors={{...formState.errors}}/>
    </Box>
  );
});

export default ExportLayerFooter;