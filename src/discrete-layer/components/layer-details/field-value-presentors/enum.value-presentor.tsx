/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useContext, useState } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash';
import { MenuItem, Select, Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import TooltippedValue from '../../../../common/components/form/tooltipped.value';
import CONFIG from '../../../../common/config';
import EnumsMapContext, {DEFAULT_ENUM_DESCRIPTOR, IEnumsMapType} from '../../../../common/contexts/enumsMap.context';
import useDebounceField from '../../../../common/hooks/debounce-field.hook';
import { IDictionary } from '../../../../common/models/dictionary';
import { Mode } from '../../../../common/models/mode.enum';
import { IRecordFieldInfo } from '../layer-details.field-info';
import { EntityFormikHandlers } from '../layer-datails-form';
import { FormInputInfoTooltipComponent } from './form.input.info.tooltip';

import './enum.value-presentor.css';

interface EnumValuePresentorProps {
  options: string[];
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: string;
  formik?: EntityFormikHandlers;
  dictionary?: IDictionary;
}

export const EnumValuePresentorComponent: React.FC<EnumValuePresentorProps> = ({options, mode, fieldInfo, value, formik, dictionary}) => {
  const [innerValue] = useDebounceField(formik as EntityFormikHandlers , value ?? '');
  const [locale] = useState<string>(CONFIG.I18N.DEFAULT_LANGUAGE);
  const intl = useIntl();
  const { enumsMap } = useContext(EnumsMapContext);
  const enums = enumsMap as IEnumsMapType;

  if (formik === undefined || mode === Mode.VIEW || (mode === Mode.EDIT && fieldInfo.isManuallyEditable !== true)) {
    return (
      <TooltippedValue className="detailsFieldValue">
        {innerValue}
      </TooltippedValue>
    );
  } else {
    return (
      <>
        <Box>
          <Select
            value={innerValue}
            id={fieldInfo.fieldName as string}
            name={fieldInfo.fieldName as string}
            onChange={(e: React.FormEvent<HTMLSelectElement>): void => {
              formik.setFieldValue(fieldInfo.fieldName as string, e.currentTarget.value);
            }}
            onBlur={formik.handleBlur}
            outlined
            enhanced
            className="enumOptions"
          >
            {
              options.map(
                (item, index) => {
                  let { realValue, icon, translationKey } = enums[item] ?? DEFAULT_ENUM_DESCRIPTOR;
                  let translation: string;
                  if (dictionary !== undefined) {
                    realValue = dictionary[item].en;
                    icon = dictionary[item].icon;
                    translation = get(dictionary[item], locale);
                  } else {
                    translation = intl.formatMessage({ id: translationKey });
                  }
                  return (
                    <MenuItem key={index} value={realValue}>
                      <Typography tag="span" className={icon}></Typography>
                      {translation}
                    </MenuItem>
                  );
                }
              )
            }
          </Select>
          {
            !(fieldInfo.infoMsgCode?.length === 1 && fieldInfo.infoMsgCode[0].includes('required')) &&
            <FormInputInfoTooltipComponent fieldInfo={fieldInfo}/>
          }
        </Box>
      </>
    );
  }
};
