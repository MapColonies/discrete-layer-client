import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useIntl } from 'react-intl';
import { IconButton, Tooltip, Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';

import './job-details.fail-reason-area.css';

interface FailReasonAreaProps {
  failReason: string;
  key?: string;
}

export const FailReasonArea: React.FC<FailReasonAreaProps> = ({
  failReason,
  key,
}) => {
  const intl = useIntl();

  return (
    <td aria-colspan={5}>
      <Box key={key} className={'failReasonAreaContainer'}>
        <Typography className={'failReasonText'} tag={'p'}>
          {failReason}
        </Typography>

        <Tooltip content={intl.formatMessage({ id: 'action.copy.tooltip' })}>
          <CopyToClipboard text={failReason}>
            <IconButton className="mc-icon-Copy" />
          </CopyToClipboard>
        </Tooltip>
      </Box>
    </td>
  );
};
