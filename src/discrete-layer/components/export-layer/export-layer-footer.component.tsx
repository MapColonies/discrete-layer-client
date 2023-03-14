import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from "@map-colonies/react-components";
import { Button, CircularProgress, Typography } from "@map-colonies/react-core";
import { FormattedMessage, useIntl } from "react-intl";
import { FieldErrors, useFormContext } from 'react-hook-form';
import { cloneDeep, get, isEmpty } from 'lodash';
import { useStore } from '../../models';
import { observer } from 'mobx-react-lite';
import { TabViews } from '../../views/tab-views';
import { useExportTrigger } from './hooks/useExportTrigger';
import { GENERAL_FIELDS_IDX } from './constants';
import { useGetFreeDiskSpace } from './hooks/useGetFreeDiskSpace';
import { useEstimatedSize } from './hooks/useEstimatedSize';
import { formatBytes, kbToBytes } from '../../../common/helpers/formatters';

interface ExportLayerFooterProps {
  handleTabViewChange: (tabView: TabViews) => void;
  onExportSuccess: () => void;
}

export enum ExportMode {
  PREVIEW = "preview",
  EXPORT = "export",
}

const NONE = 0;
const FILE_ERROR_IDX = -1;
const SERVICE_ERROR_IDX = -2;
const GENERAL_ERROR_IDX = -3;
const NOT_AVAILABLE_TEXT = 'N/A';

const ExportFormValidationErrors: React.FC<{errors: FieldErrors<Record<string, unknown>>}> = ({errors}) => {
  const intl = useIntl();
  const [validationErrors, setValidationErrors] = useState<Map<string, string[]>>(new Map<string, string[]>());

  const selectionText = intl.formatMessage({ id: 'export-layer.selection-index.text' });
  const generalFieldsText = intl.formatMessage({ id: 'export-layer.generalFields.text' });
  const importedFileErrorTitle = intl.formatMessage({ id: 'export-layer.fileError.text' });
  const serviceErrorTitle = intl.formatMessage({ id: 'export-layer.serviceError.text' });
  const generalErrorTitle = intl.formatMessage({ id: 'export-layer.generalError.text' });

  const getSelectionKey = (selectionIdx: string): string => {
    switch(+selectionIdx) {
      case GENERAL_FIELDS_IDX:
        return generalFieldsText;
      case FILE_ERROR_IDX:
        return importedFileErrorTitle;
      case SERVICE_ERROR_IDX:
        return serviceErrorTitle;
      case GENERAL_ERROR_IDX:
        return generalErrorTitle;
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
          +selectionIdx > GENERAL_FIELDS_IDX
            ? `${fieldLabel}: ${errorMsg?.message as string}`
            : (errorMsg?.message as string)
            
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

const ExportLayerFooter: React.FC<ExportLayerFooterProps> = observer(({ handleTabViewChange, onExportSuccess }) => {
  const { formState, handleSubmit } = useFormContext();
  const { exportStore, discreteLayersStore } = useStore();
  const intl = useIntl();
  const [insufficientSpaceError, setIsInsufficientSpaceError] = useState<string | undefined>();
  const mode = exportStore.hasExportPreviewed ? ExportMode.EXPORT : ExportMode.PREVIEW;

  const { data: freeDiskSpaceRes, loading: isExportFreeDiskSpaceLoading } = useGetFreeDiskSpace();

  const {
    setSelection: setExportDataToEstimateSize,
    data: exportSizeEstimationRes,
    loading: isExportSizeEstimationLoading
  } = useEstimatedSize();

  const [exportSizeEstimation, setExportSizeEstimation] = useState<number | null>();

  const {
    setFormValues: setFormValuesToQuery,
    data: exportTriggerRes,
    error: exportTriggerError,
    loading: isExportTriggerLoading,
  } = useExportTrigger();

  useEffect(() => {
    setExportSizeEstimation(undefined);
  }, [exportStore.geometrySelectionsCollection])

  useEffect(() => {
    setExportSizeEstimation(exportSizeEstimationRes);
  }, [exportSizeEstimationRes])

  useEffect(() => {
    if(typeof exportSizeEstimation === 'number' && typeof freeDiskSpaceRes === 'number') {
      if(exportSizeEstimation > freeDiskSpaceRes) {
        const insufficientSizeErrorText = intl.formatMessage({ id: 'export-layer.insufficient-space.error' });
        setIsInsufficientSpaceError(insufficientSizeErrorText);
      } else {
        setIsInsufficientSpaceError(undefined);
      }
    }
  }, [exportSizeEstimation, freeDiskSpaceRes])

  useEffect(() => {
    if(exportStore.hasExportPreviewed) {
      setExportDataToEstimateSize(exportStore.geometrySelectionsCollection);
    }
  }, [exportStore.hasExportPreviewed]);

  useEffect(() => {
    setIsInsufficientSpaceError(undefined);
  }, [exportStore.geometrySelectionsCollection])

  useEffect(() => {
    if(typeof exportTriggerRes !== 'undefined' && typeof exportTriggerRes.jobId !== 'undefined') {
      onExportSuccess();
    }
  }, [exportTriggerRes])

  const formattedFileError =
    exportStore.importedFileError !== null
      ? { [`${FILE_ERROR_IDX}_`]: { message: exportStore.importedFileError } }
      : {};
  
  const serviceError =
      exportTriggerError as boolean
      ? { [`${SERVICE_ERROR_IDX}_`]: { message: get(exportTriggerError, 'response.errors[0].message') as string } }
      : {};

  const insufficientSpaceErrorObj = 
      !isEmpty(insufficientSpaceError)
      ? { [`${GENERAL_ERROR_IDX}_`]: { message: insufficientSpaceError as string } }
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
          setFormValuesToQuery(data);
          // Submit logic
          // endExportSession();
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
        type="button"
        disabled={
          isEmpty(exportStore.geometrySelectionsCollection.features) ||
          !isEmpty(formState.errors) ||
          !isEmpty(insufficientSpaceError) ||
          isExportTriggerLoading
        }
        onClick={handleButtonClick}
      >
        {isExportTriggerLoading ? (
          <CircularProgress className="exportButtonLoading" />
        ) : (
          <FormattedMessage id={`export-layer.${mode}.button`} />
        )}
      </Button>
    );
  }, [mode, handleSubmit, formState, insufficientSpaceError, exportStore.geometrySelectionsCollection, isExportTriggerLoading]);


  const sizeEstimationsContainer = useMemo(() => {
    return (
      <Box className="estimationsContainer">
        <Typography tag="bdi" className="freeDiskSpaceContainer">
          <Typography tag="p" className="freeDiskSpaceLabel">
            {intl.formatMessage({ id: 'export-layer.freeDiskSpace.label' })}
          </Typography>

          <Typography tag="bdi" className="freeDiskSpaceValue">
            {isExportFreeDiskSpaceLoading ? (
              <CircularProgress className="freeDiskSpaceLoading" />
            ) : typeof freeDiskSpaceRes === 'number' ? (
              formatBytes(kbToBytes(freeDiskSpaceRes))
            ) : (
              NOT_AVAILABLE_TEXT
            )}
          </Typography>
        </Typography>
        <Typography tag="bdi" className="sizeEstimationContainer">
          <Typography tag="p" className="sizeEstimationLabel">
            {intl.formatMessage({ id: 'export-layer.sizeEstimation.label' })}
          </Typography>

          <Typography tag="bdi" className="sizeEstimationValue">
            {isExportSizeEstimationLoading ? (
              <CircularProgress className="sizeEstimationLoading" />
            ) : typeof exportSizeEstimation === 'number' ? (
              formatBytes(kbToBytes(exportSizeEstimation))
            ) : (
              NOT_AVAILABLE_TEXT
            )}
          </Typography>
        </Typography>
      </Box>
    );
  }, [
    isExportFreeDiskSpaceLoading,
    isExportSizeEstimationLoading,
    freeDiskSpaceRes,
    exportSizeEstimation,
  ]);

  return (
    <Box className="exportFooter">
      <Box className="buttonsContainer">
        {renderPreviewOrSubmit}
        <Button id="cancelBtn" type="button" onClick={endExportSession}>
          <FormattedMessage id="general.cancel-btn.text" />
        </Button>
        {sizeEstimationsContainer}
      </Box>
      <ExportFormValidationErrors
        errors={{ ...insufficientSpaceErrorObj, ...serviceError, ...formattedFileError, ...formState.errors }}
      />
    </Box>
  );
});

export default ExportLayerFooter;