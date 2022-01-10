import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { observer } from 'mobx-react';
import { cloneDeep } from 'lodash';
import { DialogContent } from '@material-ui/core';
import { Button, Dialog, DialogTitle, IconButton } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import CONFIG from '../../../common/config';
import { 
  GridComponent,
  GridComponentOptions,
  GridReadyEvent,
  GridApi
} from '../../../common/components/grid';
import { GraphQLError } from '../../../common/components/error/graphql.error-presentor';
import useCountDown, { IActions } from '../../../common/hooks/countdown.hook';
import { useQuery, useStore } from '../../models/RootStore';
import { JobModelType } from '../../models';
import { JobDetailsRenderer } from './cell-renderer/job-details.cell-renderer';
import { StatusRenderer } from './cell-renderer/status.cell-renderer';
import { PriorityRenderer } from './cell-renderer/priority.cell-renderer';


import './jobs-dialog.css';
import { ActionsRenderer } from '../../../common/components/grid/cell-renderer/actions.cell-renderer';
import { ProductTypeRenderer } from '../../../common/components/grid/cell-renderer/product-type.cell-renderer';
import { DateCellRenderer } from './cell-renderer/date.cell-renderer';
import { JobDetailsStatusFilter } from './cell-renderer/job-details.status.filter';
import { IDispatchAction } from '../../models/actionDispatcherStore';
import { IActionGroup } from '../../../common/actions/entity.actions';

const pagination = true;
const pageSize = 10;
const START_CYCLE_ITTERACTION = 0;
const POLLING_CYCLE_INTERVAL = CONFIG.JOB_STATUS.POLLING_CYCLE_INTERVAL;
const CONTDOWN_REFRESH_RATE = 1000; // interval to change remaining time amount, defaults to 1000
const MILISECONDS_IN_SEC = 1000;
const JOB_ENTITY = 'Job';

interface SystemJobsComponentProps {
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
}

export const SystemJobsComponent: React.FC<SystemJobsComponentProps> = observer((props: SystemJobsComponentProps) => {
  const intl = useIntl();
  const { isOpen, onSetOpen } = props;
  const [updateTaskPayload, setUpdateTaskPayload] = useState<Record<string,any>>({}); 
  const [gridRowData, setGridRowData] = useState<JobModelType[]>([]); 
  const [gridApi, setGridApi] = useState<GridApi>();
  const [pollingCycle, setPollingCycle] = useState(START_CYCLE_ITTERACTION);
  const [retryErr, setRetryErr] = useState(false);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line
  const { loading, error, data, query } = useQuery((store) =>
    store.queryJobs({
      params: {}
    }),
    {
      fetchPolicy: 'no-cache'
    }
  );
  const mutationQuery = useQuery();

  const store = useStore();


  const getJobActions = useMemo(() => {
    const actions: IActionGroup[] = store.actionDispatcherStore.getEntityActionGroups(
      JOB_ENTITY
    );

    actions[0].group = actions[0].group.map((action) => {
      return {
        ...action,
        titleTranslationId: intl.formatMessage({
          id: action.titleTranslationId,
        }),
      };
    });

    return {
      [JOB_ENTITY]: actions,
    };
  }, []);



 

  useEffect(() => {
    setGridRowData(data ? cloneDeep(data.jobs) : []);
  }, [data]);

  useEffect(() => {
    if(mutationQuery.data){
      setUpdateTaskPayload({});
      void query?.refetch();
    }
  }, [mutationQuery.data, query]);

  useEffect(() => {
    if(updateTaskPayload.id !== undefined){
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      mutationQuery.setQuery(store.mutateUpdateJob(updateTaskPayload,()=>{}));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateTaskPayload, store]);

  useEffect(() => {
    if(mutationQuery.error){
      gridApi?.refreshCells({
        suppressFlash: true,
        force: true
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[mutationQuery.error]);

  useEffect(() => {
    const pollingInterval = setInterval(() => {
      setPollingCycle(pollingCycle + 1);
      (actions as IActions).start(POLLING_CYCLE_INTERVAL);
      void query?.refetch();
    }, POLLING_CYCLE_INTERVAL);

    return (): void => {
      clearInterval(pollingInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, pollingCycle]);

  const closeDialog = useCallback(
    () => {
      onSetOpen(false);
    },
    [onSetOpen]
  );

  const dispatchAction = (action: Record<string,unknown> | undefined): void => {

    const actionToDispatch = (action ? {action: action.action, data: action.data} : action) as IDispatchAction
      store.actionDispatcherStore.dispatchAction(
        actionToDispatch
      );

  };

   // Job actions handler

   useEffect(() => {
     if (typeof store.actionDispatcherStore.action !== 'undefined') {
       const { action, data } = store.actionDispatcherStore
         .action as IDispatchAction;

       switch (action) {
         case 'Job.retry':
           mutationQuery.setQuery(
             store.mutateJobRetry({
               id: data.id as string,
             })
           );
           break;

         default:
           break;
       }
     }
   }, [store.actionDispatcherStore.action]);


  // Reset action value on store when unmounting.

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
      field: 'priority',
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
    },
  ];

  const onGridReady = (params: GridReadyEvent) => {
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
      return data.id as string;
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
      productTypeRenderer: ProductTypeRenderer,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }),[]);

  return (
    <Box id="jobsDialog">
      <Dialog open={isOpen} preventOutsideDismiss={true}>
        <DialogTitle>
          <FormattedMessage id="system-status.title"/>
          <Box 
            className="refreshContainer"
            onClick={(): void => {
              (actions as IActions).start(POLLING_CYCLE_INTERVAL);
              void query?.refetch();
            }}
          >
            <IconButton className="refreshIcon mc-icon-Refresh"/>
            <Box className="refreshSecs">
              {`${(timeLeft as number)/MILISECONDS_IN_SEC}`}
            </Box>
          </Box>
          <IconButton
            className="closeIcon mc-icon-Close"
            onClick={ (): void => { closeDialog(); } }
          />
        </DialogTitle>
        <DialogContent className="jobsBody">
          <GridComponent
            gridOptions={gridOptions}
            rowData={gridRowData}
            style={{
              height: 'calc(100% - 64px)',
              // width: 'calc(100% - 100px)',
              padding: '12px'
            }}
          />
          <Box className="buttons">
            {
              // eslint-disable-next-line
              mutationQuery.error !== undefined && <GraphQLError error={mutationQuery.error}/>
            }
            <Button raised type="button" onClick={(): void => { closeDialog(); }}>
              <FormattedMessage id="system-status.close-btn.text"/>
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
});
