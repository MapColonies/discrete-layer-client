import React, { useState } from 'react';
import { Radio } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { LayerRasterRecordModelType } from '../../../models';

import './import.icon-renderer.css';

interface IImportCellRendererParams {
  onClick: (data: LayerRasterRecordModelType, isShown: boolean) => void;
  data: LayerRasterRecordModelType;
}

export const ImportRenderer: React.FC<IImportCellRendererParams> = (props) => {
  const [checked, setChecked] = useState<boolean>(props.data.isNewlyAddedToBest as boolean);
  return (
    <Box style={{ width: '36px' }}>
      <Radio 
        checked={checked}
        onClick={
          (evt): void => {
            evt.stopPropagation();
            setChecked(evt.currentTarget.checked);
            props.onClick(props.data, evt.currentTarget.checked);
          }}
      />
    </Box>
 );
};
