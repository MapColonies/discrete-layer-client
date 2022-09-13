import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { DialogContent } from '@material-ui/core';
import { Button, Dialog, DialogActions, DialogTitle, IconButton } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';

import './continue.dialog.css';

interface ContinueDialogProps {
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
  onContinue: () => void;
}

export const ContinueDialog: React.FC<ContinueDialogProps> = ({ isOpen, onSetOpen, onContinue }) => {
  const closeDialog = useCallback(() => {
    onSetOpen(false);
  }, [onSetOpen]);

  const handleContinue = useCallback(() => {
    onSetOpen(false);
    onContinue();
  }, [onSetOpen]);
  
  return (
    <Box id="continueDialog">
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
          <FormattedMessage id={ 'general.dialog.publish.message' }/>
        </DialogContent>
        <DialogActions>
          <Button raised type="button" onClick={(): void => { handleContinue(); }}>
            <FormattedMessage id="general.continue-btn.text"/>
          </Button>
          <Button type="button" onClick={(): void => { closeDialog(); }}>
            <FormattedMessage id="general.cancel-btn.text"/>
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
