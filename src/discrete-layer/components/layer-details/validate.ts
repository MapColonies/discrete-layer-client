/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import vest, { test, enforce } from 'vest';
import { FieldConfigModelType, ValidationConfigModelType } from '../../models';

const suite = (fieldDescriptor: FieldConfigModelType[], data: Record<string, unknown> = {}): any => {

  const validate = vest.create((data: Record<string, unknown>): any => {

    fieldDescriptor.forEach((field: FieldConfigModelType): void => {
      field.validation?.forEach((val: ValidationConfigModelType): void => {
        const fieldName = field.fieldName as string;
        /* eslint-disable */
        test(fieldName, val.errorMsgTranslation as string, () => {
          if (val.type === 'REQUIRED') {
            enforce(data[fieldName] as string).isNotEmpty();
          } else {
            if (data[fieldName]) {
              if (val.pattern) {
                enforce(data[fieldName] as string).matches(val.pattern as string);
              } else if (val.min) {
                if (val.type === 'FIELD') {
                  if (data[val.min]) {
                    enforce(data[fieldName] as number).greaterThanOrEquals(Number(data[val.min]));
                  }
                } else {
                  enforce(data[fieldName] as number).greaterThanOrEquals(Number(val.min));
                }
              } else if (val.max) {
                if (val.type === 'FIELD') {
                  if (data[val.max]) {
                    enforce(data[fieldName] as number).lessThanOrEquals(Number(data[val.max]));
                  }
                } else {
                  enforce(data[fieldName] as number).lessThanOrEquals(Number(val.max));
                }
              } else if (val.minLength) {
                enforce(data[fieldName] as number).longerThanOrEquals(Number(val.minLength));
              } else if (val.maxLength) {
                enforce(data[fieldName] as number).shorterThanOrEquals(Number(val.maxLength));
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
