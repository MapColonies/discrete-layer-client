import { Box } from '@map-colonies/react-components';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useStore } from '../../models';
import { UserAction } from '../../models/userStore';
import './export-layer.component.css';

interface ExportLayerComponentProps {
    style?: {[key: string]: string};
    handleFlyTo: () => void;
}

export const ExportLayerComponent: React.FC<ExportLayerComponentProps> = observer(({ style, handleFlyTo }) => {
    const store = useStore();

    useEffect(() => {
        if(store.exportStore.layerToExport) {
            store.discreteLayersStore.selectLayer(store.exportStore.layerToExport);
            handleFlyTo(); 
        }
    }, [store.exportStore.layerToExport])

  return <Box style={style}>
    export panel!
  </Box>
})