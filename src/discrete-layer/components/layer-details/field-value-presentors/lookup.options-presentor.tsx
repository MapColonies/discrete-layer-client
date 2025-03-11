import { Box } from '@map-colonies/react-components';
import { MenuItem, Select, Typography } from '@map-colonies/react-core';
import { isEmpty } from 'lodash';
import React, { useCallback, useContext } from 'react';
import { useIntl } from 'react-intl';
import TooltippedValue from '../../../../common/components/form/tooltipped.value';
import lookupTablesContext, { ILookupOption } from '../../../../common/contexts/lookupTables.context';
import useDebounceField from '../../../../common/hooks/debounce-field.hook';
import { Mode } from '../../../../common/models/mode.enum';
import { EntityFormikHandlers } from '../layer-datails-form';
import { IRecordFieldInfo } from '../layer-details.field-info';
import './enum.value-presentor.css';
import { FormInputInfoTooltipComponent } from './form.input.info.tooltip';
import CONFIG from '../../../../common/config';
import { MultiSelection } from '../../../../common/components/multi-selection/index';

interface LookupTablesPresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: string;
  formik?: EntityFormikHandlers;
  fieldNamePrefix?: string;
}

export const LookupOptionsPresentorComponent: React.FC<LookupTablesPresentorProps> = (props) => {
  const { mode, fieldInfo, value, formik, fieldNamePrefix } = props;
  const fieldName = `${fieldNamePrefix ?? ''}${fieldInfo.fieldName}`;
  const lang = CONFIG.I18N.DEFAULT_LANGUAGE;
  const intl = useIntl();
  const { lookupTablesData } = useContext(lookupTablesContext);
  const [innerValue] = useDebounceField(formik as EntityFormikHandlers, value ?? '');
  const isDataError = fieldInfo.isRequired && !value;
 
  const getDisplayValue = useCallback((): string => {
    if (isEmpty(innerValue)) {
      return typeof innerValue === 'string' ? innerValue : (innerValue as string[]).toString();
    } else {
      const filteredOptions = lookupOptions.filter(option => option.value === innerValue);
      const displayValue = Object.keys(lookupOptions).includes('translation') ?
        filteredOptions.length ? (filteredOptions[0] as ILookupOption).translation?.find((trns) => trns.locale === lang)?.text : value
        :
        filteredOptions.length ? (filteredOptions[0] as ILookupOption).translationCode : value;

      // @ts-ignore
      return intl.formatMessage({ id: typeof displayValue === 'string' || 'undefined' ? (displayValue as string | undefined) : (displayValue as string[]).toString() });
    }
  }, [innerValue]);

  if (!lookupTablesData || !lookupTablesData.dictionary || fieldInfo.lookupTable == null) return null;

  const lookupOptions =
    !fieldInfo.isMultiSelection ?
      [
        { value: '', translationCode: 'general.empty-string' },
        ...lookupTablesData.dictionary[fieldInfo.lookupTable]
      ] :
      [
        ...lookupTablesData.dictionary[fieldInfo.lookupTable]

      ];

  if (formik === undefined || mode === Mode.VIEW || (mode === Mode.EDIT && fieldInfo.isManuallyEditable !== true)) {
    return (
      <TooltippedValue className={`detailsFieldValue  ${isDataError ? 'detailFieldDataError' : ''}`}>
        {getDisplayValue()}
      </TooltippedValue>
    );
  }

  return (
    fieldInfo.isMultiSelection ?
      <MultiSelection
        mode={mode}
        fieldInfo={fieldInfo}
        lookupOptions={lookupOptions}
        value={value}
        formik={formik}
        fieldName={fieldName}
      /> :
      <Box className="detailsFieldValue selectBoxContainer">
        <Select
          className="enumOptions"
          value={value as string}
          id={fieldName}
          name={fieldName}
          onChange={(e: React.FormEvent<HTMLSelectElement>): void => {
            formik.setFieldValue(fieldName, e.currentTarget.value);
          }}
          onBlur={formik.handleBlur}
          outlined
          enhanced>
          {
            lookupOptions.map(({ translationCode, value }, index) => {
              const translation = intl.formatMessage({ id: translationCode });

              return (
                <MenuItem key={index} value={value}>
                  <Typography tag="span"></Typography>
                  {translation}
                </MenuItem>
              );
            })
          }
        </Select>
        {
          !(fieldInfo.infoMsgCode?.length === 1 && fieldInfo.infoMsgCode[0].includes('required')) &&
          <FormInputInfoTooltipComponent fieldInfo={fieldInfo} />
        }
      </Box>
  );
}
