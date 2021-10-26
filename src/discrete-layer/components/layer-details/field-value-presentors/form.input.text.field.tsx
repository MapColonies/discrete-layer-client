import React from 'react';
import { get } from  'lodash';
import { TextField, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../../common/models/mode.enum';
import { ValidationConfigModelType } from '../../../models';
import { IRecordFieldInfo } from '../layer-details.field-info';
import { FormInputInfoTooltipComponent } from './form.input.info.tooltip';

interface FormInputTextFieldProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: string;
  formik?: unknown;
  type?: string;
}

export const FormInputTextFieldComponent: React.FC<FormInputTextFieldProps> = ({ mode, fieldInfo, value, formik, type }) => {
  if (formik === undefined || mode === Mode.VIEW || (mode === Mode.EDIT && fieldInfo.isManuallyEditable !== true)) {
    return (
      <Tooltip content={value}>
        <Box className="detailsFieldValue">
          {value}
        </Box>
      </Tooltip>
    );
  } else {
    const value = get(formik,`values[${fieldInfo.fieldName as string}]`) as string;
    let min: string;
    let max: string;
    fieldInfo.validation?.forEach((validationItem: ValidationConfigModelType) => {
      if (validationItem.type === 'VALUE') {
        if (validationItem.min !== null) {
          min = validationItem.min as string;
        }
        if (validationItem.max !== null) {
          max = validationItem.max as string;
        }
      }
    });
    // @ts-ignore
    const placeholder = (min && max) ? `${min} - ${max}` : '';
    return (
      <>
        <Box className="detailsFieldValue">
          <TextField
            id={fieldInfo.fieldName as string}
            name={fieldInfo.fieldName as string}
            type={type}
            // eslint-disable-next-line
            onChange={(formik as any).handleChange}
            // eslint-disable-next-line
            onBlur={(formik as any).handleBlur}
            placeholder={placeholder}
            value={value}
            required={fieldInfo.isRequired === true}
          />
        </Box>
        <FormInputInfoTooltipComponent fieldInfo={fieldInfo}/>
      </>
    );
  }
}
