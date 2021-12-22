/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react';
import { Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import CONFIG from '../../../../common/config';

interface TypeValuePresentorProps {
  value?: string;
}

export const TypeValuePresentorComponent: React.FC<TypeValuePresentorProps> = ({ value }) => {

  const MAX_VALUE_LENGTH = CONFIG.NUMBER_OF_CHARACTERS_LIMIT;
  
  return (
    <>
      {
        value && value.length > MAX_VALUE_LENGTH &&
        <Tooltip content={value}>
          <Box className="detailsFieldValue">
            {value}
          </Box>
        </Tooltip>
      }
      {
        !(value && value.length > MAX_VALUE_LENGTH) &&
        <Box className="detailsFieldValue">
          {value}
        </Box>
      }
    </>
  );
}
