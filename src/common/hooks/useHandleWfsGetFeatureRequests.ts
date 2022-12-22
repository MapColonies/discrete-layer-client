import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import {
  GetFeatureModelType,
  useQuery,
  useStore,
} from '../../discrete-layer/models';
import { WfsGetFeatureParams } from '../../discrete-layer/models/RootStore.base';

const useHandleWfsGetFeatureRequests = (): {
  data: { getFeature: GetFeatureModelType } | undefined;
  loading: boolean;
  getFeatureOptions: WfsGetFeatureParams | undefined;
  setGetFeatureOptions: (options: WfsGetFeatureParams) => void;
} => {
  const store = useStore();
  const [getFeatureOptions, setGetFeatureOptions] = useState<
    WfsGetFeatureParams
  >();

  const { data, loading, setQuery } = useQuery<{
    getFeature: GetFeatureModelType;
  }>();

  useEffect(() => {
    if (getFeatureOptions) {
      setQuery(store.queryGetFeature({ data: { ...getFeatureOptions } }));
    }
  }, [getFeatureOptions]);

  useEffect(() => {
    if (getFeatureOptions && !loading && data) {
      store.mapMenusManagerStore.setCurrentWfsFeatureInfo({
        ...cloneDeep(data.getFeature),
        pointCoordinates: getFeatureOptions.pointCoordinates,
      });
    }

    //TODO: Handle Errors, how should we deal with them?
  }, [data, loading]);

  return { data, loading, getFeatureOptions, setGetFeatureOptions };
};

export default useHandleWfsGetFeatureRequests;
