import React, { useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { IconButton } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { GridRowNode } from '..';

import './layer-image.cell-renderer.css';

interface ILayerImageCellRendererParams extends ICellRendererParams {
  onClick:  (id: string, value: boolean, node: GridRowNode) => void;
}

export const LayerImageRenderer: React.FC<ILayerImageCellRendererParams> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const [layerImageShown, setLayerImageShown] = useState<boolean>(props.data.layerImageShown as boolean);
  return (
    <Box style={{ display: 'flex', justifyContent: 'center', paddingTop: '8px' }}>
      <IconButton 
        className={layerImageShown ? 'mc-icon-Table---Fill-On layerShown' : 'mc-icon-Table-Fill-Off'}
        label="TABICON"
        onClick={
          (evt): void => {
            setLayerImageShown(!layerImageShown);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            props.onClick(props.data.id, !layerImageShown, props.node);
          }
        }
      />
    </Box>
  );
};
