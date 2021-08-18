import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { Icon } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';

export const IconRenderer: React.FC<ICellRendererParams> = (props) => {

  if (!props.value) {
    return <></>;
  }
  return (
    <Box className="expanderContainer">
      <Icon 
        style={{ color: 'var(--mdc-theme-primary)' }} 
        icon={{ icon: 'star_rate', size: 'small' }}
      /> 
    </Box>
  );

};
