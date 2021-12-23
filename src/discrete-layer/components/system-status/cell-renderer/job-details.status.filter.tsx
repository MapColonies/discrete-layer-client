import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { Box } from '@map-colonies/react-components';
import { Select } from '@map-colonies/react-core';
import { useIntl } from 'react-intl';
import { JobModelType, Status } from '../../../models';
import { IDoesFilterPassParams, IFilterParams, } from 'ag-grid-community';

export const JobDetailsStatusFilter = forwardRef((props: IFilterParams, ref) => {
  const intl = useIntl();

  const [filterStatus, setFilterStatus] = useState<string | Status>('');

  useEffect(() => {
    props.filterChangedCallback();
  }, [props,filterStatus]);

  useImperativeHandle(ref, () => {
    return {
      doesFilterPass(params: IDoesFilterPassParams): boolean {
        return (params.data as JobModelType).status === filterStatus;
      },

      isFilterActive(): boolean {
        return filterStatus !== '';
      },
    };
  });

  const getStatusTranslation = useCallback((status: Status): string => {
    const statusText = intl.formatMessage({
      id: `system-status.job.status_translation.${status as string}`,
    });

    return statusText;
  },[intl]);

  const getStatusOptions = useMemo((): JSX.Element => {
    const statuses: Record<string, any> = {};

    const showAllStatusesText = intl.formatMessage({
      id: 'system-status.job.filter.status.all',
    });


    for (const [key, val] of Object.entries(Status)) {
      statuses[key] = getStatusTranslation(val);
    }

    return (
      <Select
        style={{ height: '180px', borderRadius: 0 }}
        enhanced
        placeholder={showAllStatusesText}
        options={statuses}
        onChange={(evt): void => {
          setFilterStatus(evt.currentTarget.value);
        }}
      />
    );
  },[getStatusTranslation, intl]);

  return (
    <Box style={{ height: '215px', width: '200px', overflow: 'hidden' }}>
      {getStatusOptions}
    </Box>
  );
});
