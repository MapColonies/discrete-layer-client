/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { Box } from '@map-colonies/react-components';
import { CircularProgress } from '@map-colonies/react-core';
import { IUpdating } from '../jobs-dialog';

interface IPriorityCellRendererParams extends ICellRendererParams {
  isUpdating: () => IUpdating | undefined;
}

export const PriorityRenderer: React.FC<IPriorityCellRendererParams> = (props) => {
  const updatingObj = props.isUpdating();
  return (
    <Box style={{
      display: 'flex',
      flexDirection: 'row-reverse',
      justifyContent: 'flex-end'
    }}>
      {updatingObj && 
        <>
          <CircularProgress size="xsmall" style={{
            top: '10px',
            right: '40px'
          }}/>
          <span>{updatingObj.newValue}</span>
        </>
      }
      {!updatingObj && 
        <>
          <span>{props.data.priority}</span>
        </>
      }
    </Box>
 );
};
