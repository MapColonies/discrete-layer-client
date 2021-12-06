import React, { useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { FormattedMessage } from 'react-intl';
import { Moment } from 'moment';
import { Box } from '@map-colonies/react-components';
import { dateFormatter } from '../../../../common/helpers/type-formatters';
import { JobModelType, Status } from '../../../models';

import './job-details.cell-renderer.css';
import { JobDetailsHeader } from './job-details.header';
import { CollapseButton } from '../../../../common/components/collapse-button/collapse.button';
import { FailReasonArea } from './job-details.fail-reason-area';

type ValueType = 'string' | 'Status' | 'date';
interface ITaskField {
  name: string,
  label: string,
  valueType: ValueType
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
    label: 'system-status.task.fields.status.label',
    name: 'status',
    valueType: 'Status',
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
];

export const JobDetailsRenderer: React.FC<ICellRendererParams> = (
  props
) => {
  const tasksData = (props.data as JobModelType).tasks as Record<string,unknown>[];
  const keyPrefix = `${(props.data as JobModelType).resourceId as string}`;

  const getValuePresentor = (
     task: Record<string,unknown>,
     field: ITaskField,
     setCollapsed?: ((collapsed: boolean)=> void)
  ): JSX.Element => {
    switch(field.valueType){
      case "date":
        return (
          <>
            {dateFormatter(task[field.name] as Moment)}
          </>
        );
      case "Status":
        return (
          <Box className={`${(task[field.name] as string).toLowerCase()}`}>
            {task[field.name] as string}
            {task.status === Status.Failed && (
              <CollapseButton
                onClick={(collapsed: boolean): void => {
                  setCollapsed?.(!collapsed);
                }}
              />
            )}
          </Box>
        );
      default:
        return (
          <>
            {task[field.name] as string}
          </>
        );
    }

  };
  const getColumnStyle = (field: ITaskField): Record<string,string> => {
    switch(field.name){
      case 'attempts':
        return {width: '25%'};
      case 'status':
        return {width: '29%'};
      case 'created':
          return {width: '15%'};
      default:
        return {};
    }
  }

interface TaskRowProps{
  key: string;
  task: Record<string,unknown>;
}

const TaskRow: React.FC<TaskRowProps> = ({task, key}) => {

  const [collapsed, setCollapsed] = useState(true)

  return (
    <>
      <tr key={key} className={'taskRow'}>
          {
            taskFileds.map(field => (
              <td key={`${key}_${field.name}`} style={{verticalAlign: 'baseline'}}>
                <Box style={{display: 'flex', flexDirection:'row'}}>
                  {getValuePresentor(task, field, setCollapsed as ((collapsed?: boolean)=> void))}
                </Box>
              </td>
            ))
          }
        
      </tr>
      <tr>
        <FailReasonArea show={!collapsed} failReason={task.reason as string} key={`${key}_failReason`}/>
      </tr>
    </>
  )

}


  return (
    <Box className="tableFixHead">
      <JobDetailsHeader />
      <table className="tasksTable">
        <thead>
          <tr>
            {taskFileds.map((field) => (
              <th
                key={`${keyPrefix}_${field.name}`}
                className="tasksTableColumnHeader"
                style={getColumnStyle(field)}
              >
                <FormattedMessage id={field.label} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasksData.map((task) => (
            <TaskRow key={`${keyPrefix}_${task.id as string}`} task={task} />
          ))}
        </tbody>
      </table>
    </Box>
  );
};
