/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import { IconButton } from '@map-colonies/react-core';

import './graphql.error-presentor.css';

interface IGpaphQLError {
  error: any;
}

export const GpaphQLError: React.FC<IGpaphQLError> = (props)=> {
  const getErrorMessage = (message: string): string => {
    return message.substr(+message.indexOf('; ') + 1, message.length);
  };

  return (
    <>
    {
      props.error.response !== undefined && <div className="errorContainer">
        {/* {JSON.stringify(props.error)} */}
        <IconButton
          className="errorIcon mc-icon-Status-Warnings"
        />
        <ul className="errorsList">
          {
            props.error.response.errors.map((error: Record<string, any>) => {
              return (
                <li>{getErrorMessage(error.message)}</li>
              );
            })
          }
        </ul>
      </div>
    }
  </>
 );
};
