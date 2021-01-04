import React, { useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { Checkbox } from '@map-colonies/react-core';
import './row-selection.cell-renderer.css';

interface ISelectionCellRendererParams extends ICellRendererParams {
  onClick:  (id: string, value: any) => void;
}

export const RowSelectionRenderer: React.FC<ISelectionCellRendererParams> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const [checked, setChecked] = useState<boolean>(props.data.selected as boolean);
  return (
    <Checkbox 
      checked={checked}
      onClick={
        (evt): void => {
          setChecked(evt.currentTarget.checked);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          props.onClick(props.data.id, evt.currentTarget.checked);
        }}
    />
 );
};
