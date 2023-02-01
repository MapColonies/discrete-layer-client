import { degreesPerPixelToZoomLevel } from '@map-colonies/mc-utils';
import { DrawType } from '@map-colonies/react-components';
import { Feature, FeatureCollection } from 'geojson';
import { get } from 'lodash';
import { types, getParent } from 'mobx-state-tree';
import { LayerMetadataMixedUnion } from '.';
import { ResponseState } from '../../common/models/response-state.enum';
import { IDrawingState } from '../components/export-layer/export-drawing-handler.component';
import { ModelBase } from './ModelBase';
import { IRootStore, RootStoreType } from './RootStore';

const INITIAL_DRAWING_STATE: IDrawingState = {
  drawing: false,
  type: DrawType.UNKNOWN
};

const INITIAL_GEOMETRY_SELECTION: FeatureCollection = { type: "FeatureCollection", features: [] };

export const exportStore = ModelBase
  .props({
    state: types.enumeration<ResponseState>(
      'State',
      Object.values(ResponseState)
    ),
    layerToExport: types.maybe(types.frozen<LayerMetadataMixedUnion>()),
    isFullLayerExportEnabled: types.maybe(types.frozen<boolean>(false)),
    tempRawSelection: types.maybe(types.frozen<Feature>()),
    geometrySelectionsCollection: types.frozen<FeatureCollection>(INITIAL_GEOMETRY_SELECTION),
    drawingState: types.maybe(types.frozen<IDrawingState>(INITIAL_DRAWING_STATE)),
    isBBoxDialogOpen: types.maybe(types.frozen<boolean>(false)),
  })
  .views((self) => ({
    get store(): IRootStore {
      return self.__getStore<RootStoreType>()
    },
    get root(): IRootStore {
      return getParent(self);
    },
  }))
  .actions((self) => {
    // const store = self.root;

    function setLayerToExport(layer: LayerMetadataMixedUnion): void {
        self.layerToExport = layer;
    }

    function setTempRawSelection(selection: Feature): void {
      self.tempRawSelection = selection;
    }

    function resetTempRawSelection(): void {
      self.tempRawSelection = undefined;
    }

    function addFeatureSelection(newSelection: Feature): void {
        const newFeatures = [...self.geometrySelectionsCollection.features, newSelection]; 
        self.geometrySelectionsCollection = {...self.geometrySelectionsCollection, features: newFeatures};
    }

    function setSelectionProperty(selectionId: string, key: string, value: unknown): void {
      const updatedFeatures = self.geometrySelectionsCollection.features
      .map(feature => {
        if(feature.properties?.id !== selectionId) return feature;

        return {...feature, properties: {...feature.properties, [key]: value}};
      });

      self.geometrySelectionsCollection = {...self.geometrySelectionsCollection, features: updatedFeatures};

    }

    function resetFeatureSelections(): void {
      self.geometrySelectionsCollection = INITIAL_GEOMETRY_SELECTION;
    }

    function resetFullLayerExport(): void {
      self.isFullLayerExportEnabled = false;
    }

    function setDrawingState(drawingState: IDrawingState): void {
      self.drawingState = {...drawingState};
    }
    
    function resetDrawingState(): void {
      self.drawingState = INITIAL_DRAWING_STATE;
    }

    function toggleIsFullLayerExportEnabled(): void {
      self.isFullLayerExportEnabled = !(self.isFullLayerExportEnabled as boolean);
      resetDrawingState();
    }

    function setIsBBoxDialogOpen(isOpen: boolean): void {
      self.isBBoxDialogOpen = isOpen;
    }

    function reset(): void {
      self.layerToExport = undefined;
      resetFeatureSelections();
      resetDrawingState();
      resetFullLayerExport();
      resetTempRawSelection();
    }
    
    return {
        setLayerToExport,
        setTempRawSelection,
        resetTempRawSelection,
        addFeatureSelection,
        setSelectionProperty,
        toggleIsFullLayerExportEnabled,
        setDrawingState,
        setIsBBoxDialogOpen,
        resetFeatureSelections,
        resetDrawingState,
        resetFullLayerExport,
        reset,
    };
  });
