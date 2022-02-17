/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { FormikValues } from 'formik';
import { Button } from '@map-colonies/react-core';
import { Box, FileData } from '@map-colonies/react-components';
import { FieldLabelComponent } from '../../../common/components/form/field-label';
import { Mode } from '../../../common/models/mode.enum';
import { MetadataFile } from '../../../common/components/file-picker';
import { RecordType } from '../../models';
import { FilePickerDialogComponent } from '../dialogs/file-picker-dialog';
import { IRecordFieldInfo } from './layer-details.field-info';
import { EntityFormikHandlers, FormValues } from './layer-datails-form';
import { StringValuePresentorComponent } from './field-value-presentors/string.value-presentor';

import './ingestion-fields.css';
import './entity-dialog.css';

interface IngestionFieldsProps {
  fields: IRecordFieldInfo[];
  recordType: RecordType;
  formik?: EntityFormikHandlers;
  reloadFormMetadata?: (
    injestionFields: FormValues,
    metadata: MetadataFile
  ) => void;
  values: FormikValues;
}

export const IngestionFields: React.FC<IngestionFieldsProps> = ({
  formik,
  fields,
  recordType,
  reloadFormMetadata,
  values,
}) => {
  const [isFilePickerDialogOpen, setFilePickerDialogOpen] = useState<boolean>(
    false
  );

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
            <StringValuePresentorComponent
              mode={Mode.NEW}
              fieldInfo={field}
              // @ts-ignore
              value={formik?.getFieldProps(field.fieldName).value as string}
              formik={formik}
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
          if (reloadFormMetadata) {
            reloadFormMetadata(
              {
                ...values,
                fileNames: selected.files
                  .map((file: FileData) => file.name)
                  .join(','),
                directory: selected.folderChain
                  .map((folder: FileData) => folder.name)
                  .join('/'),
              },
              selected.metadata as MetadataFile
            );
          }
        }}
      />
    </Box>
  );
};
