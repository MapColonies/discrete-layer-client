import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import {
  GetFeatureModelType,
  useQuery,
  useStore,
} from '../../discrete-layer/models';
import { WfsPolygonPartsGetFeatureParams } from '../../discrete-layer/models/RootStore.base';
import CONFIG from '../config';

type GetFeatureOptions = WfsPolygonPartsGetFeatureParams;

const useWfsPolygonPartsRequests = (): {
  data: { getPolygonPartsFeature: GetFeatureModelType } | undefined;
  loading: boolean;
  queryPolygonPartsFeatureOptions: WfsPolygonPartsGetFeatureParams | undefined;
  setQueryPolygonPartsFeatureOptions: (options: GetFeatureOptions) => void;
} => {
  const store = useStore();
  const [queryPolygonPartsFeatureOptions, setQueryPolygonPartsFeatureOptions] = useState<GetFeatureOptions>();

  const { data, loading, setQuery } = useQuery<{ getPolygonPartsFeature: GetFeatureModelType }>();

  useEffect(() => {
    if (queryPolygonPartsFeatureOptions) {
      setQuery(store.queryGetPolygonPartsFeature({
        data: {
          ...queryPolygonPartsFeatureOptions
        }
      }));
    }
  }, [queryPolygonPartsFeatureOptions]);

  useEffect(() => {
    if (queryPolygonPartsFeatureOptions && !loading && data) {
      const featureInfo = {
        ...cloneDeep(data.getPolygonPartsFeature),
        feature: queryPolygonPartsFeatureOptions.feature,
      };
      if (data.getPolygonPartsFeature.numberReturned !== 0) {
        if (featureInfo.features) {
          store.discreteLayersStore.setPolygonPartsInfo(featureInfo.features);
        }
        const startIndex = queryPolygonPartsFeatureOptions.startIndex as number;
        const nextPage = startIndex / CONFIG.POLYGON_PARTS.MAX.WFS_FEATURES + 1;
        setQueryPolygonPartsFeatureOptions({
          ...queryPolygonPartsFeatureOptions,
          startIndex: nextPage * CONFIG.POLYGON_PARTS.MAX.WFS_FEATURES
        });
      }
    } 
  }, [data, loading]);

  return { data, loading, queryPolygonPartsFeatureOptions, setQueryPolygonPartsFeatureOptions };
};

export default useWfsPolygonPartsRequests;