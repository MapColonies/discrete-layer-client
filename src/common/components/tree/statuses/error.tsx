/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';

import './error.css';

interface ErrorProps {
  className: string;
  message: string;
  url?: string;
}

export const Error: React.FC<ErrorProps> = (props) => {
  const { className, message, url } = props;

  return (
    <Box className={className + ' alignCenter'}>
      <Box className="errorTitle"><Typography use="headline6" tag="div"><FormattedMessage id="general.error.text"/></Typography></Box>
      <Box><Typography use="body2" tag="div"><FormattedMessage id="general.error.title"/></Typography></Box>
      <Box className="errorDescription">
        <Typography tag="div">
          <Typography tag="span"><FormattedMessage id="general.error.description"/></Typography>
          <Typography tag="span"> {message}</Typography>
        </Typography>
      </Box>
      {
        url !== undefined &&
        <Box className="errorDescription">
          <Typography tag="p">{url}</Typography>
        </Box>
      }
    </Box>
  );
};
