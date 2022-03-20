import React from 'react';
import { Box } from '@map-colonies/react-components';
import { Typography } from '@map-colonies/react-core';
import { DeploymentWithServicesModelType } from '../../../../models';

import './internal-service.css';
import { useIntl } from 'react-intl';

interface InternalServiceProps {
  service: DeploymentWithServicesModelType;
}

interface Services {
  name: string;
  uid: string;
  addresses: string[];
}
const THEME_SUCCESS_COLOR = 'var(--mdc-theme-gc-success)';
const THEME_ERROR_COLOR = 'var(--mdc-theme-gc-error-high)';

export const InternalService: React.FC<InternalServiceProps> = ({
  service: { image, services, status },
}: InternalServiceProps) => {
  const intl = useIntl();

  const svcList = (services as
    | Services[]
    | undefined)?.map((service) => {
    return (
      <Box className="internalService">
        <Box
          className="statusIndicator"
          style={{
            backgroundColor: `${(status as boolean) ? THEME_SUCCESS_COLOR : THEME_ERROR_COLOR}`,
          }}
        />
        <Typography className={'serviceName'} tag={'h3'}>
          {`${service.name}`}
        </Typography>
        <Typography className={'serviceVersion'} tag={'p'}>
          {`${intl.formatMessage({id: 'system-core-info.versionText'})}: ${(image as string).split(':')[1]}`}
        </Typography>
      </Box>
    );
  });

  return <>{svcList}</>;
};
