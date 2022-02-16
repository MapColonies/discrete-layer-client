import React from 'react';
import moment from 'moment';
import { get } from 'lodash';
import { Box, DateTimePicker, SupportedLocales } from '@map-colonies/react-components';
import { Mode } from '../../../../common/models/mode.enum';
import CONFIG from '../../../../common/config';
import { dateFormatter } from '../../../../common/helpers/type-formatters';
import { IRecordFieldInfo } from '../layer-details.field-info';
import { FormInputInfoTooltipComponent } from './form.input.info.tooltip';
import { EntityFormikHandlers } from '../layer-datails-form';
import useDebounceField, { GCHTMLInputElement } from '../../../../common/hooks/debounce-field.hook';

interface DateValuePresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: moment.Moment;
  formik?: EntityFormikHandlers;
}

export const DateValuePresentorComponent: React.FC<DateValuePresentorProps> = ({ mode, fieldInfo, value, formik }) => {

  const [innerValue, handleOnChange] = useDebounceField(formik as EntityFormikHandlers , value ?? null );

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
    return (
      <Box className="detailsFieldValue datePresentor">
        <DateTimePicker
          value={innerValue}
          onChange={
            (dateVal): void => {
              const momentVal = moment(dateVal);
              handleOnChange({
                // eslint-disable-next-line
                persist: () => {},
                // @ts-ignore
                currentTarget: {
                  value: momentVal
                } as GCHTMLInputElement
              })
            }
          
          }
          onBlur={formik?.handleBlur}
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
