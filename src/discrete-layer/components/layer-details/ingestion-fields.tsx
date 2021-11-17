/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useMemo } from 'react';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../common/models/mode.enum';
import { FieldLabelComponent } from '../../../common/components/form/field-label';
import { StringValuePresentorComponent } from './field-value-presentors/string.value-presentors';
import { IRecordFieldInfo } from './layer-details.field-info';

import './ingestion-fields.css';

interface IngestionFieldsProps {
  fields: IRecordFieldInfo[];
  values: string[];
  formik?: unknown;
}

const MemoizedIngestionInputs = (fields: IRecordFieldInfo[], values: string[], formik: unknown) => (useMemo((): JSX.Element[] => {
  return fields.map((field: IRecordFieldInfo, index: number) => {
    return (
      <Box className="ingestionField" key={field.fieldName}>
        <FieldLabelComponent value={field.label} isRequired={true} customClassName={ `${field.fieldName as string}Spacer` }/>
        <StringValuePresentorComponent 
          mode={Mode.NEW} 
          // @ts-ignore
          fieldInfo={{ ...field }} 
          value={values[index]} 
          formik={formik}>
        </StringValuePresentorComponent>
      </Box>
    );
  });
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []));

export const IngestionFields: React.FC<IngestionFieldsProps> = ({ fields, values, formik }) => {
  return (
    <Box className="ingestionFields">
    {
      MemoizedIngestionInputs(fields, values, formik)
    }
    </Box>
  );
};
