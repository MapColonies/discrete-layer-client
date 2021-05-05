import React from 'react';
import { Method } from 'axios';
import { types, Instance, getEnv } from 'mobx-state-tree';
import { createStoreContext, createUseQueryHook } from 'mst-gql';
import { useContext } from 'react';
import { ResponseState } from '../../common/models/response-state.enum';
import { discreteLayersStore, SearchResponse } from './discreteLayersStore';
import { RootStoreBase } from './RootStore.base';

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
    })
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
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider');
  }
  return store;
};
