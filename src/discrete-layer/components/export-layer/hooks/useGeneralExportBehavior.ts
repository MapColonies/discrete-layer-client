import { useEffect } from 'react';
import { useStore } from '../../../models';

/**
 * Set selected layer and layersImages (Only one layer).
 * Show the layer's tiles and fly to it.
 */
export const useGeneralExportBehavior = (cbFunction: () => void): void => {
  const store = useStore();
  const layerToExport = store.exportStore.layerToExport;

  useEffect(() => {
    if (layerToExport) {
      store.discreteLayersStore.selectLayer(layerToExport);

      store.discreteLayersStore.setLayersImages([layerToExport], true);
      store.discreteLayersStore.showLayer(layerToExport.id, true, null);
      cbFunction();
    }
  }, [layerToExport]);
};
