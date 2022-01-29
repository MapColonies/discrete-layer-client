import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { DETAILS_ROW_ID_SUFFIX, IGridRowDataDetailsExt } from '../grid';
import {CollapseButton} from '../../collapse-button/collapse.button';

import './details-expander.cell-renderer.css';

export const DetailsExpanderRenderer: React.FC<ICellRendererParams> = (props) => {

  const handleCollapseExpand = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const rowNode = props.api.getRowNode(`${props.data?.id as string}${DETAILS_ROW_ID_SUFFIX}`);   
    const isVisible = (rowNode.data as IGridRowDataDetailsExt).isVisible;
    rowNode.setDataValue('isVisible', !isVisible);
    props.api.onFilterChanged();
  };

  return <CollapseButton onClick={handleCollapseExpand} />

};
