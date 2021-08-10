import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';

const START = 0;

export const Error: React.FC = (props) => {
  const formatMessage = (message: string): string => {
    return message.substr(START, +message.indexOf(': '));
  };

  return (
    <>
      <Box className="alignCenter failed">
        <Box className="errorTitle"><Typography use="headline6" tag="div"><FormattedMessage id="general.error.text"/></Typography></Box>
        <Box className="errorMessage"><Typography use="body2" tag="div"><FormattedMessage id="general.error.title"/></Typography></Box>
        <Box className="errorDescription"><Typography use="body2" tag="div"><FormattedMessage id="general.error.description"/> {formatMessage(props.children as string)}</Typography></Box>
      </Box>
    </>
  );
};
