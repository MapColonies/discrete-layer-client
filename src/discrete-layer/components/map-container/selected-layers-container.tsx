/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState, useRef } from 'react';
import { get, isEmpty } from 'lodash';
import { observer } from 'mobx-react-lite';
import {
  CesiumCesiumEntity,
  CesiumColor,
  Cesium3DTileset,
  CesiumSceneMode,
  CesiumViewer,
  CesiumWFSLayer,
  CesiumWMTSLayer,
  CesiumXYZLayer,
  ICesiumImageryLayer,
  useCesiumMap,
  CesiumCesiumPolygonGraphics,
  CesiumCesiumPolylineGraphics,
  CesiumGeoJsonDataSource,
  CesiumCartographic,
  CesiumCartesian3,
  CesiumVerticalOrigin,
  CesiumJulianDate,
  CesiumCesiumBillboardGraphics,
  CesiumHeightReference,
  CesiumPositionProperty
} from '@map-colonies/react-components';
import CONFIG from '../../../common/config';
import { usePrevious } from '../../../common/hooks/previous.hook';
import { LinkType } from '../../../common/models/link-type.enum';
import { ILayerImage } from '../../models/layerImage';
import { useStore } from '../../models/RootStore';
import { Layer3DRecordModelType, LayerRasterRecordModelType, LinkModelType } from '../../models';
import {
  getLayerLink,
  generateLayerRectangle,
  getTokenResource,
  getWMTSOptions,
  getLinksArrWithTokens
} from '../helpers/layersUtils';

interface CacheMap {
  [key: string]: JSX.Element | undefined;
}

type SearchLayerPredicate = (layer: ICesiumImageryLayer, idx: number) => boolean;

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
    const layerLink = getLayerLink(layer);

    switch (layerLink.protocol) {
      case LinkType.XYZ_LAYER:
        return (
          <CesiumXYZLayer
            key={layer.id}
            meta={{
              id: layer.id,
              searchLayerPredicate: ((cesiumLayer, idx) => {
                const correctLinkByProtocol = (layer.links as LinkModelType[]).find(link => link.protocol === layerLink.protocol);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                return correctLinkByProtocol?.url === (cesiumLayer as any)._imageryProvider._resource._url
              }) as SearchLayerPredicate,
              layerRecord: {
                ...layer,
                links: getLinksArrWithTokens([...layer.links as LinkModelType[]])
              } as ILayerImage
            }}
            rectangle={generateLayerRectangle(layer as LayerRasterRecordModelType)}
            options={{ url: getTokenResource(layerLink.url as string) }}
          />
        );
      case LinkType.THREE_D_TILES:
      case LinkType.THREE_D_LAYER:
        return (
          <Cesium3DTileset
            maximumScreenSpaceError={CONFIG.THREE_D_LAYER.MAXIMUM_SCREEN_SPACE_ERROR}
            cullRequestsWhileMovingMultiplier={CONFIG.THREE_D_LAYER.CULL_REQUESTS_WHILE_MOVING_MULTIPLIER}
            preloadFlightDestinations
            preferLeaves
            skipLevelOfDetail
            key={layer.id}
            url={getTokenResource(layerLink.url as string, (layer as Layer3DRecordModelType).productVersion as string)}
          />
        );
      case LinkType.WMTS_LAYER:
      case LinkType.WMTS: {
        const capability = store.discreteLayersStore.capabilities?.find(item => layerLink.name === item.id);
        const optionsWMTS = {
          ...getWMTSOptions(layer as LayerRasterRecordModelType, layerLink.url as string, capability)
        };
        return (
          <CesiumWMTSLayer
            key={layer.id}
            meta={{
              id: layer.id,
              searchLayerPredicate: ((cesiumLayer, idx) => {
                const linkUrl = (optionsWMTS.url as Record<string, any>)._url as string;
                const cesiumLayerLinkUrl = get(cesiumLayer, '_imageryProvider._resource._url') as string;
                const isLayerFound = (linkUrl.split('?')[0] === cesiumLayerLinkUrl.split('?')[0]);
                return isLayerFound;
              }) as SearchLayerPredicate,
              layerRecord: {
                ...layer,
                links: getLinksArrWithTokens([...layer.links as LinkModelType[]])
              } as ILayerImage
            }}
            rectangle={generateLayerRectangle(layer as LayerRasterRecordModelType)}
            options={optionsWMTS}
          />
        );
      }
      case LinkType.WFS:
        const options = {
          url: layerLink.url ?? '',
          featureType: layerLink.name ?? '',
          style: CONFIG.WFS.STYLE,
          pageSize: CONFIG.WFS.MAX.PAGE_SIZE,
          zoomLevel: CONFIG.WFS.MAX.ZOOM_LEVEL,
          maxCacheSize: CONFIG.WFS.MAX.CACHE_SIZE,
          keyField: 'id'
        };
        const handleVisualization = (
          mapViewer: CesiumViewer,
          dataSource: CesiumGeoJsonDataSource,
          processEntityIds: string[]
        ): void => {
          const is3D = mapViewer.scene.mode === CesiumSceneMode.SCENE3D;
          dataSource?.entities.values.forEach((entity: CesiumCesiumEntity) => {
            if (processEntityIds.length > 0 && !processEntityIds.some((validId) => entity.id.startsWith(validId))) {
              return;
            }
            if (entity.polygon) {
              entity.polygon = new CesiumCesiumPolygonGraphics({
                hierarchy: entity.polygon.hierarchy,
                material: is3D
                  ? CesiumColor.fromCssColorString(CONFIG.WFS.STYLE.color).withAlpha(0.5)
                  : CesiumColor.fromCssColorString(CONFIG.WFS.STYLE.color).withAlpha(0.2),
                outline: true,
                outlineColor: CesiumColor.fromCssColorString(CONFIG.WFS.STYLE.color),
                outlineWidth: 3,
                height: is3D ? undefined : 10000, // Mount Everest peak reaches an elevation of approximately 8848.86 meters above sea level
                perPositionHeight: false,
              });
            }
            if (entity.polyline) {
              entity.polyline = new CesiumCesiumPolylineGraphics({
                positions: entity.polyline.positions,
                material: CesiumColor.fromCssColorString(CONFIG.WFS.STYLE.color).withAlpha(0.5),
                clampToGround: true,
                width: 4,
              });
            }
            if (entity.billboard) {
              const worldPos = entity.position?.getValue(CesiumJulianDate.now()) as CesiumCartesian3;
              const worlPosCartographic = CesiumCartographic.fromCartesian(worldPos);
              const correctedCarto = new CesiumCartographic(
                worlPosCartographic.longitude,
                worlPosCartographic.latitude,
                is3D ? mapViewer.scene.sampleHeight(CesiumCartographic.fromCartesian(worldPos)) : 500
              );
        
              // Convert back to Cartesian3
              const correctedCartesian = CesiumCartesian3.fromRadians(correctedCarto.longitude, correctedCarto.latitude, correctedCarto.height);
        
              entity.position = correctedCartesian as unknown as CesiumPositionProperty;
        
              entity.billboard = new CesiumCesiumBillboardGraphics({
                image:
                  'data:image/svg+xml;base64,' +
                  btoa(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                    <circle cx="8" cy="8" r="6" fill="${CONFIG.WFS.STYLE.color}33" stroke="#FFFF0080" stroke-width="2"/>
                  </svg>
                `), //${BRIGHT_GREEN}33 - with opacity 0.2 ; #FFFF0080 - with opacity 0.5
                verticalOrigin: CesiumVerticalOrigin.BOTTOM,
                heightReference: CesiumHeightReference.NONE, // Ensures it's not clamped and floats above
                scale: 1.0,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
              });
            }
          });
        };
        return (
          <CesiumWFSLayer
            key={layer.id}
            options={options}
            meta={layer as unknown as Record<string, unknown>}
            visualizationHandler={handleVisualization}
          />
        );
      default:
        return undefined;
    }
  };
  
  const getLayer = (layer: ILayerImage): JSX.Element | null | undefined => {
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
