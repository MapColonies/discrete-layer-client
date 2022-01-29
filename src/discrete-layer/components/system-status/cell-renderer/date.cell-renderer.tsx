import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { Tooltip } from '@map-colonies/react-core';
import moment, { Moment } from 'moment';
import {
  dateFormatter,
  relativeDateFormatter,
} from '../../../../common/helpers/type-formatters';
import { Box } from '@map-colonies/react-components';

interface IDateCellRendererParams extends ICellRendererParams {
  field: string;
}

export const DateCellRenderer: React.FC<IDateCellRendererParams> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const date: Moment = moment(props.data[props.field]);

  return (
    <Tooltip content={dateFormatter(date, true)}>
      <Box>{relativeDateFormatter(date)}</Box>
    </Tooltip>
  );
};
