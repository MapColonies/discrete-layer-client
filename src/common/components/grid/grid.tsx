import React, { CSSProperties, useEffect, useState } from 'react';
import { Box } from '@map-colonies/react-components';
import { AgGridReact } from 'ag-grid-react';
import {
  GridReadyEvent,
  GridApi,
  GridOptions,
} from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { DetailsExanderRenderer } from './cell-renderer/details-expander.cell-renderer';

export interface GridComponentOptions extends GridOptions {};

interface GridComponentProps {
  gridOptions?: GridComponentOptions;
  rowData?: any[];
  style?: CSSProperties;
}


export const GridComponent: React.FC<GridComponentProps> = (props) => {
  const [gridApi, setGridApi] = useState<GridApi>();
  const [rowData, setRowData] = useState<any[]>();

  useEffect(()=>{
    const result: any[] = [];
    props.rowData?.forEach((element,idx) => {
      result.push({
        ...element,
        isVisible:true
      });
      result.push({
        ...element, 
        fullWidth: true,
        id: element.id.toString() + '_details',
        isVisible: false,
        rowHeight: 150
      });
    });
    setRowData(result);
  },[props.rowData]);
  
  const onGridReady = (params: GridReadyEvent): void => {
    setGridApi(params.api);
  };

  const gridOptions: GridOptions = {
    ...props.gridOptions,
    onGridReady: onGridReady,
    columnDefs: [
      {
        field: 'isVisible',
        hide: true,
      },
      ...props.gridOptions?.columnDefs as [],
      {
        headerName: '',
        width: 60,
        cellRenderer: 'detailsExanderRenderer',
        suppressMovable: true,
      },
   ],
   frameworkComponents: {
    ...props.gridOptions?.frameworkComponents as {[key: string]: any},
    detailsExanderRenderer: DetailsExanderRenderer,
   }
  };

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
