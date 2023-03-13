import React, { useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { Tooltip } from '@map-colonies/react-core';
import { Box, DateTimePicker, SupportedLocales } from '@map-colonies/react-components';
import moment, { Moment } from 'moment';
import {
  dateFormatter,
  relativeDateFormatter,
} from '../../../../common/helpers/formatters';
import CONFIG from '../../../../common/config';
import PlaceholderCellRenderer from './placeholder.cell-renderer';

import './date.cell-renderer.css';
import { get } from 'lodash';
import { usePrevious } from '../../../../common/hooks/previous.hook';

interface IDateCellRendererParams extends ICellRendererParams {
  field: string;
  shouldShowPredicate?: (data: unknown) => boolean;
  comingSoonDaysIndication?: number;
  onChange?: (updatedExpirationDate: Date, jobData: unknown) => void;
}

const FUTURE_DATE_DIFF_ANCHOR = 0;

export const DateCellRenderer: React.FC<IDateCellRendererParams> = (props) => {
  const {field, shouldShowPredicate, comingSoonDaysIndication, onChange} = props;
  const currentDate = typeof get(props.data, field) === 'undefined' ? undefined : moment(get(props.data, field)); 
  const [date, setDate] = useState<Moment | undefined>(currentDate);
  const prevDate = usePrevious(date);
  const isChangeable = typeof onChange !== 'undefined';

  const isComingSoonClassName = (): string => {
    if(typeof date === 'undefined') return '';

    const today = moment();
    const diffFromToday = today.diff(date);
    if(typeof comingSoonDaysIndication === 'undefined' || diffFromToday > FUTURE_DATE_DIFF_ANCHOR) return '';

    return moment(date).diff(today, 'days') <= comingSoonDaysIndication ? 'soonIndicator' :  '';
  }

  if (
    typeof date !== 'undefined' &&
   (typeof shouldShowPredicate === 'undefined' || shouldShowPredicate(props.data))
  ) {
    return (
      <Tooltip content={dateFormatter(date, true)}>
        <Box
          className={`dateCellRendererContainer ${
            isChangeable ? 'changeable' : ''
          }`}
        >
          <Box className={isComingSoonClassName()}>
            {relativeDateFormatter(date)}
          </Box>

          {isChangeable && (
            <DateTimePicker
              className="updateableDateCellRendererPicker"
              showTime
              disablePast
              disableFuture={false}
              minDate={moment().add(1,'day').toDate()}
              value={date.toDate()}
              allowKeyboardControl={false}
              format={'dd/LL/yyyy HH:mm'}
              helperText={false}
              error={false}
              onClose={(): void => {
                if (
                  typeof onChange !== 'undefined' &&
                  !moment(prevDate).isSame(date, 'day')
                ) {
                  onChange(date.toDate(), props.data);
                }
              }}
              onChange={(newDate: string): void => {
                setDate(moment(newDate))
              }}
              local={{
                calendarLocale: CONFIG.I18N
                  .DEFAULT_LANGUAGE as SupportedLocales,
              }}
              autoOk
            />
          )}
        </Box>
      </Tooltip>
    );
  }

  return <PlaceholderCellRenderer {...props} />

};
