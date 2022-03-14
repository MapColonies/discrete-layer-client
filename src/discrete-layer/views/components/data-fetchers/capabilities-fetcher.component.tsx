import React, { useState } from 'react';
import { observer } from 'mobx-react';
import CONFIG from '../../../../common/config';
import { useStore } from '../../../models/RootStore';
import { ICapability } from '../../../models/discreteLayersStore';

const OK = 200;

export const CapabilitiesFetcher: React.FC = observer(() => {
  const store = useStore();
  const [rasterWmtsCapabilitiesUrl] = useState(CONFIG.RASTER_WMTS_CAPABILITIES_URL);
  const [demWmtsCapabilitiesUrl] = useState(CONFIG.DEM_WMTS_CAPABILITIES_URL);
  fetch(rasterWmtsCapabilitiesUrl)
    .then((response) => {
      if (response.status === OK) {
        store.discreteLayersStore.setRasterCapabilities(response.body as unknown as ICapability[]);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  fetch(demWmtsCapabilitiesUrl)
    .then((response) => {
      if (response.status === OK) {
        store.discreteLayersStore.setDemCapabilities(response as unknown as ICapability[]);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  
  return (
    <></>
  );
});
