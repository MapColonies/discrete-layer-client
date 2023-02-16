import { Box } from '@map-colonies/react-components';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useStore } from '../../models';
import ExportLayerFooter from './export-layer-footer.component';
import ExportLayerHeader from './export-layer-header.component';
import { useGeneralExportBehavior } from './hooks/useGeneralExportBehavior';
import './export-layer.component.css';
import ExportSelectionFieldsContainer from './export-selection-fields-container.component';
import { FormProvider, useForm } from 'react-hook-form';
interface ExportLayerComponentProps {
  style?: { [key: string]: string };
  handleFlyTo: () => void;
}

const EXPORT_FORM_ID = 'exportForm';

export const ExportLayerComponent: React.FC<ExportLayerComponentProps> = observer(
  ({ style, handleFlyTo }) => {
    const store = useStore();
    const formMethods = useForm({
      mode: 'onBlur',
      reValidateMode: 'onBlur'
    });

    const layerToExport = store.exportStore.layerToExport;
    useGeneralExportBehavior(handleFlyTo);

    return (
      <Box style={style}>
        {typeof layerToExport !== 'undefined' && (
          <Box className="exportTabContainer">
            <ExportLayerHeader />
            <FormProvider {...formMethods}>
              <form
                className='exportLayerForm'
                id={EXPORT_FORM_ID}
              >
                <ExportSelectionFieldsContainer />
              </form>
               <ExportLayerFooter formId={EXPORT_FORM_ID} />
            </FormProvider>
          </Box>
        )}
      </Box>
    );
  }
);
