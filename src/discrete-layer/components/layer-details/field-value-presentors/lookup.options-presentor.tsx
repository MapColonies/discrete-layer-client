import { Box } from '@map-colonies/react-components';
import { MenuItem, Select } from '@map-colonies/react-core';
import { get, isEmpty } from 'lodash';
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

interface LookupTablesPresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: string;
  formik?: EntityFormikHandlers;
  dictionary?: IDictionary;
}

export const LookupOptionsPresentorComponent: React.FC<LookupTablesPresentorProps> = ({ mode, fieldInfo, value, formik, dictionary }) => {
  const intl = useIntl();
  const { lookupTablesData } = useContext(lookupTablesContext);
  const [locale] = useState<string>(CONFIG.I18N.DEFAULT_LANGUAGE);
  const [innerValue] = useDebounceField(formik as EntityFormikHandlers, value ?? '');

  const getDisplayValue = useCallback((): string => {
    if (isEmpty(innerValue)) {
      return innerValue;
    } else if (Array.isArray(innerValue)) {
      return innerValue.join(',');
    } else if (dictionary !== undefined) {
      return get(dictionary[innerValue], locale) as string;
    } else {
      return intl.formatMessage({ id: lookupOptions[0].translationCode });
    }
  }, [innerValue]);

  if (!lookupTablesData || !lookupTablesData.dictionary) return null;
  const lookupOptions = lookupTablesData.dictionary[fieldInfo.lookupKey as string];

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
          lookupOptions.map(({ translationCode, value }) => {
            const translation = intl.formatMessage({ id: translationCode });

            return (
              <MenuItem key={translationCode} value={value}>
                {translation}
              </MenuItem>
            );
          })
        }
      </Select>
    </Box>
  );
}
