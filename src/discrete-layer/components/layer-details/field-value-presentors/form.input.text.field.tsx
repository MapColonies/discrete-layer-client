import React, { useState } from 'react';
import { get } from 'lodash';
import { TextField, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../../common/models/mode.enum';
import { convertExponentialToDecimal } from '../../../../common/helpers/number';
import { ValidationConfigModelType, ValidationType } from '../../../models';
import { IRecordFieldInfo } from '../layer-details.field-info';
import { FormInputInfoTooltipComponent } from './form.input.info.tooltip';

interface FormInputTextFieldProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: string;
  formik?: unknown;
  type?: string;
}

export const FormInputTextFieldComponent: React.FC<FormInputTextFieldProps> = ({mode, fieldInfo, value, formik, type}) => {
  const val = get(formik, `values[${fieldInfo.fieldName as string}]`) as
    | string
    | undefined;

  const [inputVal, setInputVal] = useState(val ?? '');


  const handleInputChange= (e: React.ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line
    (formik as any).handleChange(e);
    setInputVal(e.target.value);
  };

  if (
    formik === undefined || mode === Mode.VIEW || (mode === Mode.EDIT && fieldInfo.isManuallyEditable !== true)) {
    return (
      <Tooltip content={value}>
        <Box className="detailsFieldValue">
          {value}
        </Box>
      </Tooltip>
    );
  } else {
    let min: string;
    let max: string;
    let validationProps = {};
    let placeholder = '';
    fieldInfo.validation?.forEach((validationItem: ValidationConfigModelType) => {
        if (validationItem.valueType === ValidationType.VALUE) {
          if (validationItem.min !== null) {
            min = convertExponentialToDecimal(validationItem.min as string);
          }
          if (validationItem.max !== null) {
            max = convertExponentialToDecimal(validationItem.max as string);
          }
        }
      }
    );

    const precisionAllowed = 'any';
    // @ts-ignore
    if (min && max) {
      validationProps = { min, max, step: precisionAllowed };
      placeholder = `${min} - ${max}`;
    }
    return (
      <>
        <Box className="detailsFieldValue">
          <TextField
            value={inputVal}
            // @ts-ignore
            id={fieldInfo.fieldName as string}
            name={fieldInfo.fieldName as string}
            type={type}
            // eslint-disable-next-line
            onChange={handleInputChange}
            // eslint-disable-next-line
            onBlur={(formik as any).handleBlur}
            placeholder={placeholder}
            required={fieldInfo.isRequired === true}
            {...validationProps}
          />
          {!(
            fieldInfo.infoMsgCode?.length === 1 &&
            fieldInfo.infoMsgCode[0].includes('required')
          ) && <FormInputInfoTooltipComponent fieldInfo={fieldInfo} />}
        </Box>
      </>
    );
  }
};
