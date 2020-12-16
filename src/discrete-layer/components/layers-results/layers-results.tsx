import React from 'react';
import { useIntl } from 'react-intl';
import { GridComponent, GridComponentOptions } from '../../../common/components/grid';
import { createMockData, MOCK_DATA_IMAGERY_LAYERS_ISRAEL } from '../../../__mocks-data__/search-results.mock';
import { ILayerImage } from '../../models/layerImage';
import { LayerDetailsRenderer } from './cell-renderer/layer-details.cell-renderer';

interface LayersResultsComponentProps {
  style?: {[key: string]: string};
}

const pagination = true;
const pageSize = 10;
const rowData = MOCK_DATA_IMAGERY_LAYERS_ISRAEL;//createMockData(pageSize * pageSize, 'body');

export const LayersResultsComponent: React.FC<LayersResultsComponentProps> = (props) => {
  const intl = useIntl();
  const colDef = [
    {
      headerName: intl.formatMessage({
        id: 'results.fields.name.label',
      }),
      width: 200,
      field: 'name',
      suppressMovable: true,
    },
    {
      headerName:  intl.formatMessage({
        id: 'results.fields.creation-date.label',
      }),
      width: 120,
      field: 'creationDate',
      suppressMovable: true,
    }
  ];
  const gridOptions: GridComponentOptions = {
    pagination: pagination,
    paginationPageSize: pageSize,
    columnDefs: colDef,
    getRowNodeId: (data: ILayerImage) => {
      return data.id;
    },
    detailsRowCellRenderer: 'detailsRenderer',
    detailsRowHeight: 150,
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
