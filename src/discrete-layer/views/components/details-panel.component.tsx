import React from 'react';
import { observer } from 'mobx-react-lite';
import { useIntl } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { IconButton, Tooltip, Typography } from '@map-colonies/react-core';
import { Mode } from '../../../common/models/mode.enum';
import { EntityDialog } from '../../components/layer-details/entity.dialog';
import { LayersDetailsComponent } from '../../components/layer-details/layer-details';
import { useStore } from '../../models/RootStore';
import { BestRecordModelType, EntityDescriptorModelType } from '../../models';

import './details-panel.component.css';

interface DetailsPanelComponentProps {
  isEditEntityDialogOpen: boolean;
  setEditEntityDialogOpen: (open: boolean) => void;

  detailsPanelExpanded: boolean;
  setDetailsPanelExpanded: (isExpanded: boolean) => void;
}

export const DetailsPanel: React.FC<DetailsPanelComponentProps> = observer((props) => {
  const store = useStore();
  const intl = useIntl();
  const {
    isEditEntityDialogOpen,
    setEditEntityDialogOpen,
    detailsPanelExpanded,
    setDetailsPanelExpanded 
  } = props;
  
  const layerToPresent = store.discreteLayersStore.selectedLayer;
  const isSelectedLayerUpdateMode = store.discreteLayersStore.selectedLayerIsUpdateMode ?? false;
  const editingBest = store.bestStore.editingBest;

  const handleEditEntityDialogClick = (): void => {
    if (typeof layerToPresent !== 'undefined' && 'isDraft' in layerToPresent) {
      store.bestStore.editBest(layerToPresent as BestRecordModelType);
    } else {
      setEditEntityDialogOpen(!isEditEntityDialogOpen);
    }
  };

  return (
    <>
      <Box style={{display: 'flex', paddingTop: '8px'}}>
        <Typography use="headline6" tag="div" className="detailsTitle">
          {layerToPresent?.productName}
        </Typography>
        {
          layerToPresent && 
          store.userStore.isActionAllowed(`entity_action.${layerToPresent.__typename}.edit`) &&
          <Tooltip content={intl.formatMessage({ id: 'action.edit.tooltip' })}>
            <IconButton
              className="operationIcon mc-icon-Edit"
              label="EDIT"
              onClick={ (): void => { handleEditEntityDialogClick(); } }
            />
          </Tooltip>
        }
        {
          isEditEntityDialogOpen &&
          <EntityDialog
            isOpen={isEditEntityDialogOpen}
            onSetOpen={setEditEntityDialogOpen}
            layerRecord={layerToPresent ?? editingBest}
            isSelectedLayerUpdateMode={isSelectedLayerUpdateMode}
          />
        }
        <Tooltip content={intl.formatMessage({ id: `${!detailsPanelExpanded ? 'action.expand.tooltip' : 'action.collapse.tooltip'}` })}>
          <IconButton 
            className={`operationIcon ${!detailsPanelExpanded ? 'mc-icon-Expand-Panel' : 'mc-icon-Collapce-Panel'}`}
            label="DETAILS EXPANDER"
            onClick={ (): void => {setDetailsPanelExpanded(!detailsPanelExpanded);}}
          />
        </Tooltip>
      </Box>
      <Box className="detailsContent panelContent">
        <LayersDetailsComponent
          className="detailsPanelProductView"
          entityDescriptors={store.discreteLayersStore.entityDescriptors as EntityDescriptorModelType[]}
          layerRecord={layerToPresent}
          isBrief={!detailsPanelExpanded}
          mode={Mode.VIEW}
        />
      </Box>
    </>
  );
})