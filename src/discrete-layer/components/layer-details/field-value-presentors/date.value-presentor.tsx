import React from 'react';
import moment from 'moment';
import { get } from 'lodash';
import { Box, DateTimePicker, SupportedLocales } from '@map-colonies/react-components';
import { Mode } from '../../../../common/models/mode.enum';
import CONFIG from '../../../../common/config';
import { dateFormatter } from '../../../../common/helpers/type-formatters';
import { IRecordFieldInfo } from '../layer-details.field-info';
import { FormInputInfoTooltipComponent } from './form.input.info.tooltip';

interface DateValuePresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: moment.Moment;
  formik?: unknown;
}

export const DateValuePresentorComponent: React.FC<DateValuePresentorProps> = ({ mode, fieldInfo, value, formik }) => {
  const local = {
    placeHolderText: CONFIG.LOCALE.DATE_FORMAT,
    calendarLocale: CONFIG.I18N.DEFAULT_LANGUAGE as SupportedLocales,
  };

  if (mode === Mode.VIEW || (mode === Mode.EDIT && fieldInfo.isManuallyEditable !== true)) {
    return (
      <Box className="detailsFieldValue">
        { dateFormatter(value) }
      </Box>
    );
  } else {
    const value = get(formik,`values[${fieldInfo.fieldName as string}]`) as  (moment.Moment | undefined);
    return (
      <Box className="detailsFieldValue datePresentor">
        <DateTimePicker
          value={value === undefined ? null : value}
          onChange={
            (dateVal): void => {
              const momentVal = moment(dateVal);
              // eslint-disable-next-line
              (formik as any).setFieldValue(fieldInfo.fieldName, momentVal);
            }
          }
          // eslint-disable-next-line
          onBlur={(formik as any).handleBlur}
          required={fieldInfo.isRequired === true}
          local={local}
          autoOk
        />
        {
          !(fieldInfo.infoMsgCode?.length === 1 && fieldInfo.infoMsgCode[0].includes('required')) &&
          <FormInputInfoTooltipComponent fieldInfo={fieldInfo}/>
        }
      </Box>
    );
  }
}
