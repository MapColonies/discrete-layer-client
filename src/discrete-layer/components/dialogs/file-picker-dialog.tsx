import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { observer } from 'mobx-react';
import { DialogContent } from '@material-ui/core';
import { Button, Dialog, DialogActions, DialogTitle, IconButton } from '@map-colonies/react-core';
import { Box, FileActionData, FileData, FilePickerActions } from '@map-colonies/react-components';
import { FilePickerComponent, Selection } from '../../../common/components/file-picker';

import './file-picker-dialog.css';
import { FileModelType, LayerMetadataMixedUnion, RecordType, useQuery, useStore } from '../../models';
import { cloneDeep } from 'lodash';

interface FilePickerDialogComponentProps {
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
  recordType: RecordType;
}

export const FilePickerDialogComponent: React.FC<FilePickerDialogComponentProps> = observer(({ isOpen, onSetOpen, recordType }) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [selection, setSelection] = useState<Selection>({ files: [], folderChain: [], metadata: {} as LayerMetadataMixedUnion });
  const [pathSuffix, setPathSuffix] = useState<string>('/');

  const store = useStore();
  const queryDirectory = useCallback(()=> useQuery<{ getDirectory: FileModelType[]}>(), [])();
  const queryMetadata = useCallback(()=> useQuery<{ getFile: LayerMetadataMixedUnion}>(), [])();

  useEffect(() => {
    queryDirectory.setQuery(store.queryGetDirectory({
      data: {
        pathSuffix,
        type: recordType,
      }
    }))
    setSelection(selection => ({...selection, metadata: {} as LayerMetadataMixedUnion }))
  },[pathSuffix])

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
      setSelection({ ...selection, metadata: cloneDeep(queryMetadata.data.getFile) })
    }
  }, [queryMetadata.data])

  const closeDialog = useCallback(
    () => {
      onSetOpen(false);
    },
    [onSetOpen]
  );

  const handleAction = (data: FileActionData): void => {

    // eslint-disable-next-line
    if (data.id === FilePickerActions.OpenFiles.id) {
      if(typeof data.payload.targetFile !== 'undefined' && data.payload.targetFile.isDir as boolean) {
        const dirName = data.payload.targetFile.name;
        setPathSuffix(`${pathSuffix}${dirName}/`);
      }
      // eslint-disable-next-line
    } else if (data.id === FilePickerActions.ChangeSelection.id) {
      setSelection((currentSelection) => {
        const newSelection = { ...currentSelection };
        newSelection.files = [ ...data.state.selectedFiles ];
        console.log(newSelection);
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
            files={files}
            selection={selection} 
            onFileAction={handleAction}
          />
        </DialogContent>
        <DialogActions>
          <Button raised type="button" disabled={true} onClick={(): void => { closeDialog(); }}>
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
