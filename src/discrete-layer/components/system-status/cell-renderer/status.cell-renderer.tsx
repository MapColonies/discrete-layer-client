import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { Box } from '@map-colonies/react-components';
import { Typography } from '@map-colonies/react-core';
import { JobModelType } from '../../../models';

import './status.cell-renderer.css';
import { useIntl } from 'react-intl';

const NO_DATA = 0;
const NO_WIDTH = 0;

const STATUS_BAR_WIDTH = 190;
const STATUS_BAR_HEIGHT = 18;

export const StatusRenderer: React.FC<ICellRendererParams> = (props) => {
  const intl = useIntl();
  const jobData = props.data as JobModelType;
  const status = jobData.status;

  const getProgress = (): string => {
    const finalStatusCount: number =
      (jobData.failedTasks as number) + (jobData.completedTasks as number);
    return `(${finalStatusCount}/${jobData.taskCount as number})`;
  };

  const getProgressComponent = (): JSX.Element => {

    const statusText = intl.formatMessage({ id: `system-status.job.status_translation.${status as string}`});


    return (
      <Box>
        {`${statusText}  ${getProgress()}`}
        {/* {statusText}&nbsp;&nbsp;{getProgress()} */}
      </Box>
    );
  };

  type StatusCountType = number | null | undefined;

  const calcStatusWidth = (statusCount: StatusCountType): number => {
    const { taskCount } = jobData;
    return (taskCount as number) > NO_DATA
      ? ((statusCount as number) / (taskCount as number)) * STATUS_BAR_WIDTH
      : NO_WIDTH;
  };

  const getProgressbarSections = () => {
    const { completedTasks, inProgressTasks, failedTasks } = jobData;
    const completedWidth = calcStatusWidth(completedTasks);
    const failedWidth = calcStatusWidth(failedTasks);
    const inProgressWidth = calcStatusWidth(inProgressTasks);

    return (
      <Box className={'progressSectionsContainer'}>
        <Box
          className={'completedArea'}
          style={{
            width: `${completedWidth}px`,
            height: `${STATUS_BAR_HEIGHT}px`,
          }}
        />
        <Box
          className={'failedArea'}
          style={{
            width: `${failedWidth}px`,
            height: `${STATUS_BAR_HEIGHT}px`,
          }}
        />
        <Box
          className={'inProgressArea'}
          style={{
            width: `${inProgressWidth}px`,
            height: `${STATUS_BAR_HEIGHT}px`,
          }}
        />
      </Box>
    );
  };

  return (
    <Box className={'statusBarContainer'}>
      <Typography style={{fontSize: '12px'}} tag="p" className="statusText">
        {getProgressComponent()}
      </Typography>
      <Box
        className={'statusBar'}
        style={{
          width: `${STATUS_BAR_WIDTH}px`,
          height: `${STATUS_BAR_HEIGHT}px`,
        }}
      >
        {getProgressbarSections()}
      </Box>
    </Box>
  );
};
