import React, {useEffect, useState, useRef} from 'react';
import { observer } from 'mobx-react';
import { BestRecordModelType, useStore } from '../../models';
import { BestDiscretesComponent } from './best-discretes';
import { BestDetailsComponent } from './best-details';

interface BestEditComponentProps {
  best?: BestRecordModelType | undefined;
}

export const BestEditComponent: React.FC<BestEditComponentProps> = observer((props) => {
  const { best } = props;
  const store = useStore();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const ids = (best.discretes as unknown[]).map((item: { id: string; zOrder: number; }) => item.id);

  // @ts-ignore
  // const bestDiscretes = store.discreteLayersStore.tabViews[0].layersImages as LayerRasterRecordModelType[];
  
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const bestDiscretes = store.discreteLayersStore.getLayersById(ids);
  
  if (best?.discretes?.length > 0) {
    let bestItem;
    bestDiscretes?.map(discrete => {
      bestItem = best?.discretes.find(item => discrete.id === item.id);
      discrete.zOrder = bestItem.zOrder;
    });
  } else {
    bestDiscretes?.map(discrete => {
      discrete.zOrder = discrete.resolution;
    });
  }

  return (
    <>
      <BestDetailsComponent best={best}/>

      <BestDiscretesComponent
        discretes={bestDiscretes}
        style={{ height: 'calc(100% - 200px)', width: 'calc(100% - 8px)' }}/>
    </>
  );
})