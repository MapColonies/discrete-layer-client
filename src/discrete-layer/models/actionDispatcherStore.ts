/* eslint-disable @typescript-eslint/naming-convention */
import { types, getParent } from 'mobx-state-tree';
import { cloneDeep } from 'lodash'
import { ResponseState } from '../../common/models/response-state.enum';
import ACTIONS_CONFIG, { IActionGroup, IEntityActions } from '../../common/actions/entity.actions';
import { ModelBase } from './ModelBase';
import { IRootStore, RootStoreType } from './RootStore';

export interface IDispatchAction {
  action: string;
  data: Record<string,unknown>;
};

export const actionDispatcherStore = ModelBase
  .props({
    state: types.enumeration<ResponseState>(
      'State',
      Object.values(ResponseState)
    ),
    actionsConfig: types.maybe(types.frozen<IEntityActions[]>(ACTIONS_CONFIG)),
    action: types.maybe(types.frozen<IDispatchAction | undefined>(undefined)),
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
    
    function getEntityActionGroups(entity: string): IActionGroup[] {
      const actions = self.actionsConfig?.find(entityActions => entityActions.entity === entity);
      return actions?.actions ?? [];
    };

    function dispatchAction(action:IDispatchAction): void {
      self.action = cloneDeep(action);
    };

    return {
      getEntityActionGroups,
      dispatchAction,
    };
  });
