/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useCallback, useEffect, useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { get } from 'lodash';
import {
  CircularProgress,
  FormattedOption,
  Select,
} from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { JobModelType, Status } from '../../../models';
import { FINAL_STATUSES } from '../job.types'

import './priority.cell-renderer.css';

interface PriorityOption {
  label: string;
  value: string;
  icon: string;
  iconColor: string;
}
interface IPriorityCellRendererParams extends ICellRendererParams {
  optionsData: PriorityOption[];
  onChange: (e: React.FormEvent<HTMLSelectElement>, jobData: ICellRendererParams) => void;
}

export const PriorityRenderer: React.FC<IPriorityCellRendererParams> = (
  props
) => {
  const jobData: JobModelType = props.data as JobModelType;
  const { optionsData } = props;
  const [value, setValue] = useState(
    (get(jobData, 'priority') as number).toString()
  );

  const [loading, setLoading] = useState(false);

  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const shouldBeDisabled = loading || FINAL_STATUSES.includes(jobData.status as Status)
    setDisabled(shouldBeDisabled)

  }, [loading, jobData.status]);

  interface IconObj {
    icon: string;
    color: string;
  }

  const getIconObjForVal = useCallback((val: string): IconObj => {
    const selectedOption: PriorityOption = optionsData.find(
      (option: PriorityOption) => option.value === val
    ) as PriorityOption;

    return { icon: selectedOption.icon, color: selectedOption.iconColor };
  
  }, []);

  const [icon, setIcon] = useState(getIconObjForVal(value));

  useEffect(() => {
    setIcon(getIconObjForVal(value));
  }, [value, getIconObjForVal]);

  return (
    <Box className="priorityCellContainer">
      {loading && (
        <Box className="loadingContainer">
          <CircularProgress />
        </Box>
      )}
      <Select
        disabled={disabled}
        enhanced
        outlined
        className="priority_options"
        value={value}
        options={optionsData as FormattedOption[]}
        icon={{
          icon: icon.icon,
          style: { color: icon.color },
          strategy: 'className',
          basename: 'icon',
          prefix: 'glow-missing-icon mc-icon-',
          size: 'small',
        }}
        onChange={(e): void => {
          setLoading(true);
          setValue(e.currentTarget.value);
          props.onChange(e, props.data);
        }}
      />
      
    </Box>
  );
};
