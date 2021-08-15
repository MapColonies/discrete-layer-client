import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { Icon, useTheme } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';

export const IconRenderer: React.FC<ICellRendererParams> = (props) => {
  const theme = useTheme();

  if (!props.value) {
    return <></>;
  }
  return (
    <Box className="expanderContainer">
      <Icon 
        style={{ color: (theme.primary as string) }} 
        icon={{ icon: 'favorite', size: 'small' }}
      />
    </Box>
  );

};
