/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';

import './error.css';

interface ErrorProps {
  className: string;
  message?: string;
}

export const Error: React.FC<ErrorProps> = (props) => {
  const { className, message, children } = props;
  // @ts-ignore
  // eslint-disable-next-line
  const errorUrl = (children ? `url: ${children.extensions?.exception?.config?.url}` : '');
  // @ts-ignore
  // eslint-disable-next-line
  const errorMessage = message ?? (children ? children.message : '');

  return (
    <Box className={className + ' alignCenter'}>
      <Box className="errorTitle"><Typography use="headline6" tag="div"><FormattedMessage id="general.error.text"/></Typography></Box>
      <Box><Typography use="body2" tag="div"><FormattedMessage id="general.error.title"/></Typography></Box>
      <Box className="errorDescription">
        <Typography use="body2" tag="div">
          <FormattedMessage id="general.error.description"/>
          <Typography tag="p">{errorMessage}</Typography>
          <Typography tag="p">{message === undefined ? errorUrl : ''}</Typography>
        </Typography>
      </Box>
    </Box>
  );
};
