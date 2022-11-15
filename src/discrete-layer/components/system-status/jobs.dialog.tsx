/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useCallback, useState, useMemo, useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { observer } from 'mobx-react';
import { cloneDeep, isEmpty } from 'lodash';
import moment from 'moment';
import { DialogContent } from '@material-ui/core';
import { Button, CollapsibleList, Dialog, DialogTitle, IconButton, SimpleListItem } from '@map-colonies/react-core';
import { Box, DateTimeRangePicker, SupportedLocales } from '@map-colonies/react-components';
import CONFIG from '../../../common/config';
import { IActionGroup } from '../../../common/actions/entity.actions';
import { 
  GridComponent,
  GridComponentOptions,
  GridReadyEvent,
  GridApi
} from '../../../common/components/grid';
import { ActionsRenderer } from '../../../common/components/grid/cell-renderer/actions.cell-renderer';
import { JobProductTypeRenderer } from '../../../common/components/grid/cell-renderer/job-product-type.cell-renderer';
import { GraphQLError } from '../../../common/components/error/graphql.error-presentor';
import useCountDown, { IActions } from '../../../common/hooks/countdown.hook';
import EnumsMapContext, { DEFAULT_ENUM_DESCRIPTOR, IEnumsMapType } from '../../../common/contexts/enumsMap.context';
import { useQuery, useStore } from '../../models/RootStore';
import { IDispatchAction } from '../../models/actionDispatcherStore';
import { JobModelType, ProductType, RecordType } from '../../models';
import { JobDetailsRenderer } from './cell-renderer/job-details.cell-renderer';
import { StatusRenderer } from './cell-renderer/status.cell-renderer';
import { PriorityRenderer } from './cell-renderer/priority.cell-renderer';
import { DateCellRenderer } from './cell-renderer/date.cell-renderer';
import { JobDetailsStatusFilter } from './cell-renderer/job-details.status.filter';
import { JOB_ENTITY } from './job.types';


import './jobs.dialog.css';

const pagination = true;
const pageSize = 10;
const START_CYCLE_ITTERACTION = 0;
const POLLING_CYCLE_INTERVAL = CONFIG.JOB_STATUS.POLLING_CYCLE_INTERVAL;
const CONTDOWN_REFRESH_RATE = 1000; // interval to change remaining time amount, defaults to 1000
const MILISECONDS_IN_SEC = 1000;

interface JobsDialogProps {
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
}

export const JobsDialog: React.FC<JobsDialogProps> = observer((props: JobsDialogProps) => {
  const intl = useIntl();
  const { isOpen, onSetOpen } = props;
  const [updateTaskPayload, setUpdateTaskPayload] = useState<Record<string,unknown>>({}); 
  const [gridRowDataRaster, setGridRowDataRaster] = useState<JobModelType[]>([]); 
  const [gridRowData3D, setGridRowData3D] = useState<JobModelType[]>([]); 
  const [gridApi, setGridApi] = useState<GridApi>();
  const [pollingCycle, setPollingCycle] = useState(START_CYCLE_ITTERACTION);
  const [fromDate, setFromDate] = useState<Date>(moment().subtract(CONFIG.JOB_MANAGER_END_OF_TIME, 'days').toDate());
  const [tillDate, setTillDate] = useState<Date>(new Date());
  const { enumsMap } = useContext(EnumsMapContext);

  // const [retryErr, setRetryErr] = useState(false);

  // @ts-ignore
  const [timeLeft, actions] = useCountDown(POLLING_CYCLE_INTERVAL, CONTDOWN_REFRESH_RATE);

  const getPriorityOptions = useMemo(() => {
    const priorityList = CONFIG.SYSTEM_JOBS_PRIORITY_OPTIONS;

    return priorityList.map((option) => {
      const optionCpy = {...option};
      optionCpy.label = intl.formatMessage({
        id: option.label,
      });
      return optionCpy
    });
  }, [intl]);

  // start the timer during the first render
  useEffect(() => {
    (actions as IActions).start();
  }, []);

  // eslint-disable-next-line
  const { setQuery, loading, error, data, query } = useQuery((store) =>
    store.queryJobs({
      params: {
        fromDate,
        tillDate
      }
    }),
    {
      fetchPolicy: 'no-cache'
    }
  );

  const mutationQuery = useQuery();

  const store = useStore();

  const getJobActions = useMemo(() => {
    let actions: IActionGroup[] = store.actionDispatcherStore.getEntityActionGroups(
      JOB_ENTITY
    );

    actions = actions.map((action) => {
      const groupsWithTranslation = action.group.map((action) => {
        return {
          ...action,
          titleTranslationId: intl.formatMessage({
            id: action.titleTranslationId,
          }),
        };
      });

      return {...action, group: groupsWithTranslation}
    });

    return {
      [JOB_ENTITY]: actions,
    };
  }, []);

  useEffect(() => {
    setQuery(
      (store) =>
        store.queryJobs({
          params: {
            fromDate,
            tillDate,
          },
        })
    );
  }, [fromDate, tillDate, setQuery]);

  const getFilterJobsPredicate = (requestedDomain: RecordType): ((cur: JobModelType) => boolean) => {
    return (cur: JobModelType): boolean => {
      const jobDomain = enumsMap?.[cur.productType as string]?.parentDomain;
      
      return jobDomain === requestedDomain;
    }
  }

  useEffect(() => {
    const combinedJobsData = data ? cloneDeep(data.jobs) : [];
    const jobsRaster = combinedJobsData.filter(getFilterJobsPredicate(RecordType.RECORD_RASTER));
    const jobs3D = combinedJobsData.filter(getFilterJobsPredicate(RecordType.RECORD_3D));
    
    setGridRowDataRaster(jobsRaster);
    setGridRowData3D(jobs3D);
  }, [data]);

  useEffect(() => {
    if (mutationQuery.data) {
      setUpdateTaskPayload({});
      void query?.refetch();
    }
  }, [mutationQuery.data, query]);

  useEffect(() => {
    if (updateTaskPayload.id !== undefined) {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      mutationQuery.setQuery(store.mutateUpdateJob(updateTaskPayload,() => {}));
    }
  }, [updateTaskPayload, store]);

  useEffect(() => {
    if (!isEmpty(mutationQuery.error)) {
      gridApi?.refreshCells({
        suppressFlash: true,
        force: true
      });
    }
  }, [mutationQuery.error]);

  useEffect(() => {
    const pollingInterval = setInterval(() => {
      setPollingCycle(pollingCycle + 1);
      (actions as IActions).start(POLLING_CYCLE_INTERVAL);
      void query?.refetch();
    }, POLLING_CYCLE_INTERVAL);

    return (): void => {
      clearInterval(pollingInterval);
    };
  }, [query, pollingCycle]);

  const closeDialog = useCallback(() => {
    onSetOpen(false);
  }, [onSetOpen]);

  const dispatchAction = (action: Record<string,unknown> | undefined): void => {
    const actionToDispatch = (action ? {action: action.action, data: action.data} : action) as IDispatchAction;
    store.actionDispatcherStore.dispatchAction(
      actionToDispatch
    );
  };

   // Job actions handler

   useEffect(() => {
     if (typeof store.actionDispatcherStore.action !== 'undefined') {
      const { action, data } = store.actionDispatcherStore.action as IDispatchAction;
      switch (action) {
        case 'Job.retry':
          mutationQuery.setQuery(
            store.mutateJobRetry({
              id: data.id as string,
            })
          );
          break;
        case 'Job.abort':
          mutationQuery.setQuery(
            store.mutateJobAbort({
              domain: enumsMap?.[data.productType as string]?.parentDomain as string,
              id: data.id as string,
            })
          );
          break;
        default:
          break;
       }
     }
   }, [store.actionDispatcherStore.action]);


  // Reset action value on store when unmounting

  useEffect(() => {
    return (): void => {
      dispatchAction(undefined)
    };
  }, []);

  const colDef = [
    {
      headerName: '',
      width: 40,
      field: 'productType',
      cellRenderer: 'productTypeRenderer',
      cellRendererParams: {
        style: {
          height: '40px',
          width: '40px',
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
        onChange: (evt: React.FormEvent<HTMLInputElement>, jobData: JobModelType): void => {
          const { id }  = jobData;
          const chosenPriority: string | number = evt.currentTarget.value;

          setUpdateTaskPayload({
            id: id,
            data: {
              priority: parseInt(chosenPriority)
            }
          });
        }
      },
    },
    {
      headerName: intl.formatMessage({
        id: 'system-status.job.fields.created.label',
      }),
      width: 172,
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
      width: 172,
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
    }
  ];

  const onGridReady = (params: GridReadyEvent): void => {
    setGridApi(params.api);
    const sortModel = [
      {colId: 'updated', sort: 'desc'}
    ];
    params.api.setSortModel(sortModel);
    params.api.sizeColumnsToFit();
  };

  const gridOptions: GridComponentOptions = useMemo(()=>({
    enableRtl: CONFIG.I18N.DEFAULT_LANGUAGE.toUpperCase() === 'HE',
    suppressRowTransform: true,
    pagination: pagination,
    paginationPageSize: pageSize,
    columnDefs: colDef,
    getRowNodeId: (data: JobModelType): string => {
      return data.id;
    },
    detailsRowCellRenderer: 'detailsRenderer',
    detailsRowHeight: 230,
    detailsRowExapnderPosition: 'start',
    overlayNoRowsTemplate: intl.formatMessage({
      id: 'results.nodata',
    }),
    frameworkComponents: {
      jobDetailsStatusFilter: JobDetailsStatusFilter,
      detailsRenderer: JobDetailsRenderer,
      statusRenderer: StatusRenderer,
      actionsRenderer: ActionsRenderer,
      priorityRenderer: PriorityRenderer,
      productTypeRenderer: JobProductTypeRenderer,
      dateCellRenderer: DateCellRenderer,
    },
    tooltipShowDelay: 0,
    tooltipMouseTrack: false,
    rowSelection: 'single',
    suppressCellSelection: true,
    singleClickEdit: true,
    onGridReady: onGridReady,
    immutableData: true, //bounded to state/store managed there otherwise getting "unstable_flushDiscreteUpdates in AgGridReact"
    // suppressRowClickSelection: true,
    suppressMenuHide: true, // Used to show filter icon at all times (not only when hovering the header).
    unSortIcon: true, // Used to show un-sorted icon.
  
  }), []);

  return (
    <Box id="jobsDialog">
      <Dialog open={isOpen} preventOutsideDismiss={true}>
        <DialogTitle>
          <FormattedMessage id="system-status.title" />
          <Box
            className="refreshContainer"
            onClick={(): void => {
              (actions as IActions).start(POLLING_CYCLE_INTERVAL);
              void query?.refetch();
            }}
          >
            <IconButton className="refreshIcon mc-icon-Refresh" />
            <Box className="refreshSecs">
              {`${(timeLeft as number) / MILISECONDS_IN_SEC}`}
            </Box>
          </Box>

          <IconButton
            className="closeIcon mc-icon-Close"
            onClick={(): void => {
              closeDialog();
            }}
          />
        </DialogTitle>
        <DialogContent className="jobsBody">
          <Box className="jobsTimeRangePicker">
            <DateTimeRangePicker
              controlsLayout="row"
              onChange={(dateRange): void => {
                if (
                  typeof dateRange.from !== 'undefined' &&
                  typeof dateRange.to !== 'undefined'
                ) {
                  setFromDate(dateRange.from);
                  setTillDate(dateRange.to);
                }
              }}
              from={fromDate}
              to={tillDate}
              local={{
                setText: intl.formatMessage({
                  id: 'filters.date-picker.set-btn.text',
                }),
                startPlaceHolderText: intl.formatMessage({
                  id: 'filters.date-picker.start-time.label',
                }),
                endPlaceHolderText: intl.formatMessage({
                  id: 'filters.date-picker.end-time.label',
                }),
                calendarLocale:
                  SupportedLocales[
                    CONFIG.I18N.DEFAULT_LANGUAGE.toUpperCase() as keyof typeof SupportedLocales
                  ],
              }}
            />
          </Box>
          <Box className="gridsContainer">
            <CollapsibleList
              handle={<SimpleListItem text={RecordType.RECORD_RASTER} metaIcon="chevron_right" />}
            >
              <GridComponent
                gridOptions={gridOptions}
                rowData={gridRowDataRaster}
                style={{
                  height: '100%',
                  padding: '12px',
                }}
              />
            </CollapsibleList>

            <CollapsibleList
              handle={<SimpleListItem text={RecordType.RECORD_3D} metaIcon="chevron_right" />}
            >
              <GridComponent
                gridOptions={gridOptions}
                rowData={gridRowData3D}
                style={{
                  height: '100%',
                  padding: '12px',
                }}
              />
            </CollapsibleList>
          </Box>

          <Box className="buttons">
            {
              mutationQuery.error !== undefined && (
                // eslint-disable-next-line
                <GraphQLError error={mutationQuery.error} />
              )
            }
            <Button
              raised
              type="button"
              onClick={(): void => {
                closeDialog();
              }}
            >
              <FormattedMessage id="system-status.close-btn.text" />
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
});
