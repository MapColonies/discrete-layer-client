import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { FormattedMessage } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { Icon } from '@map-colonies/react-core';
import { useTheme } from '@map-colonies/react-core';
import './details-expander.cell-renderer.css';

export const DetailsExanderRenderer: React.FC<ICellRendererParams> = (
  props
) => {
  const value: boolean = (props.data as any).isVisible; 
  const theme = useTheme();
  
  const handleCollapseExpand = () => {
    console.log('handleCollapseExpand');
    const rowNode = props.api.getRowNode(props.data.id + '_details');
    rowNode.setDataValue('isVisible', !rowNode.data.isVisible);
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
