import React, { useState, useEffect } from 'react';
import { TextField, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../../common/models/mode.enum';
import { IRecordFieldInfo } from '../layer-details.field-info';
import { EntityFormikHandlers } from '../layer-datails-form';
import { FormInputInfoTooltipComponent } from './form.input.info.tooltip';

interface JsonValuePresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: string;
  formik?: EntityFormikHandlers;
  type?: string;
}

export const JsonValuePresentorComponent: React.FC<JsonValuePresentorProps> = ({ mode, fieldInfo, value, formik, type }) => {
  const [jsonValue, setJsonValue] = useState('');

  useEffect(()=>{
    if(typeof value !== 'undefined'){
      setJsonValue(value)
    }

  },[value])
  


  if (formik === undefined || mode === Mode.VIEW || (mode === Mode.EDIT && fieldInfo.isManuallyEditable !== true)) {
    const stringifiedValue = JSON.stringify(value);
    return (
      <Tooltip content={stringifiedValue}>
        <Box className="detailsFieldValue">
          {stringifiedValue}
        </Box>
      </Tooltip>
    );
  } else {
    const handleBlur = (e: any): void => {      
      let formikValue: unknown = undefined;

      try {
        formikValue = JSON.parse(jsonValue) as unknown;
        formik.setFieldValue(fieldInfo.fieldName as string, formikValue);
      } catch(e) {
        formik.setFieldValue(fieldInfo.fieldName as string, undefined);
      }

      formik.handleBlur(e);
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
