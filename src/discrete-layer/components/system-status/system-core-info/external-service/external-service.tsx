import React, { useState } from 'react';
import { Box } from '@map-colonies/react-components';
import { IconButton, Tooltip, Typography } from '@map-colonies/react-core';
import { FormattedMessage, useIntl } from 'react-intl';
import { ExternalServiceModelType } from '../../../../models';

import './external-service.css';
import CopyToClipboard from 'react-copy-to-clipboard';

interface ExternalServiceProps {
  service: ExternalServiceModelType;
}

export const ExternalService: React.FC<ExternalServiceProps> = ({
  service: { url, display },
}: ExternalServiceProps) => {
 const intl = useIntl();

  return (
    <Box className="externalService">
      <Typography className={'displayName'} tag={'p'}>
        <FormattedMessage id={display} />
      </Typography>

      <Typography className={'urlText'} tag={'p'}>
        {`${url as string}`}
      </Typography>

      <Tooltip content={intl.formatMessage({ id: 'action.copy-url.tooltip' })}>
          <CopyToClipboard text={url as string} >
            <IconButton className="mc-icon-Copy" />
          </CopyToClipboard>
        </Tooltip>
    </Box>
  );
};
