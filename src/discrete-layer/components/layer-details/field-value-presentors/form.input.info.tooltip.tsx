import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Icon, Tooltip } from '@map-colonies/react-core';
import { convertExponentialToDecimal } from '../../../../common/helpers/number';
import { ValidationConfigModelType } from '../../../models';
import { IRecordFieldInfo } from '../layer-details.field-info';

const EMPTY = 0;

interface FormInputInfoTooltipProps {
  fieldInfo: IRecordFieldInfo;
}

export const FormInputInfoTooltipComponent: React.FC<FormInputInfoTooltipProps> = ({ fieldInfo }) => {
  const intl = useIntl();

  const getInfoMsgParamValue = (fieldInfo: IRecordFieldInfo, msgCode: string): string => {
    const infoMsgType = msgCode.substring(msgCode.lastIndexOf('.') + 1);
    const validation = fieldInfo.validation !== undefined ? fieldInfo.validation as ValidationConfigModelType[] : undefined;
    let validationType: string;
    let infoMsgParamValue = '';
    validation?.forEach((val: ValidationConfigModelType) => {
      validationType = val.errorMsgCode?.substring(val.errorMsgCode.lastIndexOf('.') + 1) ?? '';
      if (validationType === infoMsgType) {
        // @ts-ignore
        // eslint-disable-next-line
        const validationParamValue: string = val[validationType] ?? '';
        if (validationType !== '' && validationParamValue !== '') {
          if (val.type === 'FIELD') {
            infoMsgParamValue = intl.formatMessage({ id: `field-names.raster.${validationParamValue}` });
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