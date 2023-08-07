/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useQuery, useStore } from '../../../models/RootStore';

export interface IFeatureConfig {
  isVisualized?: boolean,
  color?: string,
  outlineColor?: string,
  dWithin?: number,
  translationId?: string,
  icon?: string,
  outlineWidth?: number,
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
        
         store.mapMenusManagerStore.setWfsFeatureTypes(featureTypes);
         store.mapMenusManagerStore.setWfsFeatureConfigs(featureConfigs);
    }
  }, [wfsGetFeatureTypesQuery.data, wfsGetFeatureTypesQuery.loading])
  
  return null;
});
