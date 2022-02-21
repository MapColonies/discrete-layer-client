/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { observer } from 'mobx-react';
import { DialogContent } from '@material-ui/core';
import { Button, Dialog, DialogActions, DialogTitle, IconButton } from '@map-colonies/react-core';
import { Box, FileActionData, FileData, FilePickerActions } from '@map-colonies/react-components';
import { FilePickerComponent, FilePickerComponentHandle, Selection } from '../../../common/components/file-picker';
import { RecordType } from '../../models';
import { isMultiSelection } from '../layer-details/utils';

import './file-picker-dialog.css';

const EMPTY = 0;

interface FilePickerDialogComponentProps {
  recordType: RecordType;
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
  onFilesSelection: (selected: Selection) => void;
  selection: Selection;
}

export const FilePickerDialogComponent: React.FC<FilePickerDialogComponentProps> = observer(
  (
    {
      recordType,
      isOpen,
      onSetOpen,
      onFilesSelection,
      selection
    }
  ) => {
  const filePickerRef = useRef<FilePickerComponentHandle>(null);
  const [files, setFiles] = useState<FileData[]>([]);
  const [isFileSelected, setIsFileSelected] = useState<boolean>(false);

  useEffect(() => {
    setFiles([ 
      {
        "id": "qwerty123456",
        "name": "PersistentVolume",
        "isDir": true,
        "selectable": false,
      },
      {
        "id": "e598a85f843c",
        "name": "Chonky",
        "isDir": true,
        "selectable": false,
        "modDate": "2020-10-24T17:48:39.866Z",
      },
      {
        "id": "e191a851841c",
        "name": "Logs",
        "isDir": true,
        "selectable": false,
        "modDate": "2022-02-14T14:00:00.866Z",
      },
      {
        "id": "12dd195bb146",
        "name": "README.md",
        "size": 1457,
        "modDate": "2020-10-22T04:17:54.294Z",
      },
      {
        "id": "12d31953b136",
        "name": "tileset.json",
        "size": 2457,
        "modDate": "2021-12-22T04:18:54.294Z",
      },
      {
        "id": "14dd495b4146",
        "name": "metadata.json",
        "size": 3457,
        "modDate": "2022-01-02T04:19:54.294Z",
      },
      {
        "id": "125d595b5146",
        "name": "stam.txt",
        "size": 15,
        "modDate": "2022-02-14T00:30:00.294Z",
      }
    ]);
  }, []);

  const closeDialog = useCallback(
    () => {
      onSetOpen(false);
    },
    [onSetOpen]
  );

  const handleAction = useCallback(
    (data: FileActionData): void => {
      if (data.id === FilePickerActions.ChangeSelection.id) {
        const curSelection = filePickerRef.current?.getFileSelection();
        if (curSelection) {
          setIsFileSelected(curSelection.files.length > EMPTY);
        }
      }
    },
    []
  );

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
            isMultiSelection={isMultiSelection(recordType)}
            onFileAction={handleAction}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            raised 
            type="button" 
            disabled={!isFileSelected} 
            onClick={(): void => {
              onFilesSelection(filePickerRef.current?.getFileSelection() as Selection);
              closeDialog();
            }}
          >
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
