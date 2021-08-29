import React, { useEffect, useMemo, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { isEmpty, get, cloneDeep, isEqual } from 'lodash';
import { Button, IconButton, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../common/models/mode.enum';
import { BestRecordModelType, LayerMetadataMixedUnion, LayerRasterRecordModelType, useQuery, useStore } from '../../models';
import { DiscreteOrder } from '../../models/DiscreteOrder';
import { UserAction } from '../../models/userStore';
import { LayersDetailsComponent } from '../layer-details/layer-details';
import { EntityDialogComponent } from '../layer-details/entity-dialog';
import { CloseWithoutSaveDialogComponent } from '../dialogs/close-without-save-dialog';
import { BestDiscretesComponent } from './best-discretes';
import { BestCatalogComponent } from './best-catalog';

import './best-edit.css';

const IMMEDIATE_EXECUTION = 0;

interface BestEditComponentProps {
  openImport: boolean;
  handleCloseImport: (isShow: boolean) => void;
  best?: BestRecordModelType | undefined;
}

export const BestEditComponent: React.FC<BestEditComponentProps> = observer((props) => {
  const { best } = props;
  const store = useStore();
  const intl = useIntl();
  const discretesOrder = best?.discretes as DiscreteOrder[];
  const discretesListRef = useRef();
  const importListRef = useRef();
  const [discretes, setDiscretes] = useState<LayerRasterRecordModelType[]>([]);
  const [showImportAddButton, setShowImportAddButton] = useState<boolean>(false);
  const [newLayersToAdd, setNewLayersToAdd] = useState<LayerRasterRecordModelType[]>([]);
  const [isEditBestEntityDialogOpen, setEditBestEntityDialogOpen] = useState<boolean>(false);
  const [isCloseWithoutSaveDialogOpen, setCloseWithoutSaveDialogOpen] = useState<boolean>(false);
  // const [showEditButton, setShowEditButton] = useState<boolean>(false);
  
  // eslint-disable-next-line
  let { loading, error, data, query, setQuery } = useQuery();
  useEffect(() => {
    if (!store.bestStore.onBestLoad()) {
      setQuery(store.querySearchById({
          idList: {
            value: [...discretesOrder.map((item: DiscreteOrder) => item.id)] as string[]
          }
        }));
    } else {
      const bestDiscretes = store.bestStore.layersList as LayerRasterRecordModelType[]
      store.discreteLayersStore.setLayersImagesData(bestDiscretes as LayerMetadataMixedUnion[]);
      setDiscretes(bestDiscretes);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isEmpty(newLayersToAdd)) {
      const bestDiscretes = store.bestStore.layersList as LayerRasterRecordModelType[];
      store.discreteLayersStore.setLayersImagesData(bestDiscretes as LayerMetadataMixedUnion[]);
      setTimeout(() => {setDiscretes(bestDiscretes);}, IMMEDIATE_EXECUTION);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newLayersToAdd]);

  useEffect(() => {
    const layersList = get(data,'searchById') as LayerRasterRecordModelType[];
    if (!isEmpty(layersList) && !isEmpty(discretesOrder)) {
      const layers = cloneDeep(layersList);

      layers.forEach(layer => {
        const discrete = discretesOrder.find(item => layer.id === item.id);
        if (discrete) {
          layer.order = discrete.zOrder;
          layer.includedInBests = [ ...(layer.includedInBests ?? []), store.bestStore.editingBest?.productName as string ];
        }
      });

      store.bestStore.setLayersList(layers);
      store.discreteLayersStore.setLayersImagesData(layers);
      setDiscretes(layers);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, store.bestStore, store.discreteLayersStore]);

  useEffect(() => {
    if (!props.openImport && !isEmpty(store.discreteLayersStore.previewedLayers)) {
      store.discreteLayersStore.previewedLayers?.forEach((layerId) => {
        store.discreteLayersStore.showLayer(layerId, false, null);
      });
      store.discreteLayersStore.cleanPreviewedLayer();
    }
  }, [props.openImport, store.discreteLayersStore, store.discreteLayersStore.previewedLayers]);

  useEffect(() => {
    if (!isEmpty(store.bestStore.movedLayer)) {
      setDiscretes(store.bestStore.layersList as LayerRasterRecordModelType[]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.bestStore.movedLayer]);

  const permissions = useMemo(() => {
    return {
      isBestRecordEditAllowed: store.userStore.isActionAllowed(UserAction.ENTITY_ACTION_BESTRECORD_EDIT),
    }
  }, [store.userStore]);

  const isDirty = useMemo(() => {
    const current = store.bestStore.editingBest;
    if (!current) {
      return false;
    }
    const saved = store.bestStore.getDraftById(current.id);
    return !isEqual(current, saved);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.bestStore.editingBest]);

  const handleImport = (): void => {
    const currentImportListRef = get(importListRef, 'current');
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if ( currentImportListRef !== undefined ) {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const layersToAdd = cloneDeep(currentImportListRef.getImportList() as LayerRasterRecordModelType[]);
      setNewLayersToAdd(layersToAdd);
      store.bestStore.addImportLayersToBest(layersToAdd);
    }
    props.handleCloseImport(false);
  };

  const handleEditBestEntityDialogClick = (): void => {
    setEditBestEntityDialogOpen(!isEditBestEntityDialogOpen);
  };
 
  const handleSave = (): void => {
    const currentDiscretesListRef = get(discretesListRef, 'current');
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (currentDiscretesListRef !== undefined) {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const newOrderedDiscretesList = currentDiscretesListRef.getOrderedDiscretes() as DiscreteOrder[];
      if (best !== undefined && !isEmpty(best)) {
        // @ts-ignore
        const newBest = { 
          ...best,
          discretes: [...newOrderedDiscretesList] 
        } as BestRecordModelType;
        
        store.bestStore.saveDraft(newBest);
        store.bestStore.editBest(newBest);
      }
    }
  };

  const handleClose = (): void => {
    if (isDirty) {
      setCloseWithoutSaveDialogOpen(true);
    } else {
      store.bestStore.editBest(undefined);
      store.bestStore.setLayersList([]);
    }
  };

  return (
    <>
      <Box
        className="bestDetails"
        // onMouseOver={(evt): void => { setShowEditButton(true); }}
        // onMouseOut={(evt): void => { setShowEditButton(false); }}
      >
        <LayersDetailsComponent layerRecord={best} isBrief={true} mode={Mode.VIEW}/>
      </Box>
      {
        permissions.isBestRecordEditAllowed &&
        // showEditButton &&
        <Tooltip content={intl.formatMessage({ id: 'tab-views.best-edit.actions.edit' })}>
          <IconButton
            className="editBestIcon mc-icon-Edit"
            label="EDIT BEST"
            onClick={ (): void => { handleEditBestEntityDialogClick(); } }
          />
        </Tooltip>
      }
      {
        // showEditButton &&
        isEditBestEntityDialogOpen &&
        <EntityDialogComponent
          isOpen={isEditBestEntityDialogOpen}
          onSetOpen={setEditBestEntityDialogOpen}
          layerRecord={best}>
        </EntityDialogComponent>
      }

      <BestDiscretesComponent
        // @ts-ignore
        ref={discretesListRef}
        discretes={discretes}
        style={{ height: 'calc(100% - 220px)', width: 'calc(100% - 8px)' }}/>
      
      <Box className="actionButtons">
        <Box>
          <Button raised type="button" onClick={ (): void => { handleSave(); } } disabled={!isDirty}>
            <FormattedMessage id="general.save-btn.text"/>
          </Button>
        </Box>
        <Box>
          <Button raised type="button" onClick={ (): void => { handleClose(); } }>
            <FormattedMessage id="general.close-btn.text"/>
          </Button>
        </Box>
      </Box>
      {
        isCloseWithoutSaveDialogOpen &&
        <CloseWithoutSaveDialogComponent
          isOpen={isCloseWithoutSaveDialogOpen}
          onSetOpen={setCloseWithoutSaveDialogOpen}/>
      }

      {
        <Box className={props.openImport ? 'bestCatalogImportContainer openedImport' : 'bestCatalogImportContainer'}>
          <Box className={props.openImport ? 'bestCatalogImportWrapper bestCatalogOpened' : 'bestCatalogImportWrapper bestCatalogClosed'}>
            {
              props.openImport && <BestCatalogComponent
              // @ts-ignore
              ref={importListRef}
              filterOut={discretesOrder}
              handleImportLayerSelected={setShowImportAddButton}/>
            }

            <Box className={props.openImport ? 'buttons bestCatalogOpened' : 'buttons bestCatalogClosed'}>
              <Button type="button" onClick={(): void => { props.handleCloseImport(false); }}>
                <FormattedMessage id="general.cancel-btn.text"/>
              </Button>
              <Button raised type="button" disabled={!showImportAddButton} onClick={(): void => { handleImport(); }}>
                <FormattedMessage id="best-edit.import.dialog.import-btn.text"/>
              </Button>
            </Box>
          </Box>
        </Box>
      }
    </>
  );
});