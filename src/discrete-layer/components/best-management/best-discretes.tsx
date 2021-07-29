import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { isObject } from 'lodash';
import { Button } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import CONFIG from '../../../common/config';
import { 
  GridComponent,
  GridComponentOptions,
  GridCellMouseOverEvent,
  GridCellMouseOutEvent,
  GridRowNode,
  GridRowSelectedEvent,
  GridReadyEvent,
  GridApi
} from '../../../common/components/grid';
import { FootprintRenderer } from '../../../common/components/grid/cell-renderer/footprint.cell-renderer';
import { HeaderFootprintRenderer } from '../../../common/components/grid/header-renderer/footprint.header-renderer';
import { LayerImageRenderer } from '../../../common/components/grid/cell-renderer/layer-image.cell-renderer';
import CustomTooltip from '../../../common/components/grid/tooltip-renderer/name.tooltip-renderer';
import { LayerRasterRecordModelType } from '../../models';
import { useStore } from '../../models/RootStore';

import './best-discretes.css';

const IS_PAGINATION = false;
const IMMEDIATE_EXECUTION = 0;
const INITIAL_ORDER = 0;

interface BestDiscretesComponentProps {
  style?: {[key: string]: string};
  discretes?: LayerRasterRecordModelType[] | undefined;
  // onSetOpen: (open: boolean) => void;
}

export const BestDiscretesComponent: React.FC<BestDiscretesComponentProps> = observer((props) => {
  const intl = useIntl();
  const { discreteLayersStore } = useStore();
  const selectedLayersRef = useRef(INITIAL_ORDER);

  const getMax = (valuesArr: number[]): number => valuesArr.reduce((prev, current) => (prev > current) ? prev : current);

  // const hashValueGetter = (params: ValueGetterParams): number => params.node.rowIndex;
  
  const colDef = [
    {
      width: 10,
      // valueGetter: hashValueGetter,
      suppressMovable: true,
      rowDrag: true
    },
    {
      width: 20,
      field: 'footPrintShown',
      cellRenderer: 'rowFootprintRenderer',
      cellRendererParams: {
        onClick: (id: string, value: boolean, node: GridRowNode): void => {
          discreteLayersStore.showFootprint(id, value);
         }
      },
      headerComponent: 'headerFootprintRenderer',
      headerComponentParams: { 
        onClick: (value: boolean, gridApi: GridApi): void => { 
          gridApi.forEachNode((item: GridRowNode)=> {
            setTimeout(()=> item.setDataValue('footPrintShown', value), IMMEDIATE_EXECUTION) ;
          });
        }  
      }
    },
    {
      width: 20,
      field: 'layerImageShown',
      cellRenderer: 'rowLayerImageRenderer',
      cellRendererParams: {
        onClick: (id: string, value: boolean, node: GridRowNode): void => {
          if (value) {
            selectedLayersRef.current++;
          } else {
            const orders: number[] = [];
            // eslint-disable-next-line
            (node as any).gridApi.forEachNode((item: GridRowNode)=> {
              const rowData = item.data as {[key: string]: string | boolean | number};
              if (rowData.layerImageShown === true && rowData.id !== id) {
                orders.push(rowData.order as number);
              }
            });
            selectedLayersRef.current = (orders.length) ? getMax(orders) : selectedLayersRef.current-1;
          }
          const order = value ? selectedLayersRef.current : null;
          discreteLayersStore.showLayer(id, value, order);
        }
      }
    },
    {
      headerName: intl.formatMessage({
        id: 'results.fields.name.label',
      }),
      width: 210,
      field: 'productName',
      suppressMovable: true,
      tooltipComponent: 'customTooltip',
      tooltipField: 'productName',
      tooltipComponentParams: { color: '#ececec' }
    },
    {
      headerName: intl.formatMessage({
        id: 'results.fields.resolution.label',
      }),
      width: 120,
      field: 'resolution',
      suppressMovable: true
    }
  ];
  const gridOptions: GridComponentOptions = {
    enableRtl: CONFIG.I18N.DEFAULT_LANGUAGE.toUpperCase() === 'HE',
    pagination: IS_PAGINATION,
    columnDefs: colDef,
    getRowNodeId: (data: LayerRasterRecordModelType) => {
      return data.id;
    },
    overlayNoRowsTemplate: intl.formatMessage({
      id: 'results.nodata',
    }),
    frameworkComponents: {
      rowFootprintRenderer: FootprintRenderer,
      rowLayerImageRenderer: LayerImageRenderer,
      customTooltip: CustomTooltip,
      headerFootprintRenderer: HeaderFootprintRenderer,
    },
    tooltipShowDelay: 0,
    tooltipMouseTrack: false,
    rowSelection: 'single',
    suppressCellSelection: true,
    // rowDragManaged: true,
    onCellMouseOver(event: GridCellMouseOverEvent) {
      discreteLayersStore.highlightLayer(event.data as LayerRasterRecordModelType);
    },
    onCellMouseOut(event: GridCellMouseOutEvent) {
      discreteLayersStore.highlightLayer(undefined);
    },
    onRowClicked(event: GridRowSelectedEvent) {
      discreteLayersStore.selectLayerByID((event.data as LayerRasterRecordModelType).id);
    },
    onGridReady(params: GridReadyEvent) {
      params.api.forEachNode( (node) => {
        if ((node.data as LayerRasterRecordModelType).id === discreteLayersStore.selectedLayer?.id) {
          params.api.selectNode(node, true);
        }
      });
    },
  };

  const handleSave = (): void => {
    // TODO save in localStorage
  };

  return (
    <>
      <GridComponent
        gridOptions={gridOptions}
        rowData={props.discretes}
        style={props.style}/>
      <Box className="saveButton">
        <Button raised type="button" onClick={(): void => { handleSave(); } }>
          <FormattedMessage id="general.save-btn.text"/>
        </Button>
      </Box>
    </>
  );
});
