import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { IconButton, Tooltip, Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { getStatusStyle, isUnpublished } from '../../../common/helpers/style';
import { Mode } from '../../../common/models/mode.enum';
import { EntityDialog } from '../../components/layer-details/entity.dialog';
import { LayersDetailsComponent } from '../../components/layer-details/layer-details';
import { PublishButton } from '../../components/layer-details/publish-button';
import { SaveMetadataButton } from '../../components/layer-details/save-metadata-button';
import { BestRecordModelType, EntityDescriptorModelType } from '../../models';
import { useStore } from '../../models/RootStore';

import './details-panel.component.css';

interface DetailsPanelComponentProps {
  isEditEntityDialogOpen: boolean;
  setEditEntityDialogOpen: (open: boolean) => void;
  detailsPanelExpanded: boolean;
  setDetailsPanelExpanded: (isExpanded: boolean) => void;
}

export const DetailsPanel: React.FC<DetailsPanelComponentProps> = observer((props) => {
  const {
    isEditEntityDialogOpen,
    setEditEntityDialogOpen,
    detailsPanelExpanded,
    setDetailsPanelExpanded
  } = props;
  
  const store = useStore();
  const intl = useIntl();
  const layerToPresent = store.discreteLayersStore.selectedLayer;
  const isSelectedLayerUpdateMode = store.discreteLayersStore.selectedLayerIsUpdateMode ?? false;
  const editingBest = store.bestStore.editingBest;

  const permissions = useMemo(() => {
    return {
     isEditAllowed: layerToPresent && store.userStore.isActionAllowed(`entity_action.${layerToPresent.__typename}.edit`),
     isPublishAllowed: layerToPresent && store.userStore.isActionAllowed(`entity_action.${layerToPresent.__typename}.publish`),
     isSaveMetadataAllowed: layerToPresent && store.userStore.isActionAllowed(`entity_action.${layerToPresent.__typename}.saveMetadata`),
    }
  }, [store.userStore.user, layerToPresent]);

  const handleEditEntityDialogClick = (): void => {
    if (typeof layerToPresent !== 'undefined' && 'isDraft' in layerToPresent) {
      store.bestStore.editBest(layerToPresent as BestRecordModelType);
    } else {
      setEditEntityDialogOpen(!isEditEntityDialogOpen);
    }
  };

  return (
    <>
      <Box style={{ display: 'flex', paddingTop: '8px' }}>
        <Typography use="headline6" tag="div" className="detailsTitle" style={getStatusStyle(layerToPresent as any ?? {})}>
          {layerToPresent?.productName}
        </Typography>
        {
          permissions.isPublishAllowed === true && layerToPresent &&
          <PublishButton metadata={layerToPresent} className="operationIcon"/>
        }
        {
          permissions.isEditAllowed === true && 
          <Tooltip content={intl.formatMessage({ id: 'action.edit.tooltip' })}>
            <IconButton
              className="operationIcon mc-icon-Edit"
              label="EDIT"
              onClick={(): void => {
                handleEditEntityDialogClick();
              }}
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
        {
          permissions.isSaveMetadataAllowed === true && layerToPresent &&
          <SaveMetadataButton metadata={layerToPresent} className="operationIcon"/>
        }
        <Tooltip
          content={intl.formatMessage({
            id: `${
              !detailsPanelExpanded
                ? 'action.expand.tooltip'
                : 'action.collapse.tooltip'
            }`,
          })}
        >
          <IconButton
            className={`operationIcon ${
              !detailsPanelExpanded
                ? 'mc-icon-Expand-Panel'
                : 'mc-icon-Collapce-Panel'
            }`}
            label="DETAILS EXPANDER"
            onClick={(): void => {
              setDetailsPanelExpanded(!detailsPanelExpanded);
            }}
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