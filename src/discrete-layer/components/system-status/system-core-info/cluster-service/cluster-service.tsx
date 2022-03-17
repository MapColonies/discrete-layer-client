import React from 'react';
import { DeploymentWithServicesModelType } from '../../../../models';

interface ClusterServiceProps {
  service: DeploymentWithServicesModelType;
}

export const ClusterService: React.FC<ClusterServiceProps> = ({
  service: { image, services, status, name},
}: ClusterServiceProps) => {
  return <></>;
};
