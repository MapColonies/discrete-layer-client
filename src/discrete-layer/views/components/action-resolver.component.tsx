/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  BestRecordModelKeys,
  LayerRasterRecordModelKeys,
  LayerDemRecordModelKeys,
  Layer3DRecordModelKeys,
  QuantizedMeshBestRecordModelKeys,
  VectorBestRecordModelKeys
} from '../../components/layer-details/entity-types-keys';
import { cleanUpEntity } from '../../components/layer-details/utils'
import { useStore } from '../../models/RootStore';
import { IDispatchAction } from '../../models/actionDispatcherStore';
import { MovedLayer } from '../../components/best-management/interfaces/MovedLayer';
import { LayerRasterRecordModelType } from '../../models/LayerRasterRecordModel';

const FIRST = 0;

interface ActionResolverComponentProps {
  handleOpenEntityDialog: (open: boolean) => void;
}

export const ActionResolver: React.FC<ActionResolverComponentProps> = observer((props) => {
  const store = useStore();
  
  useEffect(() => {
    if (store.actionDispatcherStore.action !== undefined) {
      const { action, data } = store.actionDispatcherStore.action as IDispatchAction;
      console.log(`  ${action} EVENT`, data);
      let numOfLayers: number;
      let order: number;

      switch (action) {
        case 'LayerRasterRecord.edit':
          // @ts-ignore
          store.discreteLayersStore.selectLayer(cleanUpEntity(data, LayerRasterRecordModelKeys) as LayerMetadataMixedUnion);
          props.handleOpenEntityDialog(true);
          break;
        case 'LayerRasterRecord.update':
          // @ts-ignore
          store.discreteLayersStore.selectLayer(cleanUpEntity(data, LayerRasterRecordModelKeys) as LayerMetadataMixedUnion, true);
          props.handleOpenEntityDialog(true);
          break;
        case 'Layer3DRecord.edit':
          // @ts-ignore
          store.discreteLayersStore.selectLayer(cleanUpEntity(data, Layer3DRecordModelKeys) as LayerMetadataMixedUnion);
          props.handleOpenEntityDialog(true);
          break;
        case 'LayerDemRecord.edit':
          // @ts-ignore
          store.discreteLayersStore.selectLayer(cleanUpEntity(data, LayerDemRecordModelKeys) as LayerMetadataMixedUnion);
          props.handleOpenEntityDialog(true);
          break;
        case 'BestRecord.edit':
          // @ts-ignore
          store.bestStore.editBest(cleanUpEntity(data, BestRecordModelKeys) as BestRecordModelType);
          break;
        case 'VectorBestRecord.edit':
          // @ts-ignore
          store.discreteLayersStore.selectLayer(cleanUpEntity(data, VectorBestRecordModelKeys) as LayerMetadataMixedUnion);
          props.handleOpenEntityDialog(true);
          break;
        case 'QuantizedMeshBestRecord.edit':
          // @ts-ignore
          store.discreteLayersStore.selectLayer(cleanUpEntity(data, QuantizedMeshBestRecordModelKeys) as LayerMetadataMixedUnion);
          props.handleOpenEntityDialog(true);
          break;
        case 'LayerRasterRecord.delete':
          // @ts-ignore
          store.bestStore.deleteLayerFromBest(data as LayerRasterRecordModelType);
          break;
        case 'LayerRasterRecord.moveToTop':
          numOfLayers = (store.bestStore.layersList as LayerRasterRecordModelType[]).length - 1;
          order = store.bestStore.getLayerOrder(data.id as string);
          if (order !== numOfLayers) {
            store.bestStore.updateMovedLayer({ id: data.id, from: numOfLayers - order, to: 0 } as MovedLayer);
          }
          break;
        case 'LayerRasterRecord.moveUp':
          numOfLayers = (store.bestStore.layersList as LayerRasterRecordModelType[]).length - 1;
          order = store.bestStore.getLayerOrder(data.id as string);
          if (order !== numOfLayers) {
            store.bestStore.updateMovedLayer({ id: data.id, from: numOfLayers - order, to: numOfLayers - order - 1 } as MovedLayer);
          }
          break;
        case 'LayerRasterRecord.moveDown':
          numOfLayers = (store.bestStore.layersList as LayerRasterRecordModelType[]).length - 1;
          order = store.bestStore.getLayerOrder(data.id as string);
          if (order !== FIRST) {
            store.bestStore.updateMovedLayer({ id: data.id, from: numOfLayers - order, to: numOfLayers - order + 1 } as MovedLayer);
          }
          break;
        case 'LayerRasterRecord.moveToBottom':
          numOfLayers = (store.bestStore.layersList as LayerRasterRecordModelType[]).length - 1;
          order = store.bestStore.getLayerOrder(data.id as string);
          if (order !== FIRST) {
            store.bestStore.updateMovedLayer({ id: data.id, from: numOfLayers - order, to: numOfLayers } as MovedLayer);
          }
          break;
        case 'Job.retry':
          // Is handled in jobs.dialog.tsx
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
