import React from 'react';
import { get, isEmpty } from  'lodash';
import { TextField, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../../common/models/mode.enum';
import { IRecordFieldInfo } from '../layer-details.field-info';
import { FormInputInfoTooltipComponent } from './form.input.info.tooltip';

interface JsonValuePresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: string;
  formik?: unknown;
  type?: string;
}

export const JsonValuePresentorComponent: React.FC<JsonValuePresentorProps> = ({ mode, fieldInfo, value, formik, type }) => {
  if (formik === undefined || mode === Mode.VIEW || (mode === Mode.EDIT && fieldInfo.isManuallyEditable !== true)) {
    const stringifiedValue = JSON.stringify(value ?? {});
    return (
      <Tooltip content={stringifiedValue}>
        <Box className="detailsFieldValue">
          {stringifiedValue}
        </Box>
      </Tooltip>
      // <></>
    );
  } else {
    const value = get(formik, `values[${fieldInfo.fieldName as string}]`) as unknown;
    const controlValue = {
      value: isEmpty(value) ? undefined : JSON.stringify(value ?? {})
    };

    const handleBlur = (e: any): void => {

      // eslint-disable-next-line
      const val = (e.target as any).value;
      
      let formikValue: unknown = undefined;
      try {
        formikValue = JSON.parse(val) as unknown;
        // eslint-disable-next-line
        (formik as any).setFieldValue(fieldInfo.fieldName, formikValue);
      // eslint-disable-next-line no-empty
      } catch(e) {
        // eslint-disable-next-line
        (formik as any).setFieldValue(fieldInfo.fieldName, undefined);
      }
      
      // eslint-disable-next-line
      (formik as any).handleBlur(e);
    };

    return (
      <>
        <Box className="detailsFieldValue">
          <TextField
            {...controlValue}
            id={fieldInfo.fieldName as string}
            name={fieldInfo.fieldName as string}
            type={type}
            // eslint-disable-next-line
            onBlur={handleBlur}
            placeholder={'JSON'}
            required={fieldInfo.isRequired === true}
            textarea
            rows={4}
          />
            {
              !(fieldInfo.infoMsgCode?.length === 1 && fieldInfo.infoMsgCode[0].includes('required')) &&
              <FormInputInfoTooltipComponent fieldInfo={fieldInfo}/>
            }
        </Box>
      </>
    );
  }
}
