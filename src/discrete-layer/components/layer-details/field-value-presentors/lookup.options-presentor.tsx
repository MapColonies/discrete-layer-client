import { Box } from '@map-colonies/react-components';
import { MenuItem, Select, Typography } from '@map-colonies/react-core';
import { isEmpty } from 'lodash';
import React, { useCallback, useContext, useState } from 'react';
import { useIntl } from 'react-intl';
import TooltippedValue from '../../../../common/components/form/tooltipped.value';
import CONFIG from '../../../../common/config';
import lookupTablesContext from '../../../../common/contexts/lookupTables.context';
import useDebounceField from '../../../../common/hooks/debounce-field.hook';
import { IDictionary } from '../../../../common/models/dictionary';
import { Mode } from '../../../../common/models/mode.enum';
import { EntityFormikHandlers } from '../layer-datails-form';
import { IRecordFieldInfo } from '../layer-details.field-info';
import { FormInputInfoTooltipComponent } from './form.input.info.tooltip';

interface LookupTablesPresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: string;
  formik?: EntityFormikHandlers;
}

export const LookupOptionsPresentorComponent: React.FC<LookupTablesPresentorProps> = (props) => {
  const { mode, fieldInfo, value, formik } = props;
  const intl = useIntl();
  const { lookupTablesData } = useContext(lookupTablesContext);
  const [innerValue] = useDebounceField(formik as EntityFormikHandlers, value ?? '');

  const getDisplayValue = useCallback((): string => {
    if (isEmpty(innerValue)) {
      return innerValue;
    } else if (Array.isArray(innerValue)) {
      return innerValue.join(',');
    } else {
      const filteredOptions = lookupOptions.filter(option => option.value === innerValue);
      const displayValue = filteredOptions.length ? filteredOptions[0].translationCode : value;
      return intl.formatMessage({ id: displayValue });
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
    <Box className="detailsFieldValue selectBoxContainer">
      <Select
        value={value}
        id={fieldInfo.fieldName as string}
        name={fieldInfo.fieldName as string}
        onChange={(e: React.FormEvent<HTMLSelectElement>): void => {
          formik.setFieldValue(fieldInfo.fieldName as string, e.currentTarget.value);
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
