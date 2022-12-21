/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useQuery, useStore } from '../../../models/RootStore';

export const WfsFeaturesFetcher: React.FC = observer(() => {
  const store = useStore();
  const wfsGetFeatureTypesQuery = useQuery((store) => store.queryGetFeatureTypes());
  
  useEffect(() => {
    if(!wfsGetFeatureTypesQuery.loading && wfsGetFeatureTypesQuery.data) {
        const featureTypes = [...(wfsGetFeatureTypesQuery.data.getFeatureTypes).typesArr as string[]];
        
        store.mapMenusManagerStore.setActionsMenuFeatures(featureTypes);
    }
  }, [wfsGetFeatureTypesQuery.data, wfsGetFeatureTypesQuery.loading])
  
  return null;
});
