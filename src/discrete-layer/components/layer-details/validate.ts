/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import moment from 'moment';
import vest, { test, enforce } from 'vest';
import { IEnforceRules } from 'vest/enforce';
import { FieldConfigModelType, ValidationConfigModelType } from '../../models';
import { FieldInfoName } from './layer-details.field-info';
import { getBasicType } from './utils';

enforce.extend({
  afterOrSame: (val1, val2) => (val1 as moment.Moment).isAfter(val2) || (val1 as moment.Moment).isSame(val2),
  beforeOrSame: (val1, val2) => (val1 as moment.Moment).isBefore(val2) || (val1 as moment.Moment).isSame(val2),
});

const suite = (fieldDescriptor: FieldConfigModelType[], data: Record<string, unknown> = {}): any => {

  const greaterThanOrEquals = (basicType: string, value1: unknown, value2: unknown): IEnforceRules => {
    switch (basicType) {
      case 'momentDateType':
        return enforce(value1).afterOrSame(value2);
      case 'number':
        return enforce(value1).greaterThanOrEquals(value2 as number);
    }
    return enforce(value1).greaterThanOrEquals(value2 as number);
  };

  const lessThanOrEquals = (basicType: string, value1: unknown, value2: unknown): IEnforceRules => {
    switch (basicType) {
      case 'momentDateType':
        return enforce(value1).beforeOrSame(value2);
      case 'number':
        return enforce(value1).lessThanOrEquals(value2 as number);
    }
    return enforce(value1).lessThanOrEquals(value2 as number);
  };

  const getValueToCompare = (validation: ValidationConfigModelType, data: Record<string, unknown>): number | undefined => {
    const value = validation.errorMsgCode?.substring(validation.errorMsgCode.lastIndexOf('.') + 1) ?? '';
    // @ts-ignore
    const param = validation[value] as string | number;
    if (validation.type === 'FIELD') {
      if (data[param] !== undefined) {
        return data[param as string] as number;
      }
    } else {
      return param as number;
    }
  };

  const validate = vest.create((data: Record<string, unknown>): any => {

    fieldDescriptor.forEach((field: FieldConfigModelType): void => {
      let value2Compare;
      const fieldName = field.fieldName as string;
      const basicType = getBasicType(fieldName as FieldInfoName, data.__typename as string);
      field.validation?.forEach((validation: ValidationConfigModelType): void => {
        /* eslint-disable */
        test(fieldName, validation.errorMsgTranslation as string, () => {
          if (validation.type === 'REQUIRED') {
            enforce(data[fieldName]).isNotEmpty();
          } else {
            if (data[fieldName]) {
              switch (true) {
                case validation.pattern !== null:
                  enforce(data[fieldName]).matches(validation.pattern as string);
                  break;
                case validation.min !== null:
                  value2Compare = getValueToCompare(validation, data);
                  if (value2Compare !== undefined) {
                    greaterThanOrEquals(basicType, data[fieldName], value2Compare);
                  }
                  break;
                case validation.max !== null:
                  value2Compare = getValueToCompare(validation, data);
                  if (value2Compare !== undefined) {
                    lessThanOrEquals(basicType, data[fieldName], value2Compare);
                  }
                  break;
                case validation.minLength !== null:
                  enforce(data[fieldName]).longerThanOrEquals(validation.minLength as number);
                  break;
                case validation.maxLength !== null:
                  enforce(data[fieldName]).shorterThanOrEquals(validation.maxLength as number);
                  break;
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
