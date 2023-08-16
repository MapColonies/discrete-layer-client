import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import {
  GetFeatureModelType,
  useQuery,
  useStore,
} from '../../../discrete-layer/models';
import { WfsPolygonPartsGetFeatureParams } from '../../../discrete-layer/models/RootStore.base';

type HandlerGetFeatureOptions = WfsPolygonPartsGetFeatureParams & { onDataResolved?: (data?: GetFeatureModelType) => void };

const useHandleWfsPolygonPartsRequests = (): {
  data: { getPolygonPartsFeature: GetFeatureModelType} | undefined;
  loading: boolean;
  getPolygonPartsFeatureOptions: WfsPolygonPartsGetFeatureParams | undefined;
  setGetPolygonPartsFeatureOptions: (options: HandlerGetFeatureOptions) => void;
} => {
  const store = useStore();
  const [getPolygonPartsFeatureOptions, setGetPolygonPartsFeatureOptions] = useState<HandlerGetFeatureOptions>();

  const { data, loading, setQuery } = useQuery<{ getPolygonPartsFeature: GetFeatureModelType}>();

  useEffect(() => {
    if (getPolygonPartsFeatureOptions) {
      setQuery(store.queryGetPolygonPartsFeature({ data: { ...getPolygonPartsFeatureOptions } }));
    }
  }, [getPolygonPartsFeatureOptions]);

  useEffect(() => {
    if (getPolygonPartsFeatureOptions && !loading && data) {
      const featureInfo = {
        ...cloneDeep(data.getPolygonPartsFeature),
        pointCoordinates: getPolygonPartsFeatureOptions.pointCoordinates
      };

      store.mapMenusManagerStore.setCurrentPolygonPartsInfo(featureInfo);
      console.log('POLYGON PARTS', featureInfo)

      getPolygonPartsFeatureOptions.onDataResolved?.(featureInfo);
    } 

    //TODO: Handle Errors, how should we deal with them?
  }, [data, loading]);

  return { data, loading, getPolygonPartsFeatureOptions, setGetPolygonPartsFeatureOptions };
};

export default useHandleWfsPolygonPartsRequests;
