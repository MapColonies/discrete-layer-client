/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { CSSProperties, useEffect, useState } from 'react';
import { Box } from '@map-colonies/react-components';
import { AgGridReact } from 'ag-grid-react';
import {
  GridReadyEvent,
  GridApi,
  GridOptions,
  RowNode,
  ValueFormatterParams,
  RowSelectedEvent,
  CellMouseOverEvent,
  CellMouseOutEvent,
} from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { ILayerImage } from '../../../discrete-layer/models/layerImage';
import { DetailsExpanderRenderer } from './cell-renderer/details-expander.cell-renderer';

const DEFAULT_DTAILS_ROW_HEIGHT = 150;
const EXPANDER_COLUMN_WIDTH = 60;
const UPDATE_TIMEOUT = 0;
export const DETAILS_ROW_ID_SUFFIX = '_details';

interface GridComponentProps {
  gridOptions?: GridComponentOptions;
  rowData?: any[];
  style?: CSSProperties;
};

export interface GridCellMouseOutEvent extends CellMouseOutEvent{};
export interface GridCellMouseOverEvent extends CellMouseOverEvent{};
export interface GridRowSelectedEvent extends RowSelectedEvent{};
export interface GridValueFormatterParams extends ValueFormatterParams{};
export interface GridComponentOptions extends GridOptions {
  detailsRowCellRenderer?: string;
  detailsRowHeight?: number;
};
export interface IGridRowDataDetailsExt {
  rowHeight: number;
  fullWidth: boolean;
  isVisible: boolean;
};

export const GridComponent: React.FC<GridComponentProps> = (props) => {
  const [gridApi, setGridApi] = useState<GridApi>();
  const [rowData, setRowData] = useState<any[]>();
  

  const onGridReady = (params: GridReadyEvent): void => {
    setGridApi(params.api);
  };

  const onFirstDataRendered = (params: GridReadyEvent): void => {
    params.api.forEachNode(node => {
      if((node.data as ILayerImage).selected === true){
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (params.api as any).updatingSelectionCustom = true;
        node.setSelected(true, false, true);
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    setTimeout(()=>{(params.api as any).updatingSelectionCustom = false}, UPDATE_TIMEOUT);
  };

  const gridOptionsFromProps: GridComponentOptions = {
    ...props.gridOptions,
    onGridReady: onGridReady,
    onFirstDataRendered: onFirstDataRendered,
    columnDefs: [
      {
        field: 'isVisible',
        hide: true,
      },
      ...props.gridOptions?.columnDefs as [],
      props.gridOptions?.detailsRowCellRenderer !== undefined ? 
        {
          headerName: '',
          width: EXPANDER_COLUMN_WIDTH,
          cellRenderer: 'detailsExpanderRenderer',
          suppressMovable: true,
        } : 
        {
          hide: true,
        },
   ],
   getRowHeight: props.gridOptions?.detailsRowCellRenderer !== undefined ? (params: RowNode): number => {
    return (params.data as IGridRowDataDetailsExt).rowHeight;
   } : undefined,
   isExternalFilterPresent: props.gridOptions?.detailsRowCellRenderer !== undefined ? (): boolean => true : undefined,
   doesExternalFilterPass: props.gridOptions?.detailsRowCellRenderer !== undefined ? (node): boolean => {
      return (node.data as IGridRowDataDetailsExt).isVisible;
      //return gridOptions.api.getValue("isVisible", node.rowNode);
    } : undefined,
    isFullWidthCell: props.gridOptions?.detailsRowCellRenderer !== undefined ? (rowNode): boolean => {
      // checked the fullWidth attribute that was set while creating the data
      return (rowNode.data as IGridRowDataDetailsExt).fullWidth;
    } : undefined,
    fullWidthCellRenderer: props.gridOptions?.detailsRowCellRenderer ?? undefined,

   frameworkComponents: {
    ...props.gridOptions?.frameworkComponents as {[key: string]: any},
    detailsExpanderRenderer: DetailsExpanderRenderer,
   }
  };

  const {detailsRowCellRenderer, detailsRowHeight, ...gridOptions} = gridOptionsFromProps;

  useEffect(()=>{
    const result: any[] = [];
    if(props.gridOptions?.detailsRowCellRenderer !== undefined){
      props.rowData?.forEach((element,idx) => {
        result.push({
          ...element,
          isVisible:true
        });
        result.push({
          ...element, 
          fullWidth: true,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          id: `${element.id as string}${DETAILS_ROW_ID_SUFFIX}`,
          isVisible: false,
          rowHeight: props.gridOptions?.detailsRowHeight ?? DEFAULT_DTAILS_ROW_HEIGHT,
        });
      });
    }
    else {
      result.push(...(props.rowData as []));
    }
    setRowData(result);
  },[props.rowData, props.gridOptions]);

  return (
    <Box
      className="ag-theme-alpine"
      style={props.style}
    >
      <AgGridReact
        gridOptions={gridOptions}
        rowData={rowData}
      />
    </Box>
  );
};
