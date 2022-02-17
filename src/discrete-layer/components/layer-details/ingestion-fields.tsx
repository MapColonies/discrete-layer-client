/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Icon, TextField, Tooltip, Typography } from '@map-colonies/react-core';
import { Box, defaultFormatters, FileData } from '@map-colonies/react-components';
import { Selection } from '../../../common/components/file-picker';
import { FieldLabelComponent } from '../../../common/components/form/field-label';
import { LayerMetadataMixedUnion, RecordType } from '../../models';
import { FilePickerDialogComponent } from '../dialogs/file-picker-dialog';
import { IRecordFieldInfo } from './layer-details.field-info';

import './ingestion-fields.css';

const FIRST = 0;
const DIRECTORY = 0;
const FILES = 1;
const NUM_OF_ROWS = 3;

interface IngestionFieldsProps {
  recordType: RecordType;
  fields: IRecordFieldInfo[];
  values: string[];
  onMetadataSelection: (selectedMetadata: LayerMetadataMixedUnion) => void;
  formik?: unknown;
}

const FileItem: React.FC<{file: FileData}> = ({file}) => {
  return (
    <>
      <Box><Icon className="fileIcon mc-icon-Map-Vector" /></Box>
      <Box>{file.name}</Box>
      <Box className="dateField">{defaultFormatters.formatFileSize(file)}</Box>
    </>
  );
};

const MoreItem: React.FC<{files: FileData[]}> = ({files}) => {
  return (
    <>
      <Box className="fileIconSpacer"></Box>
      <Tooltip content={
        <Box className="filesList moreTooltip">
          {
            files.map((f: FileData, i: number) => {
              if (i >= NUM_OF_ROWS - 1) {
                return <FileItem key={f.id} file={f} />;
              }
            })
          }
        </Box>
      }>
        <Box className="moreButton"><FormattedMessage id="general.more.text" /></Box>
      </Tooltip>
    </>
  );
};

const IngestionInputs: React.FC<{recordType: RecordType, fields: IRecordFieldInfo[], values: string[], selection: Selection, formik: unknown}> =
  (
    {recordType, fields, values, selection, formik }
  ) =>  {
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
              <Box className="detailsFieldValue">
                {
                  inputVal[index] === '' &&
                  <Typography tag="span" className="disabledText">{'<'}<FormattedMessage id="general.empty.text" />{'>'}</Typography>
                }
                {
                  index === DIRECTORY &&
                  inputVal[index] !== '' &&
                  <Box>{inputVal[index]}</Box>
                }
                {
                  index === FILES &&
                  inputVal[index] !== '' &&
                  <Box className="filesList">
                    {
                      selection.files.map((file: FileData, idx: number): JSX.Element | undefined => {
                        if ((recordType === RecordType.RECORD_3D && idx === FIRST) ||
                          (recordType !== RecordType.RECORD_3D && (idx < NUM_OF_ROWS - 1 || (selection.files.length === NUM_OF_ROWS && idx === NUM_OF_ROWS - 1)))) {
                          return <FileItem key={file.id} file={file} />;
                        }
                        if (recordType !== RecordType.RECORD_3D && selection.files.length > NUM_OF_ROWS && idx === NUM_OF_ROWS - 1) {
                          return <MoreItem key={file.id} files={selection.files} />;
                        }
                      })
                    }
                  </Box>
                }
              </Box>
              <Box className="hiddenField">
                <TextField 
                  type="text"
                  value={inputVal[index]}
                  // @ts-ignore
                  id={field.fieldName as string}
                  name={field.fieldName as string}
                  onChange={(evt: React.FormEvent<HTMLInputElement>): void => handleInputChange(evt, index) }
                />
              </Box>
            </Box>
          )
        })
      } 
    </>
  );
};

export const IngestionFields: React.FC<IngestionFieldsProps> = ({ recordType, fields, values, onMetadataSelection, formik }) => {

  const [ isFilePickerDialogOpen, setFilePickerDialogOpen ] = useState<boolean>(false);
  const [ inputValues, setInputValues ] = useState<string[]>(values);
  const [ selection, setSelection ] = useState<Selection>({ files: [], folderChain: [] });

  const onFilesSelection = (selected: Selection): void => {
    setInputValues([
      selected.folderChain.map((folder: FileData) => folder.name).join('/'),
      selected.files.map((file: FileData) => file.name).join(',')
    ]);
    setSelection({ ...selected });
    onMetadataSelection(selected.metadata as LayerMetadataMixedUnion);
  };
  
  return (
    <>
      <Box className="header">
        <Box className="ingestionFields">
          <IngestionInputs
            recordType={recordType}
            fields={fields}
            values={inputValues}
            selection={selection}
            formik={formik}
          />
        </Box>
        <Box className="ingestionButton">
          <Button raised type="button" onClick={(): void => { setFilePickerDialogOpen(true); }}>
            <FormattedMessage id="general.choose-btn.text"/>
          </Button>
        </Box>
      </Box>
      {
        isFilePickerDialogOpen &&
        <FilePickerDialogComponent
          recordType={recordType}
          isOpen={isFilePickerDialogOpen}
          onSetOpen={setFilePickerDialogOpen}
          onFilesSelection={onFilesSelection}
          selection={selection}
        />
      }
    </>
  );
};
