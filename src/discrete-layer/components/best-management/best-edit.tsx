import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { isEmpty, get, cloneDeep } from 'lodash';
import { Button, IconButton } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { usePrevious } from '../../../common/hooks/previous.hook';
import { BestRecordModelType, LayerRasterRecordModelType, useQuery, useStore } from '../../models';
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

  // eslint-disable-next-line
  const { loading, error, data, query } = useQuery((store) =>
    store.querySearchById({
      idList: {
        value: [...discretesOrder.map((item: DiscreteOrder) => item.id)]
      }
    })
  );

  useEffect(()=>{
    if (data?.searchById) {
      const layers = cloneDeep(data.searchById as LayerRasterRecordModelType[]);

      layers.forEach(discrete => {
        const layer = discretesOrder.find(item => discrete.id === item.id);
        if (layer){
          discrete.order = layer.zOrder;
        }
      });

      store.bestStore.setLayersList(layers);

      cacheRef.current = layers;
    }
  }, [data, store.bestStore, discretesOrder]);

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

  const save = (): void => {
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
        store.bestStore.editBest(newBest);
      }
    }
  };

  const close = (): void => {
    // TODO: close draft tab
  };
 
  const handleApply = (): void => {
    save();
  };

  const handleSave = (): void => {
    save();
    close();
  };

  const handleSendToApproval = (): void => {
    save();
    close();
  };

  return (
    <>
      <BestDetailsComponent best={best}/>

      <BestDiscretesComponent
        //@ts-ignore
        ref={discretesListRef}
        discretes={cacheRef.current}
        style={{ height: 'calc(100% - 200px)', width: 'calc(100% - 8px)' }}/>

      <Box className="actionButton">
        <Box>
          <Button raised type="button" onClick={(): void => { handleApply(); } }>
            <FormattedMessage id="general.apply-btn.text"/>
          </Button>
        </Box>
        <Box>
          <Button raised type="button" onClick={(): void => { handleSave(); } }>
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
          <IconButton
            className="closeIcon mc-icon-Close"
            label="CLOSE"
            onClick={ (): void => { props.handleCloseImport(false); } }
          />
          <BestCatalogComponent closeImport={props.handleCloseImport}/>
        </Box>
      }
    </>
  );
})