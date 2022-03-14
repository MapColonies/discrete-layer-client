import React from 'react';
import { CapabilitiesFetcher } from './capabilities-fetcher.component';
import { EntityDescriptorsFetcher } from './entity-descriptors-fetcher.component';


export const StaticDataFetcher: React.FC = () => {
  return (
    <>
      <EntityDescriptorsFetcher />
      <CapabilitiesFetcher />
    </>
  );
};
