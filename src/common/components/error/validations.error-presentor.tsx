/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import { IconButton } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';

import './error-presentor.css';

interface IValidationsError {
  errors: Record<string, string[]>;
}

export const ValidationsError: React.FC<IValidationsError> = ({ errors })=> {
  return (
    <>
      {
        <Box className="errorContainer">
          <IconButton className="errorIcon mc-icon-Status-Warnings" />
          <ul className="errorsList">
            {
              Object.keys(errors).map((key: string) => {
                return errors[key].map((errorMessage: string) => {
                  return (
                    <li>{errorMessage}</li>
                  );
                })
              })
            }
          </ul>
        </Box>
      }
    </>
  );
};
