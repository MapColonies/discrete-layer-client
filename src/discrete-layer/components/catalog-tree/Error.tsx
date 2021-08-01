import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';

export const Error: FC = (props) => (
  <>
    <Box className="failed">
      <Typography use="headline6" tag="div"><FormattedMessage id="general.error.text"/></Typography>
      <Typography use="body2" tag="div"><FormattedMessage id="general.error.title"/></Typography>
      <Typography use="body2" tag="div"><FormattedMessage id="general.error.description"/> {props.children}</Typography>
    </Box>
  </>
)
