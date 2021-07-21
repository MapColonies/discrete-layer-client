import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { Box } from '@map-colonies/react-components';
import { Tooltip } from '@map-colonies/react-core';
import { JobModelType, Status, TaskModelType } from '../../../models';

import './status.cell-renderer.css';

const NO_DATA = 0;

export const StatusRenderer: React.FC<ICellRendererParams> = (props) => {
  const getProgress = (data: JobModelType): string => {
    if(!data.tasks || data.tasks.length === NO_DATA){
      return '';
    }
    const completed = data.tasks.filter((task: TaskModelType)=> task.status === Status.Completed);
    return `(${completed.length}/${data.tasks.length})`;
  };

  const getProgressComponent = (): JSX.Element => {
    return (
      <Box className={`${status?.toLowerCase() as string}`}>
        {status}&nbsp;&nbsp;{getProgress(jobData)}
      </Box>
    );
  }
  const jobData = props.data as JobModelType;
  const status = jobData.status;
  return (
    status === 'Failed' ? 
      <Tooltip content={jobData.reason}>
        {getProgressComponent()}
      </Tooltip>
    :
      <>{getProgressComponent()}</>
 );
};
