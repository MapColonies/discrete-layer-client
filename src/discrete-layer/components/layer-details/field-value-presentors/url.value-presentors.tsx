import React, { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useIntl } from 'react-intl';
import { IconButton, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';

import './url.value-presentors.css';

interface UrlValuePresentorProps {
  value?: string;
}

export const UrlValuePresentorComponent: React.FC<UrlValuePresentorProps> = ({ value }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [copied, setCopied] = useState<boolean>(false);
  const intl = useIntl();
  return (
    <>
      <Tooltip content={value}>
        <Box className="detailsFieldValue detailsUrlFieldValue">
          {value}
        </Box>
      </Tooltip>
      <Box className="detailsUrlFieldUrlCopy">
        <Tooltip content={intl.formatMessage({ id: 'action.copy.tooltip' })}>
          <CopyToClipboard text={value as string} onCopy={(): void => setCopied(true)}>
            <IconButton icon="content_copy"/>
          </CopyToClipboard>
        </Tooltip>
      </Box>
    </>
  );
}
