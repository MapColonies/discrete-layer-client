import React from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from  'lodash';
import { Icon, TextField, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../../common/models/mode.enum';
import { IRecordFieldInfo } from '../layer-details.field-info';

const EMPTY = 0;

interface StringValuePresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: string;
  formik?: unknown;
}

export const StringValuePresentorComponent: React.FC<StringValuePresentorProps> = ({ mode, fieldInfo, value, formik }) => {
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
      <Box className="detailsFieldValue">
        <TextField
          id={fieldInfo.fieldName as string}
          name={fieldInfo.fieldName as string}
          type="text"
          // eslint-disable-next-line
          onChange={(formik as any).handleChange}
          // eslint-disable-next-line
          onBlur={(formik as any).handleBlur}
          value={value}
          required={fieldInfo.isRequired === true}
        />
        {
          fieldInfo.infoMsgCode && (fieldInfo.infoMsgCode as string[]).length > EMPTY &&
          <>
            {' '}
            <Tooltip content={
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
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
      </Box>
    );
  }
}
