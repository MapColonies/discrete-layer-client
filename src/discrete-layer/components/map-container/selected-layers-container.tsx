import React, { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../models/rootStore';
import { ILayerImage } from '../../models/layerImage';
import { CesiumXYZLayer } from '@map-colonies/react-components';


function usePrevious(value: any): any {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export const SelectedLayersContainer: React.FC = observer(() => {
  const { discreteLayersStore } = useStore();
  const [layersImages, setlayersImages] = useState<ILayerImage[]>([]);
  const prevLayersImages = usePrevious(layersImages);
  const cacheRef = useRef({})
  
  useEffect(() => {
    if (discreteLayersStore.layersImages) {
      setlayersImages(discreteLayersStore.layersImages);
    }
  }, [discreteLayersStore.layersImages]);


  const getLayer = (layer: ILayerImage) => {
    const cache = cacheRef.current;
    if(layer.selected){
      // @ts-ignore
      if(cache[layer.id] !== undefined){
        // @ts-ignore
        return cache[layer.id] as JSX.Element;
      } else{
        // @ts-ignore
        cache[layer.id] = <CesiumXYZLayer options={{url: layer.properties.url}}/>;
        // @ts-ignore
        return cache[layer.id] as JSX.Element;
      }
    }
    else{
      const prevLayer = (prevLayersImages as []).find((item: ILayerImage) => item.id === layer.id) as ILayerImage | undefined;
      if(prevLayer && prevLayer.selected){
        // @ts-ignore
        delete cache[ layer.id];
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
