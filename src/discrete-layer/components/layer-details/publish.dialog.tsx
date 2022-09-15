import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { DialogContent } from '@material-ui/core';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Icon,
  IconButton
} from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { GraphQLError } from '../../../common/components/error/graphql.error-presentor';
import { isUnpublished } from '../../../common/helpers/style';
import { RecordStatus, RecordType, useQuery, useStore } from '../../models';
import { IDispatchAction } from '../../models/actionDispatcherStore';
import { ILayerImage } from '../../models/layerImage';
import { UserAction } from '../../models/userStore';

import './publish.dialog.css';

interface ContinueDialogProps {
  layer: ILayerImage;
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
  onPublish: () => void;
}

export const PublishDialog: React.FC<ContinueDialogProps> = observer(({ layer, isOpen, onSetOpen, onPublish }) => {
  const store = useStore();
  const mutationQuery = useQuery();

  const closeDialog = useCallback(() => {
    onSetOpen(false);
  }, [onSetOpen]);

  const dispatchAction = (action: Record<string, unknown>): void => {
    store.actionDispatcherStore.dispatchAction(
      {
        action: action.action,
        data: action.data,
      } as IDispatchAction
    );
  };

  useEffect(() => {
    if (!mutationQuery.loading && ((mutationQuery.data as {updateStatus: string} | undefined)?.updateStatus === 'ok')) {
      onSetOpen(false);
      dispatchAction({ 
        action: UserAction.SYSTEM_ACTION_PUBLISHENTITY,
        data: {...layer, productStatus: isUnpublished(layer as any) ? RecordStatus.PUBLISHED : RecordStatus.UNPUBLISHED} 
      });
      onPublish();
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
          <Icon className="icon" icon={{ icon: 'info', size: 'xsmall' }}/>
          <FormattedMessage id={ 'general.dialog.publish.message' }/>
        </DialogContent>
        <DialogActions>
          <Box className="errors">
            {/* eslint-disable-next-line */}
            <GraphQLError error={mutationQuery.error ?? {}} />
          </Box>
          <Box>
            <Button
              raised
              type="button"
              disabled={mutationQuery.loading || mutationQuery.error !== undefined}
              onClick={(): void => updateStatus()}
            >
              {
                mutationQuery.loading ?
                <CircularProgress className="loading"/> :
                <FormattedMessage id="general.confirm-btn.text"/>
              }
            </Button>
            <Button type="button" onClick={(): void => { closeDialog(); }}>
              <FormattedMessage id="general.cancel-btn.text"/>
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
});
