import { Box } from '@map-colonies/react-components';
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Tooltip, Typography } from '@map-colonies/react-core';
import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FormattedMessage, useIntl } from 'react-intl';

const ExportLayerJobIdModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
  jobId: string;
  renderToPortal?: Element;
  
}> = ({ isOpen, onClose, onCancel, renderToPortal, jobId }) => {
  
  const intl = useIntl();
  const [hasCopied, setHasCopied] = useState(false);

  const textCopyTooltip = intl.formatMessage({id: hasCopied ? 'action.copied.tooltip' : 'action.copy.tooltip'});

  return (
    <Dialog
      className="jobIdModal"
      renderToPortal={renderToPortal}
      open={isOpen}
      preventOutsideDismiss={true}
    >
      <DialogTitle className="jobIdModalTitle">
        <FormattedMessage id="export-layer.exportSuccessModal.title" />
        <IconButton
          className="closeIcon mc-icon-Close"
          label="CLOSE"
          onClick={onCancel}
        />
      </DialogTitle>

      <DialogContent className="jobIdModalBody">
        <Box className="mainTextContainer">
          <Typography className="jobIdTitle" tag="p">
            {intl.formatMessage({
              id: 'export-layer.exportSuccessModal.jobId.title',
            })}
          </Typography>

          <Box onMouseLeave={(): void => setHasCopied(false)}>
            <Tooltip content={textCopyTooltip}>
              <CopyToClipboard
                text={jobId}
                onCopy={(): void => {
                  setHasCopied(true);
                }}
              >
                <Typography className="jobIdText" tag="p">
                  {jobId}
                </Typography>
              </CopyToClipboard>
            </Tooltip>
          </Box>
        </Box>

        <Box className="buttonsContainer">
          <Button id="cancelBtn" type="button" onClick={onCancel}>
            <FormattedMessage id="general.cancel-btn.text" />
          </Button>
          <CopyToClipboard text={jobId}>
            <Button
              id="copyAndApprove"
              raised
              type="button"
              onClick={onClose}
            >
              <FormattedMessage id="export-layer.exportSuccessModal.approve" />
            </Button>
          </CopyToClipboard>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ExportLayerJobIdModal;
