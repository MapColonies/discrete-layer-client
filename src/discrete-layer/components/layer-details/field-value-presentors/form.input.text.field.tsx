/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useMemo, useState } from 'react';
import { get } from 'lodash';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useIntl } from 'react-intl';
import { TextField, Tooltip, IconButton } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import CONFIG from '../../../../common/config';
import { Mode } from '../../../../common/models/mode.enum';
import { convertExponentialToDecimal } from '../../../../common/helpers/number';
import { ValidationConfigModelType, ValidationValueType } from '../../../models';
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
  const intl = useIntl();

  const handleInputChange= (e: React.ChangeEvent<HTMLInputElement>): void => {
    // eslint-disable-next-line
    (formik as any).handleChange(e);
    setInputVal(e.target.value);
  };
  
  const isCopyable = fieldInfo.isCopyable ?? false;

  const valueRenderer = useMemo(() => {
    const MAX_VALUE_LENGTH = CONFIG.NUMBER_OF_CHARACTERS_LIMIT;

    if (value && value.length > MAX_VALUE_LENGTH) {
      return (
        <Tooltip content={value}>
          <Box className={`detailsFieldValue ${isCopyable ? 'detailFieldCopyable' : ''}`}>
            {value}
          </Box>
        </Tooltip>
      );
    }
    return (
      <Box className={`detailsFieldValue ${isCopyable ? 'detailFieldCopyable' : ''}`}>
        {value}
      </Box>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (formik === undefined || mode === Mode.VIEW || (mode === Mode.EDIT && fieldInfo.isManuallyEditable !== true)) {
    return (
      <>
        {
          valueRenderer
        }
        {
          isCopyable &&
          <Box className="detailsFieldCopyIcon">
            <Tooltip content={intl.formatMessage({ id: 'action.copy.tooltip' })}>
              <CopyToClipboard text={value as string}>
                <IconButton className="mc-icon-Copy"/>
              </CopyToClipboard>
            </Tooltip>
          </Box>
        }
      </>
    );
  } else {
    let min: string;
    let max: string;
    let validationProps = {};
    let placeholder = '';
    fieldInfo.validation?.forEach((validationItem: ValidationConfigModelType) => {
      if (validationItem.valueType === ValidationValueType.VALUE) {
        if (validationItem.min !== null) {
          min = convertExponentialToDecimal(validationItem.min as string);
        }
        if (validationItem.max !== null) {
          max = convertExponentialToDecimal(validationItem.max as string);
        }
      }
    });

    const precisionAllowed = 'any';
    // @ts-ignore
    if (min && max) {
      validationProps = { min, max, step: precisionAllowed };
      placeholder = CONFIG.I18N.DEFAULT_LANGUAGE.toUpperCase() === 'HE' ? `${max} - ${min}` : `${min} - ${max}`;
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
          {
            !(fieldInfo.infoMsgCode?.length === 1 && fieldInfo.infoMsgCode[0].includes('required')) &&
            <FormInputInfoTooltipComponent fieldInfo={fieldInfo}/>
          }
        </Box>
      </>
    );
  }
};
