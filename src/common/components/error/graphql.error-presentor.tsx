/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import { IconButton } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';

import './error-presentor.css';

const SERVER_ERROR_RESPONSE_CODE = 500;
const BAD_REQUEST_ERROR_CODE = 400;
const CONFLICT_ERROR_CODE = 409;

interface IGpaphQLError {
  error: any;
}

export const GraphQLError: React.FC<IGpaphQLError> = (props) => {

  const intl = useIntl();

  const formatMessage = (message: string): string => {
    if (message.includes(BAD_REQUEST_ERROR_CODE.toString())) {
      return intl.formatMessage({ id: 'general.bad-request.error' });
    } else if (message.includes(CONFLICT_ERROR_CODE.toString())) {
      return intl.formatMessage({ id: 'general.duplicate.error' });
    } else {
      return message.substring(+message.indexOf('; ') + 1);
    }
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
                  <li dir="auto" key={index}>{formatMessage(error.message)}</li>
                );
              })
            }
            {
              props.error.response.status >= SERVER_ERROR_RESPONSE_CODE &&
              <li dir="auto" key={props.error.response.status as number}><FormattedMessage id="general.server.error"/></li>
            }
          </ul>
        </Box>
      }
    </>
  );

};
