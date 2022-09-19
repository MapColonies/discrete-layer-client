/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { useIntl } from 'react-intl';
import { Select } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import TooltippedValue from '../../../../common/components/form/tooltipped.value';
import useDebounceField from '../../../../common/hooks/debounce-field.hook';
import { Mode } from '../../../../common/models/mode.enum';
import { IRecordFieldInfo } from '../layer-details.field-info';
import { EntityFormikHandlers } from '../layer-datails-form';
import { FormInputInfoTooltipComponent } from './form.input.info.tooltip';

interface EnumValuePresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: string;
  formik?: EntityFormikHandlers;
}

export const EnumValuePresentorComponent: React.FC<EnumValuePresentorProps> = ({mode, fieldInfo, value, formik}) => {
  const intl = useIntl();
  const [innerValue, handleOnChange] = useDebounceField(formik as EntityFormikHandlers , value ?? '');

  if (formik === undefined || mode === Mode.VIEW || (mode === Mode.EDIT && fieldInfo.isManuallyEditable !== true)) {
    return (
      <TooltippedValue className="detailsFieldValue">
        {innerValue}
      </TooltippedValue>
    );
  } else {
    return (
      <>
        <Box className="detailsFieldValue">
          <Select
            value={innerValue}
            // @ts-ignore
            id={fieldInfo.fieldName as string}
            name={fieldInfo.fieldName as string}
            label={intl.formatMessage({ id: 'general.choose-btn.text'})}
            onChange={(evt: React.FormEvent<HTMLSelectElement>): void => console.log(evt.currentTarget.value)}
            options={[
              intl.formatMessage({ id: 'general.choose-btn.text'}),
              'PUBLISH',
              'UNPUBLISH'
            ]}
            // // eslint-disable-next-line
            // onChange={handleOnChange}
            // // eslint-disable-next-line
            // onBlur={formik?.handleBlur}
            // disabled={mode === Mode.UPDATE && ((fieldInfo.updateRules as UpdateRulesModelType | undefined | null)?.freeze) as boolean}
            // placeholder="xxx"
            // required={fieldInfo.isRequired === true}
          />
          {
            !(fieldInfo.infoMsgCode?.length === 1 && fieldInfo.infoMsgCode[0].includes('required')) &&
            <FormInputInfoTooltipComponent fieldInfo={fieldInfo}/>
          }
        </Box>
      </>
    );
  }
};
