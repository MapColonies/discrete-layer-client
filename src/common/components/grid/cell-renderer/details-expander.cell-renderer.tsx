import React, { useState, useEffect } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { Icon } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { DETAILS_ROW_ID_SUFFIX, IGridRowDataDetailsExt } from '../grid';

import './details-expander.cell-renderer.css';

export const DetailsExpanderRenderer: React.FC<ICellRendererParams> = (props) => {

  const BASE_ICON_ANGLE = 0;
  const UPSIDE_DOWN_ANGLE = 180;

  const [visible, setVisible] = useState(false);
  const [iconRotation, setIconRotation] = useState(BASE_ICON_ANGLE);
  
  const handleCollapseExpand = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const rowNode = props.api.getRowNode(`${props.data?.id as string}${DETAILS_ROW_ID_SUFFIX}`);   
    const isVisible = (rowNode.data as IGridRowDataDetailsExt).isVisible;
    setVisible(!isVisible);
    rowNode.setDataValue('isVisible', !isVisible);

    props.api.onFilterChanged();
  };

  // Rotating the icon when the details container is visible.
  useEffect(()=>{
    setIconRotation(visible ? UPSIDE_DOWN_ANGLE : BASE_ICON_ANGLE );
  }, [visible])

  return (
    <>
      {
      <Box className="expanderContainer" onClick={handleCollapseExpand}>
        <Icon 
          className={'expanderIcon'}
          style={{transform: `rotate(${iconRotation}deg)`}}
          icon={{ icon: 'expand_more', size: 'xsmall' }}
        />
      </Box>
      }
    </>
  );

};
