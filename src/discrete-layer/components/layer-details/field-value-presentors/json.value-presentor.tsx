import React, { useState } from 'react';
import { get, isEmpty } from  'lodash';
import { TextField, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../../common/models/mode.enum';
import { IRecordFieldInfo } from '../layer-details.field-info';
import { FormInputInfoTooltipComponent } from './form.input.info.tooltip';
import { EntityFormikHandlers } from '../layer-datails-form';

interface JsonValuePresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: string;
  formik?: EntityFormikHandlers;
  type?: string;
}

export const JsonValuePresentorComponent: React.FC<JsonValuePresentorProps> = ({ mode, fieldInfo, value, formik, type }) => {
  const [jsonValue, setJsonValue] = useState(value as string);

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
    // const value = get(formik, `values[${fieldInfo.fieldName as string}]`) as unknown;
    // const controlValue = {
    //   value: isEmpty(value) ? undefined : JSON.stringify(value ?? {})
    // };

    const handleBlur = (e: any): void => {

      // eslint-disable-next-line
      
      let formikValue: unknown = undefined;
      try {
        formikValue = JSON.parse(jsonValue) as unknown;
        // eslint-disable-next-line
        formik?.setFieldValue(fieldInfo.fieldName as string, formikValue);
      // eslint-disable-next-line no-empty
      } catch(e) {
        // eslint-disable-next-line
        formik?.setFieldValue(fieldInfo.fieldName as string, undefined);
      }
      
      // eslint-disable-next-line
      formik?.handleBlur(e);
    };

    return (
      <>
        <Box className="detailsFieldValue">
          <TextField
            id={fieldInfo.fieldName as string}
            name={fieldInfo.fieldName as string}
            type={type}
            value={jsonValue}
            onChange={(e): void => setJsonValue(e.currentTarget.value)}
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
