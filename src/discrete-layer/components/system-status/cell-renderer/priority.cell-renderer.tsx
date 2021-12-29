/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useCallback, useEffect, useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { Box } from '@map-colonies/react-components';
import { CircularProgress, Select } from '@map-colonies/react-core';
import { IUpdating } from '../jobs-dialog';
import './priority.cell-renderer.css';
import { JobModelType } from '../../../models';

interface IPriorityCellRendererParams extends ICellRendererParams {
  optionsData: { [priorityVal: number]: string; defaultVal: string };
  optionsIcons: { [val: string]: string };
  onChange: (e: Record<string, any>, jobData: ICellRendererParams) => void;
}

export const PriorityRenderer: React.FC<IPriorityCellRendererParams> = (
  props
) => {
  const jobData: JobModelType = props.data as JobModelType;
  const { optionsData } = props;

  const [loading, setLoading] = useState(false);

  let initialPriority: number | string | undefined;

  if (
    typeof jobData.priority !== 'undefined' &&
    jobData.priority !== null &&
    jobData.priority in optionsData
  ) {
    initialPriority = jobData.priority;
  } else {
    initialPriority = optionsData.defaultVal;
  }

  const icon = props.optionsIcons[initialPriority];

  const defaultSelection = (optionsData as Record<string, string>)[
    initialPriority
  ];

  const sortOptions = (
    options: Record<string, string>
  ): Record<string, string> =>
    Object.fromEntries(Object.entries(options).sort(([key1],[key2]) => {
      if(key2 > key1){
        return 1;
      }else{
        return -1;
      }
    }));

  const cleanOptionsList = useCallback(() => {
    const options = { ...optionsData } as Record<string, string>;
    delete options[initialPriority as string];
    delete options.defaultVal;
    return sortOptions(options);
  }, []);

  if (loading)
    return (
      <Box className="loadingContainer">
        <CircularProgress />
      </Box>
    );

  return (
    <Box className="priorityCellContainer">
      <Select
        enhanced
        outlined
        className={'priority_options'}
        placeholder={defaultSelection}
        options={cleanOptionsList()}
        icon={{
          icon: icon,
          strategy: 'className',
          basename: 'icon',
          prefix: 'mc-icon-',
          size: 'small',
        }}
        onChange={(e) => {
          setLoading(true);
          props.onChange(e, props.data);
        }}
      />
    </Box>
  );
};
