import React from 'react';
import { Method } from 'axios';
import { types, Instance, getEnv } from 'mobx-state-tree';
import { createStoreContext, createUseQueryHook } from 'mst-gql';
import { useContext } from 'react';
import { ResponseState } from '../../common/models/response-state.enum';
import { discreteLayersStore, SearchResponse } from './discreteLayersStore';
import { RootStoreBase } from './RootStore.base';
import { userStore } from './userStore';
import { actionDispatcherStore } from './actionDispatcherStore';
import { catalogTreeStore } from './catalogTreeStore';
import { mapMenusManagerStore } from './mapMenusManagerStore';
import { exportStore } from './exportStore';
import { servicesAvailabilityStore } from './servicesAvailabilityStore';

type FetchAction = (
  url: string,
  method: Method,
  params: Record<string, unknown>
) => Promise<SearchResponse>;

export const baseRootStore = RootStoreBase
  .props({
    discreteLayersStore: types.optional(discreteLayersStore, {
      state: ResponseState.IDLE,
      searchParams: {},
    }),
    userStore: types.optional(userStore, {
      state: ResponseState.IDLE,
    }),
    actionDispatcherStore: types.optional(actionDispatcherStore, {
      state: ResponseState.IDLE,
    }),
    catalogTreeStore: types.optional(catalogTreeStore, {
      state: ResponseState.IDLE,
    }),
    mapMenusManagerStore: types.optional(mapMenusManagerStore, {
      state: ResponseState.IDLE,
    }),
    exportStore: types.optional(exportStore, {
      state: ResponseState.IDLE,
    }),
    servicesAvailabilityStore: types.optional(servicesAvailabilityStore, {
      state: ResponseState.IDLE,
    }),
  })
  .views((self) => ({
    get fetch(): FetchAction {
      const env: { fetch: FetchAction } = getEnv(self);
      return env.fetch;
    },
  }))
  .actions(self => ({
    // This is an auto-generated example action.
    log(): void {
      console.log(JSON.stringify(self))
    }
  }))

export const rootStore = baseRootStore;

export interface RootStoreType extends Instance<typeof rootStore.Type> {}
export interface IBaseRootStore extends Instance<typeof baseRootStore> {}
export interface IRootStore extends Instance<typeof rootStore> {}

export const rootStoreContext = createStoreContext<IRootStore | IBaseRootStore>(React)
export const useQuery = createUseQueryHook(rootStoreContext, React)

export const StoreProvider = rootStoreContext.Provider;
export const useStore = (): IRootStore | IBaseRootStore => {
  const store = useContext(rootStoreContext);

  // // Used to init stores
  // ((): void => {
  // })();

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider');
  }
  return store;
};
