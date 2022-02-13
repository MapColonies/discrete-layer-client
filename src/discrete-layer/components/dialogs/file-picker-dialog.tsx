import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { observer } from 'mobx-react';
import { DialogContent } from '@material-ui/core';
import { Button, Dialog, DialogActions, DialogTitle, IconButton } from '@map-colonies/react-core';
import { Box, FileActionData, FileData, FilePickerActions, FilePickerHandle } from '@map-colonies/react-components';
import { FilePickerComponent, Selection } from '../../../common/components/file-picker';

import './file-picker-dialog.css';

const EMPTY = 0;

interface FilePickerDialogComponentProps {
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
  onFilesSelection: (selected: Selection) => void;
}

export const FilePickerDialogComponent: React.FC<FilePickerDialogComponentProps> = observer(({ isOpen, onSetOpen, onFilesSelection }) => {
  const filePickerRef = useRef<FilePickerHandle>(null);
  const [files, setFiles] = useState<FileData[]>([]);
  const [selection, setSelection] = useState<Selection>({ files: [], folderChain: [] });

  useEffect(() => {
    setFiles([ 
      {
        "id": "qwerty123456",
        "name": "PersistentVolume",
        "selectable": false,
        "isDir": true,
      },
      {
        "id": "e598a85f843c",
        "name": "Chonky Source Code",
        "isDir": true,
        "selectable": false,
        "modDate": "2020-10-24T17:48:39.866Z",
      },
      {
        "id": "12dd195bb146",
        "name": "README.md",
        "size": 1457,
        "modDate": "2020-10-22T04:17:54.294Z",
      },
      {
        "id": "12d31953b136",
        "name": "fileset.json",
        "size": 2457,
        "modDate": "2021-12-22T04:18:54.294Z",
      },
      {
        "id": "14dd495b4146",
        "name": "metadata.json",
        "size": 3457,
        "modDate": "2022-01-02T04:19:54.294Z",
      }
    ]);
  }, []);

  const closeDialog = useCallback(
    () => {
      onSetOpen(false);
    },
    [onSetOpen]
  );

  const handleAction = (data: FileActionData): void => {
    // eslint-disable-next-line
    if (data.id === FilePickerActions.OpenFiles.id) {
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
