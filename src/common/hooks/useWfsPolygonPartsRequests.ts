import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import {
  GetFeatureModelType,
  useQuery,
  useStore,
} from '../../discrete-layer/models';
import { WfsPolygonPartsGetFeatureParams } from '../../discrete-layer/models/RootStore.base';

type GetFeatureOptions = WfsPolygonPartsGetFeatureParams;

const useWfsPolygonPartsRequests = (): {
  data: { getPolygonPartsFeature: GetFeatureModelType} | undefined;
  loading: boolean;
  queryPolygonPartsFeatureOptions: WfsPolygonPartsGetFeatureParams | undefined;
  setQueryPolygonPartsFeatureOptions: (options: GetFeatureOptions) => void;
} => {
  const store = useStore();
  const [queryPolygonPartsFeatureOptions, setQueryPolygonPartsFeatureOptions] = useState<GetFeatureOptions>();

  const { data, loading, setQuery } = useQuery<{ getPolygonPartsFeature: GetFeatureModelType}>();

  useEffect(() => {
    if (queryPolygonPartsFeatureOptions) {
      setQuery(store.queryGetPolygonPartsFeature({
        data: { ...queryPolygonPartsFeatureOptions }
      }));
    }
  }, [queryPolygonPartsFeatureOptions]);

  useEffect(() => {
    if (queryPolygonPartsFeatureOptions && !loading && data) {
      const featureInfo = {
        ...cloneDeep(data.getPolygonPartsFeature),
        feature: queryPolygonPartsFeatureOptions.feature,
      };
      store.discreteLayersStore.setPolygonPartsInfo(featureInfo);
    } 
  }, [data, loading]);

  return { data, loading, queryPolygonPartsFeatureOptions, setQueryPolygonPartsFeatureOptions };
};

export default useWfsPolygonPartsRequests;
