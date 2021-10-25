/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import vest, { test, enforce } from 'vest';
import { FieldConfigModelType, ValidationConfigModelType } from '../../models';

const suite = (fieldDescriptor: FieldConfigModelType[], data: Record<string, unknown> = {}): any => {

  const validate = vest.create((data: Record<string, unknown>): any => {

    fieldDescriptor.forEach((field: FieldConfigModelType): void => {
      field.validation?.forEach((val: ValidationConfigModelType): void => {
        const fieldName = field.fieldName as string;
        test(fieldName, val.errorMsgTranslation as string, () => {
          if (val.type === 'REQUIRED') {
            enforce(data[fieldName] as string).isNotEmpty();
          } else {
            if (val.pattern) {
              enforce(data[fieldName] as string).matches(val.pattern as string);
            } else if (val.min) {
              enforce(data[fieldName] as number).greaterThanOrEquals(val.type === 'FIELD' ? data[val.min as string] as number : val.min as number);
            } else if (val.max) {
              enforce(data[fieldName] as number).lessThan(val.type === 'FIELD' ? data[val.max as string] as number : val.max as number);
            } else if (val.minLength) {
              enforce(data[fieldName] as number).longerThanOrEquals(val.minLength as number);
            } else if (val.maxLength) {
              enforce(data[fieldName] as number).shorterThan(val.maxLength as number);
            }
          }
        });
      });
      
    });
  });

  validate(data);

  return validate;
  
};

// eslint-disable-next-line
export default suite;
