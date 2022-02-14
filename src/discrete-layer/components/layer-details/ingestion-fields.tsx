/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, TextField } from '@map-colonies/react-core';
import { Box, FileData } from '@map-colonies/react-components';
import { Selection } from '../../../common/components/file-picker';
import { FieldLabelComponent } from '../../../common/components/form/field-label';
import { LayerMetadataMixedUnion, RecordType } from '../../models';
import { FilePickerDialogComponent } from '../dialogs/file-picker-dialog';
import { IRecordFieldInfo } from './layer-details.field-info';

import './ingestion-fields.css';

interface IngestionFieldsProps {
  recordType: RecordType;
  fields: IRecordFieldInfo[];
  values: string[];
  onMetadataSelection: (selectedMetadata: LayerMetadataMixedUnion) => void;
  formik?: unknown;
}

const IngestionInputs: React.FC<{fields: IRecordFieldInfo[], values: string[], formik: unknown}> = ({fields, values, formik }) =>  {
  const [inputVal, setInputVal] = useState([...values]);

  useEffect(() => {
    setInputVal([...values]);
  }, [values]);

  const handleInputChange= (e: React.FormEvent<HTMLInputElement>, idx: number): void => {
    // eslint-disable-next-line
    (formik as any).handleChange(e);

    setInputVal((prevValues) => {
      const newValues = [...prevValues];
      newValues[idx] = e.currentTarget.value;
      return newValues;
    });
  };

  return ( 
    <>
      {
        fields.map((field: IRecordFieldInfo, index: number) => {
          return (
            <Box className="ingestionField" key={field.fieldName}>
              <FieldLabelComponent value={field.label} isRequired={true} customClassName={ `${field.fieldName as string}Spacer` }/>
              <TextField 
                type="text"
                value={inputVal[index]}
                // @ts-ignore
                id={field.fieldName as string}
                name={field.fieldName as string}
                // eslint-disable-next-line
                onChange={(evt) => { handleInputChange(evt, index) }}
                disabled
              />
            </Box>
          )
        })
      } 
    </>
  );
};

export const IngestionFields: React.FC<IngestionFieldsProps> = ({ recordType, fields, values, onMetadataSelection, formik }) => {

  const [ isFilePickerDialogOpen, setFilePickerDialogOpen ] = useState<boolean>(false);
  const [ selection, setSelection ] = useState<string[]>(values);

  const onFilesSelection = (selected: Selection): void => {
    setSelection([
      selected.folderChain.map((folder: FileData) => folder.name).join('/'),
      selected.files.map((file: FileData) => file.name).join(',')
    ]);
    onMetadataSelection(selected.metadata as LayerMetadataMixedUnion);
  };
  
  return (
    <Box className="ingestionFields">
      <IngestionInputs 
        fields = {fields}
        values = {selection}
        formik = {formik}
      />
      <Button type="button" onClick={(): void => { setFilePickerDialogOpen(true); }}>
        <FormattedMessage id="general.choose-btn.text"/>
      </Button>
      <FilePickerDialogComponent
        recordType={recordType}
        isOpen={isFilePickerDialogOpen}
        onSetOpen={setFilePickerDialogOpen}
        onFilesSelection={onFilesSelection}
      />
    </Box>
  );
};
