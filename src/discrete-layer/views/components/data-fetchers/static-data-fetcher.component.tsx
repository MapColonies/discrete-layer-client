import React from 'react';
// import { BaseMapsLegendsFetcher } from './base-maps-legends-fetcher-component';
import { EntityDescriptorsFetcher } from './entity-descriptors-fetcher.component';


export const StaticDataFetcher: React.FC = () => {
  return (
    <>
      <EntityDescriptorsFetcher />
      {/* <BaseMapsLegendsFetcher /> */}
    </>
  );
};
