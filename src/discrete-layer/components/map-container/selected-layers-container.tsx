import React, { useEffect, useState, useRef } from 'react';
import { CesiumXYZLayer } from '@map-colonies/react-components';
import { observer } from 'mobx-react-lite';
import { usePrevious } from '../../../common/hooks/previous.hook';
import { useStore } from '../../models/rootStore';
import { ILayerImage } from '../../models/layerImage';

interface CacheMap {
  [key: string]: JSX.Element | undefined
}

export const SelectedLayersContainer: React.FC = observer(() => {
  const { discreteLayersStore } = useStore();
  const [layersImages, setlayersImages] = useState<ILayerImage[]>([]);
  const prevLayersImages = usePrevious<ILayerImage[]>(layersImages);
  const cacheRef = useRef({} as CacheMap);
  
  useEffect(() => {
    if (discreteLayersStore.layersImages) {
      setlayersImages(discreteLayersStore.layersImages);
    }
  }, [discreteLayersStore.layersImages]);


  const getLayer = (layer: ILayerImage) : JSX.Element | null | undefined  => {
    const cache = cacheRef.current;
    if(layer.selected === true){
      if(cache[layer.id] !== undefined){
        return cache[layer.id];
      } else{
        cache[layer.id] = <CesiumXYZLayer options={{url: layer.properties?.url as string}}/>;
        return cache[layer.id];
      }
    }
    else{
      const prevLayer = (prevLayersImages as []).find((item: ILayerImage) => item.id === layer.id) as ILayerImage | undefined;
      if(prevLayer?.selected === true){
        delete cache[layer.id];
        return null;
      }
    }
  };

  return (
    <>
      {
        layersImages.map((layer)=>{
          return getLayer(layer);
        })
      }
    </>
  );
});
