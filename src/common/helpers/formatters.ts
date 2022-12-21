import moment from 'moment';
import CONFIG from '../config';

export const getDateformatType = (withTime = false): string => withTime ? CONFIG.LOCALE.DATE_TIME_FORMAT : CONFIG.LOCALE.DATE_FORMAT;

export interface FormatterFunc {
  (
    source: string | Date | moment.Moment | undefined,
    option?: boolean | undefined
  ): string;
}

export const stringFormatter: FormatterFunc = (val): string => {
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  return val !== undefined ? val.toString() : '';
};

export const dateFormatter: FormatterFunc = (date, withTime = false): string => {
  // eslint-disable-next-line
  return date !== undefined && 'toISOString' in (moment(date) as moment.Moment)
    ? moment(date).format(getDateformatType(withTime))
    : '-';
};

export const relativeDateFormatter: FormatterFunc = (date): string => {
  return date !== undefined
    ? moment(date).fromNow()
    : '-';
};

export const dateSerializer: FormatterFunc = (date): string => {
  if (typeof date === 'string') {
    try {
      return new Date(date).toISOString();
    } catch (e) {
      return '-';
    }
  }
  
  if (typeof date !== 'undefined') {
    return (date).toISOString();
  }


  return '-';
};

export const emphasizeByHTML: FormatterFunc = (value): string => {
  return `<strong>${value as string}</strong>`;
};
