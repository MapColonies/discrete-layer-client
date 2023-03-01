import { DrawType } from '@map-colonies/react-components';
import { createIntl } from 'react-intl';
import uuid from 'uuid';
import CONFIG from '../../common/config';
import { Feature, FeatureCollection } from 'geojson';
import { isEmpty, isEqual } from 'lodash';
import { types, getParent, flow } from 'mobx-state-tree';
import shpjs from 'shpjs';
import { LayerMetadataMixedUnion } from '.';
import { ResponseState } from '../../common/models/response-state.enum';
import MESSAGES from '../../common/i18n';
import { IDrawingState } from '../components/export-layer/export-drawing-handler.component';
import { AvailableProperties } from '../components/export-layer/hooks/useAddFeatureWithProps';
import { getTimeStamp } from '../components/layer-details/utils';
import { TabViews } from '../views/tab-views';
import { ModelBase } from './ModelBase';
import { IRootStore, RootStoreType } from './RootStore';

const INITIAL_DRAWING_STATE: IDrawingState = {
  drawing: false,
  type: DrawType.UNKNOWN
};

const INITIAL_GEOMETRY_SELECTION: FeatureCollection = { type: "FeatureCollection", features: [] };

const locale = CONFIG.I18N.DEFAULT_LANGUAGE;
const intl = createIntl({ locale, messages: MESSAGES[locale] });

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
    isMultiSelectionAllowed: types.frozen<boolean>(false),
    importedFileError: types.frozen<null | string>(null),
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
      const newFeatures: Feature[] = [...currentFeatures, {...newSelection, properties: { ...newSelection.properties, id: uuid.v4(), selectionNumber: currentFeatures.length + 1}}]; 
      self.geometrySelectionsCollection = {...self.geometrySelectionsCollection, features: newFeatures};
      resetHasExportPreviewed();
      setImportedFileError(null);
    }
    
    function addFeaturesList(newSelections: Feature[]): void {
      newSelections.forEach(feature => addFeatureSelection(feature));
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
      self.drawingState = {...INITIAL_DRAWING_STATE};
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

    function setImportedFileError(error: string | null): void {
      self.importedFileError = error;
    }

    function sanitizeFeaturesWithProps(features: Feature[], internalPropsForDomain: Record<AvailableProperties, unknown>): Feature[] {
      const getNewFeatureProps = (feature: Feature): Record<AvailableProperties, unknown> => {
        const internalProps = Object.keys(internalPropsForDomain)
        .reduce((props, key) => ({ ...props, [key]: '' }), {} as Record<AvailableProperties, unknown>);

        const featureProps = (feature.properties ?? {}) as Record<string, unknown>;
        const newFeatureProps = {} as Record<string, unknown>;

        for(const [internalPropKey, internalPropValue] of  Object.entries(internalProps)) {
          newFeatureProps[internalPropKey] = featureProps[internalPropKey] ?? internalPropValue;
        }
        return newFeatureProps;
      }

      return features.map(feature => ({...feature, properties: getNewFeatureProps(feature)}));
    }

    const handleUploadedFile = 
    flow(function* handleUploadedFileGen(ev: ProgressEvent<FileReader>, fileType: string, internalPropsForDomain?: Record<AvailableProperties, unknown>): Generator<
      Promise<shpjs.FeatureCollectionWithFilename | shpjs.FeatureCollectionWithFilename[]>,
      void,
      shpjs.FeatureCollectionWithFilename | shpjs.FeatureCollectionWithFilename[]
    > {
        const GEOJSON_FILE_EXTENSION = 'geojson';
        const SHAPE_ZIP_FILE_EXTENSION = 'zip';
        const FEATURE_COLLECTION_TYPE = 'FeatureCollection';
        
        const multiSelectionSupportError = new Error(intl.formatMessage({id: 'export-layer.validations.multiSelectionSupport'}));
        const invalidGeojsonError = new Error(intl.formatMessage({id: 'export-layer.validations.invalidGeojson'}));
        const invalidFeaturePropsError = new Error(intl.formatMessage({id: 'export-layer.validations.invalidFeatureProps'}));
        const invalidShapefileError = new Error(intl.formatMessage({id: 'export-layer.validations.invalidShapefile'}));
        const generalInvalidError = new Error(intl.formatMessage({id: 'export-layer.validations.generalInvalidType'}));
        
        // Clear previous errors
        setImportedFileError(null);
        
        const shpOrGeojson = (ev.target?.result as unknown) as ArrayBuffer;


        switch(fileType) {
          case GEOJSON_FILE_EXTENSION: 
            try {
              const parsedGeojson = JSON.parse(new TextDecoder().decode(shpOrGeojson)) as Record<string, unknown>;
              
              if(parsedGeojson.type !== FEATURE_COLLECTION_TYPE || isEmpty(parsedGeojson.features)) {
                throw invalidGeojsonError;
              }

              const featuresList = parsedGeojson.features as Feature[];
    
              if(featuresList.length > 1 && !self.isMultiSelectionAllowed) {
                throw multiSelectionSupportError;
              }

              if(typeof internalPropsForDomain !== 'undefined') {
                addFeaturesList(sanitizeFeaturesWithProps(featuresList, internalPropsForDomain));
              }
            } catch(e) {
              setImportedFileError((e as Error).message);
            }
          break;

          case SHAPE_ZIP_FILE_EXTENSION: {
            let featureCollectionData: shpjs.FeatureCollectionWithFilename | shpjs.FeatureCollectionWithFilename[] = [];
            try {
              featureCollectionData = yield shpjs(shpOrGeojson);
            } catch(e) {
              setImportedFileError(generalInvalidError.message);
              break;
            }

            try {
              
              if(Array.isArray(featureCollectionData) || isEmpty(featureCollectionData.features)){
                throw invalidShapefileError;
              }
              
              if(featureCollectionData.features.length > 1 && !self.isMultiSelectionAllowed) {
                throw multiSelectionSupportError;
              }
              
              if(typeof internalPropsForDomain !== 'undefined') {
                addFeaturesList(sanitizeFeaturesWithProps(featureCollectionData.features, internalPropsForDomain));
              }
            } catch(e) {
              setImportedFileError((e as Error).message);
            }
          }
          break;

          default:
            setImportedFileError(generalInvalidError.message);
            break;
        }
      }
    );

    function setIsMultiSelectionAllowed(isMultiSelectionAllowed: boolean): void {
      self.isMultiSelectionAllowed = isMultiSelectionAllowed; 
    }

    function reset(): void {
      self.layerToExport = undefined;
      resetFeatureSelections();
      resetDrawingState();
      resetFullLayerExport();
      resetTempRawSelection();
      resetHasExportPreviewed();
      setImportedFileError(null);
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
        addFeaturesList,
        setSelectionProperty,
        toggleIsFullLayerExportEnabled,
        setIsFullyLayerExportEnabled,
        setDrawingState,
        setIsBBoxDialogOpen,
        setHasExportPreviewed,
        setFormData,
        setIsMultiSelectionAllowed,
        handleUploadedFile,
        resetFormData,
        resetHasExportPreviewed,
        resetFeatureSelections,
        resetDrawingState,
        resetFullLayerExport,
        reset,
    };
  });
