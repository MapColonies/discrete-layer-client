import React, { useState } from 'react';
import { Checkbox } from '@map-colonies/react-core';

import { ILayerImage } from '../../../models/layerImage';
import './footprint.icon-renderer.css';

interface IFootprintCellRendererParams {
  onClick: (data: ILayerImage, isShown: boolean) => void;
  data: ILayerImage;
}

export const FootprintRenderer: React.FC<IFootprintCellRendererParams> = (props) => {
  const [checked, setChecked] = useState<boolean>(props.data.footprintShown as boolean);
  return (
    <div  style={{
      width: '36px'
    }}
    >
    <Checkbox 
      checked={checked}
      onClick={
        (evt): void => {
          evt.stopPropagation();
          setChecked(evt.currentTarget.checked);
          props.onClick(props.data, evt.currentTarget.checked);
        }}
    />
    </div>
 );
};
