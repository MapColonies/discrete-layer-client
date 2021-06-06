import React, { useEffect, useState, useRef } from 'react';
import { Cesium3DTileset, CesiumXYZLayer } from '@map-colonies/react-components';
import { observer } from 'mobx-react-lite';
import { isEmpty, get } from 'lodash';
import { usePrevious } from '../../../common/hooks/previous.hook';
import { useStore } from '../../models/RootStore';
import { ILayerImage } from '../../models/layerImage';
import { LinkModelType } from '../../models/LinkModel';

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
      // @ts-ignore
      setlayersImages(discreteLayersStore.layersImages.slice().sort((curr, next) => curr.order - next.order));
      if(isEmpty(discreteLayersStore.layersImages)) {
        cacheRef.current = {};
      }
    }
  }, [discreteLayersStore.layersImages]);

  const generateLayerComponent = (layer: ILayerImage) : JSX.Element | undefined  => {
    const layerLink: LinkModelType = get(layer,'links[0]') as LinkModelType;
    switch(layerLink.protocol){
      case 'XYZ_LAYER':
        return <CesiumXYZLayer key={layer.id} options={{url: layerLink.url as string}}/>
      case '3D_LAYER':
        return <Cesium3DTileset key={layer.id} url={layerLink.url as string}/>
      default:
        return undefined;
    }
  }

  const getLayer = (layer: ILayerImage) : JSX.Element | null | undefined  => {
    const cache = cacheRef.current;
    if(layer.layerImageShown === true){
      if(cache[layer.id] !== undefined){
        return cache[layer.id];
      } else{
        cache[layer.id] = generateLayerComponent(layer);
        return cache[layer.id];
      }
    }
    else{
      const prevLayer = (prevLayersImages as []).find((item: ILayerImage) => item.id === layer.id) as ILayerImage | undefined;
      if(prevLayer?.layerImageShown === true){
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
