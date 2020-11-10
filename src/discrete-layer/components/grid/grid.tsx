import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  ICellRendererParams,
  GridReadyEvent,
  GridApi,
  ValueGetterParams,
} from 'ag-grid-community';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   Button,
// } from '@map-colonies/react-core';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { DetailsExanderRenderer } from './cell-renderer/details-expander.cell-renderer';
import { DetailsRenderer } from './cell-renderer/details.cell-renderer';

const createMockData = (count: number, prefix: string) => {
  const rowData = [];
  for (let i = 0; i < count; i++) {
    const item: any = {};
    // mark every third row as full width. how you mark the row is up to you,
    // in this example the example code (not the grid code) looks at the
    // fullWidth attribute in the isFullWidthCell() callback. how you determine
    // if a row is full width or not is totally up to you.

    // item.fullWidth = i % 3 === 2;
    item.isVisible = true;
    item.id = i;
    // put in a column for each letter of the alphabet
    item.name = prefix + ' ("name",' + i + ')';
    item.collected = new Date();
    
    rowData.push(item);
    rowData.push({
      ...item, 
      fullWidth: true,
      id: i.toString() + '_details',
      isVisible: false,
      rowHeight: 150
    });

  }
  return rowData;
};

interface GridComponentProps {
  isOpen?: boolean;
}

const pagination = true;
const pageSize = 10;
const rowData = createMockData(100, 'body');
const colDef = [
  {
    field: 'isVisible',
    hide: true,
  },
  {
    headerName: 'Name',
    width: 200,
    field: 'name',
    suppressMovable: true,
  },
  {
    headerName: 'Collected',
    width: 120,
    field: 'collected',
    suppressMovable: true,
  },
  {
    width: 20,
    field: 'progress',
    cellRenderer: 'detailsExanderRenderer',
    suppressMovable: true,
  },
];


export const GridComponent: React.FC<GridComponentProps> = (props) => {
  const [gridApi, setGridApi] = useState<GridApi>();
  const intl = useIntl();

  const onGridReady = (params: GridReadyEvent): void => {
    setGridApi(params.api);
  };
  return (
    <Box
      className="ag-theme-alpine"
      style={{
        height: '450px',
        width: '100%',
      }}
    >
      <AgGridReact
        onGridReady={onGridReady}
        pagination={pagination}
        paginationPageSize={pageSize}
        columnDefs={colDef}
        getRowNodeId= {(data) => {
          return data.id;
        }}
        getRowHeight= {(params: any) => {
          return params.data.rowHeight;
        }}
        isFullWidthCell= {(rowNode) => {
          // in this example, we check the fullWidth attribute that we set
          // while creating the data. what check you do to decide if you
          // want a row full width is up to you, as long as you return a boolean
          // for this method.
          return rowNode.data.fullWidth;
        }}
        isExternalFilterPresent= {() => {return true;}}
        doesExternalFilterPass= {(node) => {
          console.log('doesExternalFilterPass',node);
          return node.data.isVisible;
          //return gridOptions.api.getValue("isVisible", node.rowNode);
        }}
        fullWidthCellRenderer = {'detailsRenderer'} 
        // see ag-Grid docs cellRenderer for details on how to build cellRenderers
        // this is a simple function cellRenderer, returns plain HTML, not a component
        // fullWidthCellRenderer = {(params) => {
        //   // pinned rows will have node.rowPinned set to either 'top' or 'bottom' - see docs for row pinning
        //   var cssClass;
        //   var message;
      
        //   if (params.node.rowPinned) {
        //     cssClass = 'example-full-width-pinned-row';
        //     message = 'Pinned full width row at index ' + params.rowIndex;
        //   } else {
        //     cssClass = 'example-full-width-row';
        //     message = 'Normal full width row at index' + params.rowIndex;
        //   }
      
        //   var eDiv = document.createElement('div');
        //   eDiv.innerHTML =
        //     '<div class="' +
        //     cssClass +
        //     '"><button>Click</button> ' +
        //     message +
        //     '</div>';
      
        //   var eButton = eDiv.querySelector('button');
        //   eButton.addEventListener('click', function () {
        //     alert('button clicked', params);
        //     console.log(params);
        //     var rowNode = gridOptions.api.getRowNode('2');
        //     rowNode.setDataValue('isVisible', false);
        //     gridOptions.api.onFilterChanged();
        //     // params.node.data.isVisible=false
        //     // params.node.data.fullWidth= false;
        //     // params.node.setDataValue('A', 123);
        //   });
      
        //   return eDiv.firstChild;
        // }}
        rowData={rowData}
        overlayNoRowsTemplate={intl.formatMessage({
          id: 'export-table.nodata',
        })}
        frameworkComponents={{
          detailsExanderRenderer: DetailsExanderRenderer,
          detailsRenderer: DetailsRenderer
        }}
      />
    </Box>
  );
};
