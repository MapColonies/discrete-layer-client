import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { Box } from '@map-colonies/react-components';
import { JobModelType, Status } from '../../../models';

export const ActionsRenderer: React.FC<ICellRendererParams> = (props) => {
  const isChangePriorityEnabled = (data: JobModelType): boolean => {
    return data.status === Status.InProgress || data.status === Status.Pending
  };

  return (
    <Box style={{
      display: 'flex',
      justifyContent: 'center'
    }}>
      <Box>
        <button disabled={!isChangePriorityEnabled(props.data)}>Priority</button>
      </Box>
    </Box>
 );
};
