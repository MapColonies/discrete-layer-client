import React from 'react';
import moment, {Moment} from 'moment'; 
import { Box, DateTimePicker, SupportedLocales } from '@map-colonies/react-components';
import { Mode } from '../../../../common/models/mode.enum';
import CONFIG from '../../../../common/config';
import { dateFormatter, dateSerializer } from '../../../../common/helpers/type-formatters';
import useDebounceField, { GCHTMLInputElement } from '../../../../common/hooks/debounce-field.hook';
import { IRecordFieldInfo } from '../layer-details.field-info';
import { EntityFormikHandlers } from '../layer-datails-form';
import { FormInputInfoTooltipComponent } from './form.input.info.tooltip';

interface DateValuePresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: moment.Moment;
  formik?: EntityFormikHandlers;
}

export const DateValuePresentorComponent: React.FC<DateValuePresentorProps> = ({ mode, fieldInfo, value, formik }) => {
  const [innerValue, handleOnChange] = useDebounceField(
    formik as EntityFormikHandlers ,
    value ?? null
  );

  const local = {
    placeHolderText: CONFIG.LOCALE.DATE_FORMAT,
    calendarLocale: CONFIG.I18N.DEFAULT_LANGUAGE as SupportedLocales,
  };

  const inputValue = (): string | undefined => {
    if(innerValue === null || !moment(innerValue).isValid()){
      return undefined;
    } 
    return dateFormatter(innerValue);
  }

  const getDate = (): Date | null => {
    if(innerValue !== null){
      return new Date(dateSerializer(innerValue))
    }
    return null;
  }

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
          value={getDate()}
          inputValue={inputValue()}
          onChange={
            (dateVal, val): void => {
              const momentVal = moment(dateVal);
              handleOnChange({
                // eslint-disable-next-line
                persist: () => {},
                // @ts-ignore
                currentTarget: {
                  value: momentVal,
                  name: fieldInfo.fieldName,
                } as GCHTMLInputElement
              });
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
