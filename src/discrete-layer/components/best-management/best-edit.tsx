import React, {useEffect, useState, useRef} from 'react';
import { observer } from 'mobx-react';
import { LayerRasterRecordModelType, useStore } from '../../models';
import { BestDiscretesComponent } from './best-discretes';

export const BestEditComponent: React.FC = observer(() => {
  const store = useStore();

  // @ts-ignore
  const bestDiscretes = store.discreteLayersStore.tabViews[0].layersImages as LayerRasterRecordModelType[];

  return (
    <div style={{height: '100%'}}>
      <BestDiscretesComponent 
        discretes={ bestDiscretes } 
        style={{ height: '100%', width: 'calc(100% - 8px)' }}
      />

      {JSON.stringify(store.discreteLayersStore.editingBest)}
    </div>
  )
})