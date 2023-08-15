import _ from "lodash";

export const isArrayEqual = (x: Array<unknown>, y: Array<unknown>) => {
  return _(x).differenceWith(y, _.isEqual).isEmpty();
};
