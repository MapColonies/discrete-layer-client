import { QueryLike } from 'mst-gql';
import { IBaseRootStore, IRootStore, useQuery, useStore } from '../../discrete-layer/models/RootStore';
import { useEffect } from 'react';
import { get } from 'lodash';

export const useParallelQueries = (queries: QueryLike<IRootStore | IBaseRootStore, unknown>[]) => {
    const responses = queries.map( (query: QueryLike<IRootStore | IBaseRootStore, unknown>) => useQuery(query) )
    return responses;
};

export const useParallelSearchQueries = (queries: QueryLike<IRootStore | IBaseRootStore, unknown>[]) => {
    const store = useStore();
    const resp = useParallelQueries(queries);

    useEffect(() => {
        if(resp[0].data !== undefined)
            store.discreteLayersStore.setLayersImages(get(resp[0].data, 'search'), false)
    }, [resp[0].data]);

    useEffect(() => {
        if(resp[1].data !== undefined)
            store.discreteLayersStore.setLayersImages(get(resp[1].data, 'search'), false)
    }, [resp[1].data]);
};
