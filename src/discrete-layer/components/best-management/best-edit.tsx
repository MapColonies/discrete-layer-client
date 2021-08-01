import React, {useEffect, useState, useRef} from 'react';
import { observer } from 'mobx-react';
import { BestRecordModelType, LayerRasterRecordModelType, useStore } from '../../models';
import { BestDiscretesComponent } from './best-discretes';
import { BestDetailsComponent } from './best-details';

interface BestEditComponentProps {
  best?: BestRecordModelType | undefined;
}

export const BestEditComponent: React.FC<BestEditComponentProps> = observer((props) => {
  const { best } = props;
  const store = useStore();

  // @ts-ignore
  const bestDiscretes = store.discreteLayersStore.tabViews[0].layersImages as LayerRasterRecordModelType[];
  // const bestDiscretes = getRecordsById(best.discretesArray);

  return (
    <>
      <BestDetailsComponent best={best}/>

      <BestDiscretesComponent
        discretes={bestDiscretes}
        style={{ height: 'calc(100% - 150px)', width: 'calc(100% - 8px)' }}/>
    </>
  );
})