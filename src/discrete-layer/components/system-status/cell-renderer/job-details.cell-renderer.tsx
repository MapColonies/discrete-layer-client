import React, { useEffect, useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { FormattedMessage, useIntl } from 'react-intl';
import { observer } from 'mobx-react';
import { truncate } from 'lodash';
import { Moment } from 'moment';
import { IconButton, Tooltip, Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { relativeDateFormatter, dateFormatter, } from '../../../../common/helpers/type-formatters';
import { Loading } from '../../../../common/components/tree/statuses/Loading';
import { DETAILS_ROW_ID_SUFFIX } from '../../../../common/components/grid';
import { JobModelType, Status, TaskModelType } from '../../../models';
import { useQuery } from '../../../models/RootStore';
import { CopyButton } from '../job-details.copy-button';
import { JobDetailsHeader } from './job-details.header';

import './job-details.cell-renderer.css';

type ValueType = 'string' | 'Status' | 'date';
interface ITaskField {
  name: string;
  label: string;
  valueType: ValueType;
}
const taskFileds: ITaskField[] = [
  {
    label: 'system-status.task.fields.type.label',
    name: 'type',
    valueType: 'string',
  },
  {
    label: 'system-status.task.fields.attempts.label',
    name: 'attempts',
    valueType: 'string',
  },
  {
    label: 'system-status.task.fields.created.label',
    name: 'created',
    valueType: 'date',
  },
  {
    label: 'system-status.task.fields.updated.label',
    name: 'updated',
    valueType: 'date',
  },
  {
    label: 'system-status.task.fields.status.label',
    name: 'status',
    valueType: 'Status',
  },
];

interface StatusPresentorParams {
  task: Record<string, unknown>;
}

const StatusPresentor: React.FC<StatusPresentorParams> = ({ task }) => {
  const intl = useIntl();

  const statusText = intl.formatMessage({
    id: `system-status.job.status_translation.${task.status as string}`,
  });

  if (task.status === Status.Failed) {
    const FAIL_REASON_MAX_LEN = 35;
    const ERROR_ICON_SIZE = 20;
    const ERROR_ICON_COLOR = 'var(--mdc-theme-gc-error-medium)';
    const ellipsizedFailReason = truncate(task.reason as string, {
      length: FAIL_REASON_MAX_LEN,
    });

    return (
      <Box className={`${(task.status as string).toLowerCase()} gridCell`}>
        {statusText}
        <Tooltip content={ellipsizedFailReason}>
          <IconButton
            style={{
              fontSize: `${ERROR_ICON_SIZE}px`,
              color: ERROR_ICON_COLOR,
            }}
            className={'mc-icon-Warning'}
            label="failReasonIcon"
          />
        </Tooltip>
        <CopyButton text={task.reason as string} />
      </Box>
    );
  }
  return (
    <Box className={`${(task.status as string).toLowerCase()} gridCell`}>
      {statusText}
    </Box>
  );
};

const getValuePresentor = (
  task: Record<string, unknown>,
  field: ITaskField,
  setCollapsed?: (collapsed: boolean) => void
): JSX.Element => {
  switch (field.valueType) {
    case 'date': {
      const dateAndTimeTooltipContent: string = dateFormatter(
        task[field.name] as Moment,
        true
      );

      return (
        <Tooltip content={dateAndTimeTooltipContent}>
          <Box className={'gridCell'}>
            {relativeDateFormatter(task[field.name] as Moment)}
          </Box>
        </Tooltip>
      );
    }
    case 'Status':
      return <StatusPresentor task={task} />;
    default:
      return <Box className={'gridCell'}>{task[field.name] as string} </Box>;
  }
};

interface TasksRendererParams {
  jobId: string;
}

const TasksRenderer: React.FC<TasksRendererParams> = observer(({ jobId }) => {
  const [tasksData, setTasksData] = useState<TaskModelType[]>([]);

  const { loading, data } = useQuery(
    (store) =>
      store.queryTasks({
        params: {
          jobId,
        },
      }),
    {
      fetchPolicy: 'no-cache',
    }
  );

  useEffect(() => {
    if (data?.tasks) {
      setTasksData(data.tasks);
    }
  }, [data]);

  if (loading)
    return (
      <Box className="loadingContainer">
        <Loading />
      </Box>
    );

  return (
    <>
      {tasksData.map((task) => {
        return taskFileds.map((field) => {
          return getValuePresentor(
            (task as unknown) as Record<string, unknown>,
            field
          );
        });
      })}
    </>
  );
});

export const JobDetailsRenderer: React.FC<ICellRendererParams> = (props) => {
  const jobId = (props.data as JobModelType).id;

  const keyPrefix = `${(props.data as JobModelType).resourceId as string}`;

  return (
    <Box className="jobDetailsContainer">
      <JobDetailsHeader job={props.data as JobModelType} />
      <Box className={'gridContainer'}>
        {taskFileds.map((field) => (
          <Typography
            key={`${keyPrefix}_${field.name}`}
            tag="div"
            className="column-label"
            style={{ fontWeight: 'bold' }}
          >
            <FormattedMessage id={field.label} />
          </Typography>
        ))}

        <TasksRenderer jobId={(jobId as string).replace(DETAILS_ROW_ID_SUFFIX,'')} />
      </Box>
    </Box>
  );
};
