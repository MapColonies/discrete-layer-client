import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { FormattedMessage } from 'react-intl';
import { Moment } from 'moment';
import { Box } from '@map-colonies/react-components';
import { JobModelType } from '../../../models';
import { dateFormatter } from '../../layers-results/type-formatters/type-formatters';
// import { dateFormatter, FormatterFunc, stringFormatter } from '../type-formatters/type-formatters';

import './job-details.cell-renderer.css';
import { StatusRenderer } from './status.cell-renderer';

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
  const getValuePresentor = (task: Record<string,unknown>, field: ITaskField): JSX.Element => {
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
  return (
    <Box >
    {
      <table className="tasksTable">
        <thead>
          <tr>
            {
              taskFileds.map(field => (
                <th 
                  key={`${keyPrefix}_${field.name}`} 
                  className="tasksTableColumnHeader"
                  style={getColumnStyle(field)}
                >
                  <FormattedMessage id={field.label} />
                </th>    
              ))
            }
          </tr>
        </thead>
        <tbody>
          {
            tasksData.map(task => (
              <tr key={`${keyPrefix}_${task.id as string}`}>
                {
                taskFileds.map(field => (
                  <td key={`${keyPrefix}_${task.id as string}_${field.name}`}>
                    {/* {(task[field.name] as string)} */}
                    {getValuePresentor(task, field)}
                  </td>
                ))
                }
              </tr>
            ))

          }
        </tbody>
        {/* <tr>
          <td>DB</td>
          <td>Completed</td>
          <td>1</td>
          <td>12/12/2020</td>
          <td>13/12/2020</td>
        </tr>
        <tr>
          <td>FS</td>
          <td>Failed</td>
          <td>1</td>
          <td>12/12/2020</td>
          <td>13/12/2020</td>
        </tr>
        <tr>
          <td>Mailer</td>
          <td>Completed</td>
          <td>2</td>
          <td>12/12/2020</td>
          <td>13/12/2020</td>
        </tr> */}
      </table>
    
  //     props.data.tasks.map((task: Record<string,unknown>,i:number) => {
  //       return (
  //         <Box  key={i} className="detailsColumn">
  //           {
  //             ['status', 'jobId'].map((field:string, ii: number) => {
  //               return(
  //                 <Box key={`${i}_${ii}`}>
  //                   <span style={{fontWeight:600}}>
  //                     LABEL
  //                     {/* <FormattedMessage id={task[field]} />:&nbsp; */}
  //                   </span>
  //                   <span>
  //                     {
  //                       task[field] as string
  //                       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //                       // item.formater(props.data[item.propName])
  //                     }
  //                   </span>
  //                 </Box>
  //               )
  //             })
  //           }
  //         </Box>
  //       )
  //     })
    }
  </Box>
  );

};
