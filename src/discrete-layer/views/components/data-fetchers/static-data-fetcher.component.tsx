import React from 'react';
// import { BaseMapsLegendsFetcher } from './base-maps-legends-fetcher-component';
import { EntityDescriptorsFetcher } from './entity-descriptors-fetcher.component';
import { MCEnumsFetcher } from './mc-enums-fetcher.component';
import { WfsFeaturesFetcher } from './wfs-features-fetcher.component';


export const StaticDataFetcher: React.FC = () => {
  return (
    <>
      <EntityDescriptorsFetcher />
      <MCEnumsFetcher />
      <WfsFeaturesFetcher />
      {/* <BaseMapsLegendsFetcher /> */}
    </>
  );
};
