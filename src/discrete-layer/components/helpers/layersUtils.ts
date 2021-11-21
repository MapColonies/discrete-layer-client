import bbox from '@turf/bbox';
import { Rectangle } from 'cesium';
import { LayerRasterRecordModelType } from '../../models';

export const generateLayerRectangle = (
  layer: LayerRasterRecordModelType
): Rectangle => {
  return Rectangle.fromDegrees(...bbox(layer.footprint));
};
