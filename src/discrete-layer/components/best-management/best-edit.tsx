import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { isEmpty, get } from 'lodash';
import { Button } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { BestRecordModelType, LayerRasterRecordModelType, useStore } from '../../models';
import { DiscreteOrder } from '../../models/DiscreteOrder';
import { BestDiscretesComponent } from './best-discretes';
import { BestDetailsComponent } from './best-details';

import './best-edit.css';

interface BestEditComponentProps {
  best?: BestRecordModelType | undefined;
}

export const BestEditComponent: React.FC<BestEditComponentProps> = observer((props) => {
  const { best } = props;
  const store = useStore();
  //@ts-ignore
  const discretesOrder = best?.discretes as DiscreteOrder[];
  const ids = discretesOrder.map((item: DiscreteOrder) => item.id);
  const discretesListRef = useRef();
  const [discretes, setDiscretes] = useState<LayerRasterRecordModelType[]>([]);
  
  useEffect(() => {
    void store.bestStore.getLayersById(ids);
  }, []);

  useEffect(() => {
    if (store.bestStore.layersList) {
      setDiscretes(store.bestStore.layersList);
    }
  }, [store.bestStore.layersList]);
  
  if (!isEmpty(discretesOrder) && !isEmpty(discretes)) {
    discretes?.forEach(discrete => {
      const layer = discretesOrder.find(item => discrete.id === item.id);
      if (layer){
        discrete.order = layer.zOrder;
      }
    });
  }
  
  const handleSave = (): void => {
    const currentDiscretesListRef = get(discretesListRef, 'current');
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if ( currentDiscretesListRef !== undefined ) {
      //@ts-ignore
      const newOrderedDiscretesList = currentDiscretesListRef.getOrderedDiscretes() as DiscreteOrder[];
      if (best !== undefined && !isEmpty(best)) {
        //@ts-ignore
        const newBest = { ...best, discretes: [...newOrderedDiscretesList] } as BestRecordModelType;
        store.bestStore.saveDraft(newBest);
        store.bestStore.editBest(newBest);
      }
    }
  };

  return (
    <>
      <BestDetailsComponent best={best}/>

      <BestDiscretesComponent
        //@ts-ignore
        ref={discretesListRef}
        discretes={discretes}
        style={{ height: 'calc(100% - 200px)', width: 'calc(100% - 8px)' }}/>

      <Box className="saveButton">
        <Button raised type="button" onClick={(): void => { handleSave(); } }>
          <FormattedMessage id="general.save-btn.text"/>
        </Button>
      </Box>
    </>
  );
})