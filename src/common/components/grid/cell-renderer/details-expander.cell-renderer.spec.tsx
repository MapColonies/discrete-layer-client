import React from 'react';
import { shallow } from 'enzyme';
import { ICellRendererParams, Column, RowNode, GridApi, ColumnApi } from 'ag-grid-community';
import { DetailsExanderRenderer } from './details-expander.cell-renderer';
import { Icon } from '@map-colonies/react-core';

/* eslint-disable */
const mockDataBase:ICellRendererParams = {
  value: '',
  valueFormatted: null,
  getValue: () => {},
  setValue: () => {},
  formatValue: () => {},
  data: {isVisible:true },
  node: new RowNode(),
  colDef: {},
  column: new Column({},null,'isVisible',true),
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

describe('AgGrid DetailsExanderRenderer component', () => {
  it('renders correctly', () => {
    const mockData = {
      ...mockDataBase
    };

    const wrapper = shallow(
      <DetailsExanderRenderer {...mockData} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('when component clicked detail row was found in grid rowdata', () => {
    const value='1';
    const mockData = {
      ...mockDataBase,
      value,
      data: { id: '1' },
    };

    const spyGetRonNode = jest.spyOn(mockData.api, 'getRowNode');

    const wrapper = shallow(
      <DetailsExanderRenderer {...mockData} />
    );

    wrapper.update();
    
    const fieldWrapper = wrapper.find(Icon);
    console.log(fieldWrapper, '------', fieldWrapper.length, '---', wrapper.text()); 

    const iconContainer = wrapper.find(Icon);
    iconContainer.simulate('click');
    expect(spyGetRonNode).toHaveBeenCalled();
  });

});
