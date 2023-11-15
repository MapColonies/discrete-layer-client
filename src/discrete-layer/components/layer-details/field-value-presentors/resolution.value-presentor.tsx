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
import './resolution.value-presentor.css';

interface ResolutionValuePresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: string;
  formik?: EntityFormikHandlers;
}
  
export const ResolutionValuePresentorComponent: React.FC<ResolutionValuePresentorProps> = (props) => {
  const { mode, fieldInfo, formik } = props;
  const value = props.value?.toString();
  const intl = useIntl();
  const { lookupTablesData } = useContext(lookupTablesContext);
  const [innerValue] = useDebounceField(formik as EntityFormikHandlers, value ?? '');
  const MAX_PADDING_LENGTH = 17;
  const MAX_VALUE_LENGTH = 10;

  const getDisplayValue = useCallback((): string => {
    if (isEmpty(innerValue)) {
      return innerValue;
    } else {
      if(fieldInfo.lookupTableBinding){
        // const filteredOptions = lookupOptions.filter(option => option.properties[fieldInfo.lookupTableBinding.valueFromPropertyName] === innerValue);
        return innerValue;

      } else {
        const filteredOptions = lookupOptions.filter(option => option.value === innerValue);
        const displayValue = filteredOptions.length ? filteredOptions[0].translationCode : value;
        return intl.formatMessage({ id: displayValue });
      }
    }
  }, [innerValue]);

  if (!lookupTablesData || !lookupTablesData.dictionary || fieldInfo.lookupTable == null) return null;
  const lookupOptions = lookupTablesData.dictionary[fieldInfo.lookupTable];
  
  if (formik === undefined || mode === Mode.VIEW || (mode === Mode.EDIT && fieldInfo.isManuallyEditable !== true)) {
    return (
      <TooltippedValue className="detailsFieldValue">
        {getDisplayValue()}
      </TooltippedValue>
    );
  }
  
  return (
    <Box className="detailsFieldValue selectBoxContainer resolutionBoxContainer">
      <Select
        className="enumOptions"
        value={value}
        id={fieldInfo.fieldName as string}
        name={fieldInfo.fieldName as string}
        onChange={(e: React.FormEvent<HTMLSelectElement>): void => {
          formik.setFieldValue(fieldInfo.fieldName as string, Number(e.currentTarget.value));
          
          const filteredOptions = lookupOptions.filter(option => option.properties[fieldInfo.lookupTableBinding.valueFromPropertyName] === Number(e.currentTarget.value));
          formik.setFieldValue(fieldInfo.dependentField.name as string, filteredOptions[0].properties[fieldInfo.dependentField.valueFromPropertyName]);
        }}
        onBlur={formik.handleBlur}
        outlined
        enhanced>
        {
          lookupOptions.map(({ translationCode, value, properties }, index) => {
            const E_POWER = 'e-';
            const substrStart = 0;
            let numberOfDecimals = 8;

            const [, ePower] = (properties[fieldInfo.lookupTableBinding.valueFromPropertyName] + '').split(E_POWER);
            if(ePower){
              numberOfDecimals = 5;
            }
            const [integers, decimals] = (properties[fieldInfo.lookupTableBinding.valueFromPropertyName] + '').split('.');
            const resString = `${integers}.${decimals.substring(substrStart, numberOfDecimals)}${ePower ? E_POWER + ePower :''}`;
            const zoomLevel = Number.parseFloat(value);
            const menuItemText = `${(zoomLevel + '').padEnd(MAX_PADDING_LENGTH + (MAX_VALUE_LENGTH - resString.length)*2,' ')}${resString}`;
            

            return (
              <MenuItem key={index} value={properties[fieldInfo.lookupTableBinding.valueFromPropertyName] as number}>
                <bdi>{menuItemText}</bdi>
              </MenuItem>
            );
          })
        }
      </Select>
    </Box>
  );
}
