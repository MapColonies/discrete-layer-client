/* eslint-disable @typescript-eslint/naming-convention */
import { types, getParent } from 'mobx-state-tree';
import { ResponseState } from '../../common/models/response-state.enum';
import { ModelBase } from './ModelBase';
import { IRootStore, RootStoreType } from './RootStore';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum UserAction {
  SYSTEM_ACTION_JOBS = 'system_action.jobs',
  SYSTEM_ACTION_COREINFO = 'system_action.coreInfo',
  SYSTEM_ACTION_FILTER = 'system_action.filter',
  SYSTEM_ACTION_FREETEXTSEARCH = 'system_action.freeTextSearch',
  SYSTEM_ACTION_SIDEBARCOLLAPSEEXPAND = 'system_action.sidebarCollapseExapnd',

  ENTITY_ACTION_LAYERRASTERRECORD_CREATE = 'entity_action.LayerRasterRecord.create',
  ENTITY_ACTION_LAYER3DRECORD_CREATE = 'entity_action.Layer3DRecord.create',
  ENTITY_ACTION_LAYERDEMRECORD_CREATE = 'entity_action.LayerDemRecord.create',
  ENTITY_ACTION_BESTRECORD_CREATE = 'entity_action.BestRecord.create',
  ENTITY_ACTION_LAYERRASTERRECORD_EDIT = 'entity_action.LayerRasterRecord.edit',
  ENTITY_ACTION_LAYER3DRECORD_EDIT = 'entity_action.Layer3DRecord.edit',
  ENTITY_ACTION_LAYERDEMRECORD_EDIT = 'entity_action.LayerDemRecord.edit',
  ENTITY_ACTION_BESTRECORD_EDIT = 'entity_action.BestRecord.edit',
  ENTITY_ACTION_VECTORBESTRECORD_EDIT = 'entity_action.VectorBestRecord.edit',
  ENTITY_ACTION_QUANTIZEDMESHBESTRECORD_EDIT = 'entity_action.QuantizedMeshBestRecord.edit',
  ENTITY_ACTION_LAYERRASTERRECORD_UPDATE = 'entity_action.LayerRasterRecord.update',
  ENTITY_ACTION_LAYERRASTERRECORD_DELETE = 'entity_action.LayerRasterRecord.delete',
  ENTITY_ACTION_LAYER3DRECORD_DELETE = 'entity_action.Layer3DRecord.delete',
  ENTITY_ACTION_LAYERDEMRECORD_DELETE = 'entity_action.LayerDemRecord.delete',
  ENTITY_ACTION_BESTRECORD_DELETE = 'entity_action.BestRecord.delete',
  ENTITY_ACTION_LAYER3DRECORD_PUBLISH = 'entity_action.Layer3DRecord.publish',
  ENTITY_ACTION_LAYERRASTERRECORD_SAVEMETADATA = 'entity_action.LayerRasterRecord.saveMetadata',
  ENTITY_ACTION_LAYER3DRECORD_SAVEMETADATA = 'entity_action.Layer3DRecord.saveMetadata',
  ENTITY_ACTION_LAYERDEMRECORD_SAVEMETADATA = 'entity_action.LayerDemRecord.saveMetadata',
  ENTITY_ACTION_BESTRECORD_SAVEMETADATA = 'entity_action.BestRecord.saveMetadata',
  ENTITY_ACTION_VECTORBESTRECORD_SAVEMETADATA = 'entity_action.VectorBestRecord.saveMetadata',
  ENTITY_ACTION_LAYERRASTERRECORD_FLYTO = 'entity_action.LayerRasterRecord.flyTo',
  ENTITY_ACTION_LAYER3DRECORD_FLYTO = 'entity_action.Layer3DRecord.flyTo',
  ENTITY_ACTION_LAYERRASTERRECORD_MOVETOTOP = 'entity_action.LayerRasterRecord.moveToTop',
  ENTITY_ACTION_LAYERRASTERRECORD_MOVEUP = 'entity_action.LayerRasterRecord.moveUp',
  ENTITY_ACTION_LAYERRASTERRECORD_MOVEDOWN = 'entity_action.LayerRasterRecord.moveDown',
  ENTITY_ACTION_LAYERRASTERRECORD_MOVETOBOTTOM = 'entity_action.LayerRasterRecord.moveToBottom',

  SYSTEM_CALLBACK_EDIT = 'system_callback.editEntity',
  SYSTEM_CALLBACK_PUBLISH = 'system_callback.publish',
  SYSTEM_CALLBACK_FLYTO = 'system_callback.flyToEntity',
  SYSTEM_CALLBACK_SHOWFOOTPRINT = 'system_callback.showFootprint',
  /***  FOR FUTURE USE, ENTITY FIELD PERMISSION PATTERN EXAMPLE ***/
  // ENTITY_FIELD_ACTION_BESTRECORD_PRODUCTNAME_VIEW = 'entity_action.BestRecord.productName.view',
}

type UserActionKeys = { [K in UserAction]?: boolean; }

interface IUser {
  userName: string;
  firstName?: string;
  secondName?: string;
  eMail?: string;
  role: UserRole;
}

interface IRole {
  role: UserRole;
  permissions: UserActionKeys;
}

const ROLES: IRole[] = [
  {
    role: UserRole.ADMIN,
    permissions: {
      [UserAction.SYSTEM_ACTION_JOBS]: true,
      [UserAction.SYSTEM_ACTION_COREINFO]: true,
      [UserAction.SYSTEM_ACTION_FILTER]: false,
      [UserAction.SYSTEM_ACTION_FREETEXTSEARCH]: false,
      [UserAction.SYSTEM_ACTION_SIDEBARCOLLAPSEEXPAND]: false,
      [UserAction.ENTITY_ACTION_LAYERRASTERRECORD_CREATE]: true,
      [UserAction.ENTITY_ACTION_LAYER3DRECORD_CREATE]: true,
      [UserAction.ENTITY_ACTION_LAYERDEMRECORD_CREATE]: false,
      [UserAction.ENTITY_ACTION_BESTRECORD_CREATE]: true,
      [UserAction.ENTITY_ACTION_LAYERRASTERRECORD_EDIT]: true,
      [UserAction.ENTITY_ACTION_LAYER3DRECORD_EDIT]: true,
      [UserAction.ENTITY_ACTION_LAYERDEMRECORD_EDIT]: false,
      [UserAction.ENTITY_ACTION_BESTRECORD_EDIT]: true,
      [UserAction.ENTITY_ACTION_VECTORBESTRECORD_EDIT]: true,
      [UserAction.ENTITY_ACTION_QUANTIZEDMESHBESTRECORD_EDIT]: true,
      [UserAction.ENTITY_ACTION_LAYERRASTERRECORD_UPDATE]: false,
      [UserAction.ENTITY_ACTION_LAYERRASTERRECORD_DELETE]: true,
      [UserAction.ENTITY_ACTION_LAYER3DRECORD_DELETE]: true,
      [UserAction.ENTITY_ACTION_LAYERDEMRECORD_DELETE]: true,
      [UserAction.ENTITY_ACTION_BESTRECORD_DELETE]: true,
      [UserAction.ENTITY_ACTION_LAYER3DRECORD_PUBLISH]: true,
      [UserAction.ENTITY_ACTION_LAYERRASTERRECORD_SAVEMETADATA]: true,
      [UserAction.ENTITY_ACTION_LAYER3DRECORD_SAVEMETADATA]: true,
      [UserAction.ENTITY_ACTION_LAYERDEMRECORD_SAVEMETADATA]: true,
      [UserAction.ENTITY_ACTION_BESTRECORD_SAVEMETADATA]: true,
      [UserAction.ENTITY_ACTION_VECTORBESTRECORD_SAVEMETADATA]: true,
      [UserAction.ENTITY_ACTION_LAYERRASTERRECORD_FLYTO]: true,
      [UserAction.ENTITY_ACTION_LAYER3DRECORD_FLYTO]: true,
      [UserAction.ENTITY_ACTION_LAYERRASTERRECORD_MOVETOTOP]: true,
      [UserAction.ENTITY_ACTION_LAYERRASTERRECORD_MOVEUP]: true,
      [UserAction.ENTITY_ACTION_LAYERRASTERRECORD_MOVEDOWN]: true,
      [UserAction.ENTITY_ACTION_LAYERRASTERRECORD_MOVETOBOTTOM]: true,
    },
  },
  {
    role: UserRole.USER,
    permissions: {
      [UserAction.SYSTEM_ACTION_JOBS]: false,
      [UserAction.SYSTEM_ACTION_COREINFO]: false,
      [UserAction.SYSTEM_ACTION_FILTER]: false,
      [UserAction.SYSTEM_ACTION_FREETEXTSEARCH]: false,
      [UserAction.SYSTEM_ACTION_SIDEBARCOLLAPSEEXPAND]: false,
      [UserAction.ENTITY_ACTION_LAYERRASTERRECORD_CREATE]: false,
      [UserAction.ENTITY_ACTION_LAYER3DRECORD_CREATE]: false,
      [UserAction.ENTITY_ACTION_LAYERDEMRECORD_CREATE]: false,
      [UserAction.ENTITY_ACTION_BESTRECORD_CREATE]: false,
      [UserAction.ENTITY_ACTION_LAYERRASTERRECORD_EDIT]: false,
      [UserAction.ENTITY_ACTION_LAYER3DRECORD_EDIT]: false,
      [UserAction.ENTITY_ACTION_LAYERDEMRECORD_EDIT]: false,
      [UserAction.ENTITY_ACTION_BESTRECORD_EDIT]: false,
      [UserAction.ENTITY_ACTION_VECTORBESTRECORD_EDIT]: false,
      [UserAction.ENTITY_ACTION_QUANTIZEDMESHBESTRECORD_EDIT]: false,
      [UserAction.ENTITY_ACTION_LAYERRASTERRECORD_UPDATE]: false,
      [UserAction.ENTITY_ACTION_LAYERRASTERRECORD_DELETE]: false,
      [UserAction.ENTITY_ACTION_LAYER3DRECORD_DELETE]: false,
      [UserAction.ENTITY_ACTION_LAYERDEMRECORD_DELETE]: false,
      [UserAction.ENTITY_ACTION_BESTRECORD_DELETE]: false,
      [UserAction.ENTITY_ACTION_LAYER3DRECORD_PUBLISH]: false,
      [UserAction.ENTITY_ACTION_LAYERRASTERRECORD_SAVEMETADATA]: true,
      [UserAction.ENTITY_ACTION_LAYER3DRECORD_SAVEMETADATA]: true,
      [UserAction.ENTITY_ACTION_LAYERDEMRECORD_SAVEMETADATA]: true,
      [UserAction.ENTITY_ACTION_BESTRECORD_SAVEMETADATA]: true,
      [UserAction.ENTITY_ACTION_VECTORBESTRECORD_SAVEMETADATA]: true,
      [UserAction.ENTITY_ACTION_LAYERRASTERRECORD_FLYTO]: true,
      [UserAction.ENTITY_ACTION_LAYER3DRECORD_FLYTO]: true,
      [UserAction.ENTITY_ACTION_LAYERRASTERRECORD_MOVETOTOP]: false,
      [UserAction.ENTITY_ACTION_LAYERRASTERRECORD_MOVEUP]: false,
      [UserAction.ENTITY_ACTION_LAYERRASTERRECORD_MOVEDOWN]: false,
      [UserAction.ENTITY_ACTION_LAYERRASTERRECORD_MOVETOBOTTOM]: false,
    },
  },
];

export const userStore = ModelBase
  .props({
    state: types.enumeration<ResponseState>(
      'State',
      Object.values(ResponseState)
    ),
    user: types.maybe(types.frozen<IUser>({userName: 'user', role: UserRole.ADMIN})), /*UserRole.ADMIN*/
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

    function isActionAllowed(action: UserAction | string): boolean | undefined {
      const role = ROLES.find(item => item.role === self.user?.role);
      return role ? role.permissions[action as UserAction] as boolean : false;
    }

    function changeUserRole(role: UserRole): void {
      self.user = {...self.user, role} as IUser;

      const PRESERVE_STATE_FOR_FIELDS = ['baseMaps', 'entityDescriptors', 'searchParams'];
      store.discreteLayersStore.resetAppState(PRESERVE_STATE_FOR_FIELDS);
      void store.catalogTreeStore.initTree();
    }

    function isUserAdmin(): boolean {
      return self.user?.role === UserRole.ADMIN
    }

    return {
      isActionAllowed,
      changeUserRole,
      isUserAdmin,
    };
  });
