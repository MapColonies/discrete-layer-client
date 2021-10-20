import React from 'react';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../common/models/mode.enum';
import { FieldLabelComponent } from '../../../common/components/form/field-label';
import { StringValuePresentorComponent } from './field-value-presentors/string.value-presentors';

import './ingestion-fields.css';

interface IFieldInfo {
  fieldName: string;
  label: string;
  value: string;
}

interface IngestionFieldsProps {
  fields: IFieldInfo[];
  formik?: unknown;
}

export const IngestionFields: React.FC<IngestionFieldsProps> = ({ fields, formik }) => {
  return (
    <Box className="ingestionFields">
      <Box className="categoryField">
        {
          fields.map(field => {
            return (
              <>
                <FieldLabelComponent value={field.label} isRequired={true} customClassName={ `${field.fieldName}Spacer` }/>
                <StringValuePresentorComponent 
                  mode={Mode.NEW} 
                  // @ts-ignore
                  fieldInfo={{
                    fieldName: field.fieldName,
                    isRequired: true
                  }} 
                  value={field.value} 
                  formik={formik}>
                </StringValuePresentorComponent>
              </>
            );
          })
        }
      </Box>
    </Box>
  );
};
