import React from 'react';
import { Box } from "@map-colonies/react-components";
import { Mode } from "../../../common/models/mode.enum";
import { EntityDescriptorModelType, LayerMetadataMixedUnion } from "../../models";
import { LayersDetailsComponent } from "../layer-details/layer-details";

import './export-layer.component.css';

interface ExportLayerHeaderProps {
    entityDescriptors: EntityDescriptorModelType[];
    layerToExport: LayerMetadataMixedUnion;
}

const ExportLayerHeader: React.FC<ExportLayerHeaderProps> = ({ entityDescriptors, layerToExport }) => {
  return (
    <Box id="exportLayerHeader">
      <Box id="exportLayerHeaderContent">
        <LayersDetailsComponent
          className="detailsPanelProductView"
          entityDescriptors={entityDescriptors}
          layerRecord={layerToExport}
          isBrief={true}
          mode={Mode.EXPORT}
        />
      </Box>
    </Box>
  );
};

export default ExportLayerHeader; 