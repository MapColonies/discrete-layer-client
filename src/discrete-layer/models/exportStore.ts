import { types, getParent } from 'mobx-state-tree';
import { LayerMetadataMixedUnion } from '.';
import { ResponseState } from '../../common/models/response-state.enum';
import { ModelBase } from './ModelBase';
import { IRootStore, RootStoreType } from './RootStore';

export const exportStore = ModelBase
  .props({
    state: types.enumeration<ResponseState>(
      'State',
      Object.values(ResponseState)
    ),
    layerToExport: types.maybe(types.frozen<LayerMetadataMixedUnion>()),
    isFullLayerExportEnabled: types.maybe(types.frozen<boolean>(false)),
    geometrySelectionList: types.maybe(types.frozen<unknown[]>([])),
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

    function toggleIsFullLayerExportEnabled(): void {
        self.isFullLayerExportEnabled = !self.isFullLayerExportEnabled;
    }

    function setGeometrySelectionList(newSelections: unknown[]): void {
        self.geometrySelectionList = newSelections;
    }

    function reset(): void {
      self.layerToExport = undefined;
    }
    
    return {
        setLayerToExport,
        setGeometrySelectionList,
        toggleIsFullLayerExportEnabled,
        reset,
    };
  });
