import React, { useLayoutEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { isEmpty, get } from 'lodash';
import { CesiumGeographicTilingScheme, useCesiumMap } from '@map-colonies/react-components';
import { usePrevious } from '../../../common/hooks/previous.hook';
import { dateFormatter } from '../../../common/helpers/type-formatters';
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
    if (layerLink === undefined) {
      layerLink = get(layer,'links[0]') as LinkModelType;
    } else {
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
            // resolution: layer.resolution,
            // updateDate: dateFormatter(layer.updateDate),
          },
        }, 
        mapViewer.layersManager.length(),
        '');
    });
  };

  useLayoutEffect(() => {
    if(!isEmpty(bestStore.layersList)){
      const sortedLayers = [...(bestStore.layersList ?? [])].sort(
        // @ts-ignore
        (layer1, layer2) => layer1.order - layer2.order
      );
  
      setlayersImages(sortedLayers);

    } else {
      mapViewer.layersManager?.removeNotBaseMapLayers();
      setlayersImages([]);
    }
  }, [bestStore.layersList, mapViewer]);

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
    if (bestStore.movedLayer) {
      if (bestStore.movedLayer.from > bestStore.movedLayer.to) {
        mapViewer.layersManager?.raise(bestStore.movedLayer.id, bestStore.movedLayer.from - bestStore.movedLayer.to);
      } else {
        mapViewer.layersManager?.lower(bestStore.movedLayer.id, bestStore.movedLayer.to - bestStore.movedLayer.from);
      }
    }
  }, [bestStore.movedLayer, mapViewer]);

  useLayoutEffect(() => {
    if (bestStore.deletedLayer) {
      mapViewer.layersManager?.removeLayer(bestStore.deletedLayer.id);
    }
  }, [bestStore.deletedLayer, mapViewer]);

  useLayoutEffect(() => {
    if (bestStore.importedLayers) {
      addLayersToMap(bestStore.importedLayers);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bestStore.importedLayers]);
  
  return (
    <></>
  );
});