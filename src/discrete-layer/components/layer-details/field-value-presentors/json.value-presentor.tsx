import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash';
import { TextField, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { emphasizeByHTML } from '../../../../common/helpers/formatters';
import { Mode } from '../../../../common/models/mode.enum';
import { IRecordFieldInfo } from '../layer-details.field-info';
import { EntityFormikHandlers } from '../layer-datails-form';
import { FormInputInfoTooltipComponent } from './form.input.info.tooltip';

const NONE = 0;
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
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {     
      formik.setFieldTouched(fieldInfo.fieldName as string, true, false); 

      let formikValue: unknown = undefined;
      const currentErrors = get(formik.status, 'errors') as { [fieldName: string]: string[]; };

      const removeStatusErrors = (): void => {
        setTimeout(() => {
          if (typeof currentErrors !== 'undefined') {
            // Remove valid field from errors obj if exists
            delete currentErrors[fieldInfo.fieldName as string];
            formik.setStatus({ errors: currentErrors });
          } else {
            formik.setStatus({});
          }
        }, NONE);
      };

      try {
        if(jsonValue === '{}' && fieldInfo.isRequired as boolean){
          throw new Error('Required field');
        }

        formikValue = JSON.parse(jsonValue) as unknown;
        formik.setFieldValue(fieldInfo.fieldName as string, formikValue);

          removeStatusErrors();

      } catch(err) {
        const error = {id: `validation-field.${fieldInfo.fieldName as string}.json`};
        const isFieldRequired = fieldInfo.isRequired as boolean
        
        if (isFieldRequired || jsonValue.length > NONE) {
          if (isFieldRequired && (jsonValue.length === NONE || jsonValue === '{}')) {
            error.id = 'validation-general.required';
          }
          const errorMsg = intl.formatMessage(
            error,
            { fieldName: emphasizeByHTML(`${intl.formatMessage({ id: fieldInfo.label })}`) }
          );

          formik.setStatus({
            errors: {
                ...currentErrors,
                [fieldInfo.fieldName as string]: [errorMsg]
              }
          })
        }
        else {
          removeStatusErrors();
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
            required={fieldInfo.isRequired as boolean}
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
