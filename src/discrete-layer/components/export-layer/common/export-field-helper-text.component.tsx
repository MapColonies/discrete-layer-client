import React, { useEffect, useState } from 'react';
import { ExportFieldOptions } from '../hooks/useAddFeatureWithProps';
import { isEmpty } from 'lodash';
import TooltippedValue from '../../../../common/components/form/tooltipped.value';

interface IExportFieldOptions extends ExportFieldOptions {}

interface ExportFieldHelperTextProps {
  helperText: IExportFieldOptions['helperTextValue'];
  fieldValue: string;
}

const getHelperTextValue = (
  helperTextValue?: string | ((value: unknown) => string),
  value?: string
): string | undefined => {
  if (
    typeof helperTextValue !== 'undefined' &&
    typeof helperTextValue !== 'string' &&
    !isEmpty(value?.toString())
  ) {
    return helperTextValue(value);
  }

  return !isEmpty(helperTextValue) && typeof helperTextValue === 'string'
    ? helperTextValue
    : undefined;
};

const ExportFieldHelperText: React.FC<ExportFieldHelperTextProps> = ({
  helperText,
  fieldValue,
}) => {
  const [helperValue, setHelperText] = useState<string | undefined>(
    getHelperTextValue(helperText, fieldValue)
  );

  useEffect(() => {
    setHelperText(getHelperTextValue(helperText, fieldValue));
  }, [fieldValue]);

  return (
    <>
      {typeof helperText !== 'undefined' && (
        <TooltippedValue tag="span" className="exportFieldHelper">
          {!isEmpty(helperValue) && helperValue}
        </TooltippedValue>
      )}
    </>
  );
};

export default ExportFieldHelperText;
