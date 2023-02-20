import { Feature } from 'geojson';
import { get } from 'lodash';
import { useContext, useEffect, useMemo } from 'react';
import EnumsMapContext, { IEnumsMapType } from '../../../../common/contexts/enumsMap.context';
import { LayerMetadataMixedUnion, RecordType, useStore } from '../../../models';
import { getLayerFootprint } from '../../../models/layerImage';
import { ExportActions } from './useDomainExportActionsConfig';

/**
 * Set selected layer and layersImages (Only one layer).
 * Show the layer's tiles and fly to it.
 * 
 * For 3D:
 *  Toggle full export mode.
 */
export const useGeneralExportBehavior = (cbFunction: () => void): void => {
  const store = useStore();
  const layerToExport = store.exportStore.layerToExport;

  const { enumsMap } = useContext(EnumsMapContext);
  const enums = enumsMap as IEnumsMapType;
  const layerRecordType = useMemo(() => get(enums, layerToExport?.productType as string).parentDomain as RecordType, [layerToExport]);


  useEffect(() => {
    if (layerToExport) {
      store.discreteLayersStore.selectLayer(layerToExport);

      store.discreteLayersStore.setLayersImages([layerToExport], true);
      store.discreteLayersStore.showLayer(layerToExport.id, true, null);
      
      switch(layerRecordType) {
        case RecordType.RECORD_3D: {
          const INVOKE_ON_CLEAN_STACK = 0;
          
          setTimeout(() => {
            store.actionDispatcherStore.dispatchAction({
              action: ExportActions.TOGGLE_FULL_LAYER_EXPORT,
              data: {}
            });
          }, INVOKE_ON_CLEAN_STACK);
          break;
        }

        default:
          break;
      }
      
      cbFunction();
    }
  }, [layerToExport]);
};
