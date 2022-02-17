
import filesize from 'filesize';
import moment from 'moment';
import CONFIG from '../config';

export interface FormatterFunc {
  (source: string | Date | moment.Moment | undefined, option?: boolean | undefined): string;
}

export const stringFormatter: FormatterFunc = (val): string => {
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  return val !== undefined ? val.toString() : '';
}

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

interface IFileSize {
  value: number;
  symbol: string;
  exponent: number;
  unit: string;
}

export const fileSizeFormatter = (size: number): string => {
  const sizeData = filesize(size, { bits: false, output: 'object' }) as IFileSize;
  if (sizeData.symbol === 'B') {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return `${Math.round(sizeData.value / 10) / 100.0} KB`;
  } else if (sizeData.symbol === 'KB') {
    return `${Math.round(sizeData.value)} ${sizeData.symbol}`;
  }
  return `${sizeData.value} ${sizeData.symbol}`;
};
