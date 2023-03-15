import { Box } from '@map-colonies/react-components';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '../../models';
import ExportLayerFooter from './export-layer-footer.component';
import ExportLayerHeader from './export-layer-header.component';
import { useGeneralExportBehavior } from './hooks/useGeneralExportBehavior';
import './export-layer.component.css';
import ExportSelectionFieldsContainer from './export-selection-fields-container.component';
import { FormProvider, useForm } from 'react-hook-form';
import { isEmpty } from 'lodash';
import { TabViews } from '../../views/tab-views';
import ExportLayerJobIdModal from './export-layer-jobIdModal.component';
import { ExportActions } from './hooks/useDomainExportActionsConfig';

interface ExportLayerComponentProps {
  style?: { [key: string]: string };
  handleFlyTo: () => void;
  handleTabViewChange: (tabView: TabViews) => void;
}

export const ExportLayerComponent: React.FC<ExportLayerComponentProps> = observer(
  ({ style, handleFlyTo, handleTabViewChange }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isFinalModalOpen, setIsFinalModalOpen] = useState(false);
    const [jobId, setJobId] = useState<string>();
    
    const store = useStore();
    const formMethods = useForm({
      mode: 'onBlur',
      reValidateMode: 'onBlur'
    });

    const layerToExport = store.exportStore.layerToExport;
    useGeneralExportBehavior(() => {
      if(isEmpty(store.exportStore.geometrySelectionsCollection.features)) {
        handleFlyTo();
      }
    });

    const {formState: { isSubmitted }} = formMethods;

    useEffect(() => {
      return (): void => {
        // Save form data to store.
        if(!isSubmitted) {
          store.exportStore.setFormData(formMethods.getValues());
        } else {
          store.exportStore.resetFormData();
        }
      }
    }, [isSubmitted]);

    const endExportSession = useCallback(() => {
      store.actionDispatcherStore.dispatchAction({
        action: ExportActions.END_EXPORT_SESSION,
        data: {}
      });
    }, [])

    return (
      <Box style={style}>
        {typeof layerToExport !== 'undefined' && (
          <div className="exportTabContainer" ref={containerRef}>
            <ExportLayerHeader />
            <FormProvider {...formMethods}>
              <form className="exportLayerForm" id={'exportForm'}>
                <ExportSelectionFieldsContainer />
              </form>
              <ExportLayerFooter
                handleTabViewChange={handleTabViewChange}
                onExportSuccess={(jobId: string): void => {
                  setJobId(jobId);
                  setIsFinalModalOpen(true);
                }}
              />
            </FormProvider>
            {!isEmpty(jobId) && isFinalModalOpen && (
              <ExportLayerJobIdModal
                renderToPortal={containerRef.current as Element}
                jobId={jobId as string}
                isOpen={isFinalModalOpen}
                onClose={(): void => {
                  setIsFinalModalOpen(false);
                  endExportSession();
                }}
                onCancel={(): void => { setIsFinalModalOpen(false) }}
              />
            )}
          </div>
        )}
      </Box>
    );
  }
);
