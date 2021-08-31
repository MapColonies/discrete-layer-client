import React, { useEffect, useState, useRef } from 'react';
import { Cesium3DTileset, CesiumGeographicTilingScheme, CesiumWMTSLayer, CesiumXYZLayer, RCesiumWMTSLayerOptions, useCesiumMap } from '@map-colonies/react-components';
import { observer } from 'mobx-react-lite';
import { isEmpty, get } from 'lodash';
import { usePrevious } from '../../../common/hooks/previous.hook';
import { useStore } from '../../models/RootStore';
import { ILayerImage } from '../../models/layerImage';
import { LinkModelType } from '../../models/LinkModel';
import { LayerRasterRecordModelType } from '../../models';

interface CacheMap {
  [key: string]: JSX.Element | undefined
}

export const SelectedLayersContainer: React.FC = observer(() => {
  const { discreteLayersStore } = useStore();
  const [layersImages, setlayersImages] = useState<ILayerImage[]>([]);
  const prevLayersImages = usePrevious<ILayerImage[]>(layersImages);
  const cacheRef = useRef({} as CacheMap);
  const mapViewer = useCesiumMap();
  
  useEffect(() => {
    if (discreteLayersStore.layersImages) {
      // @ts-ignore
      setlayersImages(discreteLayersStore.layersImages.slice().sort((curr, next) => curr.order - next.order));
      if(isEmpty(discreteLayersStore.layersImages)) {
        cacheRef.current = {};
      }
    }
  }, [discreteLayersStore.layersImages]);

  useEffect(() => {
    if (isEmpty(discreteLayersStore.previewedLayers)) {
      cacheRef.current = {};
    }
  }, [discreteLayersStore.previewedLayers]);

  const generateLayerComponent = (layer: ILayerImage) : JSX.Element | undefined  => {
    let optionsWMTS;
    let layerLink = layer.links?.find((link: LinkModelType)=> ['WMTS_tile','WMTS_LAYER'].includes(link.protocol as string)) as LinkModelType | undefined;
    if(layerLink === undefined){
      layerLink = get(layer,'links[0]') as LinkModelType;
    }
    else{
      optionsWMTS = {
        url: layerLink.url,
        layer: `${(layer as LayerRasterRecordModelType).productId as string}-${(layer as LayerRasterRecordModelType).productVersion as string}`,
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'newGrids',
        tilingScheme: new CesiumGeographicTilingScheme()
     };

    }
    switch(layerLink.protocol){
      case 'XYZ_LAYER':
        return <CesiumXYZLayer key={layer.id} options={{url: layerLink.url as string}}/>
      case '3DTiles':
      case '3D_LAYER':
        return <Cesium3DTileset key={layer.id} url={layerLink.url as string}/>
      case 'WMTS_tile':
      case 'WMTS_LAYER':
        return <CesiumWMTSLayer options={optionsWMTS as RCesiumWMTSLayerOptions}/>;
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
        if(mapViewer.layersManager?.get(layer.id) === undefined){
          cache[layer.id] = generateLayerComponent(layer);
          return cache[layer.id];
        }
        else{
          return <></>;
        }
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
