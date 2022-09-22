/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { MenuItem, Select, Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import TooltippedValue from '../../../../common/components/form/tooltipped.value';
import useDebounceField from '../../../../common/hooks/debounce-field.hook';
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
}

export const EnumValuePresentorComponent: React.FC<EnumValuePresentorProps> = ({options, mode, fieldInfo, value, formik}) => {
  const [innerValue] = useDebounceField(formik as EntityFormikHandlers , value ?? '');

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
            // options={options}
            outlined
            enhanced
            className="enumOptions"
          >
            {
              options.map(
                (item, index) => {
                  return (
                    <MenuItem key={index} value={item}>
                      <Typography tag="span" className="mc-icon-Map-Orthophoto"></Typography>
                      {item}
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
