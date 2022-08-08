/* eslint-disable @typescript-eslint/naming-convention */
import { types, getParent } from 'mobx-state-tree';
import { ResponseState } from '../../common/models/response-state.enum';
import CONFIG from '../../common/config';
import { ModelBase } from './ModelBase';
import { IRootStore, RootStoreType } from './RootStore';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum UserAction {
  ACTION_SYSTEMJOBS = 'action_systemJobs',

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
  ENTITY_ACTION_LAYERRASTERRECORD_MOVETOTOP = 'entity_action.LayerRasterRecord.moveToTop',
  ENTITY_ACTION_LAYERRASTERRECORD_MOVEUP = 'entity_action.LayerRasterRecord.moveUp',
  ENTITY_ACTION_LAYERRASTERRECORD_MOVEDOWN = 'entity_action.LayerRasterRecord.moveDown',
  ENTITY_ACTION_LAYERRASTERRECORD_MOVETOBOTTOM = 'entity_action.LayerRasterRecord.moveToBottom',


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
      'action_systemJobs': true,
      'entity_action.LayerRasterRecord.create': true,
      'entity_action.Layer3DRecord.create': true,
      'entity_action.LayerDemRecord.create': false,
      'entity_action.BestRecord.create': true,
      'entity_action.LayerRasterRecord.edit': true,
      'entity_action.Layer3DRecord.edit': true,
      'entity_action.LayerDemRecord.edit': false,
      'entity_action.BestRecord.edit': true,
      'entity_action.VectorBestRecord.edit': true,
      'entity_action.QuantizedMeshBestRecord.edit': true,
      'entity_action.LayerRasterRecord.update': false,
      'entity_action.LayerRasterRecord.delete': true,
      'entity_action.Layer3DRecord.delete': true,
      'entity_action.LayerDemRecord.delete': true,
      'entity_action.BestRecord.delete': true,
      'entity_action.LayerRasterRecord.moveToTop': true,
      'entity_action.LayerRasterRecord.moveUp': true,
      'entity_action.LayerRasterRecord.moveDown': true,
      'entity_action.LayerRasterRecord.moveToBottom': true,
    },
  },
  {
    role: UserRole.USER,
    permissions: {
      'action_systemJobs': false,
      'entity_action.LayerRasterRecord.create': false,
      'entity_action.Layer3DRecord.create': false,
      'entity_action.LayerDemRecord.create': false,
      'entity_action.BestRecord.create': false,
      'entity_action.LayerRasterRecord.edit': false,
      'entity_action.Layer3DRecord.edit': false,
      'entity_action.LayerDemRecord.edit': false,
      'entity_action.BestRecord.edit': false,
      'entity_action.VectorBestRecord.edit': false,
      'entity_action.QuantizedMeshBestRecord.edit': false,
      'entity_action.LayerRasterRecord.update': false,
      'entity_action.LayerRasterRecord.delete': false,
      'entity_action.Layer3DRecord.delete': false,
      'entity_action.LayerDemRecord.delete': false,
      'entity_action.BestRecord.delete': false,
      'entity_action.LayerRasterRecord.moveToTop': false,
      'entity_action.LayerRasterRecord.moveUp': false,
      'entity_action.LayerRasterRecord.moveDown': false,
      'entity_action.LayerRasterRecord.moveToBottom': false,
    },
  },
];

export const userStore = ModelBase
  .props({
    state: types.enumeration<ResponseState>(
      'State',
      Object.values(ResponseState)
    ),
    user: types.maybe(types.frozen<IUser>({userName: 'user', role: CONFIG.DEFAULT_USER.ROLE as UserRole})), /*UserRole.ADMIN*/
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
    function isActionAllowed(action: UserAction | string): boolean | undefined {
      const role = ROLES.find(item => item.role === self.user?.role);
      return role ? role.permissions[action as UserAction] as boolean : false;
    }

    function changeUserRole(role: UserRole): void {
      self.user = {...self.user, role} as IUser;
    }

    return {
      isActionAllowed,
      changeUserRole,
    };
  });
