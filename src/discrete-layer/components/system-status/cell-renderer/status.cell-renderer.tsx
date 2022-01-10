import React from 'react';
import { useIntl } from 'react-intl';
import { ICellRendererParams } from 'ag-grid-community';
import { Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { JobModelType, Status } from '../../../models';

import './status.cell-renderer.css';

const NO_DATA = 0;
const NO_WIDTH = 0;

const STATUS_BAR_WIDTH = 134;
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
    const statusText = intl.formatMessage({
      id: `system-status.job.status_translation.${status as string}`,
    });

    return (
      <Box>
        {`${statusText}  ${getProgress()}`}
      </Box>
    );
  };

  type StatusCountType = number | null | undefined;

  const calcStatusWidth = (statusCount: StatusCountType): number => {
    const { taskCount } = jobData;

    if(taskCount === NO_DATA) return NO_WIDTH;

    return ((statusCount as number) / (taskCount as number)) * STATUS_BAR_WIDTH;
  };

  const getSectionComponent = (
    statusType: Status,
    width: number
  ): JSX.Element | null => {
    if (width === NO_WIDTH) return null;

    const className = `${statusType}Area`;

    return (
      <Box
        className={className}
        style={{
          width: `${width}px`,
          height: `${STATUS_BAR_HEIGHT}px`,
        }}
      />
    );
  };

  const getProgressbarSections = (): JSX.Element | null => {
    const { completedTasks, inProgressTasks, failedTasks, status} = jobData;

    switch(status){
      case Status.Completed:
        return getSectionComponent(Status.Completed, STATUS_BAR_WIDTH);
      case Status.Failed:
        return getSectionComponent(Status.Failed, STATUS_BAR_WIDTH);
      default: 
        // Do nothing
        break;
    }


    const completedWidth = calcStatusWidth(completedTasks);
    const failedWidth = calcStatusWidth(failedTasks);
    const inProgressWidth = calcStatusWidth(inProgressTasks);

    return (
      <Box className={'progressSectionsContainer'}>
        {getSectionComponent(Status.Completed, completedWidth)}
        {getSectionComponent(Status.Failed, failedWidth)}
        {getSectionComponent(Status.InProgress, inProgressWidth)}
      </Box>
    );
  };

  return (
    <Box className={'statusBarContainer'}>
      <Box className="statusText">
      <Typography style={{ fontSize: '12px' }} tag="div" />
        {getProgressComponent()}
      </Box>
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
