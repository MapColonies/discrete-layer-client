import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { FormattedMessage, useIntl } from 'react-intl';
import { Moment } from 'moment';
import { Box } from '@map-colonies/react-components';
import { dateFormatter } from '../../../../common/helpers/type-formatters';
import { JobModelType, Status } from '../../../models';

import './job-details.cell-renderer.css';
import { JobDetailsHeader } from './job-details.header';
import { IconButton, Tooltip, Typography } from '@map-colonies/react-core';
import CopyToClipboard from 'react-copy-to-clipboard';
import { truncate } from 'lodash';

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

export const JobDetailsRenderer: React.FC<ICellRendererParams> = (props) => {
  const intl = useIntl();
  const tasksData = (props.data as JobModelType).tasks as Record<
    string,
    unknown
  >[];
  const keyPrefix = `${(props.data as JobModelType).resourceId as string}`;

  const statusPresentor = (task: Record<string, unknown>): JSX.Element => {
    if (task.status === Status.Failed) {
      return (
        <Box className={`${(task.status as string).toLowerCase()} gridCell`}>
          {task.status as string}
          <Tooltip content={truncate(task.reason as string, { length: 35 })}>
            <IconButton
              style={{
                fontSize: '20px',
                color: 'var(--mdc-theme-gc-error-medium)',
              }}
              className={'mc-icon-Warning'}
              label="failReasonIcon"
            />
          </Tooltip>
          <Tooltip content={intl.formatMessage({ id: 'action.copy.tooltip' })}>
            <CopyToClipboard text={task.reason as string}>
              <IconButton
                style={{ fontSize: '20px' }}
                className="mc-icon-Copy"
              />
            </CopyToClipboard>
          </Tooltip>
        </Box>
      );
    }
    return (
      <Box className={`${(task.status as string).toLowerCase()} gridCell`}>
        {task.status as string}
      </Box>
    );
  };

  const getValuePresentor = (
    task: Record<string, unknown>,
    field: ITaskField,
    setCollapsed?: (collapsed: boolean) => void
  ): JSX.Element => {
    switch (field.valueType) {
      case 'date':
        return (
          <Box className={'gridCell'}>
            {dateFormatter(task[field.name] as Moment, true)}
          </Box>
        );
        break;
      case 'Status':
        return statusPresentor(task);
        break;
      default:
        return <Box className={'gridCell'}>{task[field.name] as string} </Box>;
        break;
    }
  };

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
        {tasksData.map((task) => {
          return taskFileds.map((field) => {
            return getValuePresentor(task, field);
          });
        })}
      </Box>
    </Box>
  );
};
