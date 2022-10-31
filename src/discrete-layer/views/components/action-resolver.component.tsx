/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useCallback, useEffect } from 'react';
import { NodeData, TreeItem } from 'react-sortable-tree';
import { observer } from 'mobx-react-lite';
import { get, isEmpty } from 'lodash';
import { existStatus, isUnpublished } from '../../../common/helpers/style';
import { MovedLayer } from '../../components/best-management/interfaces/MovedLayer';
import {
  BestRecordModelKeys,
  LayerRasterRecordModelKeys,
  LayerDemRecordModelKeys,
  Layer3DRecordModelKeys,
  QuantizedMeshBestRecordModelKeys,
  VectorBestRecordModelKeys
} from '../../components/layer-details/entity-types-keys';
import { cleanUpEntity, downloadJSONToClient } from '../../components/layer-details/utils'
import { IDispatchAction } from '../../models/actionDispatcherStore';
import { ILayerImage } from '../../models/layerImage';
import { LayerRasterRecordModelType } from '../../models/LayerRasterRecordModel';
import { useStore } from '../../models/RootStore';
import { UserAction } from '../../models/userStore';

const FIRST = 0;

interface ActionResolverComponentProps {
  handleOpenEntityDialog: (open: boolean) => void;
  handleFlyTo: () => void;
}

export const ActionResolver: React.FC<ActionResolverComponentProps> = observer((props) => {
  const { handleOpenEntityDialog, handleFlyTo } = props;

  const store = useStore();

  const baseUpdateEntity = useCallback(
    (updatedValue: ILayerImage) => {
      store.discreteLayersStore.updateLayer(updatedValue);
      store.discreteLayersStore.selectLayerByID(updatedValue.id);

      store.catalogTreeStore.updateNodeById(updatedValue.id, updatedValue);

      // After updating specific item REFRESH layerImages in order to present performed changes where it is relevant
      store.discreteLayersStore.updateTabviewsData(updatedValue);
      store.discreteLayersStore.refreshLayersImages();
    },
    [
      store.discreteLayersStore.updateLayer,
      store.discreteLayersStore.selectLayerByID,
      store.catalogTreeStore.updateNodeById,
      store.discreteLayersStore.updateTabviewsData,
    ]
  );

  const baseFootprintShow = useCallback(
    (isShown: boolean, selectedLayer: ILayerImage) => {
      if (!isEmpty(selectedLayer)) {
        store.discreteLayersStore.showFootprint(selectedLayer.id, isShown);
        store.catalogTreeStore.updateNodeById(selectedLayer.id, {
          ...selectedLayer,
          footprintShown: isShown,
        });
      }
    },
    [
      store.discreteLayersStore.showFootprint,
      store.catalogTreeStore.updateNodeById,
    ]
  );
  
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
          handleOpenEntityDialog(true);
          break;
        case 'Layer3DRecord.edit':
          // @ts-ignore
          store.discreteLayersStore.selectLayer(cleanUpEntity(data, Layer3DRecordModelKeys) as LayerMetadataMixedUnion);
          handleOpenEntityDialog(true);
          break;
        case 'LayerDemRecord.edit':
          // @ts-ignore
          store.discreteLayersStore.selectLayer(cleanUpEntity(data, LayerDemRecordModelKeys) as LayerMetadataMixedUnion);
          handleOpenEntityDialog(true);
          break;
        case 'BestRecord.edit':
          // @ts-ignore
          store.bestStore.editBest(cleanUpEntity(data, BestRecordModelKeys) as BestRecordModelType);
          break;
        case 'VectorBestRecord.edit':
          // @ts-ignore
          store.discreteLayersStore.selectLayer(cleanUpEntity(data, VectorBestRecordModelKeys) as LayerMetadataMixedUnion);
          handleOpenEntityDialog(true);
          break;
        case 'QuantizedMeshBestRecord.edit':
          // @ts-ignore
          store.discreteLayersStore.selectLayer(cleanUpEntity(data, QuantizedMeshBestRecordModelKeys) as LayerMetadataMixedUnion);
          handleOpenEntityDialog(true);
          break;
        case 'LayerRasterRecord.flyTo':
          // @ts-ignore
          store.discreteLayersStore.selectLayer(cleanUpEntity(data, LayerRasterRecordModelKeys) as LayerMetadataMixedUnion);
          handleFlyTo();
          break;
        case 'Layer3DRecord.flyTo':
          // @ts-ignore
          store.discreteLayersStore.selectLayer(cleanUpEntity(data, Layer3DRecordModelKeys) as LayerMetadataMixedUnion);
          handleFlyTo();
          break;
        case 'LayerDemRecord.flyTo':
          // @ts-ignore
          store.discreteLayersStore.selectLayer(cleanUpEntity(data, LayerDemRecordModelKeys) as LayerMetadataMixedUnion);
          handleFlyTo();
          break;
        case 'BestRecord.flyTo':
          // @ts-ignore
          store.discreteLayersStore.selectLayer(cleanUpEntity(data, BestRecordModelKeys) as LayerMetadataMixedUnion);
          handleFlyTo();
          break;
        case 'VectorBestRecord.flyTo':
          // @ts-ignore
          store.discreteLayersStore.selectLayer(cleanUpEntity(data, VectorBestRecordModelKeys) as LayerMetadataMixedUnion);
          handleFlyTo();
          break;
        case 'QuantizedMeshBestRecord.flyTo':
          // @ts-ignore
          store.discreteLayersStore.selectLayer(cleanUpEntity(data, QuantizedMeshBestRecordModelKeys) as LayerMetadataMixedUnion);
          handleFlyTo();
          break;
        case 'LayerRasterRecord.update':
          // @ts-ignore
          store.discreteLayersStore.selectLayer(cleanUpEntity(data, LayerRasterRecordModelKeys) as LayerMetadataMixedUnion, true);
          handleOpenEntityDialog(true);
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
        case 'LayerRasterRecord.saveMetadata':
        case 'Layer3DRecord.saveMetadata':
        case 'LayerDemRecord.saveMetadata':
        case 'BestRecord.saveMetadata':
        case 'VectorBestRecord.saveMetadata':
        case 'QuantizedMeshBestRecord.saveMetadata':
          downloadJSONToClient(data, 'metadata.json');
          break;
        case UserAction.SYSTEM_CALLBACK_EDIT: {
          const inputValues = data as unknown as ILayerImage;
          baseUpdateEntity(inputValues);
          break;
        }
        case UserAction.SYSTEM_CALLBACK_PUBLISH: {
          const inputValues = data as unknown as ILayerImage;
          
          baseUpdateEntity(inputValues);
          
          const node = store.catalogTreeStore.findNodeById(inputValues.id);

          if (node) {
            if (existStatus(inputValues as unknown as Record<string, unknown>) && isUnpublished(inputValues as unknown as Record<string, unknown>)) {
              store.catalogTreeStore.addNodeToParent(node.node, "tab-views.catalog.top-categories.unpublished", true);
            } else  {
              const unpublishedNode = store.catalogTreeStore.findNodeByTitle("tab-views.catalog.top-categories.unpublished", true) as NodeData;
              store.catalogTreeStore.removeChildFromParent(inputValues.id, unpublishedNode);
            }
          }
          break;
        }
        case UserAction.SYSTEM_CALLBACK_FLYTO: {
          const selectedLayer = data.selectedLayer as ILayerImage;
          baseFootprintShow(true, selectedLayer);
          break;
        }
        case UserAction.SYSTEM_CALLBACK_SHOWFOOTPRINT: {
          const selectedLayer = data.selectedLayer as ILayerImage;
          baseFootprintShow(selectedLayer.footprintShown as boolean, selectedLayer);
          break;
        }
        default:
          break;
      }
    }
  }, [store.actionDispatcherStore.action, store.discreteLayersStore, store.bestStore, props]);

  return (
    <></>
  );

});
