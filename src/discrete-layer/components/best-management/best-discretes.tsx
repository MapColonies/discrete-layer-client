import { observer } from 'mobx-react';
import React, { forwardRef, useImperativeHandle, useState, useMemo } from 'react';
import { useIntl } from 'react-intl';
// import { ChangeDetectionStrategyType } from 'ag-grid-react/lib/changeDetectionService';
import CONFIG from '../../../common/config';
import { 
  GridComponent,
  GridComponentOptions,
  GridCellMouseOverEvent,
  GridCellMouseOutEvent,
  GridRowDragEnterEvent,
  GridRowDragEndEvent,
  GridRowNode,
  GridRowSelectedEvent,
  GridReadyEvent,
  GridApi
} from '../../../common/components/grid';
import { FootprintRenderer } from '../../../common/components/grid/cell-renderer/footprint.cell-renderer';
import { LayerImageRenderer } from '../../../common/components/grid/cell-renderer/layer-image.cell-renderer';
import CustomTooltip from '../../../common/components/grid/tooltip-renderer/name.tooltip-renderer';
import { IconRenderer } from '../../../common/components/grid/cell-renderer/icon.cell-renderer';
import { ActionsRenderer } from '../../../common/components/grid/cell-renderer/actions.cell-renderer';
import { IActionGroup } from '../../../common/actions/entity.actions';
import { LayerRasterRecordModelType } from '../../models';
import { useStore } from '../../models/RootStore';
import { DiscreteOrder } from '../../models/DiscreteOrder';
import { IDispatchAction } from '../../models/actionDispatcherStore';
import { TabViews } from '../../views/tab-views';

const IS_PAGINATION = false;

interface BestDiscretesComponentProps {
  style?: {[key: string]: string};
  discretes?: LayerRasterRecordModelType[] | undefined;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const BestDiscretesComponent = observer(forwardRef((props: BestDiscretesComponentProps, ref) => {
  const intl = useIntl();
  const store = useStore();
  const [gridApi, setGridApi] = useState<GridApi>();
  
  const sortedDiscretes = useMemo(() => {
    return [...(props.discretes ?? [])].sort(
      // @ts-ignore
      (layer1, layer2) => layer2.order - layer1.order
    );
  }, [props.discretes]);
  
  let start: number;
  let numberOfRows: number | undefined;
  let currentOrder: DiscreteOrder[];

  useImperativeHandle(ref, () => ({
    getOrderedDiscretes: (): DiscreteOrder[] => {
      currentOrder = [];
      numberOfRows = gridApi?.getDisplayedRowCount();
      gridApi?.forEachNode(updateOrder);
      return currentOrder;
    }
  }));

  const updateOrder = (node: GridRowNode, index: number): void => {
    currentOrder.push(
      {
        id: node.id,
        zOrder: numberOfRows !== undefined ? numberOfRows - 1 - node.rowIndex : index
      } as DiscreteOrder
    );
  };

  const entityPermittedActions = useMemo(() => {
    const entityActions: Record<string, unknown> = {};
    ['LayerRasterRecord', 'Layer3DRecord', 'BestRecord'].forEach( entityName => {
       const allGroupsActions = store.actionDispatcherStore.getEntityActionGroups(entityName);
       const permittedGroupsActions = allGroupsActions.map((actionGroup) => {
        return {
          titleTranslationId: actionGroup.titleTranslationId,
          group: 
            actionGroup.group.filter(action => {
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              return store.userStore.isActionAllowed(`entity_action.${entityName}.${action.action}`) === false ? false : true &&
                    action.views.includes(TabViews.CREATE_BEST);
            })
            .map((action) => {
              return {
                ...action,
                titleTranslationId: intl.formatMessage({ id: action.titleTranslationId }),
              };
            }),
        }
       });
       entityActions[entityName] = permittedGroupsActions;
    })
    return entityActions;
  }, []);

  const dispatchAction = (action: Record<string,unknown>): void => {
    store.actionDispatcherStore.dispatchAction(
      {
        action: action.action,
        data: action.data,
      } as IDispatchAction
    );
  };

  const colDef = [
    {
      width: 10,
      field: 'productName',
      suppressMovable: true,
      rowDrag: true
    },
    {
      headerName: '',
      width: 20,
      field: 'order',
      suppressMovable: true
    },
    {
      headerName: '',
      width: 20,
      field: 'footprintShown',
      cellRenderer: 'rowFootprintRenderer',
      cellRendererParams: {
        onClick: (id: string, value: boolean, node: GridRowNode): void => {
          store.discreteLayersStore.showFootprint(id, value);
          store.bestStore.showFootprint(id, value);
        }
      }
    },
    {
      width: 20,
      field: 'layerImageShown',
      cellRenderer: 'rowLayerImageRenderer',
      cellRendererParams: {
        onClick: (id: string, value: boolean, node: GridRowNode): void => {
          store.bestStore.showLayer(id, value);
        }
      }
    },
    {
      headerName: intl.formatMessage({
        id: 'results.fields.name.label',
      }),
      width: 140,
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
      width: 105,
      field: 'resolution',
      suppressMovable: true
    },
    {
      headerName: '',
      width: 20,
      field: 'isNewlyAddedToBest',
      cellRenderer: 'iconRenderer',
      suppressMovable: true
    },
    {
      headerName: '',
      width: 60,
      cellRenderer: 'actionsRenderer',
      cellRendererParams: {
        // entity: (params.data as BestRecordModelType).__typename,
        // actions: {entityPermittedActions[params.data.__typename] as IActionGroup[]}
        actionHandler: dispatchAction
      }
    }
  ];
  const gridOptions: GridComponentOptions = {
    // rowDataChangeDetectionStrategy: ChangeDetectionStrategyType.IdentityCheck,
    immutableData: true,
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
      headerFootprintRenderer: HeaderFootprintRenderer,
      rowFootprintRenderer: FootprintRenderer,
      rowLayerImageRenderer: LayerImageRenderer,
      customTooltip: CustomTooltip,
      iconRenderer: IconRenderer,
      customTooltip: CustomTooltip,
      actionsRenderer: ActionsRenderer,
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
    onRowDragEnter(event: GridRowDragEnterEvent) {
      start = event.overIndex;
    },
    onRowDragEnd(event: GridRowDragEndEvent) {
      store.bestStore.updateMovedLayer({ id: (event.node.data as LayerRasterRecordModelType).id, from: start, to: event.overIndex });
    },
    onGridReady(params: GridReadyEvent) {
      setGridApi(params.api);
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
        rowData={sortedDiscretes}
        style={props.style}/>
    </>
  );
}));
