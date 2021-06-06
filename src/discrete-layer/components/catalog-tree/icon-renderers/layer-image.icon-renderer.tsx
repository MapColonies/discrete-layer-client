import React, { useState } from 'react';
import { IconButton } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';

import { ILayerImage } from '../../../models/layerImage';
import './layer-image.icon-renderer.css';

interface ILayerImageCellRendererParams {
  onClick: (data: ILayerImage, isShown: boolean) => void;
  data: ILayerImage;
}

export const LayerImageRenderer: React.FC<ILayerImageCellRendererParams> = (props) => {
  const [layerImageShown, setLayerImageShown] = useState<boolean>(props.data.layerImageShown as boolean);
  return (
    <Box  style={{    
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '8px'
      }}
    >
      <IconButton 
        className={layerImageShown ? 'mc-icon-Table---Fill-On layerShown' : 'mc-icon-Table-Fill-Off'}
        label="TABICON"
        onClick={
          (evt): void => {
            const val = !layerImageShown;
            evt.stopPropagation();
            setLayerImageShown(val);
            props.onClick(props.data, val);
          }
        }
      />
    </Box>
 );
};
