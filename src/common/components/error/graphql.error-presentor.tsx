/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { IconButton } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';

import './error-presentor.css';
import { isEmpty } from 'lodash';

const SERVER_ERROR_RESPONSE_CODE = 500;

interface IGpaphQLError {
  error: any;
}

export const GraphQLError: React.FC<IGpaphQLError> = (props)=> {
  const formatMessage = (message: string): string => {
    return message.substr(+message.indexOf('; ') + 1, message.length);
  };

  return (
    <>
      {
        !isEmpty(props.error?.response) &&
        <Box className="errorContainer">
          <IconButton className="errorIcon mc-icon-Status-Warnings" />
          <ul className="errorsList">
            {
              props.error.response.errors?.map((error: Record<string, any>, index: number) => {
                return (
                  <li key={index}>{formatMessage(error.message)}</li>
                );
              })
            }
            {
              props.error.response.status >= SERVER_ERROR_RESPONSE_CODE &&
              <li key={props.error.response.status as number}><FormattedMessage id="general.server.error"/></li>
            }
          </ul>
        </Box>
      }
    </>
  );
};
