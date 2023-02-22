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
import { isEmpty } from 'lodash';
import { TabViews } from '../../views/tab-views';
interface ExportLayerComponentProps {
  style?: { [key: string]: string };
  handleFlyTo: () => void;
  setActiveTabView: (tabView: TabViews) => void;
}

const EXPORT_FORM_ID = 'exportForm';

export const ExportLayerComponent: React.FC<ExportLayerComponentProps> = observer(
  ({ style, handleFlyTo, setActiveTabView }) => {
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
               <ExportLayerFooter setActiveTabView={setActiveTabView} />
            </FormProvider>
          </Box>
        )}
      </Box>
    );
  }
);
