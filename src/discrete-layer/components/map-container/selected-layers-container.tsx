/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState, useRef } from 'react';
import { Cesium3DTileset, CesiumGeographicTilingScheme, CesiumWMTSLayer, CesiumXYZLayer, RCesiumWMTSLayerOptions, useCesiumMap } from '@map-colonies/react-components';
import { observer } from 'mobx-react-lite';
import { isEmpty } from 'lodash';
import { Resource } from 'cesium';
import CONFIG from '../../../common/config';
import { usePrevious } from '../../../common/hooks/previous.hook';
import { useStore } from '../../models/RootStore';
import { ILayerImage } from '../../models/layerImage';
import { LayerRasterRecordModelType } from '../../models';
import { getLayerLink, generateLayerRectangle } from '../helpers/layersUtils';


interface CacheMap {
  [key: string]: JSX.Element | undefined
}

export const SelectedLayersContainer: React.FC = observer(() => {
  const store = useStore();
  const [layersImages, setlayersImages] = useState<ILayerImage[]>([]);
  const prevLayersImages = usePrevious<ILayerImage[]>(layersImages);
  const cacheRef = useRef({} as CacheMap);
  const mapViewer = useCesiumMap();
  
  useEffect(() => {
    if (store.discreteLayersStore.layersImages) {
      // @ts-ignore
      setlayersImages(store.discreteLayersStore.layersImages.slice().sort((curr, next) => curr.order - next.order));
      if (isEmpty(store.discreteLayersStore.layersImages)) {
        cacheRef.current = {};
      }
    }
  }, [store.discreteLayersStore.layersImages]);

  useEffect(() => {
    if (isEmpty(store.discreteLayersStore.previewedLayers)) {
      cacheRef.current = {};
    }
  }, [store.discreteLayersStore.previewedLayers]);

  const generateLayerComponent = (layer: ILayerImage): JSX.Element | undefined  => {
    let style = 'default';
    let format = 'image/jpeg';
    let tileMatrixSetID = 'newGrids';
    let capability;
    let optionsWMTS;
    const layerLink = getLayerLink(layer);
    
    const getTokenResource = (url: string): Resource => {
      const tokenProps: Record<string, unknown> = {url};
      
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const {INJECTION_TYPE, ATTRIBUTE_NAME, TOKEN_VALUE} = CONFIG.ACCESS_TOKEN as 
      // eslint-disable-next-line @typescript-eslint/naming-convention
      {INJECTION_TYPE: string, ATTRIBUTE_NAME: string, TOKEN_VALUE: string};
      
      if (INJECTION_TYPE.toLowerCase() === 'header') {
        tokenProps.headers = {
          [ATTRIBUTE_NAME]: TOKEN_VALUE
        } as Record<string, unknown>;
      } else if (INJECTION_TYPE.toLowerCase() === 'queryparam') {
        tokenProps.queryParameters = {
          [ATTRIBUTE_NAME]: TOKEN_VALUE
        } as Record<string, unknown>;
      }

      return new Resource({...tokenProps as unknown as Resource});
    };

    switch (layerLink.protocol) {
      case 'XYZ_LAYER':
        return (
          <CesiumXYZLayer
            rectangle={generateLayerRectangle(
              layer as LayerRasterRecordModelType
            )}
            key={layer.id}
            options={{ url: getTokenResource(layerLink.url as string) }}
          />
        );
      case '3DTiles':
      case '3D_LAYER':
        return (
          <Cesium3DTileset
            key={layer.id}
            url={getTokenResource(layerLink.url as string)}
          />
        );
      case 'WMTS_tile':
      case 'WMTS_LAYER':
        capability = store.discreteLayersStore.capabilities?.find(item => layerLink?.name === item.id);
        if (capability) {
          style = capability.style as string;
          format = (capability.format as string[])[0];
          tileMatrixSetID = (capability.tileMatrixSet as string[])[0];
        }
        optionsWMTS = {
          url: getTokenResource(layerLink.url as string),
          layer: `${(layer as LayerRasterRecordModelType).productId as string}-${(layer as LayerRasterRecordModelType).productVersion as string}`,
          style,
          format,
          tileMatrixSetID,
          tilingScheme: new CesiumGeographicTilingScheme()
        };
        return (
          <CesiumWMTSLayer
            rectangle={generateLayerRectangle(
              layer as LayerRasterRecordModelType
            )}
            options={optionsWMTS as RCesiumWMTSLayerOptions}
          />
        );
      default:
        return undefined;
    }
  }
  
  const getLayer = (layer: ILayerImage): JSX.Element | null | undefined  => {
    const cache = cacheRef.current;
    if (layer.layerImageShown === true) {
      if (cache[layer.id] !== undefined) {
        return cache[layer.id];
      } else {
        if (mapViewer.layersManager?.get(layer.id) === undefined) {
          cache[layer.id] = generateLayerComponent(layer);
          return cache[layer.id];
        } else {
          return <></>;
        }
      }
    } else {
      const prevLayer = (prevLayersImages as []).find((item: ILayerImage) => item.id === layer.id) as ILayerImage | undefined;
      if (prevLayer?.layerImageShown === true) {
        delete cache[layer.id];
        return null;
      }
    }
  };

  return (
    <>
      {
        layersImages.map((layer) => {
          return getLayer(layer);
        })
      }
    </>
  );
});
