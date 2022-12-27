import React from 'react';
// import { BaseMapsLegendsFetcher } from './base-maps-legends-fetcher-component';
import { EntityDescriptorsFetcher } from './entity-descriptors-fetcher.component';
import { LookupTablesFetcher } from './lookup-tables-fetcher.component';
import { MCEnumsFetcher } from './mc-enums-fetcher.component';


export const StaticDataFetcher: React.FC = () => {
  return (
    <>
      <EntityDescriptorsFetcher />
      <MCEnumsFetcher />
      <LookupTablesFetcher/>
      {/* <BaseMapsLegendsFetcher /> */}
    </>
  );
};
