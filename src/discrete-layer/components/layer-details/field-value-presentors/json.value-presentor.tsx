import React, { useState, useEffect } from 'react';
import { TextField, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../../common/models/mode.enum';
import { IRecordFieldInfo } from '../layer-details.field-info';
import { EntityFormikHandlers } from '../layer-datails-form';
import { FormInputInfoTooltipComponent } from './form.input.info.tooltip';
import { useIntl } from 'react-intl';

interface JsonValuePresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: string;
  formik?: EntityFormikHandlers;
  type?: string;
}

export const JsonValuePresentorComponent: React.FC<JsonValuePresentorProps> = ({ mode, fieldInfo, value, formik, type }) => {
  const [jsonValue, setJsonValue] = useState(JSON.stringify(value ?? {}));
  const intl = useIntl();

  useEffect(()=>{
      setJsonValue(JSON.stringify(value ?? {}));
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
        setTimeout(()=>{
          formik.setFieldValue(fieldInfo.fieldName as string, formikValue);
          formik.setStatus({});
        }, 0);
      } catch(err) {
        const error = {id: `validation-field.${fieldInfo.fieldName}.json`};
        
        if(fieldInfo.isRequired || jsonValue.length > 0){
          if(fieldInfo.isRequired && jsonValue.length === 0){
            error.id = 'validation-general.required';
          }
          const errorMsg = intl.formatMessage(
            error,
            { fieldName: `<strong>${intl.formatMessage({ id: fieldInfo.label })}</strong>` }
          );
          
          formik.setStatus({
            errors: {
                ...formik.status.errors,
                [fieldInfo.fieldName as string]: [errorMsg]
              }
          })
        }
        else {
          formik.setStatus({});
        }
      }
    };

    return (
      <>
        <Box className="detailsFieldValue">
          <TextField
            id={fieldInfo.fieldName as string}
            name={fieldInfo.fieldName as string}
            type={type}
            value={jsonValue === '{}' ? '' : jsonValue}
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
