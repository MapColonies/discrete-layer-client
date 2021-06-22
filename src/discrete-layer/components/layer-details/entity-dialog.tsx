import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FormattedMessage } from 'react-intl';
import { Button, Dialog, DialogTitle } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { ILayerImage } from '../../models/layerImage';
import { DialogContent } from '@material-ui/core';
import { useFormik } from 'formik';
import { LayersDetailsComponent } from './layer-details';

import './entity-dialog.css';

interface EntityDialogComponentProps {
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
  layerRecord?: ILayerImage | null;
}

export const EntityDialogComponent: React.FC<EntityDialogComponentProps> = (props: EntityDialogComponentProps) => {
  const { isOpen, onSetOpen, layerRecord } = props;

  const mode = (layerRecord === undefined) ? 'New' : 'Edit';

  const formik = useFormik({
    initialValues: {},
    onSubmit: values => {}
  });

  const handleClose = (isOpened: boolean): void => {
    onSetOpen(isOpened);
  };

  return (
    <>
      return (
        <Box id="entityDialog">
          <Dialog open={isOpen} preventOutsideDismiss={true}>
            <DialogTitle>
              <FormattedMessage id={ mode === 'New' ? 'general.title.new' : 'general.title.edit' }/>
            </DialogTitle>
            <DialogContent>
              <form onSubmit={formik.handleSubmit}>
                <PerfectScrollbar className="content">
                  <LayersDetailsComponent layerRecord={layerRecord} mode={mode}/>
                </PerfectScrollbar>
                <Box className="buttons">
                  <Button type="button" onClick={(): void => { handleClose(false); }}>
                    <FormattedMessage id="general.cancel-btn.text"/>
                  </Button>
                  <Button raised type="submit">
                    <FormattedMessage id="general.ok-btn.text"/>
                  </Button>
                </Box>
              </form>
            </DialogContent>
          </Dialog>
        </Box>
      )
    </>
  )
};