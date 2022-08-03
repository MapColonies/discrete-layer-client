import React, { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useIntl } from 'react-intl';
import { IconButton, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { ILink } from '../../../models/links';
import { getTokenParam } from '../../helpers/layersUtils';

import './url.value-presentor.css';

const COPY = 'copy';
const LINK = 'link';

interface UrlValuePresentorProps {
  value: string;
  linkInfo?: ILink;
}

export const UrlValuePresentorComponent: React.FC<UrlValuePresentorProps> = ({ value, linkInfo }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [copied, setCopied] = useState<boolean>(false);
  const intl = useIntl();
  return (
    <>
      <Tooltip content={value}>
        <Box className="detailsFieldValue detailsUrlFieldValue">
            {linkInfo?.linkAction === LINK && <a href={`${value}${getTokenParam()}`} target="_blank" rel="noreferrer" className='url'>{value}</a>}
            {linkInfo?.linkAction !== LINK && <span>{value}</span>}
        </Box>
      </Tooltip>
      <Box className="detailsUrlFieldUrlCopy">
        <Tooltip content={intl.formatMessage({ id: 'action.copy-url.tooltip' })}>
          <CopyToClipboard text={value} onCopy={(): void => setCopied(true)}>
            <>
              {linkInfo?.linkAction === COPY && <IconButton className="mc-icon-Copy"/>}
              {linkInfo?.linkAction !== COPY && <Box></Box>}
            </>
          </CopyToClipboard>
        </Tooltip>
      </Box>
    </>
  );
}
