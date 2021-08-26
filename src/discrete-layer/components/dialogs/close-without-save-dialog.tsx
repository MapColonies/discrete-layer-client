import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { observer } from 'mobx-react';
import { DialogContent } from '@material-ui/core';
import { Button, Dialog, DialogActions, DialogTitle, IconButton } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { useStore } from '../../models';

import './close-without-save-dialog.css';

interface CloseWithoutSaveDialogComponentProps {
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
}

export const CloseWithoutSaveDialogComponent: React.FC<CloseWithoutSaveDialogComponentProps> = observer(({ isOpen, onSetOpen }) => {
  const store = useStore();
  
  const closeDialog = useCallback(
    () => {
      onSetOpen(false);
    },
    [onSetOpen]
  );

  const closeWithoutSaving = useCallback(
    () => {
      onSetOpen(false);
      store.bestStore.editBest(undefined);
      store.bestStore.setLayersList([]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onSetOpen]
  );
  
  return (
    <Box id="closeWithoutSaveDialog">
      <Dialog open={isOpen} preventOutsideDismiss={true}>
        <DialogTitle>
          <FormattedMessage id={ 'general.dialog.exit.title' }/>
          <IconButton
            className="closeIcon mc-icon-Close"
            label="CLOSE"
            onClick={ (): void => { closeDialog(); } }
          />
        </DialogTitle>
        <DialogContent className="dialogBody">
          <FormattedMessage id={ 'general.dialog.exit.message' }/>
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={(): void => { closeDialog(); }}>
            <FormattedMessage id="general.cancel-btn.text"/>
          </Button>
          <Button raised type="button" onClick={(): void => { closeWithoutSaving(); }}>
            <FormattedMessage id="general.continue-btn.text"/>
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});
