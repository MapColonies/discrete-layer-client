/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { cloneDeep } from 'lodash';
import { observer } from 'mobx-react';
import { DialogContent } from '@material-ui/core';
import { Button, Dialog, DialogActions, DialogTitle, IconButton } from '@map-colonies/react-core';
import { Box, FileActionData, FileData, FilePickerActions, FilePickerHandle } from '@map-colonies/react-components';
import { FilePickerComponent, Selection } from '../../../common/components/file-picker';
import { FileModelType, LayerMetadataMixedUnion, RecordType, useQuery, useStore } from '../../models';
import './file-picker-dialog.css';

const EMPTY = 0;

interface FilePickerDialogComponentProps {
  recordType: RecordType;
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
  onFilesSelection: (selected: Selection) => void;
}

export const FilePickerDialogComponent: React.FC<FilePickerDialogComponentProps> = observer(
  (
    {
      recordType,
      isOpen,
      onSetOpen,
      onFilesSelection
    }
  ) => {
  const filePickerRef = useRef<FilePickerHandle>(null);
  const [files, setFiles] = useState<FileData[]>([]);
  const [selection, setSelection] = useState<Selection>({
    files: [],
    folderChain: [],
    metadata: { recordModel: {} as LayerMetadataMixedUnion, error: null },
  });
  const [pathSuffix, setPathSuffix] = useState<string>('/');

  const store = useStore();
  const queryDirectory = useCallback(()=> useQuery<{ getDirectory: FileModelType[]}>(), [])();
  const queryMetadata = useCallback(()=> useQuery<{ getFile: LayerMetadataMixedUnion}>(), [])();
  const intl = useIntl();


  useEffect(() => {
    queryDirectory.setQuery(
      store.queryGetDirectory({
        data: {
          pathSuffix,
          type: recordType,
        },
      })
    );

    setSelection((selection) => ({
      ...selection,
      metadata: {
        recordModel: {} as LayerMetadataMixedUnion,
        error: null,
      },
    }));
  }, [pathSuffix]);

  useEffect(()=> {
    if(queryDirectory.data){
      const dirContent = cloneDeep(queryDirectory.data.getDirectory) as FileData[]
      setFiles(dirContent);

      if(dirContent.length){
        const hasMetadata = dirContent.some(file => file.name === 'metadata.json');
  
        if(hasMetadata) {
          queryMetadata.setQuery(store.queryGetFile({
            data: {
              pathSuffix: pathSuffix + 'metadata.json',
              type: recordType,
            }
          }))
        }
      }
    }
  },[queryDirectory.data])

  useEffect(() => {
    if(queryMetadata.data){
      setSelection({
        ...selection,
        metadata: {
          recordModel: cloneDeep(queryMetadata.data.getFile),
          error: null,
        },
      });
    }
  }, [queryMetadata.data])

  useEffect(() => {
    if (queryMetadata.error) {
      const metadataError = [
        {
          message: intl.formatMessage({
            id: 'ingestion.error.invalid-metadata',
          }),
        },
        // eslint-disable-next-line
        ...queryMetadata.error.response.errors,
      ];

      // eslint-disable-next-line
      const queryError = { ...queryMetadata.error };

      // eslint-disable-next-line
      queryError.response.errors = metadataError;

      setSelection({
        ...selection,
        metadata: {
          recordModel: {} as LayerMetadataMixedUnion,
          // eslint-disable-next-line
          error: queryError,
        },
      });
    }
  }, [queryMetadata.error]);

  const closeDialog = useCallback(
    () => {
      onSetOpen(false);
    },
    [onSetOpen]
  );

  const handleAction = (data: FileActionData): void => {
    // eslint-disable-next-line
    if (data.id === FilePickerActions.OpenFiles.id) {
      const { targetFile, files } = data.payload;
      const fileToOpen = targetFile ?? files[0];
      if (fileToOpen.isDir === true) {
        setPathSuffix(`${pathSuffix}${fileToOpen.name}/`);
        setSelection((currentSelection) => {
          const newSelection = { ...currentSelection };
          newSelection.folderChain = [ ...newSelection.folderChain, fileToOpen ];
          return newSelection;
        });
      }
    // eslint-disable-next-line
    } else if (data.id === FilePickerActions.ChangeSelection.id) {
      setSelection((currentSelection) => {
        const newSelection = { ...currentSelection };
        // eslint-disable-next-line
        const selectedIds = filePickerRef?.current?.getFileSelection() as Set<string>;
        newSelection.files = files.filter((file: FileData) => selectedIds.has(file.id));
        return newSelection;
      });
    }
  };
  
  return (
    <Box id="filePickerDialog">
      <Dialog open={isOpen} preventOutsideDismiss={true}>
        <DialogTitle>
          <FormattedMessage id={ 'general.title.choose' }/>
          <IconButton
            className="closeIcon mc-icon-Close"
            label="CLOSE"
            onClick={ (): void => { closeDialog(); } }
          />
        </DialogTitle>
        <DialogContent className="dialogBody">
          <FilePickerComponent
            // @ts-ignore
            ref={filePickerRef}
            files={files}
            selection={selection} 
            onFileAction={handleAction}
          />
        </DialogContent>
        <DialogActions>
          <Button raised type="button" disabled={selection.files.length === EMPTY} onClick={(): void => { onFilesSelection(selection); closeDialog(); }}>
            <FormattedMessage id="general.ok-btn.text"/>
          </Button>
          <Button type="button" onClick={(): void => { closeDialog(); }}>
            <FormattedMessage id="general.cancel-btn.text"/>
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});
