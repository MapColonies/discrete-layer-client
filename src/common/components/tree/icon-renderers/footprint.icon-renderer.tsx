import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Checkbox } from '@map-colonies/react-core';
import { ILayerImage } from '../../../../discrete-layer/models/layerImage';
import { useStore } from '../../../../discrete-layer/models/RootStore';

import './footprint.icon-renderer.css';

interface IFootprintCellRendererParams {
  onClick: (data: ILayerImage, isShown: boolean) => void;
  data: ILayerImage;
}

export const FootprintRenderer: React.FC<IFootprintCellRendererParams> = observer((props) => {
  const [checked, setChecked] = useState<boolean>(props.data.footprintShown as boolean);
  const store = useStore();
  
  useEffect(() => {
    if ( props.data.id === store.actionDispatcherStore.action?.data.id &&
      ['LayerRasterRecord.flyTo','Layer3DRecord.flyTo'].includes(store.actionDispatcherStore.action.action)) {
      setChecked(true);
    }
  }, [store.actionDispatcherStore.action]);

  return (
    <Checkbox
      className="footprintIcon"
      checked={checked}
      onClick={
        (evt): void => {
          evt.stopPropagation();
          setChecked(evt.currentTarget.checked);
          props.onClick(props.data, evt.currentTarget.checked);
        }
      }
    />
  );
});
