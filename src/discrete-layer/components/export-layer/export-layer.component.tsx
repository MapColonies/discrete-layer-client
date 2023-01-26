import { Box } from '@map-colonies/react-components';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../models';
import ExportLayerFooter from './export-layer-footer.component';
import ExportLayerHeader from './export-layer-header.component';
import { useGeneralExportBehavior } from './hooks/useGeneralExportBehavior';
import './export-layer.component.css';
interface ExportLayerComponentProps {
  style?: { [key: string]: string };
  handleFlyTo: () => void;
}

export const ExportLayerComponent: React.FC<ExportLayerComponentProps> = observer(
  ({ style, handleFlyTo }) => {
    const store = useStore();

    const layerToExport = store.exportStore.layerToExport;
    useGeneralExportBehavior(handleFlyTo);

    return (
        <Box style={style}>
          {typeof layerToExport !== 'undefined' && (
            <Box className='exportTabContainer'>
              <ExportLayerHeader />
              <ExportLayerFooter />
            </Box>
          )}
        </Box>
    );
  }
);
