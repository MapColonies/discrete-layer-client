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
  GridValueFormatterParams,
  GridReadyEvent,
  GridApi
} from '../../../common/components/grid';
import { GpaphQLError } from '../../../common/components/graphql/graphql.error-presentor';
import useCountDown, { IActions } from '../../../common/hooks/countdown.hook';
import { useQuery, useStore } from "../../models/RootStore";
import { JobModelType } from '../../models';
import { dateFormatter } from '../layers-results/type-formatters/type-formatters';
import { JobDetailsRenderer } from './cell-renderer/job-details.cell-renderer';
import { StatusRenderer } from './cell-renderer/status.cell-renderer';
import { ActionsRenderer } from './cell-renderer/actions.cell-renderer';
import { PriorityRenderer } from './cell-renderer/priority.cell-renderer';

import './jobs-dialog.css';

const pagination = true;
const pageSize = 10;
const START_CYCLE_ITTERACTION = 0;
const POLLING_CYCLE_INTERVAL = CONFIG.JOB_STATUS.POLLING_CYCLE_INTERVAL;
const CONTDOWN_REFRESH_RATE = 1000; // interval to change remaining time amount, defaults to 1000
const MILISECONDS_IN_SEC = 1000;

interface SystemJobsComponentProps {
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
}

export interface IUpdating {
  updating: boolean;
  newValue: string | number;
}

export const SystemJobsComponent: React.FC<SystemJobsComponentProps> = observer((props: SystemJobsComponentProps) => {
  const intl = useIntl();
  const { isOpen, onSetOpen } = props;
  const [updateTaskPayload, setUpdateTaskPayload] = useState<Record<string,any>>({}); 
  const [gridRowData, setGridRowData] = useState<JobModelType[]>([]); 
  const [updatingPriority, setUpdatingPriority] = useState<IUpdating>();
  const [gridApi, setGridApi] = useState<GridApi>();
  const [pollingCycle, setPollingCycle] = useState(START_CYCLE_ITTERACTION);

  // @ts-ignore
  const [timeLeft, actions] = useCountDown(POLLING_CYCLE_INTERVAL, CONTDOWN_REFRESH_RATE);
  
  // start the timer during the first render
  useEffect(() => {
    (actions as IActions).start();
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

  useEffect(() => {
    setGridRowData(data ? cloneDeep(data.jobs) : []);
    setUpdatingPriority(undefined);
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
  }, [updateTaskPayload, store]);

  useEffect(() => {
    if(mutationQuery.error){
      setUpdatingPriority(undefined);
      gridApi?.refreshCells({
        suppressFlash: true,
        force: true
      });
    }
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
  }, [query, pollingCycle]);

  const closeDialog = useCallback(
    () => {
      onSetOpen(false);
    },
    [onSetOpen]
  );

  const getUpdating = function (): IUpdating | undefined {
    let ret = undefined;
    setUpdatingPriority((prev) => {
      ret = prev;
      return prev;
    });
    return ret;
  };

  const colDef = [
    {
      headerName: intl.formatMessage({
        id: 'system-status.job.fields.resource-id.label',
      }),
      width: 120,
      field: 'resourceId',
    },
    {
      headerName: intl.formatMessage({
        id: 'system-status.job.fields.version.label',
      }),
      width: 80,
      field: 'version',
    },
    {
      headerName:  intl.formatMessage({
        id: 'system-status.job.fields.type.label',
      }),
      width: 120,
      field: 'type',
      filter: true,
      sortable: true,
    },
    {
      headerName:  intl.formatMessage({
        id: 'system-status.job.fields.status.label',
      }),
      width: 160,
      field: 'status',
      cellRenderer: 'statusRenderer',
    },
    {
      headerName:  intl.formatMessage({
        id: 'system-status.job.fields.priority.label',
      }),
      width: 100,
      field: 'priority',
      editable: true,
      cellStyle: (params: Record<string, any>): Record<string, string> => {
        return {border: 'solid 1px var(--mdc-theme-gc-selection-background, #fff)'};
      },
      cellRenderer: 'priorityRenderer',
      cellRendererParams: {
        isUpdating: getUpdating,
      },
      onCellValueChanged: (evt: Record<string, any>): void => {
        const id = (evt.data as Record<string, string>).id;
        setUpdatingPriority({
          updating: true,
          newValue: evt.newValue as string | number
        });
        setUpdateTaskPayload({
          id: id,
          data: {
            priority: parseInt(evt.newValue)
          }
        });
      }
    },
    {
      headerName:  intl.formatMessage({
        id: 'system-status.job.fields.created.label',
      }),
      width: 120,
      field: 'created',
      valueFormatter: (params: GridValueFormatterParams): string => dateFormatter(params.value),
    },
    {
      headerName:  intl.formatMessage({
        id: 'system-status.job.fields.updated.label',
      }),
      width: 120,
      field: 'updated',
      valueFormatter: (params: GridValueFormatterParams): string => dateFormatter(params.value),
    },
    // {
    //   headerName: 'actions',
    //   width: 240,
    //   pinned: 'right',
    //   cellRenderer: 'actionsRenderer',
    // },
  ];

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
  };

  const gridOptions: GridComponentOptions = {
    enableRtl: CONFIG.I18N.DEFAULT_LANGUAGE.toUpperCase() === 'HE',
    pagination: pagination,
    paginationPageSize: pageSize,
    columnDefs: colDef,
    getRowNodeId: (data: JobModelType) => {
      return data.id as string;
    },
    detailsRowCellRenderer: 'detailsRenderer',
    detailsRowHeight: 100,
    detailsRowExapnderPosition: 'start',
    overlayNoRowsTemplate: intl.formatMessage({
      id: 'results.nodata',
    }),
    frameworkComponents: {
      detailsRenderer: JobDetailsRenderer,
      statusRenderer: StatusRenderer,
      actionsRenderer: ActionsRenderer,
      priorityRenderer: PriorityRenderer,
    },
    tooltipShowDelay: 0,
    tooltipMouseTrack: false,
    rowSelection: 'single',
    suppressCellSelection: true,
    singleClickEdit: true,
    onGridReady: onGridReady,
    immutableData: true //bounded to state/store managed there otherwise getting "unstable_flushDiscreteUpdates in AgGridReact"
    // suppressRowClickSelection: true,
  };

  return (
    <Box id="jobsDialog">
      <Dialog open={isOpen} preventOutsideDismiss={true}>
        <DialogTitle>
          <FormattedMessage id="system-status.title"/>
          <Box 
            className="refreshContainer"
            onClick={ (): void => {
              (actions as IActions).start(POLLING_CYCLE_INTERVAL);
              void query?.refetch();
            }}
          >
            <IconButton 
              icon="autorenew" 
              className="refreshIcon"
            />
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
              height: 'calc(100% - 70px)',
              width: 'calc(100% - 8px)'
            }}
          />
          <Box className="buttons">
            {
              // eslint-disable-next-line
              mutationQuery.error !== undefined && <GpaphQLError error={mutationQuery.error}/>
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
