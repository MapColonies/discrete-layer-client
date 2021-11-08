/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import moment from 'moment';
import vest, { test, enforce } from 'vest';
import { IEnforceRules } from 'vest/enforce';
import { FieldConfigModelType, ValidationConfigModelType } from '../../models';

enforce.extend({
  isSameOrAfter: (val1, val2) => (val1 as moment.Moment).isAfter(val2) || (val1 as moment.Moment).isSame(val2),
  isSameOrBefore: (val1, val2) => (val1 as moment.Moment).isBefore(val2) || (val1 as moment.Moment).isSame(val2),
});

const suite = (fieldDescriptor: FieldConfigModelType[], data: Record<string, unknown> = {}): any => {

  const greaterThanOrEquals = (value1: any, value2: any): IEnforceRules => {
    if (typeof value2 === 'object') {
      return enforce(value1).isSameOrAfter(value2);
    }
    return enforce(value1).greaterThanOrEquals(value2);
  };

  const lessThanOrEquals = (value1: any, value2: any): IEnforceRules => {
    if (typeof value2 === 'object') {
      return enforce(value1).isSameOrBefore(value2);
    }
    return enforce(value1).lessThanOrEquals(value2);
  };

  const validate = vest.create((data: Record<string, unknown>): any => {

    fieldDescriptor.forEach((field: FieldConfigModelType): void => {
      const fieldName = field.fieldName as string;
      field.validation?.forEach((val: ValidationConfigModelType): void => {
        /* eslint-disable */
        test(fieldName, val.errorMsgTranslation as string, () => {
          if (val.type === 'REQUIRED') {
            enforce(data[fieldName]).isNotEmpty();
          } else {
            if (data[fieldName]) {
              if (val.pattern) {
                enforce(data[fieldName]).matches(val.pattern as string);
              } else if (val.min) {
                if (val.type === 'FIELD') {
                  if (data[val.min]) {
                    greaterThanOrEquals(data[fieldName], data[val.min]);
                  }
                } else {
                  greaterThanOrEquals(data[fieldName], val.min);
                }
              } else if (val.max) {
                if (val.type === 'FIELD') {
                  if (data[val.max]) {
                    lessThanOrEquals(data[fieldName], data[val.max]);
                  }
                } else {
                  lessThanOrEquals(data[fieldName], val.max);
                }
              } else if (val.minLength) {
                enforce(data[fieldName]).longerThanOrEquals(val.minLength);
              } else if (val.maxLength) {
                enforce(data[fieldName]).shorterThanOrEquals(val.maxLength);
              }
            }
          }
        });
        /* eslint-enable */
      });
      
    });
  });

  validate(data);

  return validate;
  
};

// eslint-disable-next-line
export default suite;
