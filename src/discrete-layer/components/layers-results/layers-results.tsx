import React from 'react';
import { useIntl } from 'react-intl';
import { GridComponent, GridComponentOptions } from '../../../common/components/grid';
import { LayerDetailsRenderer } from './cell-renderer/layer-details.cell-renderer';

const createMockData = (count: number, prefix: string) => {
  const rowData = [];
  for (let i = 0; i < count; i++) {
    const item: any = {};

    // item.isVisible = true;
    item.id = i;
    // put in a column for each letter of the alphabet
    item.name = prefix + ' ("name",' + i + ')';
    item.collected = new Date();
    
    rowData.push(item);
    // rowData.push({
    //   ...item, 
    //   fullWidth: true,
    //   id: i.toString() + '_details',
    //   isVisible: false,
    //   rowHeight: 150
    // });

  }
  return rowData;
};


interface LayersResultsComponentProps {
  style?: {[key: string]: string};
}

const pagination = true;
const pageSize = 10;
const rowData = createMockData(100, 'body');
const colDef = [
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
  }
];


export const LayersResultsComponent: React.FC<LayersResultsComponentProps> = (props) => {
  const intl = useIntl();

  const gridOptions: GridComponentOptions = {
    // onGridReady: onGridReady,
    pagination: pagination,
    paginationPageSize: pageSize,
    columnDefs: colDef,
    getRowNodeId: (data) => {
      return data.id;
    },
    getRowHeight: (params: any) => {
      return params.data.rowHeight;
    },
    isFullWidthCell: (rowNode) => {
      // in this example, we check the fullWidth attribute that we set
      // while creating the data. what check you do to decide if you
      // want a row full width is up to you, as long as you return a boolean
      // for this method.
      return rowNode.data.fullWidth;
    },
    isExternalFilterPresent: () => {return true;},
    doesExternalFilterPass: (node) => {
      return node.data.isVisible;
      //return gridOptions.api.getValue("isVisible", node.rowNode);
    },
    fullWidthCellRenderer: 'detailsRenderer',
    overlayNoRowsTemplate: intl.formatMessage({
      id: 'results.nodata',
    }),
    frameworkComponents: {
      detailsRenderer: LayerDetailsRenderer
    },
  };

  return (
    <GridComponent
      gridOptions={gridOptions}
      rowData={rowData}
      style={props.style}
    />
  );
};
