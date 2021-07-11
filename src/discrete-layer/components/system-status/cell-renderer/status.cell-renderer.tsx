import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { Box } from '@map-colonies/react-components';
import { JobModelType, Status, TaskModelType } from '../../../models';

import './status.cell-renderer.css';

export const StatusRenderer: React.FC<ICellRendererParams> = (props) => {
  const getProgress = (data: JobModelType): string => {
    if(!data.tasks || data.tasks.length === 0){
      return '';
    }
    const completed = data.tasks.filter((task: TaskModelType)=> task.status === Status.Completed);
    return `(${completed.length}/${data.tasks.length})`;
  };

  const status = (props.data as JobModelType).status;
  return (
    <Box className={`${status?.toLowerCase() as string}`}>
      {status}&nbsp;&nbsp;{getProgress(props.data)}
    </Box>
 );
};
