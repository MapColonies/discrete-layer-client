import React from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from  'lodash';
import { Icon, TextField, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../../common/models/mode.enum';
import { IRecordFieldInfo } from '../layer-details.field-info';

const EMPTY = 0;

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
            value={value}
            required={fieldInfo.isRequired === true}
          />
        </Box>
        {
          fieldInfo.infoMsgCode && (fieldInfo.infoMsgCode as string[]).length > EMPTY &&
          <>
            <Tooltip content={
              <ul className="textFieldInfoList">
                {
                  (fieldInfo.infoMsgCode as string[]).map((msg: string, index: number) => {
                    return (
                      <li key={index}><FormattedMessage id={msg}/></li>
                    );
                  })
                }
              </ul>
            }>
              <Icon className="textFieldInfoIcon" icon={{ icon: 'info', size: 'small' }}/>
            </Tooltip>
          </>
        }
      </>
    );
  }
}