/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import vest, { test, enforce } from 'vest';

const suite = (data: any = {}, fieldDescriptor: any[]): any => {

  const validate = vest.create((data: any = {}): any => {

    fieldDescriptor.forEach(field => {
      field.validation?.forEach((val: any) => {
        test(field.fieldName, val.errorMsgTranslation, () => {
          if (val.type === 'required') {
            enforce(data[field.fieldName] as string).isNotEmpty();
          } else {
            if (val.pattern !== undefined) {
              enforce(data[field.fieldName] as string).matches(val.pattern);
            } else if (val.min !== undefined) {
              enforce(data[field.fieldName] as string).greaterThanOrEquals(val.type === 'field' ? data[val.min] : val.min);
            } else if (val.max !== undefined) {
              enforce(data[field.fieldName] as string).lessThan(val.type === 'field' ? data[val.max] : val.max);
            } else if (val.minLength !== undefined) {
              enforce(data[field.fieldName] as string).longerThanOrEquals(val.type === 'field' ? data[val.minLength] : val.minLength);
            } else if (val.maxLength !== undefined) {
              enforce(data[field.fieldName] as string).shorterThan(val.type === 'field' ? data[val.maxLength] : val.maxLength);
            }
          }
        });
      });
      
    });
  }) as any;

  validate(data);

  return validate;
  
};

// eslint-disable-next-line
export default suite;
