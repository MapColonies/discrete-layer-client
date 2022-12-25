import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import {
  GetFeatureModelType,
  useQuery,
  useStore,
} from '../../../discrete-layer/models';
import { WfsGetFeatureParams } from '../../../discrete-layer/models/RootStore.base';
import { IFeatureConfig } from '../../../discrete-layer/views/components/data-fetchers/wfs-features-fetcher.component';

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
      store.mapMenusManagerStore.resetCurrentWfsFeatureInfo();
      
      const featureConfig = store.mapMenusManagerStore.getFeatureConfig(getFeatureOptions.typeName);
      const dWithin = featureConfig.dWithin;
  
        setQuery(store.queryGetFeature({ data: { ...getFeatureOptions, dWithin } }));
    }
  }, [getFeatureOptions]);

  useEffect(() => {
    if (getFeatureOptions && !loading && data) {
      store.mapMenusManagerStore.setCurrentWfsFeatureInfo({
        ...cloneDeep(data.getFeature),
        pointCoordinates: getFeatureOptions.pointCoordinates,
        typeName: getFeatureOptions.typeName,
      });
    }

    //TODO: Handle Errors, how should we deal with them?
  }, [data, loading]);

  return { data, loading, getFeatureOptions, setGetFeatureOptions };
};

export default useHandleWfsGetFeatureRequests;
