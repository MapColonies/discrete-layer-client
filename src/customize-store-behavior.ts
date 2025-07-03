import { Instance } from "mobx-state-tree";
import { DocumentNode } from 'graphql';
import { rootStore } from "./discrete-layer/models";

type StoreType = Instance<typeof rootStore>;

export const customizeStoreBehavior = (store: StoreType) => {
  const originalQuery = store.query;

  //@ts-ignore
  store.query = function (
    queryStr: string | DocumentNode,
    variables?: any,
    options: any = {}
  ) {
    const mergedOptions = {
      fetchPolicy: 'no-cache',
      ...options,
    };

    console.log(`[mst-gql] global no-cache applied to query:`, mergedOptions.fetchPolicy);

    return originalQuery.call(this, queryStr, variables, mergedOptions);
  };
}
