import React from 'react';
import { shallow } from 'enzyme';
import { ICellRendererParams, Column, RowNode, GridApi, ColumnApi } from 'ag-grid-community';
import { LayerDetailsRenderer } from './layer-details.cell-renderer';

/* eslint-disable */
const mockDataBase:ICellRendererParams = {
  value: '',
  valueFormatted: null,
  getValue: () => {},
  setValue: () => {},
  formatValue: () => {},
  data: {
    name: '',
    creationDate: new Date('Sun Nov 15 2020 18:06:06 GMT+0200'),
  } as any,
  node: new RowNode(),
  colDef: {},
  column: new Column({},null,'name',false),
  $scope: null,
  rowIndex: 1,
  api: new GridApi(),
  columnApi: new ColumnApi(),
  context: null,
  refreshCell: () => {},
  eGridCell: document.createElement('span'),
  eParentOfValue: document.createElement('span'),
  addRenderedRowListener: () => {},
};
/* eslint-enable */

const NUM_SPAN_PER_FIELD = 2;
const NUM_FIEDLS = 10;

describe('AgGrid LayerDetailsRenderer component', () => {
  it('renders correctly', () => {
    const mockData = {
      ...mockDataBase
    };

    const wrapper = shallow(
      <LayerDetailsRenderer {...mockData} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('data fields presented as TOTAL_PARTS = NUM_SPAN_PER_FIELD * NUM_FIEDLS', () => {
    const mockData = {
      ...mockDataBase
    };

    const wrapper = shallow(
      <LayerDetailsRenderer {...mockData} />
    );

    const spans = wrapper.find('span');
    expect(spans).toHaveLength(NUM_SPAN_PER_FIELD * NUM_FIEDLS);
  });
});
