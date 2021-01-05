import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { find, isObject } from 'lodash';
import { GridComponent, GridComponentOptions, GridRowSelectedEvent, GridValueFormatterParams, GridCellMouseOverEvent, GridCellMouseOutEvent, GridReadyEvent } from '../../../common/components/grid';
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
const UPDATE_TIMEOUT = 0;

export const LayersResultsComponent: React.FC<LayersResultsComponentProps> = observer((props) => {
  const intl = useIntl();
  const { discreteLayersStore } = useStore();
  const [layersImages, setlayersImages] = useState<ILayerImage[]>([]);

  useEffect(()=>{
    if(discreteLayersStore.layersImages){
      setlayersImages(discreteLayersStore.layersImages);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  
  const colDef = [
    {
      // checkboxSelection: true,
      width: 20,
      field: 'selected',
      cellRenderer: 'rowSelectionRenderer',
      cellRendererParams: {
        onClick: (id: string, value: boolean): void => {
          discreteLayersStore.showLayer(id, value);
        }
      }
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
    onFirstDataRendered: (params: GridReadyEvent): void => {
      const selectionFieldName = 'selected';
      const columns = params.columnApi.getAllColumns();
      const selectionCol = find(columns, (column) => {
        const colDef = column.getColDef();
        return (colDef.checkboxSelection === true && colDef.field === selectionFieldName);
      });

      if(isObject(selectionCol)){
        params.api.forEachNode(node => {
          if((node.data as ILayerImage)[selectionFieldName] === true){
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            (params.api as any).updatingSelectionCustom = true;
            node.setSelected(true, false, true);
          }
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        setTimeout(()=>{(params.api as any).updatingSelectionCustom = false}, UPDATE_TIMEOUT);
      }
    },
    onRowSelected: (event: GridRowSelectedEvent): void => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if((event.api as any).updatingSelectionCustom !== true){
        discreteLayersStore.showLayer((event.data as ILayerImage).id, event.node.isSelected());
      }
    },
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
      rowData={layersImages}
      style={props.style}
    />
  );
});
