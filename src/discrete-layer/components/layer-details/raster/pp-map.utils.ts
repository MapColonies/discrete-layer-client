import { Vector } from 'ol/layer';
import { Style, Stroke, Fill } from 'ol/style';
import CONFIG from '../../../../common/config';
import { LayerRasterRecordModelType } from '../../../models';
import { ILayerImage } from '../../../models/layerImage';

export enum FeatureType {
  DEFAULT = 'DEFAULT',
  PP_PERIMETER = 'PP_PERIMETER',
  SOURCE_EXTENT ='SOURCE_EXTENT',
  EXISTING_PP='EXISTING_PP',
  SELECTED='SELECTED',
}

export const PPMapStyles = new Map<FeatureType,Style|undefined>([
  // @ts-ignore
  [FeatureType.DEFAULT, new Vector().getStyleFunction()()[0]],
  [FeatureType.PP_PERIMETER, new Style({
                                stroke: new Stroke({
                                  width: 4,
                                  color: "#000000"
                                }),
                              })
  ],
  [FeatureType.SOURCE_EXTENT, new Style({
                                stroke: new Stroke({
                                  width: 4,
                                  color: "#7F00FF"
                                }),
                              })
  ],
  [FeatureType.EXISTING_PP, new Style({
                              stroke: new Stroke({
                                width: 2,
                                color: CONFIG.CONTEXT_MENUS.MAP.POLYGON_PARTS_FEATURE_CONFIG.outlineColor
                              }),
                              fill: new Fill({
                                color: CONFIG.CONTEXT_MENUS.MAP.POLYGON_PARTS_FEATURE_CONFIG.color
                              })
                            })
  ],
  [FeatureType.SELECTED, new Style({
                          stroke: new Stroke({
                            width: 2,
                            color: "#ff0000"
                          }),
                          fill: new Fill({
                            color: "#aa2727"
                          })
                        })
]
])

const POLYGON_PARTS_PREFIX = 'polygon_parts:';
const POLYGON_PARTS_SUFFIX = '_polygon_parts';
export const getTypeName = (layerRecord?: LayerRasterRecordModelType) => {
  // Naming convension of polygon parts feature typeName
  // polygon_parts:{lowercase(productId)}_{lowercase(productType)}_polygon_parts
  return layerRecord ? 
    `${POLYGON_PARTS_PREFIX}${layerRecord.productId?.toLowerCase()}_${layerRecord.productType?.toLowerCase()}${POLYGON_PARTS_SUFFIX}` :
    'SHOULD_BE_CALCULATED_FROM_UPDATED_LAYER';
}