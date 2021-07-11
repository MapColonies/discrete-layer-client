import React, { useState } from 'react';
import { IconButton, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import CopyToClipboard from 'react-copy-to-clipboard';

import './url.value-presentors.css';

interface UrlValuePresentorProps {
  value?: string;
}

export const UrlValuePresentorComponent: React.FC<UrlValuePresentorProps> = ({ value }) => {
  const [copied, setCopied] = useState<boolean>(false);
  return (
    <>
      <Tooltip content={value}>
        <Box className="detailsFieldValue detailsUrlFieldValue">
          {value}
        </Box>
      </Tooltip>
      <Box className="detailsUrlFieldUrlCopy">
        <CopyToClipboard text={value as string} onCopy={(): void => setCopied(true)}>
          <IconButton icon="content_copy" />
        </CopyToClipboard>
      </Box>
    </>
  );
}
