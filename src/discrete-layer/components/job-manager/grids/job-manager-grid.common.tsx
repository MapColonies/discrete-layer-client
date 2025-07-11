import { ColDef, ColGroupDef } from 'ag-grid-community';
import React, { useContext, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import CONFIG from '../../../../common/config';
import {
  GridComponent,
  GridComponentOptions,
  GridReadyEvent,
} from '../../../../common/components/grid';
import EnumsMapContext from '../../../../common/contexts/enumsMap.context';
import { IActionGroup } from '../../../../common/actions/entity.actions';
import { ActionsRenderer } from '../../../../common/components/grid/cell-renderer/actions.cell-renderer';
import { JobProductTypeRenderer } from '../../../../common/components/grid/cell-renderer/job-product-type.cell-renderer';
import { Loading } from '../../../../common/components/tree/statuses/loading';
import { JobModelType, ProductType } from '../../../models';
import { getProductDomain } from '../../layer-details/utils';
import { DateCellRenderer } from '../../system-status/cell-renderer/date.cell-renderer';
import { JobDetailsRenderer } from '../../system-status/cell-renderer/job-details.cell-renderer';
import { JobDetailsStatusFilter } from '../../system-status/cell-renderer/job-details.status.filter';
import { PriorityRenderer } from '../../system-status/cell-renderer/priority.cell-renderer';
import PlaceholderCellRenderer from '../../system-status/cell-renderer/placeholder.cell-renderer';
import { StatusRenderer } from '../../system-status/cell-renderer/status.cell-renderer';
import { TooltippedCellRenderer } from '../../system-status/cell-renderer/tool-tipped.cell-renderer';
import { JOB_ENTITY } from '../job.types';

export interface ICommonJobManagerGridProps {
  rowData: unknown[];
  dispatchAction: (action: Record<string, unknown> | undefined) => void;
  getJobActions: { [JOB_ENTITY]: IActionGroup[] };
  updateJobCB: (updateParam: Record<string, unknown>) => void;
  rowDataChangeCB?: () => void;
  gridOptionsOverride?: Partial<GridComponentOptions>;
  gridStyleOverride?: React.CSSProperties;
  onGridReadyCB?: (params: GridReadyEvent) => void;
  customColDef?: (ColDef | ColGroupDef)[];
  omitColDefsByRenderer?: { renderers: string[], preserveColWidth?: boolean };
  areJobsLoading?: boolean;
}

const pagination = true;
const pageSize = 10;

const JobManagerGrid: React.FC<ICommonJobManagerGridProps> = (props) => {
  const {
    rowData,
    dispatchAction,
    getJobActions,
    updateJobCB,
    customColDef,
    gridOptionsOverride = {},
    gridStyleOverride = {},
    onGridReadyCB = (params): void => { return },
    rowDataChangeCB = (): void => {
      return;
    },
    omitColDefsByRenderer,
    areJobsLoading
  } = props;

  const intl = useIntl();
  const { enumsMap } = useContext(EnumsMapContext);

  const onGridReady = (params: GridReadyEvent): void => {
    onGridReadyCB(params);

    const sortModel = [
      {colId: 'updated', sort: 'desc'}
    ];
    params.api.setSortModel(sortModel);
    params.api.sizeColumnsToFit();
  };

  useEffect(() => {
    rowDataChangeCB();
  }, [rowData]);

  const getPriorityOptions = useMemo(() => {
    const priorityList = CONFIG.SYSTEM_JOBS_PRIORITY_OPTIONS;

    return priorityList.map((option) => {
      const optionCpy = { ...option };
      optionCpy.label = intl.formatMessage({
        id: option.label,
      });
      return optionCpy;
    });
  }, [intl]);

  const defaultColDef = useMemo(
    () => [
      {
        headerName: '',
        width: 48,
        field: 'productType',
        cellRenderer: 'productTypeRenderer',
        cellRendererParams: {
          style: {
            height: '48px',
            width: '48px',
            display: 'flex',
            alignItems: 'center',
          },
        },
      },
      {
        headerName: intl.formatMessage({
          id: 'system-status.job.fields.resource-id.label',
        }),
        width: 120,
        field: 'productName',
        cellRenderer: 'tooltippedCellRenderer',
        cellRendererParams: {
          tag: 'p',
        },
        filter: true,
      },
      {
        headerName: intl.formatMessage({
          id: 'system-status.job.fields.version.label',
        }),
        width: 80,
        field: 'version',
      },
      {
        headerName: intl.formatMessage({
          id: 'system-status.job.fields.type.label',
        }),
        width: 120,
        field: 'type',
        filter: true,
        sortable: true,
      },
      {
        headerName: intl.formatMessage({
          id: 'system-status.job.fields.priority.label',
        }),
        width: 150,
        // Binding status field to priority col, in order to keep it updated when status is changed.
        field: 'status',
        cellRenderer: 'priorityRenderer',
        cellRendererParams: {
          optionsData: getPriorityOptions,
          onChange: (
            evt: React.FormEvent<HTMLInputElement>,
            jobData: JobModelType
          ): void => {
            const { id, productType } = jobData;
            const chosenPriority: string | number = evt.currentTarget.value;
            const updateTaskDomain = getProductDomain(
              productType as ProductType,
              enumsMap ?? undefined
            );

            updateJobCB({
              id: id,
              domain: updateTaskDomain,
              data: {
                priority: parseInt(chosenPriority),
              },
            });
          },
          readOnly: (jobData: JobModelType): boolean => {
            return jobData.domain !== 'RASTER';
          } 
        },
      },
      {
        headerName: intl.formatMessage({
          id: 'system-status.job.fields.created.label',
        }),
        width: 140,
        field: 'created',
        cellRenderer: 'dateCellRenderer',
        cellRendererParams: {
          field: 'created',
        },
        sortable: true,
        // @ts-ignore
        comparator: (valueA, valueB, nodeA, nodeB, isInverted): number =>
          valueA - valueB,
      },
      {
        headerName: intl.formatMessage({
          id: 'system-status.job.fields.updated.label',
        }),
        width: 140,
        field: 'updated',
        sortable: true,
        cellRenderer: 'dateCellRenderer',
        cellRendererParams: {
          field: 'updated',
        },
        // @ts-ignore
        comparator: (valueA, valueB, nodeA, nodeB, isInverted): number =>
          valueA - valueB,
      },
      // {
      //   headerName: intl.formatMessage({
      //     id: 'system-status.job.fields.expirationDate.label',
      //   }),
      //   width: 160,
      //   field: 'expirationDate',
      //   sortable: true,
      //   cellRenderer: 'dateCellRenderer',
      //   cellRendererParams: {
      //     field: 'expirationDate',
      //     comingSoonDaysIndication: 10,
      //     shouldShowPredicate: (data: JobModelType): boolean => {
      //       return (data.type as string).toLowerCase().includes('export');
      //     },
      //     onChange: (
      //       updatedExpirationDate: Date,
      //       jobData: JobModelType
      //     ): void => {
      //       const { id, productType } = jobData;
      //       const updateTaskDomain = getProductDomain(
      //         productType as ProductType,
      //         enumsMap ?? undefined
      //       );

      //       updateJobCB({
      //         id,
      //         domain: updateTaskDomain,
      //         data: {
      //           parameters: {
      //             cleanupData: {
      //               cleanupExpirationTime: updatedExpirationDate
      //             }
      //           },
      //         },
      //       });
      //     },
      //     datePickerProps: {
      //       disablePast: true,
      //       disableFuture: false,
      //       minDate: moment().add(1,'day').toDate(),
      //     }
      //   },
      //   // @ts-ignore
      //   comparator: (valueA, valueB, nodeA, nodeB, isInverted): number =>
      //     valueA - valueB,
      // },
      {
        headerName: intl.formatMessage({
          id: 'system-status.job.fields.status.label',
        }),
        width: 160,
        field: 'status',
        cellRenderer: 'statusRenderer',
        filter: 'jobDetailsStatusFilter',
      },
      {
        pinned: 'right',
        headerName: '',
        width: 0,
        cellRenderer: 'actionsRenderer',
        cellRendererParams: {
          actions: getJobActions,
          actionHandler: dispatchAction,
        },
      },
    ],
    []
  );

  const getColDef = (gridOptions: GridComponentOptions): ColDef[] => {
    const firstColumnPadding = 120;
    let colDef: ColDef[];

    if (typeof omitColDefsByRenderer !== 'undefined') {
      const renderersList = omitColDefsByRenderer.renderers;

      if (!(omitColDefsByRenderer.preserveColWidth ?? false)) {
        colDef = defaultColDef.filter(colDef => !renderersList.includes(colDef.cellRenderer as string)); 
      } else {
        colDef = defaultColDef.map(colDef => {
          if (renderersList.includes(colDef.cellRenderer as string)) {
            return ({
              ...colDef,
              cellRenderer: 'placeholderRenderer',
              headerName: '',
              pinned: undefined,
            })
          }
          return colDef;
        });
      }
    } else {
      colDef = defaultColDef;
    }

    if (typeof gridOptions.detailsRowCellRenderer === 'undefined') {
      colDef[0].width = firstColumnPadding;
    }

    return colDef;
  };

  const baseGridOption: GridComponentOptions = {
      enableRtl: CONFIG.I18N.DEFAULT_LANGUAGE.toUpperCase() === 'HE',
      suppressRowTransform: true,
      pagination: pagination,
      paginationPageSize: pageSize,
      getRowNodeId: (data: JobModelType): string => {
        return data.id;
      },
      detailsRowCellRenderer: 'detailsRenderer',
      detailsRowHeight: 230,
      detailsRowExpanderPosition: 'start',
      overlayNoRowsTemplate: intl.formatMessage({
        id: 'results.nodata',
      }),
      loadingOverlayComponent: 'customLoadingOverlay',
      frameworkComponents: {
        jobDetailsStatusFilter: JobDetailsStatusFilter,
        detailsRenderer: JobDetailsRenderer,
        statusRenderer: StatusRenderer,
        actionsRenderer: ActionsRenderer,
        priorityRenderer: PriorityRenderer,
        productTypeRenderer: JobProductTypeRenderer,
        dateCellRenderer: DateCellRenderer,
        tooltippedCellRenderer: TooltippedCellRenderer,
        placeholderRenderer: PlaceholderCellRenderer,
        customLoadingOverlay: Loading
      },
      tooltipShowDelay: 0,
      tooltipMouseTrack: false,
      rowSelection: 'single',
      suppressCellSelection: true,
      singleClickEdit: true,
      immutableData: true, //bounded to state/store managed there otherwise getting "unstable_flushDiscreteUpdates in AgGridReact"
      // suppressRowClickSelection: true,
      suppressMenuHide: true, // Used to show filter icon at all times (not only when hovering the header).
      unSortIcon: true, // Used to show un-sorted icon.
      onGridReady,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      detailsRowCellRendererPresencePredicate: (rowData: any) => {
        const jobData = rowData as JobModelType;
        return jobData.domain === 'RASTER';
      }
    };

  const gridOptions = useMemo(() => {
    const combinedOptions = { ...baseGridOption, ...gridOptionsOverride };
    const colDefs = customColDef ?? getColDef(combinedOptions);
    return ({ ...combinedOptions, columnDefs: colDefs })
  }, []);


  const defaultGridStyle: React.CSSProperties = {
    height: '100%',
    padding: '12px',
  };

  return (
    <GridComponent
      gridOptions={gridOptions}
      rowData={rowData}
      style={{ ...defaultGridStyle, ...gridStyleOverride }}
      isLoading={areJobsLoading}
    />
  );
};

export default JobManagerGrid;
