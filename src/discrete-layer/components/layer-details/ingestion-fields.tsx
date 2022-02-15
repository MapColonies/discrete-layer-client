/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, TextField } from '@map-colonies/react-core';
import { Box, FileData } from '@map-colonies/react-components';
import { FieldLabelComponent } from '../../../common/components/form/field-label';
import { RecordType } from '../../models';
import { FilePickerDialogComponent } from '../dialogs/file-picker-dialog';
import { IRecordFieldInfo } from './layer-details.field-info';
import { FormValues } from './layer-datails-form';

import './ingestion-fields.css';


interface IngestionFieldsProps {
  fields: IRecordFieldInfo[];
  values: FormValues;
  handleChange: (e: React.ChangeEvent<any>) => void;
  recordType: RecordType;
  // onMetadataSelection: (selectedMetadata: LayerMetadataMixedUnion) => void;
  setValues: (
    values: React.SetStateAction<FormValues>,
    shouldValidate?: boolean | undefined
  ) => void;
}
export const IngestionFields: React.FC<IngestionFieldsProps> = ({
  values,
  handleChange,
  fields,
  recordType,
  setValues,
}) => {
  const [isFilePickerDialogOpen, setFilePickerDialogOpen] = useState<boolean>( false);

  return (
    <Box className="ingestionFields">
      {fields.map((field: IRecordFieldInfo, index: number) => {
        return (
          <Box className="ingestionField" key={field.fieldName}>
            <FieldLabelComponent
              value={field.label}
              isRequired={true}
              customClassName={`${field.fieldName as string}Spacer`}
            />
            <TextField
              type="text"
              // @ts-ignore
              value={values[field.fieldName] as string}
              id={field.fieldName as string}
              name={field.fieldName as string}
              onChange={handleChange}
            />
          </Box>
        );
      })}

      <Button
        type="button"
        onClick={(): void => {
          setFilePickerDialogOpen(true);
        }}
      >
        <FormattedMessage id="general.choose-btn.text" />
      </Button>
      <FilePickerDialogComponent
        recordType={recordType}
        isOpen={isFilePickerDialogOpen}
        onSetOpen={setFilePickerDialogOpen}
        onFilesSelection={(selected): void => {
          setValues({
            fileNames: selected.files
              .map((file: FileData) => file.name)
              .join(','),
            directory: selected.folderChain
              .map((folder: FileData) => folder.name)
              .join('/'),
          });
        }}
      />
    </Box>
  );
};
