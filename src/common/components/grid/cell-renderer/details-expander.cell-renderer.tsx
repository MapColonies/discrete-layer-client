import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { Box } from '@map-colonies/react-components';
import { Icon } from '@map-colonies/react-core';
import { useTheme } from '@map-colonies/react-core';
import { DETAILS_ROW_ID_SUFFIX, IGridRowDataDetailsExt } from '../grid';
import './details-expander.cell-renderer.css';

export const DetailsExpanderRenderer: React.FC<ICellRendererParams> = (
  props
) => {
  const value: boolean = (props.data as IGridRowDataDetailsExt).isVisible; 
  const theme = useTheme();
  
  const handleCollapseExpand = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const rowNode = props.api.getRowNode(`${props.data?.id as string}${DETAILS_ROW_ID_SUFFIX}`);
    rowNode.setDataValue('isVisible', !(rowNode.data as IGridRowDataDetailsExt).isVisible);
    props.api.onFilterChanged();
  };

  if (!value) {
    return <></>;//''; // not null!
  }
  return (
    <Box className="expanderContainer" onClick={handleCollapseExpand}>
      <Icon 
        style={{color: theme.primary}} 
        icon={{ icon: 'expand_more', size: 'xsmall' }}
      />
    </Box>
  );

};
