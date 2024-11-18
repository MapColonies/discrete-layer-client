/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useCallback, useEffect } from 'react';
import { NodeData } from 'react-sortable-tree';
import { observer } from 'mobx-react-lite';
import { Feature } from 'geojson';
import _, { get, isEmpty } from 'lodash';
import { DrawType } from '@map-colonies/react-components';
import { existStatus, isUnpublished } from '../../../common/helpers/style';
import {
  LayerRasterRecordModelKeys,
  LayerDemRecordModelKeys,
  Layer3DRecordModelKeys,
  QuantizedMeshBestRecordModelKeys,
  VectorBestRecordModelKeys
} from '../../components/layer-details/entity-types-keys';
import { cleanUpEntity, downloadJSONToClient, importShapeFileFromClient } from '../../components/layer-details/utils'
import { IDispatchAction } from '../../models/actionDispatcherStore';
import { getLayerFootprint, ILayerImage } from '../../models/layerImage';
import { LayerRasterRecordModelType } from '../../models/LayerRasterRecordModel';
import { useStore } from '../../models/RootStore';
import { UserAction } from '../../models/userStore';
import { ContextActions } from '../../../common/actions/context.actions';
import useHandleWfsGetFeatureRequests from '../../../common/hooks/mapMenus/useHandleWfsGetFeatureRequests';
import { LayerMetadataMixedUnion } from '../../models';
import useHandleDemHeightsRequests from '../../../common/hooks/mapMenus/useHandleDemHeightsRequests';
import useHandleWfsPolygonPartsRequests from '../../../common/hooks/mapMenus/useHandleWfsPolygonPartsRequests';
import CONFIG from '../../../common/config';
import { ExportActions } from '../../components/export-layer/hooks/useDomainExportActionsConfig';
import useAddFeatureWithProps from '../../components/export-layer/hooks/useAddFeatureWithProps';
import { getWFSFeatureTypeName } from '../../components/layer-details/raster/pp-map.utils';
import { TabViews } from '../tab-views';
import { useEnums } from '../../../common/hooks/useEnum.hook';

const FIRST = 0;

interface ActionResolverComponentProps {
  handleOpenEntityDialog: (open: boolean) => void;
  handleFlyTo: () => void;
  handleTabViewChange: (tabView: TabViews) => void;
  activeTabView: TabViews;
}

export const ActionResolver: React.FC<ActionResolverComponentProps> = observer((props) => {
  const { handleOpenEntityDialog, handleFlyTo, handleTabViewChange, activeTabView } = props;

  const store = useStore();
  const ENUMS = useEnums();

  const {internalFields: exportDomainInternalFields} = useAddFeatureWithProps(false);
  
  const { setGetFeatureOptions } = useHandleWfsGetFeatureRequests();
  const { setDemHeightsOptions } = useHandleDemHeightsRequests();
  const { setGetPolygonPartsFeatureOptions } = useHandleWfsPolygonPartsRequests();
  
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
        
        const shouldUpdateTreeNode = activeTabView === TabViews.CATALOG;

        if(shouldUpdateTreeNode) {
          store.catalogTreeStore.updateNodeById(selectedLayer.id, {
            ...selectedLayer,
            footprintShown: isShown,
          });
        }
      }
    },
    [
      store.discreteLayersStore.showFootprint,
      store.catalogTreeStore.updateNodeById,
      activeTabView
    ]
  );

  const basePPUpdateErrorShow = useCallback(
    (ppResolutionsUpdateError: Record<string,string[]>) => {
      store.discreteLayersStore.setCustomValidationError(ppResolutionsUpdateError);
    },
    []
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
        case 'Layer3DRecord.analyze':
          window.open(`${CONFIG.WEB_TOOLS_URL}/${CONFIG.MODEL_ANALYZER_ROUTE}?model_ids=${data.productId}&token=${CONFIG.MODEL_ANALYZER_TOKEN_VALUE}`);
          break;
        case 'LayerRasterRecord.analyze':
        case 'LayerDemRecord.analyze':
        case 'VectorBestRecord.analyze':
        case 'QuantizedMeshBestRecord.analyze':
          break;
        case 'Job.retry':
          // Is handled in jobs.dialog.tsx
          break;
        case 'LayerRasterRecord.saveMetadata':
        case 'Layer3DRecord.saveMetadata':
        case 'LayerDemRecord.saveMetadata':
        case 'VectorBestRecord.saveMetadata':
        case 'QuantizedMeshBestRecord.saveMetadata':
          downloadJSONToClient(data, 'metadata.json');
          break;
        case 'LayerRasterRecord.export': {
          // @ts-ignore
          const selectedLayerToExport = cleanUpEntity(data, LayerRasterRecordModelKeys) as LayerMetadataMixedUnion;
          store.exportStore.reset();
          store.exportStore.setLayerToExport(selectedLayerToExport);
          break;
        }
        case 'Layer3DRecord.export': {
          // @ts-ignore
          const selectedLayerToExport = cleanUpEntity(data, Layer3DRecordModelKeys) as LayerMetadataMixedUnion;
          store.exportStore.reset();
          store.exportStore.setLayerToExport(selectedLayerToExport);
          break;
        }
        case 'LayerDemRecord.export': {
          // @ts-ignore
          const selectedLayerToExport = cleanUpEntity(data, LayerDemRecordModelKeys) as LayerMetadataMixedUnion;
          store.exportStore.reset();
          store.exportStore.setLayerToExport(selectedLayerToExport);
          break;
        }
        case 'VectorBestRecord.export':
          break;
        case 'QuantizedMeshBestRecord.export':
          break;
        case ContextActions.QUERY_WFS_FEATURE: {
          const coordinates = data.coordinates as { longitude: number, latitude: number };
          const typeName = data.feature as string;
          const closeMenu = (data.handleClose as (() => void | undefined));

          setGetFeatureOptions({
            pointCoordinates: [
              coordinates.longitude.toString(),
              coordinates.latitude.toString(),
            ],
            typeName,
            count: 1,
            onDataResolved: closeMenu,
          });
          
          break;
        }
        case ContextActions.QUERY_POLYGON_PARTS: {
          const coordinates = data.coordinates as { longitude: number, latitude: number };
          const closeMenu = (data.handleClose as (() => void | undefined));

          setGetPolygonPartsFeatureOptions({
            feature: {
              "type": "Feature",
              "properties": {},
              "geometry": {
                "coordinates": [
                  coordinates.longitude.toString(),
                  coordinates.latitude.toString()
                ],
                "type": "Point"
              }
            },
            typeName: getWFSFeatureTypeName(data?.layerRecord as LayerRasterRecordModelType, ENUMS),
            shouldFlyToFeatures: true,
            // filterProperties: [{ propertyName: "recordId", propertyValue: _.get(data?.layerRecord, 'id') as string }],
            onDataResolved: closeMenu,
            dWithin: 0
          });
          
          break;
        }
        case ContextActions.QUERY_DEM_HEIGHT: {
          const coordinates = data.coordinates as { longitude: number, latitude: number };
          const closeMenu = (data.handleClose as (() => void | undefined));

          setDemHeightsOptions({
            positions: [coordinates],
            onDataResolved: closeMenu,
          });
          
          break;
        }
        case ExportActions.DRAW_FOOTPRINT: {
          const {layerToExport} = store.exportStore;
          store.exportStore.setTempRawSelection(getLayerFootprint(layerToExport as LayerMetadataMixedUnion, false) as Feature);
          break;
        }
        case ExportActions.TOGGLE_FULL_LAYER_EXPORT: {
          const {layerToExport} = store.exportStore;

          if(data.is3DInit as boolean) {
            store.exportStore.resetFeatureSelections();
            store.exportStore.setTempRawSelection(getLayerFootprint(layerToExport as LayerMetadataMixedUnion, false) as Feature);
            store.exportStore.setIsFullyLayerExportEnabled(true);

            break;
          }

          if(!store.exportStore.isFullLayerExportEnabled) {
            // Clean any previous selections
            store.exportStore.resetFeatureSelections();
            store.exportStore.setTempRawSelection(getLayerFootprint(layerToExport as LayerMetadataMixedUnion, false) as Feature);
          } else {
            store.exportStore.resetFeatureSelections();
          }

          store.exportStore.toggleIsFullLayerExportEnabled();
          break;
        }
        case ExportActions.DRAW_RECTANGLE:
          store.exportStore.setDrawingState({
            drawing: true,
            type: DrawType.BOX
          })
          break;
        case ExportActions.DRAW_POLYGON:
          store.exportStore.setDrawingState({
            drawing: true,
            type: DrawType.POLYGON
          })
          break;
        case ExportActions.DRAW_BY_COORDINATES:
          store.exportStore.setIsBBoxDialogOpen(true);
          break;
        case ExportActions.CLEAR_DRAWINGS:
          store.exportStore.resetFeatureSelections();
          store.exportStore.resetFullLayerExport();
          store.exportStore.resetHasExportPreviewed();
          store.exportStore.resetDrawingState();
          break;
        case ExportActions.IMPORT_FROM_SHAPE_FILE: 
          importShapeFileFromClient((evt, fileType) => {
            void store.exportStore.handleUploadedFile(evt, fileType, exportDomainInternalFields);
          }, true);
          break;
        case ExportActions.EXPORT_HOT_AREA_SELECTION:
          store.exportStore.setTempRawSelection(data as unknown as Feature);
          break;
        case ExportActions.END_EXPORT_SESSION:
          handleTabViewChange(TabViews.CATALOG);
          store.discreteLayersStore.resetTabView([TabViews.EXPORT_LAYER]);
          store.exportStore.reset();
          break;
        // System Callback operations
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
        case UserAction.SYSTEM_CALLBACK_SHOW_PPERROR_ON_UPDATE: {
          basePPUpdateErrorShow(data as Record<string,string[]>);
          break;
        }
        default:
          break;
      }
    }
  }, [store.actionDispatcherStore.action, store.discreteLayersStore]);

  return (
    <></>
  );

});
