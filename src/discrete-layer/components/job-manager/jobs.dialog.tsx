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
  GridApi
} from '../../../common/components/grid';
import { GraphQLError } from '../../../common/components/error/graphql.error-presentor';
import useCountDown, { IActions } from '../../../common/hooks/countdown.hook';
import EnumsMapContext from '../../../common/contexts/enumsMap.context';
import { useQuery, useStore } from '../../models/RootStore';
import { IDispatchAction } from '../../models/actionDispatcherStore';
import { JobModelType, ProductType, RecordType } from '../../models';
import { JOB_ENTITY } from './job.types';
import { getProductDomain } from '../layer-details/utils';


import './jobs.dialog.css';
import JobManagerRasterGrid from './grids/job-manager-raster-grid.component';
import JobManager3DGrid from './grids/job-manager-3d-grid.component';

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
  const [gridApiRaster, setGridApiRaster] = useState<GridApi>();
  const [gridApi3D, setGridApi3D] = useState<GridApi>();
  const [pollingCycle, setPollingCycle] = useState(START_CYCLE_ITTERACTION);
  const [fromDate, setFromDate] = useState<Date>(moment().subtract(CONFIG.JOB_MANAGER_END_OF_TIME, 'days').toDate());
  const [tillDate, setTillDate] = useState<Date>(new Date());
  const { enumsMap } = useContext(EnumsMapContext);

  // const [retryErr, setRetryErr] = useState(false);

  // @ts-ignore
  const [timeLeft, actions] = useCountDown(POLLING_CYCLE_INTERVAL, CONTDOWN_REFRESH_RATE);

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
  }, [updateTaskPayload]);

  useEffect(() => {
    if (!isEmpty(mutationQuery.error)) {
      gridApiRaster?.refreshCells({
        suppressFlash: true,
        force: true
      });

      gridApi3D?.refreshCells({
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
        case 'Job.abort': {
          const abortJobDomain = getProductDomain(data.productType as ProductType, enumsMap ?? undefined);
          mutationQuery.setQuery(
            store.mutateJobAbort({
              domain: abortJobDomain,
              id: data.id as string,
            })
          );
          break;
        }
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

  const gridTitleRaster = useMemo(() => intl.formatMessage({
    id: `record-type.${RecordType.RECORD_RASTER.toLowerCase()}.label`,
  }), []);

  const gridTitle3D = useMemo(() => intl.formatMessage({
    id: `record-type.${RecordType.RECORD_3D.toLowerCase()}.label`,
  }), []);

  const renderGridList = (): JSX.Element => {
    return (
      <Box className="gridsContainer">
        <CollapsibleList
          handle={
            <SimpleListItem text={gridTitleRaster} metaIcon="chevron_right" />
          }
          defaultOpen
        >          
          <JobManagerRasterGrid 
            dispatchAction={dispatchAction}
            getJobActions={getJobActions}
            rowData={gridRowDataRaster}
            onGridReadyCB={(params): void => {
              setGridApiRaster(params.api)
            }}
            priorityChangeCB={setUpdateTaskPayload}
            rowDataChangeCB={(): void => {
              gridApiRaster?.applyTransaction({ update: gridRowDataRaster});
            }}
          />
          
        </CollapsibleList>

        <CollapsibleList
          handle={
            <SimpleListItem text={gridTitle3D} metaIcon="chevron_right" />
          }
          defaultOpen
        >
          <JobManager3DGrid 
            dispatchAction={dispatchAction}
            getJobActions={getJobActions}
            rowData={gridRowData3D}
            onGridReadyCB={(params): void => {
              setGridApi3D(params.api);
            }}
            priorityChangeCB={setUpdateTaskPayload}
            rowDataChangeCB={(): void => {
              gridApi3D?.applyTransaction({ update: gridRowData3D});
            }}
          />

        </CollapsibleList>
      </Box>
    );
  };

  const renderDateTimeRangePicker = (): JSX.Element => {
    return (
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
    );
  };
 

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
          {renderDateTimeRangePicker()}
          {renderGridList()}
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
