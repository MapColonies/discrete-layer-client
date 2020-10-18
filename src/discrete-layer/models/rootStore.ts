import { Method } from 'axios';
import { types, Instance, getEnv } from 'mobx-state-tree';
import { useContext, createContext } from 'react';
import { ResponseState } from '../../common/models/response-state.enum';
import { discreteLayersStore, SearchResponse } from './discreteLayersStore';

type FetchAction = (
  url: string,
  method: Method,
  params: Record<string, unknown>
) => Promise<SearchResponse>;

export const baseRootStore = types
  .model({
    discreteLayersStore: types.optional(discreteLayersStore, {
      state: ResponseState.IDLE,
      searchParams: {},
    }),
  })
  .views((self) => ({
    get fetch(): FetchAction {
      const env: { fetch: FetchAction } = getEnv(self);
      return env.fetch;
    },
  }));

export const rootStore = baseRootStore;
export interface IBaseRootStore extends Instance<typeof baseRootStore> {}
export interface IRootStore extends Instance<typeof rootStore> {}
const rootStoreContext = createContext<null | IRootStore | IBaseRootStore>(
  null
);

export const StoreProvider = rootStoreContext.Provider;
export const useStore = (): IRootStore | IBaseRootStore => {
  const store = useContext(rootStoreContext);
  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider');
  }
  return store;
};
