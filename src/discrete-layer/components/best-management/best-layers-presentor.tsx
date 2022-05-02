/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useLayoutEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { isEmpty, get } from 'lodash';
import { useCesiumMap } from '@map-colonies/react-components';
import { usePrevious } from '../../../common/hooks/previous.hook';
import { LayerRasterRecordModelType, LinkModelType, useStore } from '../../models';
import { findLayerLink, generateLayerRectangle, getWMTSOptions } from '../helpers/layersUtils';

interface IRasterLayerProperties {
  url: string;
  protocol: string;
  options: Record<string, unknown>;
}

export const BestLayersPresentor: React.FC = observer((props) => {
  const store = useStore();
  const mapViewer = useCesiumMap();

  const [layersImages, setlayersImages] = useState<LayerRasterRecordModelType[]>([]);
  const prevLayersImages = usePrevious<LayerRasterRecordModelType[]>(layersImages);

  const buildLayerProperties = (layer: LayerRasterRecordModelType): IRasterLayerProperties => {
    let capability;
    let options: Record<string, unknown> = {};
    let layerLink = findLayerLink(layer);
    if (layerLink === undefined) {
      layerLink = get(layer, 'links[0]') as LinkModelType;
    } else {
      capability = store.discreteLayersStore.capabilities?.find(item => layerLink?.name === item.id);
      options = {
        ...getWMTSOptions(layer, layerLink.url as string, capability),
        rectangle: generateLayerRectangle(layer),
     };
    }
    return {
      url: layerLink.url as string,
      protocol: layerLink.protocol as string,
      options,
    }
  };

  const addLayersToMap = (layersImages: LayerRasterRecordModelType[]): void =>{
    layersImages.forEach((layer, idx) => {
      const layerProperties = buildLayerProperties(layer);

      mapViewer.layersManager?.addRasterLayer(
        {
          id: layer.id,
          type: layerProperties.protocol as "OSM_LAYER" | "WMTS_LAYER" | "WMS_LAYER" | "XYZ_LAYER",
          opacity: 1,
          zIndex: layer.order as number,
          show: layer.layerImageShown === true,
          options: {
            ...layerProperties.options,
            url: layerProperties.url,
          },
          details: {
            footprint: layer.footprint as Record<string, unknown>,
            name: layer.productName,
          },
        }, 
        mapViewer.layersManager.length(),
        '');
    });
  };

  useLayoutEffect(() => {
    if (!isEmpty(store.bestStore.layersList)) {
      const sortedLayers = [...(store.bestStore.layersList ?? [])].sort(
        // @ts-ignore
        (layer1, layer2) => layer1.order - layer2.order
      );
      setlayersImages(sortedLayers);
    } else {
      mapViewer.layersManager?.removeNotBaseMapLayers();
      setlayersImages([]);
    }
  }, [store.bestStore.layersList, mapViewer]);

  useLayoutEffect(() => {
    if (isEmpty(prevLayersImages)) {
      addLayersToMap(layersImages);
    } else {
      (prevLayersImages ?? []).forEach(prevLayer => {
        const layer = layersImages.find(layer => layer.id === prevLayer.id);
        if (layer && layer.layerImageShown !== prevLayer.layerImageShown) {
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          mapViewer.layersManager?.show(layer.id, layer.layerImageShown ? true : false);
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layersImages, mapViewer, prevLayersImages]);

  useLayoutEffect(() => {
    if (store.bestStore.movedLayer) {
      if (store.bestStore.movedLayer.from > store.bestStore.movedLayer.to) {
        mapViewer.layersManager?.raise(store.bestStore.movedLayer.id, store.bestStore.movedLayer.from - store.bestStore.movedLayer.to);
      } else {
        mapViewer.layersManager?.lower(store.bestStore.movedLayer.id, store.bestStore.movedLayer.to - store.bestStore.movedLayer.from);
      }
    }
  }, [store.bestStore.movedLayer, mapViewer]);

  useLayoutEffect(() => {
    if (store.bestStore.deletedLayer) {
      mapViewer.layersManager?.removeLayer(store.bestStore.deletedLayer.id);
    }
  }, [store.bestStore.deletedLayer, mapViewer]);

  useLayoutEffect(() => {
    if (store.bestStore.importedLayers) {
      addLayersToMap(store.bestStore.importedLayers);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.bestStore.importedLayers]);
  
  return (
    <></>
  );
});