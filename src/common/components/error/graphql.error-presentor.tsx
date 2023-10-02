/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import { IconButton } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';

import './error-presentor.css';

const NONE = 0;
const USER_ERROR_RESPONSE_CODE = 400;
const SERVER_ERROR_RESPONSE_CODE = 500;

interface IGpaphQLError {
  error: any;
}

interface IServerError {
  message: string;
  serverResponse?: IServerErrorResponse;
}

interface IServerErrorResponse {
  data: { message: string };
  status?: number;
  statusText?: string;
}

export const GraphQLError: React.FC<IGpaphQLError> = (props) => {

  const intl = useIntl();

  const formatMessage = (serverError: IServerError): string => {
    const status = serverError.serverResponse?.status ?? NONE;
    const message = serverError.serverResponse?.data.message ?? '';
    if (status && status >= USER_ERROR_RESPONSE_CODE && status < SERVER_ERROR_RESPONSE_CODE) {
      const translatedError = intl.formatMessage({ id: `general.http-${status}.error` });
      return `${translatedError}<br/>${message}`;
    }  else if (message) {
      return message;
    } else {
      return serverError.message.substring(+serverError.message.indexOf('; ') + 1);
    }
  };

  return (
    <>
      {
        !isEmpty(props.error?.response) &&
        <bdi className="errorContainer">
          <IconButton className="errorIcon mc-icon-Status-Warnings" />
          <ul className="errorsList">
            {
              props.error.response.errors?.map((error: IServerError, index: number) => {
                return (
                  <li dir="auto" key={index} dangerouslySetInnerHTML={{__html: formatMessage(error)}}></li>
                );
              })
            }
            {
              props.error.response.status >= SERVER_ERROR_RESPONSE_CODE &&
              <li dir="auto" key={props.error.response.status as number}><FormattedMessage id="general.server.error"/></li>
            }
          </ul>
        </bdi>
      }
    </>
  );

};
