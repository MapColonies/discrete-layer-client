/* eslint-disable @typescript-eslint/naming-convention */
import { types, getParent } from 'mobx-state-tree';
import { ResponseState } from '../../common/models/response-state.enum';
import CONFIG from '../../common/config';
import { ModelBase } from './ModelBase';
import { IRootStore, RootStoreType } from './RootStore';

enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum UserAction {
  ACTION_SYSTEMJOBS = 'action_systemJobs',

  ENTITY_ACTION_LAYERRASTERRECORD_CREATE = 'entity_action.LayerRasterRecord.create',
  ENTITY_ACTION_LAYER3DRECORD_CREATE = 'entity_action.Layer3DRecord.create',
  ENTITY_ACTION_BESTRECORD_CREATE = 'entity_action.BestRecord.create',
  ENTITY_ACTION_LAYERRASTERRECORD_EDIT = 'entity_action.LayerRasterRecord.edit',
  ENTITY_ACTION_LAYER3DRECORD_EDIT = 'entity_action.Layer3DRecord.edit',
  ENTITY_ACTION_BESTRECORD_EDIT = 'entity_action.BestRecord.edit',

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
  permitions: UserActionKeys;
}

const ROLES: IRole[] = [
  {
    role: UserRole.ADMIN,
    permitions: {
      'action_systemJobs': true,
      'entity_action.LayerRasterRecord.create': true,
      'entity_action.Layer3DRecord.create': true,
      'entity_action.BestRecord.create': true,
      'entity_action.LayerRasterRecord.edit': true,
      'entity_action.Layer3DRecord.edit': true,
      'entity_action.BestRecord.edit': true,
    },
  },
  {
    role: UserRole.USER,
    permitions: {
      'action_systemJobs': false,
      'entity_action.LayerRasterRecord.create': false,
      'entity_action.Layer3DRecord.create': false,
      'entity_action.BestRecord.create': false,
      'entity_action.LayerRasterRecord.edit': false,
      'entity_action.Layer3DRecord.edit': false,
      'entity_action.BestRecord.edit': false,
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
    
    function isActionAllowed(action: UserAction | string): boolean {
      const role = ROLES.find(item => item.role === self.user?.role);
      return  role ? role.permitions[action as UserAction] as boolean : false;
    }

    return {
      isActionAllowed,
    };
  });
