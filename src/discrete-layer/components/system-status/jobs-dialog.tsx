import React, { useEffect, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { observer } from 'mobx-react';
import { cloneDeep } from 'lodash';
import { DialogContent } from '@material-ui/core';
import { Button, Dialog, DialogTitle } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import CONFIG from '../../../common/config';
import { 
  GridComponent,
  GridComponentOptions,
  GridValueFormatterParams,
  GridCellMouseOverEvent,
  GridCellMouseOutEvent,
  GridRowNode,
  GridRowSelectedEvent,
  GridReadyEvent,
  GridApi
} from '../../../common/components/grid';
import { useQuery, useStore } from "../../models/RootStore";
import { JobModelType } from '../../models';
import { dateFormatter } from '../layers-results/type-formatters/type-formatters';
import { JobDetailsRenderer } from './cell-renderer/job-details.cell-renderer';
import { StatusRenderer } from './cell-renderer/status.cell-renderer';
import { ActionsRenderer } from './cell-renderer/actions.cell-renderer';

import './jobs-dialog.css';

const pagination = true;
const pageSize = 10;

interface SystemJobsComponentProps {
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
}

export const SystemJobsComponent: React.FC<SystemJobsComponentProps> = observer((props: SystemJobsComponentProps) => {
  const intl = useIntl();
  const { isOpen, onSetOpen } = props;
  const { loading, error, data, query } = useQuery((store) =>
    store.queryJobs({
      params: {}
    })
  );
  const store = useStore();

  const closeDialog = useCallback(
    () => {
      onSetOpen(false);
    },
    [onSetOpen]
  );

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
      width: 100,
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
      width: 120,
      field: 'status',
      cellRenderer: 'statusRenderer',
    },
    {
      headerName:  intl.formatMessage({
        id: 'system-status.job.fields.priority.label',
      }),
      width: 100,
      field: 'priority',
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
    {
      headerName: 'xcz',
      width: 240,
      pinned: 'right',
      cellRenderer: 'actionsRenderer',
    },
  ];
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
    },
    tooltipShowDelay: 0,
    tooltipMouseTrack: false,
    rowSelection: 'single',
    suppressCellSelection: true,
    // suppressRowClickSelection: true,
  };

  const prepareData = (data: JobModelType[] | undefined ): any[] => {
    console.log('DATA--->', cloneDeep(data));
    return data ? cloneDeep(data) : [];
  }

  return (
    <Box id="jobsDialog">
      <Dialog open={isOpen} preventOutsideDismiss={true}>
        <DialogTitle>
          <FormattedMessage id="system-status.title"/>
        </DialogTitle>
        <DialogContent className="jobsBody">
          <GridComponent
            gridOptions={gridOptions}
            rowData={prepareData(data?.jobs)}
            style={{
              height: 'calc(100% - 70px)',
              width: 'calc(100% - 8px)'
            }}
          />
          <Box className="buttons">
            <Button raised type="button" onClick={(): void => { closeDialog(); }}>
              <FormattedMessage id="system-status.ok-btn.text"/>
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
});
