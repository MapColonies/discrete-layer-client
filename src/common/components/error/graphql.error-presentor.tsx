/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import { IconButton } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';

import './error-presentor.css';

interface IGpaphQLError {
  error: any;
}

export const GpaphQLError: React.FC<IGpaphQLError> = (props)=> {
  const formatMessage = (message: string): string => {
    return message.substr(+message.indexOf('; ') + 1, message.length);
  };

  return (
    <>
      {
        props.error.response !== undefined &&
        <Box className="errorContainer">
          <IconButton className="errorIcon mc-icon-Status-Warnings" />
          <ul className="errorsList">
            {
              props.error.response.errors.map((error: Record<string, any>) => {
                return (
                  <li>{formatMessage(error.message)}</li>
                );
              })
            }
          </ul>
        </Box>
      }
    </>
  );
};
