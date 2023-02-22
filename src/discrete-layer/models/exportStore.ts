import { DrawType } from '@map-colonies/react-components';
import { Feature, FeatureCollection } from 'geojson';
import { get } from 'lodash';
import { types, getParent } from 'mobx-state-tree';
import { LayerMetadataMixedUnion } from '.';
import { ResponseState } from '../../common/models/response-state.enum';
import { IDrawingState } from '../components/export-layer/export-drawing-handler.component';
import { TabViews } from '../views/tab-views';
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
    isFullLayerExportEnabled: types.frozen<boolean>(false),
    tempRawSelection: types.maybe(types.frozen<Feature>()),
    geometrySelectionsCollection: types.frozen<FeatureCollection>(INITIAL_GEOMETRY_SELECTION),
    drawingState: types.maybe(types.frozen<IDrawingState>(INITIAL_DRAWING_STATE)),
    isBBoxDialogOpen: types.maybe(types.frozen<boolean>(false)),
    highlightedSelection: types.maybe(types.frozen<Feature>()),
    hasExportPreviewed: types.frozen<boolean>(false),
    formData: types.frozen<Record<string, unknown>>({}),
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
    const store = self.root;

    function getFeatureById(id: string): Feature | null {
      return self.geometrySelectionsCollection.features.find(feature => feature.properties?.id === id) ?? null;
    }

    function removeFeatureById(id: string): void {
      const currentFeatures = [...self.geometrySelectionsCollection.features];
      const filteredFeatures = currentFeatures.filter(feat => feat.properties?.id !== id).map((feat, i) => ({...feat, properties: { ...feat.properties, selectionNumber: i + 1 }}));

      self.geometrySelectionsCollection = {...self.geometrySelectionsCollection, features: filteredFeatures};
      resetHasExportPreviewed();
    }

    function setHighlightedFeature(feature: Feature): void {
      self.highlightedSelection = feature;
    }

    function resetHighlightedFeature(): void {
      self.highlightedSelection = undefined;
    }

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
      const currentFeatures = self.geometrySelectionsCollection.features;
        const newFeatures: Feature[] = [...currentFeatures, {...newSelection, properties: { ...newSelection.properties, selectionNumber: currentFeatures.length + 1}}]; 
        self.geometrySelectionsCollection = {...self.geometrySelectionsCollection, features: newFeatures};
        resetHasExportPreviewed();
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
      self.isFullLayerExportEnabled = !self.isFullLayerExportEnabled;
      resetDrawingState();
    }

    function setIsFullyLayerExportEnabled(isFullLayerExportEnabled: boolean): void {
      self.isFullLayerExportEnabled = isFullLayerExportEnabled;
    }

    function setIsBBoxDialogOpen(isOpen: boolean): void {
      self.isBBoxDialogOpen = isOpen;
    }

    function setHasExportPreviewed(hasPreviewed: boolean): void {
      self.hasExportPreviewed = hasPreviewed;
    }

    function resetHasExportPreviewed(): void {
      self.hasExportPreviewed = false;
    }

    function setFormData(formData: Record<string, unknown>): void {
      self.formData = formData;
    }

    function resetFormData(): void {
      self.formData = {};
    }

    function reset(): void {
      self.layerToExport = undefined;
      resetFeatureSelections();
      resetDrawingState();
      resetFullLayerExport();
      resetTempRawSelection();
      resetHasExportPreviewed();
      resetFormData();

      store.discreteLayersStore.resetTabView([TabViews.EXPORT_LAYER]);
    }
    
    return {
        getFeatureById,
        removeFeatureById,
        setHighlightedFeature,
        resetHighlightedFeature,
        setLayerToExport,
        setTempRawSelection,
        resetTempRawSelection,
        addFeatureSelection,
        setSelectionProperty,
        toggleIsFullLayerExportEnabled,
        setIsFullyLayerExportEnabled,
        setDrawingState,
        setIsBBoxDialogOpen,
        setHasExportPreviewed,
        setFormData,
        resetFormData,
        resetHasExportPreviewed,
        resetFeatureSelections,
        resetDrawingState,
        resetFullLayerExport,
        reset,
    };
  });
