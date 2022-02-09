import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { observer } from 'mobx-react';
import { DialogContent } from '@material-ui/core';
import { Button, Dialog, DialogActions, DialogTitle, IconButton } from '@map-colonies/react-core';
import { Box, FileActionData, FilePickerActions } from '@map-colonies/react-components';
import { FilePickerComponent } from '../../../common/components/file-picker';

import './file-picker-dialog.css';
interface FilePickerDialogComponentProps {
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
}

export const FilePickerDialogComponent: React.FC<FilePickerDialogComponentProps> = observer(({ isOpen, onSetOpen }) => {

  const closeDialog = useCallback(
    () => {
      onSetOpen(false);
    },
    [onSetOpen]
  );

  const handleAction = (data: FileActionData): void => {
    // eslint-disable-next-line
    if (data.id === FilePickerActions.OpenFiles.id) {
      console.log('*** OpenFiles *** ', data);
    // eslint-disable-next-line
    } else if (data.id === FilePickerActions.DeleteFiles.id) {
      console.log('*** DeleteFiles *** ', data);
    }
  }
  
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
            files={[ 
              {
                "id": "qwerty123456",
                "name": "PersistentVolume",
                "isDir": true,
              },
              {
                "id": "e598a85f843c",
                "name": "Chonky Source Code",
                "isDir": true,
                "modDate": "2020-10-24T17:48:39.866Z",
              }
            ]}
            currentSelection={{
              files: [],
              folderChain: []
            }} 
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
