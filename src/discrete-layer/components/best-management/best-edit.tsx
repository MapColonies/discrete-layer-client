import React, {useEffect, useState, useRef} from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../../models';

export const BestEditComponent: React.FC = observer(() => {
  const store = useStore();

  return (
    <div>
      {JSON.stringify(store.discreteLayersStore.editingBest)}
    </div>
  )
})