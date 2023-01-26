import React from 'react';
import { Box } from "@map-colonies/react-components";
import { Mode } from "../../../common/models/mode.enum";
import { EntityDescriptorModelType, useStore } from "../../models";
import { LayersDetailsComponent } from "../layer-details/layer-details";

import './export-layer.component.css';
import ExportLayerToolbar from './export-layer-toolbar.component';

interface ExportLayerHeaderProps {}

const ExportLayerHeader: React.FC<ExportLayerHeaderProps> = () => {
  const store = useStore();
  const layerToExport = store.exportStore.layerToExport;
  const entityDescriptors = store.discreteLayersStore.entityDescriptors as EntityDescriptorModelType[];

  return (
    <Box id="exportLayerHeader">
      <ExportLayerToolbar />
      <Box className='exportLayerDetails'>
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
    </Box>
  );
};

export default ExportLayerHeader; 