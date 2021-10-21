import React from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { get } from 'lodash';
import { Icon, TextField, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../../common/models/mode.enum';
import { dateFormatter } from '../../../../common/helpers/type-formatters';
import { IRecordFieldInfo } from '../layer-details.field-info';

const EMPTY = 0;

interface DateValuePresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: moment.Moment;
  formik?: unknown;
}

export const DateValuePresentorComponent: React.FC<DateValuePresentorProps> = ({ mode, fieldInfo, value, formik }) => {
  if (mode === Mode.VIEW || (mode === Mode.EDIT && fieldInfo.isManuallyEditable !== true)) {
    return (
      <Tooltip content={ dateFormatter(value) }>
        <Box className="detailsFieldValue">
          { dateFormatter(value) }
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
          type="date"
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
