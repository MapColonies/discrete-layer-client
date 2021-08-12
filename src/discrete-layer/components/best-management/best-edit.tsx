import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { isEmpty, get, cloneDeep } from 'lodash';
import { Button, IconButton } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { BestRecordModelType, LayerMetadataMixedUnion, LayerRasterRecordModelType, useQuery, useStore } from '../../models';
import { DiscreteOrder } from '../../models/DiscreteOrder';
import { BestDiscretesComponent } from './best-discretes';
import { BestDetailsComponent } from './best-details';
import { BestCatalogComponent } from './best-catalog';

import './best-edit.css';

interface BestEditComponentProps {
  openImport: boolean;
  handleCloseImport: (isShow: boolean) => void;
  best?: BestRecordModelType | undefined;
}

export const BestEditComponent: React.FC<BestEditComponentProps> = observer((props) => {
  const { best } = props;
  const store = useStore();
  //@ts-ignore
  const discretesOrder = best?.discretes as DiscreteOrder[];
  const discretesListRef = useRef();
  const [discretes, setDiscretes] = useState<LayerRasterRecordModelType[]>([]);
  
  // eslint-disable-next-line
  let { loading, error, data, query, setQuery } = useQuery();
  useEffect(()=>{
    if(!store.bestStore.isDirty()){
      setQuery(store.querySearchById({
          idList: {
            value: [...discretesOrder.map((item: DiscreteOrder) => item.id)]
          }
        }));
    } else {
      const bestDiscretes = store.bestStore.layersList as LayerRasterRecordModelType[]
      store.discreteLayersStore.setLayersImagesData(bestDiscretes as LayerMetadataMixedUnion[]);
      setDiscretes(bestDiscretes);
    }
  },[]);

  useEffect(()=>{
    const layersList = get(data,'searchById') as LayerRasterRecordModelType[];
    if (!isEmpty(layersList) && !isEmpty(discretesOrder)) {
      const layers = cloneDeep(layersList);

      layers.forEach(discrete => {
        const layer = discretesOrder.find(item => discrete.id === item.id);
        if (layer){
          discrete.order = layer.zOrder;
        }
      });

      store.bestStore.setLayersList(layers);
      store.discreteLayersStore.setLayersImagesData(layers);
      setDiscretes(layers);
    }
  }, [data, store.bestStore, store.discreteLayersStore, discretesOrder]);

  useEffect(() => {
    if(!props.openImport && !isEmpty(store.discreteLayersStore.previewedLayers)){
      store.discreteLayersStore.previewedLayers?.forEach((layerId) => {
        store.discreteLayersStore.showLayer(layerId, false, null);
      });
      store.discreteLayersStore.cleanPreviewedLayer();
    }

  }, [props.openImport, store.discreteLayersStore, store.discreteLayersStore.previewedLayers]);

  const handleImport = (): void => {
    // store.bestStore.addImportLayersToBest();
    props.handleCloseImport(false);
  };
 
  const handleSave = (isApply: boolean): void => {
    const currentDiscretesListRef = get(discretesListRef, 'current');
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if ( currentDiscretesListRef !== undefined ) {
      //@ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const newOrderedDiscretesList = currentDiscretesListRef.getOrderedDiscretes() as DiscreteOrder[];
      if (best !== undefined && !isEmpty(best)) {
        //@ts-ignore
        const newBest = { 
          ...best,
          discretes: [...newOrderedDiscretesList] 
        } as BestRecordModelType;
        
        store.bestStore.saveDraft(newBest);

        if (isApply) {
          store.bestStore.editBest(newBest);
        } else {
          store.bestStore.editBest(undefined);
          store.bestStore.setLayersList([]);
        }
      }
    }
  };

  const handleSendToApproval = (): void => {
    // TODO: send to approval
  };

  return (
    <>
      <BestDetailsComponent best={best}/>

      <BestDiscretesComponent
        //@ts-ignore
        ref={discretesListRef}
        discretes={discretes}
        style={{ height: 'calc(100% - 200px)', width: 'calc(100% - 8px)' }}/>
      
      <Box className="actionButton">
        <Box>
          <Button raised type="button" onClick={(): void => { handleSave(true); } }>
            <FormattedMessage id="general.apply-btn.text"/>
          </Button>
        </Box>
        <Box>
          <Button raised type="button" onClick={(): void => { handleSave(false); } }>
            <FormattedMessage id="general.save-btn.text"/>
          </Button>
        </Box>
        <Box>
          <Button raised type="button" onClick={(): void => { handleSendToApproval(); } }>
            <FormattedMessage id="general.send-to-approval-btn.text"/>
          </Button>
        </Box>
      </Box>

      {
        props.openImport && <Box className="bestCatalogImportContainer">
          <BestCatalogComponent filterOut={discretesOrder}/>

          <Box className="buttons">
            <Button type="button" onClick={(): void => { props.handleCloseImport(false); }}>
              <FormattedMessage id="general.cancel-btn.text"/>
            </Button>
            <Button raised type="button" disabled={true} onClick={(): void => { handleImport(); }}>
              <FormattedMessage id="best-edit.import.dialog.import-btn.text"/>
            </Button>
          </Box>
        </Box>
      }
    </>
  );
})