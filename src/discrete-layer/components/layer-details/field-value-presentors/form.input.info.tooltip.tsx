import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Icon, Tooltip } from '@map-colonies/react-core';
import { convertExponentialToDecimal } from '../../../../common/helpers/number';
import { ValidationConfigModelType } from '../../../models';
import { IRecordFieldInfo } from '../layer-details.field-info';

const START = 0;
const EMPTY = 0;

interface FormInputInfoTooltipProps {
  fieldInfo: IRecordFieldInfo;
}

export const FormInputInfoTooltipComponent: React.FC<FormInputInfoTooltipProps> = ({ fieldInfo }) => {
  const intl = useIntl();

  const getInfoMsgParamValue = (fieldInfo: IRecordFieldInfo, msgCode: string): string => {
    let infoMsgParamValue = '';
    const infoMsgType = msgCode.substring(msgCode.lastIndexOf('.') + 1);
    const validation = fieldInfo.validation !== undefined ? fieldInfo.validation as ValidationConfigModelType[] : undefined;
    validation?.forEach((val: ValidationConfigModelType) => {
      const validationType = val.errorMsgCode?.substring(val.errorMsgCode.lastIndexOf('.') + 1) ?? '';
      if (validationType === infoMsgType) {
        // @ts-ignore
        // eslint-disable-next-line
        const validationParamValue: string = val[validationType] ?? '';
        if (validationType !== '' && validationParamValue !== '') {
          if (val.type === 'FIELD') {
            const fieldLabel = fieldInfo.label as string;
            const fieldLabelPrefix = fieldLabel.substring(START, fieldLabel.lastIndexOf('.'));
            infoMsgParamValue = intl.formatMessage({ id: `${fieldLabelPrefix}.${validationParamValue}` });
          } else {
            infoMsgParamValue = convertExponentialToDecimal(validationParamValue);
          }
          return;
        }
      }
    });
    return infoMsgParamValue;
  };

  return (
    <>
      {
        fieldInfo.infoMsgCode && 
        (fieldInfo.infoMsgCode as string[]).length > EMPTY &&
        <Tooltip content={
          <ul className="textFieldInfoList">
            {
              (fieldInfo.infoMsgCode as string[]).map((msg: string, index: number) => {
                return (
                  <li key={index}><FormattedMessage id={msg} values={{ value: `${getInfoMsgParamValue(fieldInfo, msg)}` }}/></li>
                );
              })
            }
          </ul>
        }>
          <Icon className="textFieldInfoIcon" icon={{ icon: 'info', size: 'small' }}/>
        </Tooltip>
      }
    </>
  );
}