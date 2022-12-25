/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useQuery, useStore } from '../../../models/RootStore';

export interface IFeatureConfig {
  isVisualized?: boolean,
  color?: string,
  outlineColor?: string,
  dWithin?: number, 
}

export interface IFeatureConfigs {
  [featureType: string]: IFeatureConfig | undefined
}

export const WfsFeaturesFetcher: React.FC = observer(() => {
  const store = useStore();
  const wfsGetFeatureTypesQuery = useQuery((store) => store.queryGetFeatureTypes());
  
  useEffect(() => {
    if(!wfsGetFeatureTypesQuery.loading && wfsGetFeatureTypesQuery.data) {
        const featureTypes = [...(wfsGetFeatureTypesQuery.data.getFeatureTypes).typesArr as string[]];
        const featureConfigs = {...(wfsGetFeatureTypesQuery.data.getFeatureTypes).featureConfigs as IFeatureConfigs};
        
        store.mapMenusManagerStore.setActionsMenuFeatures(featureTypes);
        store.mapMenusManagerStore.setFeatureConfigs(featureConfigs);
    }
  }, [wfsGetFeatureTypesQuery.data, wfsGetFeatureTypesQuery.loading])

  useEffect(() => {
    if(store.mapMenusManagerStore.actionsMenuFeatures) {
      store.mapMenusManagerStore.initStore();
    }
  }, [store.mapMenusManagerStore.actionsMenuFeatures])
  
  return null;
});
