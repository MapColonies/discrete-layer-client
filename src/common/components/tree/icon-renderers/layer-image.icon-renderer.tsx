import React, { useState } from 'react';
import { get } from 'lodash';
import { IconButton } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { ILayerImage } from '../../../../discrete-layer/models/layerImage';

import './layer-image.icon-renderer.css';

interface ILayerImageCellRendererParams {
  onClick: (data: ILayerImage, isShown: boolean) => void;
  data: ILayerImage;
}

export const LayerImageRenderer: React.FC<ILayerImageCellRendererParams> = (props) => {
  const [layerImageShown, setLayerImageShown] = useState<boolean>(props.data.layerImageShown as boolean);
  return (
    <Box>
      <IconButton 
        className={layerImageShown ? 'mc-icon-Show imageChecked' : get(props.data, 'layerURLMissing') ? 'mc-icon-Hide urlMissing' : 'mc-icon-Hide'}
        label="LAYER IMAGE SHOWN ICON"
        onClick={
          (evt: React.MouseEvent<HTMLButtonElement>): void => {
            if (!get(props.data, 'layerURLMissing')) {
              const val = !layerImageShown;
              evt.stopPropagation();
              setLayerImageShown(val);
              props.onClick(props.data, val);
            }
          }
        }
      />
    </Box>
  );
};
