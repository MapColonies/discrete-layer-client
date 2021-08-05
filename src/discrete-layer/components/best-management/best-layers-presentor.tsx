import React, { useLayoutEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { get } from 'lodash';
import { CesiumGeographicTilingScheme, useCesiumMap } from '@map-colonies/react-components';
import { usePrevious } from '../../../common/hooks/previous.hook';
import { LayerRasterRecordModelType, LinkModelType, useStore } from '../../models';

interface IRasterLayerProperties {
  url: string;
  protocol: string;
  options: Record<string, unknown>;
}

export const BestLayersPresentor: React.FC = observer((props) => {
  const { bestStore } = useStore();
  const mapViewer = useCesiumMap();

  const [layersImages, setlayersImages] = useState<LayerRasterRecordModelType[]>([]);
  const prevLayersImages = usePrevious<LayerRasterRecordModelType[]>(layersImages);

  const buildLayerProperties = (layer: LayerRasterRecordModelType): IRasterLayerProperties => {
    let options: Record<string, unknown> = {};
    let layerLink = layer.links?.find((link: LinkModelType)=> ['WMTS_tile','WMTS_LAYER'].includes(link.protocol as string)) as LinkModelType | undefined;
    if(layerLink === undefined){
      layerLink = get(layer,'links[0]') as LinkModelType;
    }
    else{
      options = {
        url: layerLink.url,
        layer: `${layer.productId as string}-${layer.productVersion as string}`,
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'newGrids',
        tilingScheme: new CesiumGeographicTilingScheme()
     };
    }
    return {
      url: layerLink.url as string,
      protocol: layerLink.protocol as string,
      options,
    }
  };

  useLayoutEffect(() => {
    // @ts-ignore
    if(bestStore.layersList?.length > 0 ){
      const sortedLayers = [...(bestStore.layersList ?? [])].sort(
        // @ts-ignore
        (layer1, layer2) => layer2.order - layer1.order
      );
  
      setlayersImages(sortedLayers);

    }
  }, [bestStore.layersList, mapViewer]);

  useLayoutEffect(() => {
    // @ts-ignore
    if((prevLayersImages ?? []).length === 0){
      layersImages.forEach((layer, idx) => {
        const layerProperties = buildLayerProperties(layer);
  
        mapViewer.layersManager?.addRasterLayer(
          {
            id: layer.id,
            type: layerProperties.protocol as "OSM_LAYER" | "WMTS_LAYER" | "WMS_LAYER" | "XYZ_LAYER",
            opacity: 1,
            zIndex: layer.order as number,
            show: false,
            options: {
              ...layerProperties.options,
              url: layerProperties.url,
            },
          }, 
          mapViewer.layersManager?.length(),
          '');
      });
    } else {
      (prevLayersImages ?? []).forEach(prevLayer => {
        const layer = layersImages.find(layer => layer.id === prevLayer.id);
        if(layer && layer.layerImageShown !== prevLayer.layerImageShown) {
          mapViewer.layersManager?.show(layer.id, layer.layerImageShown ? true : false);
        }
      })
    }
  }, [layersImages, mapViewer]);

  useLayoutEffect(() => {
    if(bestStore.movedLayer){
      if(bestStore.movedLayer.from > bestStore.movedLayer.to){
        mapViewer.layersManager?.raise(bestStore.movedLayer.id, bestStore.movedLayer.from - bestStore.movedLayer.to);
      } else {
        mapViewer.layersManager?.lower(bestStore.movedLayer.id, bestStore.movedLayer.to - bestStore.movedLayer.from);
      }
    }
  }, [bestStore.movedLayer, mapViewer]);
  
  return (
    <></>
  );
});