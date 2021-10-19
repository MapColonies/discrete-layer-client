import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../common/models/mode.enum';
import { FieldLabelComponent } from '../../../common/components/form/field-label';
import { RecordType } from '../../models';
import { StringValuePresentorComponent } from './field-value-presentors/string.value-presentors';

import './ingestion-fields.css';

interface IngestionFieldsProps {
  recordType?: RecordType;
  directory: string;
  fileNames: string;
  formik?: unknown;
}

export const IngestionFields: React.FC<IngestionFieldsProps> = (props: IngestionFieldsProps) => {
  const { recordType, directory, fileNames, formik } = props;

  return (
    <Box className="ingestionFields">
      <Box className="categoryField">
        <FieldLabelComponent value='field-names.ingestion.directory' isRequired={true} customClassName='directorySpacer'/>
        <StringValuePresentorComponent 
          mode={Mode.NEW} 
          // @ts-ignore
          fieldInfo={{
            fieldName: 'directory',
            isRequired: true
          }} 
          value={directory} 
          formik={formik}>
        </StringValuePresentorComponent>
        <FieldLabelComponent value={recordType === RecordType.RECORD_3D ? 'field-names.3d.fileNames' : 'field-names.raster.fileNames'} isRequired={true} customClassName='fileNamesSpacer'/>
        <StringValuePresentorComponent 
          mode={Mode.NEW} 
          // @ts-ignore
          fieldInfo={{
            fieldName: 'fileNames',
            isRequired: true
          }}
          value={fileNames} 
          formik={formik}>
        </StringValuePresentorComponent>
      </Box>
    </Box>
  );
};
