import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { Box } from '@map-colonies/react-components';

export const ActionsRenderer: React.FC<ICellRendererParams> = (props) => {
  return (
    <Box style={{
      display: 'flex',
      justifyContent: 'center'
    }}>
      <Box>
        <button>Priority</button>
      </Box>
    </Box>
 );
};
