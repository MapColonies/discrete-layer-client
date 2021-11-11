/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import moment from 'moment';
import vest, { test, enforce } from 'vest';
import { IEnforceRules } from 'vest/enforce';
import { ValidationTypeName } from '../../../common/models/validation.enum';
import { FieldConfigModelType, ValidationConfigModelType, ValidationType } from '../../models';
import { FieldInfoName } from './layer-details.field-info';
import { getBasicType, getValidationType } from './utils';

enforce.extend({
  afterOrSame: (val1, val2) => (val1 as moment.Moment).isAfter(val2) || (val1 as moment.Moment).isSame(val2),
  beforeOrSame: (val1, val2) => (val1 as moment.Moment).isBefore(val2) || (val1 as moment.Moment).isSame(val2),
  isJson: (val) => val !== null,
});

const suite = (fieldDescriptor: FieldConfigModelType[], data: Record<string, unknown> = {}): any => {

  const greaterThanOrEquals = (basicType: string, value1: unknown, value2: unknown): IEnforceRules => {
    switch (basicType) {
      case 'momentDateType':
        return enforce(value1).afterOrSame(value2);
      case 'number':
        return enforce(value1).greaterThanOrEquals(value2 as number);
      default:
        return enforce(false).isTruthy();
    }
  };

  const lessThanOrEquals = (basicType: string, value1: unknown, value2: unknown): IEnforceRules => {
    switch (basicType) {
      case 'momentDateType':
        return enforce(value1).beforeOrSame(value2);
      case 'number':
        return enforce(value1).lessThanOrEquals(value2 as number);
      default:
        return enforce(false).isTruthy();
    }
  };

  const getValueToCompare = (validation: ValidationConfigModelType, data: Record<string, unknown>): number | undefined => {
    const value = getValidationType(validation) ?? '';
    // @ts-ignore
    const param = validation[value] as string | number;
    if (validation.valueType === ValidationType.FIELD) {
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
          if (data[fieldName]) {
            const validationType = getValidationType(validation);
            if (validationType !== undefined) {
              switch (validationType) {
                case ValidationTypeName.required:
                  enforce(data[fieldName]).isNotEmpty();
                  break;
                case ValidationTypeName.pattern:
                  enforce(data[fieldName]).matches(validation.pattern as string);
                  break;
                case ValidationTypeName.min:
                  value2Compare = getValueToCompare(validation, data);
                  if (value2Compare !== undefined) {
                    greaterThanOrEquals(basicType, data[fieldName], value2Compare);
                  }
                  break;
                case ValidationTypeName.max:
                  value2Compare = getValueToCompare(validation, data);
                  if (value2Compare !== undefined) {
                    lessThanOrEquals(basicType, data[fieldName], value2Compare);
                  }
                  break;
                case ValidationTypeName.minLength:
                  enforce(data[fieldName]).longerThanOrEquals(validation.minLength as number);
                  break;
                case ValidationTypeName.maxLength:
                  enforce(data[fieldName]).shorterThanOrEquals(validation.maxLength as number);
                  break;
                case ValidationTypeName.json:
                  enforce(data[fieldName]).isJson();
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
