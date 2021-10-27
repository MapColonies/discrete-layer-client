import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Icon, Tooltip } from '@map-colonies/react-core';
import { ValidationConfigModelType } from '../../../models';
import { IRecordFieldInfo } from '../layer-details.field-info';

const EMPTY = 0;

interface FormInputInfoTooltipProps {
  fieldInfo: IRecordFieldInfo;
}

export const FormInputInfoTooltipComponent: React.FC<FormInputInfoTooltipProps> = ({ fieldInfo }) => {
  const intl = useIntl();
  const validation = fieldInfo.validation !== undefined ? fieldInfo.validation as ValidationConfigModelType[] : undefined;
  let paramType: string;
  let param: string;
  validation?.forEach((val: ValidationConfigModelType) => {
    if (val.type === 'FIELD') {
      paramType = val.errorMsgCode?.substring(val.errorMsgCode.lastIndexOf('.') + 1) as string;
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      param = (paramType && val[paramType] !== null) ? intl.formatMessage({ id: `field-names.raster.${val[paramType]}` }) : '';
      return;
    }
  });

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
                  <li key={index}><FormattedMessage id={msg} values={{ fieldToCompare: `${param}` }}/></li>
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