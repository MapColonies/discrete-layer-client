import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { Typography } from '@map-colonies/react-core';
import { getStatusStyle } from '../../../helpers/style';

export const StyledByDataRenderer: React.FC<ICellRendererParams> = (props) => {

  return (
    <Typography tag='span' style={getStatusStyle(props.data, 'color')}>
      {props.value}
    </Typography>
  );
  
};
