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
const FILE_ERROR_IDX = -1;

const ExportFormValidationErrors: React.FC<{errors: FieldErrors<Record<string, unknown>>}> = ({errors}) => {
  const intl = useIntl();
  const [validationErrors, setValidationErrors] = useState<Map<string, string[]>>(new Map<string, string[]>());

  const selectionText = intl.formatMessage({ id: 'export-layer.selection-index.text' });
  const generalFieldsText = intl.formatMessage({ id: 'export-layer.generalFields.text' });
  const importedFileErrorTitle = intl.formatMessage({ id: 'export-layer.fileError.text' });

  const getSelectionKey = (selectionIdx: string): string => {
    switch(+selectionIdx) {
      case GENERAL_FIELDS_IDX:
        return generalFieldsText;
      case FILE_ERROR_IDX:
        return importedFileErrorTitle;
      default:
        return `${selectionText} ${selectionIdx}`;
    }
  };

  useEffect(() => {
    if(!isEmpty(errors)) {
      const errorsBySelection: Map<string, string[]> = new Map<string, string[]>();

      Object.entries(errors).forEach(([erroredFieldName, errorMsg]) => {
        const [selectionIdx, fieldName] = erroredFieldName.split('_');
        const fieldLabel = intl.formatMessage({ id: `export-layer.${fieldName}.field` });
        const selectionKey = getSelectionKey(selectionIdx);
        const currentSelectionErrors = errorsBySelection.get(selectionKey) ?? [];
        const newSelectionError =
          +selectionIdx === FILE_ERROR_IDX
            ? (errorMsg?.message as string)
            : `${fieldLabel}: ${errorMsg?.message as string}`;

        errorsBySelection.set(selectionKey,[...currentSelectionErrors, newSelectionError]);
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

const ExportLayerFooter: React.FC<ExportLayerFooterProps> = observer(({ handleTabViewChange }) => {
  const { formState, handleSubmit } = useFormContext();
  const { exportStore, discreteLayersStore } = useStore();
  const mode = exportStore.hasExportPreviewed ? ExportMode.EXPORT : ExportMode.PREVIEW;

  const formattedFileError =
    exportStore.importedFileError !== null
      ? { [`${FILE_ERROR_IDX}_`]: { message: exportStore.importedFileError } }
      : {};

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

      <ExportFormValidationErrors errors={{...formattedFileError ,...formState.errors}}/>
    </Box>
  );
});

export default ExportLayerFooter;