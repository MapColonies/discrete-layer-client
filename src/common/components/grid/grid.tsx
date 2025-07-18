/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { CSSProperties, useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ChangeDetectionStrategyType } from 'ag-grid-react/lib/changeDetectionService';
import {
  GridReadyEvent as AgGridReadyEvent,
  GridApi as AgGridApi,
  GridOptions,
  RowNode,
  ValueFormatterParams,
  RowSelectedEvent,
  CellMouseOverEvent,
  CellMouseOutEvent,
  RowDragEnterEvent,
  RowDragEndEvent
} from 'ag-grid-community';
import { useTheme } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { GRID_MESSAGES } from '../../i18n';
import CONFIG from '../../config';
import { DetailsExpanderRenderer } from './cell-renderer/details-expander.cell-renderer';
import { GridThemes } from './themes/themes';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const DEFAULT_DETAILS_ROW_HEIGHT = 150;
const EXPANDER_COLUMN_WIDTH = 60;
export const DETAILS_ROW_ID_SUFFIX = '_details';

interface GridComponentProps {
  gridOptions?: GridComponentOptions;
  rowData?: any[];
  style?: CSSProperties;
  isLoading?: boolean;
};

export interface GridApi extends AgGridApi{};
export interface GridReadyEvent extends AgGridReadyEvent{};
export interface GridCellMouseOutEvent extends CellMouseOutEvent{};
export interface GridCellMouseOverEvent extends CellMouseOverEvent{};
export interface GridRowDragEnterEvent extends RowDragEnterEvent{};
export interface GridRowDragEndEvent extends RowDragEndEvent{};
export interface GridRowSelectedEvent extends RowSelectedEvent{};
export interface GridValueFormatterParams extends ValueFormatterParams{};
export interface GridComponentOptions extends GridOptions {
  detailsRowCellRenderer?: string;
  detailsRowHeight?: number;
  detailsRowExpanderPosition?: 'start' | 'end';
  rowDataChangeDetectionStrategy?: ChangeDetectionStrategyType;
  detailsRowCellRendererPresencePredicate?: (data: any) => boolean;
};

export interface IGridRowDataDetailsExt {
  rowHeight: number;
  fullWidth: boolean;
  isVisible: boolean;
};
export interface GridRowNode extends RowNode {};

export const GridComponent: React.FC<GridComponentProps> = (props) => {
  const [rowData, setRowData] = useState<any[]>()
  const theme = useTheme();
  const [gridApi, setGridApi] = useState<GridApi>();
  
  const {rowDataChangeDetectionStrategy, detailsRowExpanderPosition, ...restGridOptions} = props.gridOptions as GridComponentOptions;
  const reactGridConfig = {
    rowDataChangeDetectionStrategy: rowDataChangeDetectionStrategy ?? undefined,
  };

  const gridOptionsFromProps: GridComponentOptions = {
    ...restGridOptions,
    columnDefs: [
      {
        field: 'isVisible',
        hide: true,
      },
      (props.gridOptions?.detailsRowExpanderPosition ===  'start' && props.gridOptions.detailsRowCellRenderer !== undefined) ? 
        {
          headerName: '',
          width: EXPANDER_COLUMN_WIDTH,
          cellRenderer: 'detailsExpanderRenderer',
          suppressMovable: true,
          cellRendererParams: {
            detailsRowCellRendererPresencePredicate: props.gridOptions.detailsRowCellRendererPresencePredicate
          }
        } : 
        {
          hide: true,
        },
      ...props.gridOptions?.columnDefs as [],
      (props.gridOptions?.detailsRowExpanderPosition !==  'start' && props.gridOptions?.detailsRowCellRenderer !== undefined) ? 
        {
          headerName: '',
          width: EXPANDER_COLUMN_WIDTH,
          cellRenderer: 'detailsExpanderRenderer',
          suppressMovable: true,
          cellRendererParams: {
            detailsRowCellRendererPresencePredicate: props.gridOptions.detailsRowCellRendererPresencePredicate
          }
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
   },
   localeText: GRID_MESSAGES[CONFIG.I18N.DEFAULT_LANGUAGE],
   onGridReady(params: GridReadyEvent) {
    if (typeof(restGridOptions.onGridReady) === 'function') {
      restGridOptions.onGridReady(params);
    } 

    setGridApi(params.api);
   },
  };

  const {detailsRowCellRenderer, detailsRowHeight, ...gridOptions} = gridOptionsFromProps;

  const getIsVisible = (id:string): boolean => {
    let res = false;

    gridApi?.forEachNode((node) => {
      const nodeData = node.data as Record<string,any>;
      if (nodeData.id === id) {
        res = nodeData.isVisible as boolean;
      }
    });
    return res;
  };


  useEffect(() => {
    const result: any[] = [];
    if (props.gridOptions?.detailsRowCellRenderer !== undefined) {
      props.rowData?.forEach((element,idx) => {
        const rowElement: Record<string, unknown> = element as Record<string, unknown>;

        result.push({
          ...rowElement,
          isVisible: true
        });
        result.push({
          ...rowElement, 
          fullWidth: true,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          id: `${rowElement.id as string}${DETAILS_ROW_ID_SUFFIX}`,
          isVisible: getIsVisible(`${rowElement.id as string}${DETAILS_ROW_ID_SUFFIX}`),
          rowHeight: props.gridOptions?.detailsRowHeight ?? DEFAULT_DETAILS_ROW_HEIGHT,
        });
      });
    } else {
      result.push(...(props.rowData as []));
    }
    if (typeof props.isLoading === 'undefined' || props.isLoading === false) {
      gridApi?.hideOverlay();
      setRowData(result);
    } else {
      gridApi?.showLoadingOverlay();
    }
  
  }, [props.rowData, props.gridOptions, props.isLoading]);

  const agGridThemeOverrides = GridThemes.getTheme(theme);

  return (
    <Box
      className={theme.type === 'dark' ? 'ag-theme-alpine-dark' : 'ag-theme-alpine' }
      style={{
        ...props.style,
        ...agGridThemeOverrides
      }}
    >
      <AgGridReact
        gridOptions={gridOptions}
        rowData={rowData}
        {...reactGridConfig} />
    </Box>
  );
};
