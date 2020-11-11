import React from 'react';
import { shallow } from 'enzyme';
import { ICellRendererParams, Column, RowNode, GridApi, ColumnApi } from 'ag-grid-community';
import { LinkRenderer } from './link.cell-renderer';

/* eslint-disable */
const mockDataBase:ICellRendererParams = {
  value: '',
  valueFormatted: null,
  getValue: () => {},
  setValue: () => {},
  formatValue: () => {},
  data: {link: ''} as any,
  node: new RowNode(),
  colDef: {},
  column: new Column({},null,'link',false),
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

// describe('AgGrid LinkRenderer component', () => {
//   it('renders correctly', () => {
//     const mockData = {
//       ...mockDataBase
//     };

//     const wrapper = shallow(
//       <LinkRenderer {...mockData} />
//     );

//     expect(wrapper).toMatchSnapshot();
//   });

//   it('value of link rendered as href', () => {
//     const value = 'http://kuku.com/1';
//     const mockData = {
//       ...mockDataBase,
//       value,
//       data: { link: value },
//     };

//     const wrapper = shallow(
//       <LinkRenderer {...mockData} />
//     );
    
//     const linkContainer = wrapper.find('a');
//     expect(linkContainer.props().href).toBe(value);
//   });

//   it('empty link value not renders an <a>', () => {
//     const value = '';
//     const mockData = {
//       ...mockDataBase,
//       value,
//       data: { link: value },
//     };

//     const wrapper = shallow(
//       <LinkRenderer {...mockData} />
//     );
    
//     const linkContainer = wrapper.find('a');
//     expect(linkContainer).toEqual({});
//   });

// });
