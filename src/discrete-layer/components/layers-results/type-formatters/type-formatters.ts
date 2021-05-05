
import moment from 'moment';
import CONFIG from '../../../../common/config';

export interface FormatterFunc {
  (source: string | Date | moment.Moment | undefined): string;
}

export const stringFormatter: FormatterFunc = (val): string =>{
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  return val !== undefined ? val.toString() : '';
}

export const dateFormatter: FormatterFunc = (date): string => {
  // eslint-disable-next-line
  return date !== undefined && 'toISOString' in (date as any)
    ? moment(date).format(CONFIG.LOCALE.DATE_TIME_FORMAT)
    : '-';
};
