import React, { useCallback, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { DialogContent } from '@material-ui/core';
import { Button, CircularProgress, Dialog, DialogActions, DialogTitle, IconButton } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { isUnpublished } from '../../../common/helpers/style';
import { RecordStatus, RecordType, useQuery, useStore } from '../../models';

import './publish.dialog.css';
import { ILayerImage } from '../../models/layerImage';
import { observer } from 'mobx-react';
import { GraphQLError } from '../../../common/components/error/graphql.error-presentor';

interface ContinueDialogProps {
  layer: ILayerImage;
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
}

export const PublishDialog: React.FC<ContinueDialogProps> = observer(({ layer, isOpen, onSetOpen }) => {
  const store = useStore();
  const mutationQuery = useQuery();

  const closeDialog = useCallback(() => {
    onSetOpen(false);
  }, [onSetOpen]);

  useEffect(() => {
    if (!mutationQuery.loading && ((mutationQuery.data as {updateStatus: string} | undefined)?.updateStatus === 'ok')) {
      onSetOpen(false);
    }
  }, [mutationQuery.data]);

  const updateStatus = (): void => {
    const productStatus = isUnpublished(layer as any) ? RecordStatus.PUBLISHED : RecordStatus.UNPUBLISHED;
    mutationQuery.setQuery(
      store.mutateUpdateStatus({
        data: {
          id: layer.id,
          type: layer.type as RecordType,
          partialRecordData: { productStatus },
        },
      })
    );
  };
  
  return (
    <Box id="publishDialog">
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
        <DialogActions className="actions">
          <Box className='buttons'>
            <Button raised type="button" disabled={mutationQuery.loading} onClick={(): void => {
              updateStatus();
            }}>
              {
                mutationQuery.loading ?
                <CircularProgress/> :
                <FormattedMessage id="general.confirm-btn.text"/>
              }
            </Button>
            <Button type="button" onClick={(): void => { closeDialog(); }}>
              <FormattedMessage id="general.cancel-btn.text"/>
            </Button>
          </Box>
            {/* eslint-disable-next-line */}
            <Box className="errors"><GraphQLError error={mutationQuery.error ?? {}} /></Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
});
