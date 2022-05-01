import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';

import './error.css';

const START = 0;

interface ErrorProps {
  className: string;
}

export const Error: React.FC<ErrorProps> = (props) => {
  const formatMessage = (message: string): string => {
    return (message+' ').slice(START, +message.indexOf(': '));
  };

  return (
    <Box className={props.className + ' alignCenter'}>
      <Box className="errorTitle"><Typography use="headline6" tag="div"><FormattedMessage id="general.error.text"/></Typography></Box>
      <Box><Typography use="body2" tag="div"><FormattedMessage id="general.error.title"/></Typography></Box>
      <Box className="errorDescription"><Typography use="body2" tag="div"><FormattedMessage id="general.error.description"/> {formatMessage(props.children as string)}</Typography></Box>
    </Box>
  );
};
