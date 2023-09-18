import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form';
import { endOfDay, endOfWeek, isDate, startOfDay, startOfMonth, startOfWeek, startOfYear, subDays, subWeeks } from 'date-fns';
import { Box, DateRangePicker, isDateRange } from '@map-colonies/react-components';
import { getDateformatType } from '../../../../../common/helpers/formatters';
import { FieldConfigModelType, FilterFieldValidationModelType } from '../../../../models';
import CatalogFilterFieldLabel from './catalog-filter-field-label.component';
import { isEmpty } from 'lodash';

interface CatalogFilterDateRangeFieldProps {
  fieldDescriptor: FieldConfigModelType;
}

export const CatalogFilterDateRangeField: React.FC<CatalogFilterDateRangeFieldProps> = ({ fieldDescriptor }) => {
  const intl = useIntl();
  const formMethods = useFormContext();
  const fieldId = fieldDescriptor.fieldName ?? '';

  const fieldValidation: FilterFieldValidationModelType = {
    ...fieldDescriptor.isFilterable.validation,
    pattern: fieldDescriptor?.isFilterable?.validation?.pattern
      ? {
          value: new RegExp(fieldDescriptor.isFilterable.validation.pattern),
          message: intl.formatMessage({id: `catalog-filter.${fieldId}.validation-error`}),
        }
      : undefined,
  };

  const shortcutsTranslations = {
    TODAY: intl.formatMessage({id: 'catalog-filter.today.date-shortcuts'}),
    START_WEEK: intl.formatMessage({id: 'catalog-filter.startWeek.date-shortcuts'}),
    LAST_WEEK: intl.formatMessage({id: 'catalog-filter.lastWeek.date-shortcuts'}),
    START_MONTH: intl.formatMessage({id: 'catalog-filter.startMonth.date-shortcuts'}),
    START_YEAR: intl.formatMessage({id: 'catalog-filter.startYear.date-shortcuts'}),
  }

  console.log(formMethods.watch())
  return (
    <Box
      className={'catalogFilterFieldContainer'}
      key={fieldId + '_fieldContainer'}
    >
      <CatalogFilterFieldLabel
        fieldName={fieldId}
        labelTranslationId={fieldDescriptor.label ?? ''}
      />

      <Controller
        control={formMethods.control}
        name={fieldId}
        defaultValue={{}}
        rules={{ ...(fieldValidation as RegisterOptions) , validate: (dateRangeValue) => {
          if(!isEmpty(dateRangeValue) && (!dateRangeValue.startDate || !dateRangeValue.endDate)) {
            return intl.formatMessage({id: "catalog-filter.dateRangeField.validation-error" });
          }
        }}}
        render={({ name, onBlur, onChange, value }) => {
          return (
            <DateRangePicker
              startDate={value.startDate || undefined}
              endDate={value.endDate || undefined}
              locale={intl.locale as any}
              wrapperClassName="catalogFilterDateRangeWrapper"
              shouldCloseOnSelect={false}
              selectsRange
              autoFocus={false}
              // dateFormat={getDateformatType(false, true)}
              dateFormat={"EEEE, dd MMMM yyyy"}
              placeholderText={intl.formatMessage({
                id: 'catalog-filter.dateRangeField.placeholder',
              })}
              maxDate={new Date()}
              inputName={name}
              withShortcuts={[
                {
                  id: '1',
                  label: shortcutsTranslations.TODAY,
                  startDate: startOfDay(new Date()),
                  endDate: new Date(),
                },
                {
                  id: '2',
                  label: shortcutsTranslations.START_WEEK,
                  startDate: startOfWeek(new Date(), { weekStartsOn: 0 }),
                  endDate: new Date(),
                },
                () => {
                  const lastWeekStart = startOfWeek(subWeeks(new Date(), 1));
                  const lastWeekEnd = endOfWeek(lastWeekStart);

                  return {
                    id: '3',
                    label: shortcutsTranslations.LAST_WEEK,
                    startDate: lastWeekStart,
                    endDate: lastWeekEnd,
                  };
                },
                {
                  id: '4',
                  label: shortcutsTranslations.START_MONTH,
                  startDate: startOfMonth(new Date()),
                  endDate: new Date(),
                },
                {
                  id: '5',
                  label: shortcutsTranslations.START_YEAR,
                  startDate: startOfYear(new Date()),
                  endDate: new Date(),
                },
              ]}
              isClearable
              showMonthYearDropdown
              onBlur={onBlur}
              onChange={(dateRangeObj) => {
                if(isDateRange(dateRangeObj)) {
                  const dateRangeVal = !dateRangeObj.startDate && !dateRangeObj.endDate ? {} : dateRangeObj;
                  onChange(dateRangeVal);
                  
                  // Revalidate range on change
                  formMethods.trigger(fieldId)
                }
              }}
            />
          );
        }}
      />

      <span className="catalogFilterFieldError">
        {formMethods.errors[fieldId]?.message ?? undefined}
      </span>
    </Box>
  );
}