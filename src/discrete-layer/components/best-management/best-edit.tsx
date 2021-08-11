import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { isEmpty, get, cloneDeep } from 'lodash';
import { Button } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { usePrevious } from '../../../common/hooks/previous.hook';
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
  
  const prevDiscretes = usePrevious<LayerRasterRecordModelType[]>(discretes);
  const cacheRef = useRef([] as LayerRasterRecordModelType[]);

  let  loading: boolean,
       error: any,
       data: { searchById: LayerMetadataMixedUnion[]; } | undefined,
       query: any; 
  // if(store.bestStore.layersList?.length === 0){
    // eslint-disable-next-line
    const queryObj = useQuery((store) =>
      store.querySearchById({
        idList: {
          value: [...discretesOrder.map((item: DiscreteOrder) => item.id)]
        }
      })
    );
    loading = queryObj.loading;
    // @ts-ignore
    error = queryObj.error;
    data = queryObj.data;
    query  = queryObj.query;
  // } else {
  //   data = {
  //     searchById: store.bestStore.layersList as LayerMetadataMixedUnion[]
  //   }
  // }

  useEffect(()=>{
    if (data?.searchById && !isEmpty(discretesOrder)) {
      const layers = cloneDeep(data.searchById as LayerRasterRecordModelType[]);

      // if(store.bestStore.layersList?.length === 0){
        layers.forEach(discrete => {
          const layer = discretesOrder.find(item => discrete.id === item.id);
          if (layer){
            discrete.order = layer.zOrder;
          }
        });
      // }

      store.bestStore.setLayersList(layers);
      store.discreteLayersStore.setLayersImages(layers, false);

      cacheRef.current = layers;
    }
  }, [data, store.bestStore, store.discreteLayersStore, discretesOrder]);

  useEffect(() => {
    if (store.bestStore.layersList) {
      if(prevDiscretes?.length !== store.bestStore.layersList.length) {
        setDiscretes(store.bestStore.layersList);
      }
    }
  }, [store.bestStore.layersList]);

  useEffect(() => {
    cacheRef.current = discretes;
  }, [discretes]);

  useEffect(() => {
    if(!props.openImport && !isEmpty(store.discreteLayersStore.previewedLayers)){
      store.discreteLayersStore.previewedLayers?.forEach((layerId) => {
        store.discreteLayersStore.showLayer(layerId, false, null);
      });
      store.discreteLayersStore.cleanPreviewedLayer();
    }

  }, [props.openImport, store.discreteLayersStore, store.discreteLayersStore.previewedLayers]);

 
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

        if(isApply){
          store.bestStore.editBest(newBest);
        }
        else {
          store.bestStore.editBest(undefined);
          store.bestStore.setLayersList([]);
        }
      }
    }
  };

  return (
    <>
      <BestDetailsComponent best={best}/>

      <BestDiscretesComponent
        //@ts-ignore
        ref={discretesListRef}
        discretes={cacheRef.current}
        style={{ height: 'calc(100% - 200px)', width: 'calc(100% - 8px)' }}/>

      <Box className="saveButton">
        <Button raised type="button" onClick={(): void => { handleSave(false); } }>
          <FormattedMessage id="general.save-btn.text"/>
        </Button>
        <Button raised type="button" onClick={(): void => { handleSave(true); } }>
          <FormattedMessage id="general.apply-btn.text"/>
        </Button>
        
      </Box>

      {
        props.openImport && <Box className="bestCatalogImportContainer">
          <BestCatalogComponent filterOut={discretesOrder}/>

          <Box className="buttons">
            <Button type="button" onClick={(): void => { props.handleCloseImport(false); }}>
              <FormattedMessage id="general.cancel-btn.text"/>
            </Button>
            <Button raised type="button" disabled={false}>
              <FormattedMessage id="best-edit.import.dialog.import-btn.text"/>
            </Button>
          </Box>
        </Box>
      }
    </>
  );
})