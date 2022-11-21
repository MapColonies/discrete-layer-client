import React from 'react';
import JobManagerGrid, {
  ICommonJobManagerGridProps,
} from './job-manager-grid.common';

type JobManager3DGridProps = Omit<
  ICommonJobManagerGridProps,
  'gridOptionsOverride' | 'gridStyleOverride' | 'customColDef'
>;

const JobManager3DGrid: React.FC<JobManager3DGridProps> = ({
  rowData,
  dispatchAction,
  getJobActions,
  priorityChangeCB,
  rowDataChangeCB,
  onGridReadyCB,
}) => {
  const renderersToOmit = ['priorityRenderer', 'actionsRenderer'];

  return (
    <JobManagerGrid
      rowData={rowData}
      dispatchAction={dispatchAction}
      priorityChangeCB={priorityChangeCB}
      getJobActions={getJobActions}
      onGridReadyCB={onGridReadyCB}
      rowDataChangeCB={rowDataChangeCB}
      omitColDefsByRenderer={renderersToOmit}
      gridOptionsOverride={{ detailsRowCellRenderer: undefined }}
    />
  );
};

export default JobManager3DGrid;
