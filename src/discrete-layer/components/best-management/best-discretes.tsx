import { observer } from 'mobx-react';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useIntl } from 'react-intl';
import CONFIG from '../../../common/config';
import { 
  GridComponent,
  GridComponentOptions,
  GridCellMouseOverEvent,
  GridCellMouseOutEvent,
  GridRowDragEvent,
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
import { DiscreteOrder } from '../../models/DiscreteOrder';

import './best-discretes.css';

const IS_PAGINATION = false;
const IMMEDIATE_EXECUTION = 0;
const INITIAL_ORDER = 0;

interface BestDiscretesComponentProps {
  style?: {[key: string]: string};
  discretes?: LayerRasterRecordModelType[] | undefined;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const BestDiscretesComponent = observer(forwardRef((props: BestDiscretesComponentProps, ref) => {
  const { style, discretes } = props;
  const intl = useIntl();
  const store = useStore();
  const selectedLayersRef = useRef(INITIAL_ORDER);
  
  useImperativeHandle(ref, () => ({
    getOrderedDiscretes: (): DiscreteOrder[] => {
      return [{
        id: 'kuku',
        zOrder: 0
      }]
    }
  }));

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
          store.discreteLayersStore.showFootprint(id, value);
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
          store.discreteLayersStore.showLayer(id, value, order);
        }
      }
    },
    {
      headerName: intl.formatMessage({
        id: 'results.fields.name.label',
      }),
      width: 190,
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
    rowDragManaged: true,
    animateRows: true,
    onCellMouseOver(event: GridCellMouseOverEvent) {
      store.discreteLayersStore.highlightLayer(event.data as LayerRasterRecordModelType);
    },
    onCellMouseOut(event: GridCellMouseOutEvent) {
      store.discreteLayersStore.highlightLayer(undefined);
    },
    onRowClicked(event: GridRowSelectedEvent) {
      store.discreteLayersStore.selectLayerByID((event.data as LayerRasterRecordModelType).id);
    },
    onRowDragEnd(event: GridRowDragEvent) {
      store.bestStore.updateMovedLayer({ id: (event.node.data as LayerRasterRecordModelType).id, from: event.node.data.order, to: event.overIndex });
    },
    onGridReady(params: GridReadyEvent) {
      params.api.forEachNode( (node) => {
        if ((node.data as LayerRasterRecordModelType).id === store.discreteLayersStore.selectedLayer?.id) {
          params.api.selectNode(node, true);
        }
      });
    },
  };

  return (
    <>
      <GridComponent
        gridOptions={gridOptions}
        rowData={discretes}
        style={style}/>
    </>
  );
}));
