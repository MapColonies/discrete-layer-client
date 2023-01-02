/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Box } from '@map-colonies/react-components';
import { MenuItem, Select } from '@map-colonies/react-core';
import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import TooltippedValue from '../../../../common/components/form/tooltipped.value';
import lookupTablesContext, { ILookupOption, LookupKey } from '../../../../common/contexts/lookupTables.context';
import { EntityFormikHandlers } from '../layer-datails-form';
import { IRecordFieldInfo } from '../layer-details.field-info';

interface LookupTablesPresentorProps {
  lookupKey: LookupKey;
  fieldInfo: IRecordFieldInfo;
  value?: string;
  formik?: EntityFormikHandlers;
}

export const LookupOptionsPresentorComponent: React.FC<LookupTablesPresentorProps> = ({ lookupKey, fieldInfo, value, formik }) => {
  const intl = useIntl(); 
  const { lookupTablesData } = useContext(lookupTablesContext);

  if (!lookupTablesData) return <></>;
  const lookupOptions = lookupTablesData[lookupKey] as ILookupOption[];

  if (!formik) {
    return (
      <TooltippedValue className="detailsFieldValue">
        {"tooltip test value"}
      </TooltippedValue>
    );
  } else {
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
}
