import { types, getParent } from "mobx-state-tree";
import { IRootStore, RootStoreType } from ".";
import { ResponseState } from "../../common/models/response-state.enum";
import { ModelBase } from "./ModelBase";
import { UserAction } from "./userStore";
import { ContextActions } from "../../common/actions/context.actions";

type UserActionToService = { [K in UserAction]?: string; }
type ContextActionToService = { [K in ContextActions]?: string; }

const ACTIONS_TO_SERVICES_PATH_MAP: UserActionToService | ContextActionToService = {
      [UserAction.SYSTEM_ACTION_JOBS]: 'jobServices.common',
      [UserAction.SYSTEM_ACTION_COREINFO]: 'serviceDiscovery',
      [UserAction.ENTITY_ACTION_LAYERRASTERRECORD_CREATE]: 'ingestionServices.raster',
      [UserAction.ENTITY_ACTION_LAYER3DRECORD_CREATE]: 'ingestionServices.3d',
      [UserAction.ENTITY_ACTION_LAYERDEMRECORD_CREATE]: 'ingestionServices.dem',
      [UserAction.ENTITY_ACTION_LAYERRASTERRECORD_EDIT]: 'catalogServices.raster',
      [UserAction.ENTITY_ACTION_LAYER3DRECORD_EDIT]: 'catalogServices.3d',
      [UserAction.ENTITY_ACTION_LAYERDEMRECORD_EDIT]: 'catalogServices.dem',
      [UserAction.ENTITY_ACTION_VECTORBESTRECORD_EDIT]: 'catalogServices.raster',
      [UserAction.ENTITY_ACTION_QUANTIZEDMESHBESTRECORD_EDIT]: 'catalogServices.dem',
      [UserAction.ENTITY_ACTION_LAYERRASTERRECORD_UPDATE]: 'ingestionServices.raster',
      [UserAction.ENTITY_ACTION_LAYERRASTERRECORD_DELETE]: 'catalogServices.raster',
      [UserAction.ENTITY_ACTION_LAYER3DRECORD_DELETE]: 'catalogServices.3d',
      [UserAction.ENTITY_ACTION_LAYERDEMRECORD_DELETE]: 'catalogServices.dem',
      [UserAction.ENTITY_ACTION_LAYERRASTERRECORD_PUBLISH]: 'catalogServices.raster',
      [UserAction.ENTITY_ACTION_LAYER3DRECORD_PUBLISH]: 'catalogServices.3d',
      [UserAction.ENTITY_ACTION_LAYERRASTERRECORD_EXPORT]: 'exportLayerServices.raster',
      [UserAction.ENTITY_ACTION_LAYER3DRECORD_EXPORT]: 'exportLayerServices.3d',
      [UserAction.ENTITY_ACTION_LAYERDEMRECORD_EXPORT]: 'exportLayerServices.dem',
      [UserAction.ENTITY_ACTION_VECTORBESTRECORD_EXPORT]: 'exportLayerServices.raster',
      [UserAction.ENTITY_ACTION_QUANTIZEDMESHBESTRECORD_EXPORT]: 'exportLayerServices.dem',
      [UserAction.FEATURE_SWITCH_USER_ROLE]: "featureSwitchUserRole",
      [ContextActions.QUERY_WFS_FEATURE]: 'wfs',
      [ContextActions.QUERY_DEM_HEIGHT]: 'demHeightsService',
      [ContextActions.QUERY_POLYGON_PARTS]: 'polygonParts'
}


export const servicesAvailabilityStore = ModelBase
  .props({
    state: types.enumeration<ResponseState>(
      'State',
      Object.values(ResponseState)
    ),
    servicesAvailability: types.maybe(types.frozen<Record<string, boolean>>({})),
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const store = self.root;

    function isActionAvailable(action: UserActionToService | ContextActionToService  | string): boolean | undefined {
      const servicePath = ACTIONS_TO_SERVICES_PATH_MAP[action as keyof (UserActionToService | ContextActionToService)];

      return self.servicesAvailability?.[servicePath as string] ?? true;
      
    }

    function setServicesAvailabilities(servicesAvailabilities: Record<string, boolean>): void {
      self.servicesAvailability = servicesAvailabilities;
    }

    return {
      isActionAvailable,
      setServicesAvailabilities,
    };
  });
