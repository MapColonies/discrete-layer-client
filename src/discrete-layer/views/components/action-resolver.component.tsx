import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { BestRecordModelKeys, LayerRasterRecordModelKeys, Layer3DRecordModelKeys, cleanUpEntity } from '../../components/layer-details/layer-details.field-info';
import { useStore } from '../../models/RootStore';
import { IDispatchAction } from '../../models/actionDispatcherStore';
import { MovedLayer } from '../../components/best-management/interfaces/MovedLayer';
import { LayerRasterRecordModelType } from '../../models/LayerRasterRecordModel';

interface ActionResolverComponentProps {
  handleOpenEntityDialog: (open: boolean) => void;
}

export const ActionResolver: React.FC<ActionResolverComponentProps> = observer((props) => {
  const store = useStore();
  
  useEffect(() => {
    if (store.actionDispatcherStore.action !== undefined) {
      const { action, data } = store.actionDispatcherStore.action as IDispatchAction;
      console.log(`  ${action} EVENT`, data);

      switch (action) {
        case 'BestRecord.edit':
          // @ts-ignore
          store.bestStore.editBest(cleanUpEntity(data, BestRecordModelKeys) as BestRecordModelType);
          break;
        case 'LayerRasterRecord.edit':
          // @ts-ignore
          store.discreteLayersStore.selectLayer(cleanUpEntity(data, LayerRasterRecordModelKeys) as LayerMetadataMixedUnion);
          
          props.handleOpenEntityDialog(true);
          break;
        case 'Layer3DRecord.edit':
          // @ts-ignore
          store.discreteLayersStore.selectLayer(cleanUpEntity(data, Layer3DRecordModelKeys) as LayerMetadataMixedUnion);
          
          props.handleOpenEntityDialog(true);
          break;
        case 'LayerRasterRecord.delete':
          // @ts-ignore
          store.bestStore.deleteLayerFromBest(data as LayerRasterRecordModelType);
          break;
        case 'LayerRasterRecord.moveToTop':
          store.bestStore.updateMovedLayer({ id: data.id, from: data.zIndex, to: (store.bestStore.layersList as LayerRasterRecordModelType[]).length-1 } as MovedLayer);
          break;
        case 'LayerRasterRecord.moveUp':
          store.bestStore.updateMovedLayer({ id: data.id, from: data.zIndex, to: (data.zIndex as number) + 1 } as MovedLayer);
          break;
        case 'LayerRasterRecord.moveDown':
          store.bestStore.updateMovedLayer({ id: data.id, from: data.zIndex, to: (data.zIndex as number) - 1 } as MovedLayer);
          break;
        case 'LayerRasterRecord.moveToBottom':
          store.bestStore.updateMovedLayer({ id: data.id, from: data.zIndex, to: 0 } as MovedLayer);
          break;
        default:
          break;
      }
    }
  }, [store.actionDispatcherStore.action, store.discreteLayersStore, store.bestStore, props]);

  return (
    <></>
  );

});
