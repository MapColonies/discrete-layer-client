import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { Icon } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { DETAILS_ROW_ID_SUFFIX, IGridRowDataDetailsExt } from '../grid';

import './details-expander.cell-renderer.css';

export const DetailsExpanderRenderer: React.FC<ICellRendererParams> = (props) => {
  const value: boolean = (props.data as IGridRowDataDetailsExt).isVisible;
  
  const handleCollapseExpand = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const rowNode = props.api.getRowNode(`${props.data?.id as string}${DETAILS_ROW_ID_SUFFIX}`);
    rowNode.setDataValue('isVisible', !(rowNode.data as IGridRowDataDetailsExt).isVisible);
    props.api.onFilterChanged();
  };

  return (
    <>
      {
      value && <Box className="expanderContainer" onClick={handleCollapseExpand}>
        <Icon 
          style={{ color: 'var(--mdc-theme-primary)' }}
          icon={{ icon: 'expand_more', size: 'xsmall' }}
        />
      </Box>
      }
    </>
  );

};
