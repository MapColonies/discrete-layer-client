import { Box } from '@map-colonies/react-components';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { EntityActionsTypes } from '../../../common/actions/entity.actions';
import {
  EntityDescriptorModelType,
  useStore,
} from '../../models';
import ExportLayerHeader from './export-layer-details.component';

import './export-layer.component.css';

interface ExportLayerComponentProps {
  style?: { [key: string]: string };
  handleFlyTo: () => void;
}

export const ExportLayerComponent: React.FC<ExportLayerComponentProps> = observer(
  ({ style, handleFlyTo }) => {
    const store = useStore();

    const layerToExport = store.exportStore.layerToExport;
    const entityDescriptors = store.discreteLayersStore.entityDescriptors as EntityDescriptorModelType[];

    useEffect(() => {
      if (layerToExport) {
        store.discreteLayersStore.selectLayer(layerToExport);

        // Should we handle multiple layers to export or it will always be a single layer?
        store.discreteLayersStore.setLayersImages([layerToExport], true);
        store.discreteLayersStore.showLayer(layerToExport.id, true, null);
        handleFlyTo();
      }

      const actions = store.actionDispatcherStore.getEntityActionGroups('LayerRasterRecord');
      console.log(actions.filter(({type}) => type === EntityActionsTypes.EXPORT_ACTIONS));
    }, [layerToExport]);

    return (
      <Box style={style}>
        {typeof layerToExport !== 'undefined' && (
          <ExportLayerHeader
            entityDescriptors={entityDescriptors}
            layerToExport={layerToExport}
          />
        )}
        export panel!
      </Box>
    );
  }
);
