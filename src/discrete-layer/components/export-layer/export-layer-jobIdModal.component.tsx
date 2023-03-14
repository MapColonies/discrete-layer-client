import { Dialog, DialogContent, DialogTitle } from '@map-colonies/react-core';
import React from 'react';

const ExportLayerJobIdModal: React.FC<{isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
  
  return (
    <Dialog open={isOpen} onClose={onClose} preventOutsideDismiss={true}>
      <DialogTitle className="jobIdModalTitle">
        Title
      </DialogTitle>
      <DialogContent className="jobIdModalBody">
        Content
      </DialogContent>
    </Dialog>
  );
};

export default ExportLayerJobIdModal;
