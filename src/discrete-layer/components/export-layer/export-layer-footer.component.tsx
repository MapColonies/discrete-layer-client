import React from 'react';
import { Box } from "@map-colonies/react-components";
import { Button } from "@map-colonies/react-core";
import { FormattedMessage } from "react-intl";

const ExportLayerFooter: React.FC = () => {
  return (
    <Box className="exportFooter">
      <Box className="buttonsContainer">
        <Button id="exportBtn" raised type="button" onClick={(): void => {}}>
          <FormattedMessage id="export-layer.export.button" />
        </Button>
        <Button id="cancelBtn" raised type="button" onClick={(): void => {}}>
          <FormattedMessage id="general.cancel-btn.text" />
        </Button>
      </Box>
    </Box>
  );
};

export default ExportLayerFooter;