import { Box } from '@map-colonies/react-components';
import { MenuItem, Select, Typography } from '@map-colonies/react-core';
import { isEmpty } from 'lodash';
import React, { useCallback, useContext } from 'react';
import { useIntl } from 'react-intl';
import TooltippedValue from '../../../../common/components/form/tooltipped.value';
import lookupTablesContext from '../../../../common/contexts/lookupTables.context';
import useDebounceField from '../../../../common/hooks/debounce-field.hook';
import { Mode } from '../../../../common/models/mode.enum';
import { EntityFormikHandlers } from '../layer-datails-form';
import { IRecordFieldInfo } from '../layer-details.field-info';
import './enum.value-presentor.css';
import { FormInputInfoTooltipComponent } from './form.input.info.tooltip';

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
  const intl = useIntl();
  const { lookupTablesData } = useContext(lookupTablesContext);
  const [innerValue] = useDebounceField(formik as EntityFormikHandlers, value ?? '');
  const isDataError = fieldInfo.isRequired && !value;

  const getDisplayValue = useCallback((): string => {
    if (isEmpty(innerValue)) {
      return innerValue;
    } else {
      const filteredOptions = lookupOptions.filter(option => option.value === innerValue);
      const displayValue = filteredOptions.length ? filteredOptions[0].translationCode : value;
      return intl.formatMessage({ id: displayValue });
    }
  }, [innerValue]);

  if (!lookupTablesData || !lookupTablesData.dictionary || fieldInfo.lookupTable == null) return null;
  const lookupOptions = [
    {value: '', translationCode: 'general.empty-string'},
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
    <Box className="detailsFieldValue selectBoxContainer">
      <Select
        className="enumOptions"
        value={value}
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
