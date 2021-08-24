import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { Icon } from '@map-colonies/react-core';

import './icon.cell-renderer.css';

export const IconRenderer: React.FC<ICellRendererParams> = (props) => {

  return (
    <>
    {
      props.value && <Icon 
        className="cellRendererIcon"
        icon={{ icon: 'star_rate', size: 'small' }}
      />
    }
    </>
  );

};
