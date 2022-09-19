import { types } from "mobx-state-tree"
import moment from 'moment';

export const momentDateType = types.custom<string, moment.Moment>({
    name: 'momentDateType',
    fromSnapshot(value: string) {
      return moment(value);
    },
    toSnapshot(value: moment.Moment) {
      return value.toISOString();
    },
    isTargetType(value: string | moment.Moment): boolean {
      return value instanceof moment.isMoment;
    },
    getValidationMessage(value: string | null): string {
      if (value === null) {
        return '';
      }
  
      if (
        /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+([+-][0-2]\d:[0-5]\d|Z))?/.test(value)
      ) {
        return '';
      }
      return `'${value}' doesn't look like 'YYYY-MM-DDTHH:mm:ss.SSSZ'`;
    },
  })