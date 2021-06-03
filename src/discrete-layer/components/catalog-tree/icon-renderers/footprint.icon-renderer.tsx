import React, { useState } from 'react';
import { Checkbox } from '@map-colonies/react-core';

import './footprint.icon-renderer.css';

interface IFootprintCellRendererParams {
  onClick: (data: any) => void;
  data: any;
}

export const FootprintRenderer: React.FC<IFootprintCellRendererParams> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const [checked, setChecked] = useState<boolean>(props.data.footPrintShown as boolean);
  return (
    <div  style={{
      width: '36px'
    }}
    >
    <Checkbox 
      checked={checked}
      onClick={
        (evt): void => {
          setChecked(evt.currentTarget.checked);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          props.onClick(props.data);
        }}
    />
    </div>
 );
};
