/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../common/models/mode.enum';
import { FieldLabelComponent } from '../../../common/components/form/field-label';
import { FilePickerDialogComponent } from '../dialogs/file-picker-dialog';
import { StringValuePresentorComponent } from './field-value-presentors/string.value-presentor';
import { IRecordFieldInfo } from './layer-details.field-info';

import './ingestion-fields.css';
import { RecordType } from '../../models';

interface IngestionFieldsProps {
  fields: IRecordFieldInfo[];
  recordType: RecordType;
  values: string[];
  formik?: unknown;
}

const MemoizedIngestionInputs = (fields: IRecordFieldInfo[], values: string[], formik: unknown): JSX.Element[] => (useMemo((): JSX.Element[] => {
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

export const IngestionFields: React.FC<IngestionFieldsProps> = ({ fields, values, recordType, formik }) => {

  const [isFilePickerDialogOpen, setFilePickerDialogOpen] = useState<boolean>(false);
  
  return (
    <Box className="ingestionFields">
      {MemoizedIngestionInputs(fields, values, formik)}
      <Button type="button" onClick={(): void => { setFilePickerDialogOpen(true); }}>
        <FormattedMessage id="general.choose-btn.text"/>
      </Button>
      {
        <FilePickerDialogComponent
          recordType={recordType}
          isOpen={isFilePickerDialogOpen}
          onSetOpen={setFilePickerDialogOpen}
        />
      }
    </Box>
  );
};
