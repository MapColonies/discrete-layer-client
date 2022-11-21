import React from 'react';
import JobManagerGrid, {
  ICommonJobManagerGridProps,
} from './job-manager-grid.common';

type JobManagerRasterGridProps = Omit<
  ICommonJobManagerGridProps,
  'gridOptionsOverride' | 'gridStyleOverride' | 'customColDef'
>;

const JobManagerRasterGrid: React.FC<JobManagerRasterGridProps> = ({
  rowData,
  dispatchAction,
  priorityChangeCB,
  getJobActions,
  onGridReadyCB,
  rowDataChangeCB,
}) => {
  return (
    <JobManagerGrid
      rowData={rowData}
      dispatchAction={dispatchAction}
      priorityChangeCB={priorityChangeCB}
      getJobActions={getJobActions}
      onGridReadyCB={onGridReadyCB}
      rowDataChangeCB={rowDataChangeCB}
    />
  );
};

export default JobManagerRasterGrid;
