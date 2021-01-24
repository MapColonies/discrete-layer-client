import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { isObject } from 'lodash';
import { GridComponent, GridComponentOptions, GridValueFormatterParams, GridCellMouseOverEvent, GridCellMouseOutEvent, GridRowNode } from '../../../common/components/grid';
import { usePrevious } from '../../../common/hooks/previous.hook';
import { ILayerImage } from '../../models/layerImage';
import { useStore } from '../../models/rootStore';
import { LayerDetailsRenderer } from './cell-renderer/layer-details.cell-renderer';
import { RowSelectionRenderer } from './cell-renderer/row-selection.cell-renderer';
import { dateFormatter } from './type-formatters/type-formatters';

interface LayersResultsComponentProps {
  style?: {[key: string]: string};
}

const pagination = true;
const pageSize = 10;
const immediateExecution = 0;
const intialOrder = 0;

export const LayersResultsComponent: React.FC<LayersResultsComponentProps> = observer((props) => {
  const intl = useIntl();
  const { discreteLayersStore } = useStore();
  const [layersImages, setlayersImages] = useState<ILayerImage[]>([]);

  const prevLayersImages = usePrevious<ILayerImage[]>(layersImages);
  const cacheRef = useRef({} as ILayerImage[]);
  const selectedLayersRef = useRef(intialOrder);

  useEffect(()=>{
    if(discreteLayersStore.layersImages){
      setlayersImages(discreteLayersStore.layersImages);
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
      selectedLayersRef.current = intialOrder;
      return cacheRef.current;
    }
  }

  const getMax = (valuesArr: number[]) => valuesArr.reduce((prev, current) => (prev > current) ? prev : current);
  
  const colDef = [
    {
      width: 20,
      field: 'selected',
      cellRenderer: 'rowSelectionRenderer',
      cellRendererParams: {
        onClick: (id: string, value: boolean, node: GridRowNode): void => {
          setTimeout(()=> node.setDataValue('selected', value), immediateExecution);
          if(value) {
            selectedLayersRef.current++;
          }
          else {
            const orders: number[] = [];
            // eslint-disable-next-line
            (node as any).gridApi.forEachNode((item: GridRowNode)=> {
              const rowData = item.data as {[key: string]: string | boolean | number};
              if(rowData.selected === true && rowData.id !== id) {
                orders.push(rowData.order as number);
              }
            });
            selectedLayersRef.current = (orders.length) ? getMax(orders) : selectedLayersRef.current-1;
          }
          const order = value ? selectedLayersRef.current : null;
          setTimeout(()=> node.setDataValue('order', order), immediateExecution) ;
          discreteLayersStore.showLayer(id, value, order);
        }
      }
    },
    {
      headerName: intl.formatMessage({
        id: 'results.fields.order.label',
      }),
      width: 50,
      field: 'order',
    },
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
      valueFormatter: (params: GridValueFormatterParams): string => dateFormatter(params.value),
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
      detailsRenderer: LayerDetailsRenderer,
      rowSelectionRenderer: RowSelectionRenderer,
    },
    rowSelection: 'multiple',
    suppressRowClickSelection: true,
    onCellMouseOver(event: GridCellMouseOverEvent) {
      discreteLayersStore.highlightLayer((event.data as ILayerImage).id);
    },
    onCellMouseOut(event: GridCellMouseOutEvent) {
      discreteLayersStore.highlightLayer('');
    }
  };

  return (
    <GridComponent
      gridOptions={gridOptions}
      rowData={getRowData()}
      style={props.style}
    />
  );
});
