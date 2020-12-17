import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { ResponseState } from '../../../common/models/response-state.enum';
import { useStore } from '../../models/rootStore';
import { Snackbar, SnackbarAction } from '@map-colonies/react-core';

interface SnackDetails {
  message: string;
}

export const SnackContainer: React.FC = observer(() => {
  const { discreteLayersStore } = useStore();
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackDetails, setSnackDetails] = useState<SnackDetails>({
    message: '',
  });
  const intl = useIntl();
  useEffect(() => {
    switch (discreteLayersStore.state) {
      case ResponseState.ERROR:
        setSnackOpen(true);
        setSnackDetails({
          message: 'snack.message.failed',
        });
        break;
      case ResponseState.DONE:
        setSnackOpen(true);
        setSnackDetails({
          message: 'snack.message.success',
        });
        break;
      default:
        break;
    }
  }, [discreteLayersStore.state]);

  // setTimeout(()=>{setSnackOpen(true)}, 5000);

  return (
    <>
      {!!snackDetails.message && (
        <Snackbar
          open={snackOpen}
          onClose={(evt): void => setSnackOpen(false)}
          message={intl.formatMessage({ id: snackDetails.message })}
          // message={intl.formatMessage({ id: 'snack.message.success' })}
          dismissesOnAction
          action={
            <SnackbarAction
              label={intl.formatMessage({ id: 'snack.dismiss-btn.text' })}
              onClick={(): void => console.log('dismiss clicked')}
            />
          }
        />
      )}
    </>
  );
});
