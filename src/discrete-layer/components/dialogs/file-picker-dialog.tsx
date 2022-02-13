import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { observer } from 'mobx-react';
import { DialogContent } from '@material-ui/core';
import { Button, Dialog, DialogActions, DialogTitle, IconButton } from '@map-colonies/react-core';
import { Box, FileActionData, FileData, FilePickerActions } from '@map-colonies/react-components';
import { FilePickerComponent, Selection } from '../../../common/components/file-picker';

import './file-picker-dialog.css';

interface FilePickerDialogComponentProps {
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
}

export const FilePickerDialogComponent: React.FC<FilePickerDialogComponentProps> = observer(({ isOpen, onSetOpen }) => {
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
    console.log(data);
    // eslint-disable-next-line
    if (data.id === FilePickerActions.OpenFiles.id) {
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
