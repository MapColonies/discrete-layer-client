import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { isObject } from 'lodash';
import { ValueGetterParams } from 'ag-grid-community';
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
import { usePrevious } from '../../../common/hooks/previous.hook';
import { FootprintRenderer } from '../../../common/components/grid/cell-renderer/footprint.cell-renderer';
import { HeaderFootprintRenderer } from '../../../common/components/grid/header-renderer/footprint.header-renderer';
import { LayerImageRenderer } from '../../../common/components/grid/cell-renderer/layer-image.cell-renderer';
import CustomTooltip from '../../../common/components/grid/tooltip-renderer/name.tooltip-renderer';
import { ILayerImage } from '../../models/layerImage';
import { useStore } from '../../models/RootStore';

const IS_PAGINATION = true;
const PAGE_SIZE = 10;
const IMMEDIATE_EXECUTION = 0;
const INITIAL_ORDER = 0;

interface BestDiscretesComponentProps {
  style?: {[key: string]: string};
}

export const BestDiscretesComponent: React.FC<BestDiscretesComponentProps> = observer((props) => {
  const intl = useIntl();
  const { discreteLayersStore } = useStore();
  const [layersImages, setLayersImages] = useState<ILayerImage[]>([]);

  const prevLayersImages = usePrevious<ILayerImage[]>(layersImages);
  const cacheRef = useRef({} as ILayerImage[]);
  const selectedLayersRef = useRef(INITIAL_ORDER);

  useEffect(()=>{
    if(discreteLayersStore.layersImages){
      setLayersImages(discreteLayersStore.layersImages);
    }
  },[discreteLayersStore.layersImages]);

  const isSameRowData = (source: ILayerImage[] | undefined, target: ILayerImage[] | undefined): boolean => {
    let res = false;
    if (source && target &&
        source.length === target.length) {
          let matchesRes = true;
          source.forEach((srcFeat: ILayerImage) => {
            const match = target.find((targetFeat: ILayerImage) => {
              return targetFeat.id === srcFeat.id;
            });
            matchesRes = matchesRes && isObject(match);
          });
          res = matchesRes;
    }
    return res;
  };

  const getRowData = (): ILayerImage[] | undefined => {
    if (isSameRowData(prevLayersImages, layersImages)) {
      return cacheRef.current;
    } else {
      cacheRef.current = layersImages;
      selectedLayersRef.current = INITIAL_ORDER;
      return cacheRef.current;
    }
  }

  const getMax = (valuesArr: number[]): number => valuesArr.reduce((prev, current) => (prev > current) ? prev : current);

  const hashValueGetter = (params: ValueGetterParams): number => params.node.rowIndex;
  
  const colDef = [
    {
      headerName: intl.formatMessage({
        id: 'results.fields.order.label',
      }),
      width: 90,
      valueGetter: hashValueGetter,
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
      width: 150,
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
    paginationPageSize: PAGE_SIZE,
    columnDefs: colDef,
    getRowNodeId: (data: ILayerImage) => {
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
      discreteLayersStore.highlightLayer(event.data as ILayerImage);
    },
    onCellMouseOut(event: GridCellMouseOutEvent) {
      discreteLayersStore.highlightLayer(undefined);
    },
    onRowClicked(event: GridRowSelectedEvent) {
      discreteLayersStore.selectLayerByID((event.data as ILayerImage).id);
    },
    onGridReady(params: GridReadyEvent) {
      params.api.forEachNode( (node) => {
        if ((node.data as ILayerImage).id === discreteLayersStore.selectedLayer?.id) {
          params.api.selectNode(node, true);
        }
      });
    },
  };

  return (
    <GridComponent
      gridOptions={gridOptions}
      rowData={getRowData()}
      style={props.style}
    />
  );
});
