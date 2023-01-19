import React, { useMemo } from 'react';
import moment from 'moment'; 
import { Box, DateTimePicker, SupportedLocales } from '@map-colonies/react-components';
import { Mode } from '../../../../common/models/mode.enum';
import CONFIG from '../../../../common/config';
import useDebounceField, { GCHTMLInputElement } from '../../../../common/hooks/debounce-field.hook';
import { dateFormatter, dateSerializer, getDateformatType } from '../../../../common/helpers/formatters';
import TooltippedValue from '../../../../common/components/form/tooltipped.value';
import { DateGranularityType } from '../../../models';
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
    formik as EntityFormikHandlers,
    value ?? null
  );

  const shouldShowTime = useMemo(() => fieldInfo.dateGranularity === DateGranularityType.DATE_AND_TIME, [fieldInfo]);
  const dateFnsFormat = useMemo(() => shouldShowTime ? 'dd/LL/yyyy HH:mm' : 'dd/LL/yyyy', [shouldShowTime]);

  const local = useMemo(() => ({
    placeHolderText: shouldShowTime ? CONFIG.LOCALE.DATE_TIME_FORMAT : CONFIG.LOCALE.DATE_FORMAT,
    calendarLocale: CONFIG.I18N.DEFAULT_LANGUAGE as SupportedLocales,
  }), [shouldShowTime]);
  
  const inputValue = (): string | undefined => {
    if (innerValue === null || !moment(innerValue).isValid()) {
      return undefined;
    } 
    return dateFormatter(innerValue, shouldShowTime);
  };
  

  const getDate = (): Date | null => {
    if (innerValue !== null) {
      return new Date(dateSerializer(innerValue))
    }
    return null;
  };

  const isReadOnlyMode = mode === Mode.VIEW || (mode === Mode.EDIT && fieldInfo.isManuallyEditable !== true) || mode === Mode.EXPORT;

  if (isReadOnlyMode) {
    return (
      <TooltippedValue className="detailsFieldValue">
        {dateFormatter(value, shouldShowTime)}
      </TooltippedValue>
    );
  } else {
    return (
      <Box className="detailsFieldValue datePresentor">
        <DateTimePicker
          name={fieldInfo.fieldName}
          showTime={shouldShowTime}
          value={getDate()}
          inputValue={inputValue()}
          allowKeyboardControl={false}
          format={dateFnsFormat}
          onChange={
            (dateVal, val): void => {
              const momentVal = moment(dateVal, getDateformatType(shouldShowTime));
              handleOnChange({
                /* eslint-disable */
                persist: () => {},
                // @ts-ignore
                currentTarget: {
                  value: momentVal,
                  name: fieldInfo.fieldName,
                } as GCHTMLInputElement
                /* eslint-enable */
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
