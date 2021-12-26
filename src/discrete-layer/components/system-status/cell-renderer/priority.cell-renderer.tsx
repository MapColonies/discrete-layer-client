/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useCallback } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { Box } from '@map-colonies/react-components';
import { CircularProgress, Select } from '@map-colonies/react-core';
import { IUpdating } from '../jobs-dialog';
import './priority.cell-renderer.css';

interface IPriorityCellRendererParams extends ICellRendererParams {
  isUpdating: () => IUpdating | undefined;
  optionsData: {[priorityVal: number]: string, defaultVal: string};
}

export const PriorityRenderer: React.FC<IPriorityCellRendererParams> = (
  props
) => {
  const updatingObj = props.isUpdating();
  
  const defaultSelection = (props.optionsData as Record<string, string>)[props.optionsData.defaultVal];

  const cleanOptionsList = useCallback(() => {
    const options = {...props.optionsData} as Record<string, string>;
    delete options[options.defaultVal];
    delete options.defaultVal;

    return options;
  },[])


  return (
    <Box
    className="priorityCellContainer"
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '150px',
        position:'relative',
        height: '40px'
      }}
    >
        <Select
          enhanced
          outlined
          className={'priority_options'}
          placeholder={defaultSelection}
          options={cleanOptionsList()}
        />
      {/* {updatingObj && 
        <>
          <CircularProgress size="xsmall" style={{
            top: '10px',
            right: '40px'
          }}/>
          <span>{updatingObj.newValue}</span>
        </>
      }
      {!updatingObj && 
        <>
          <span>{props.data.priority}</span>
        </>
      } */}
    </Box>
  );
};
