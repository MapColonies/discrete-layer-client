import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import TooltippedValue, { TooltippedValueProps } from '../../../../common/components/form/tooltipped.value';
import './tool-tipped.cell-renderer.css';
import { Box } from '@material-ui/core';

export const TooltippedCellRenderer: React.FC<
  ICellRendererParams & TooltippedValueProps
> = (props) => {
  const {
    tag,
    className,
    alwaysTooltip,
    disableTooltip,
    customTooltipText,
  } = props;

  return (
    <Box className='tooltippedCell'>
      <TooltippedValue
        tag={tag}
        alwaysTooltip={alwaysTooltip}
        disableTooltip={disableTooltip}
        customTooltipText={customTooltipText}
        className={className}>
        {props.value}
      </TooltippedValue>
    </Box>
  );
};
