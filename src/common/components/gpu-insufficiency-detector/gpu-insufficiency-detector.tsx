import { IconButton, Typography } from '@map-colonies/react-core';
import { Box } from '@material-ui/core';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import useGetGPUTier from '../../hooks/useGetGpuTier/useGetGPUTier';

import './gpu-insufficiency-detector.css';

const MINIMUM_SUFFICIENT_GPU_TIER = 2;

const GPUInsufficiencyDetector: React.FC = () => {
  const intl = useIntl();
  const gpuTier = useGetGPUTier();

  const [closeSnackbar, setCloseSnackbar] = useState(false);

  if (!gpuTier) return null;

  const systemInsufficientError = intl.formatMessage({
    id: 'gpu-insufficient.error',
  });

  return (
    <>
      {gpuTier.tier < MINIMUM_SUFFICIENT_GPU_TIER && !closeSnackbar && (
        <Box className="gpuInsufficientError">
          <Box className="closeIconContainer">
            <IconButton
              className="closeIcon mc-icon-Close"
              label="CLOSE"
              onClick={(): void => {
                setCloseSnackbar(true);
              }}
            />
          </Box>
          <Typography tag="h4">{systemInsufficientError}</Typography>
          <Typography tag="p">{`GPU:\n${gpuTier.gpu as string}`}</Typography>
        </Box>
      )}
    </>
  );
};

export default GPUInsufficiencyDetector;
