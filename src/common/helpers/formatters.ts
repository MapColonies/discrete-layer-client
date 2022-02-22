
import moment from 'moment';
import CONFIG from '../config';

export interface FormatterFunc {
  (source: string | Date | moment.Moment | undefined, option?: boolean | undefined): string;
}

export const stringFormatter: FormatterFunc = (val): string => {
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  return val !== undefined ? val.toString() : '';
};

export const dateFormatter: FormatterFunc = (date, withTime = false): string => {
  const formatType = withTime ? CONFIG.LOCALE.DATE_TIME_FORMAT : CONFIG.LOCALE.DATE_FORMAT;
  // eslint-disable-next-line
  return date !== undefined && 'toISOString' in (moment(date) as moment.Moment)
    ? moment(date).format(formatType)
    : '-';
};

export const relativeDateFormatter: FormatterFunc = (date): string => {
  return date !== undefined
    ? moment(date).fromNow()
    : '-';
};

export const dateSerializer: FormatterFunc = (date): string => {
  if (typeof date !== 'undefined') {
    return (date as Date | moment.Moment).toISOString();
  }

  if (typeof date === 'string') {
    try {
      return new Date(date).toISOString();
    } catch (e) {
      return '-';
    }
  }

  return '-';
};