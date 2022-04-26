import bbox from '@turf/bbox';
import { Rectangle } from 'cesium';
import { get } from 'lodash';
import { LayerRasterRecordModelType, LinkModelType } from '../../models';
import { ILayerImage } from '../../models/layerImage';

export const generateLayerRectangle = (
  layer: LayerRasterRecordModelType
): Rectangle => {
  return Rectangle.fromDegrees(...bbox(layer.footprint));
};

export const findLayerLink = (layer: ILayerImage): LinkModelType | undefined => {
  return layer.links?.find((link: LinkModelType) => ['WMTS_tile', 'WMTS_LAYER'].includes(link.protocol as string)) as LinkModelType | undefined;
};

export const getLayerLink = (layer: ILayerImage): LinkModelType => {
  let layerLink = findLayerLink(layer);
  if (layerLink === undefined) {
    layerLink = get(layer, 'links[0]') as LinkModelType;
  }
  return layerLink;
};
