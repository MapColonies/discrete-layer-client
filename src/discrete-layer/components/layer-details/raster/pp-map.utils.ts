import { Feature } from 'geojson';
import { get } from 'lodash';
import { Vector } from 'ol/layer';
import { Style, Stroke, Fill, Text } from 'ol/style';
import CONFIG from '../../../../common/config';
import { LayerRasterRecordModelType } from '../../../models';
import { dateFormatter } from '../../../../common/helpers/formatters';

export enum FeatureType {
  DEFAULT = 'DEFAULT',
  PP_PERIMETER = 'PP_PERIMETER',
  SOURCE_EXTENT ='SOURCE_EXTENT',
  EXISTING_PP='EXISTING_PP',
  SELECTED='SELECTED',
  ILLEGAL_PP='ILLEGAL_PP',
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
],
[FeatureType.ILLEGAL_PP, new Style({
  stroke: new Stroke({
    width: 2,
    color: "#e91e63"
  }),
  fill: new Fill({
    color: "#e91e6385"
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

// Inspired by https://openlayers.org/en/latest/examples/vector-labels.html
const stringDivider = (str:string, width:number, spaceReplacer: string):string  => {
  if (str.length > width) {
    let p = width;
    while (p > 0 && str[p] !== ' ' && str[p] !== '-') {
      p--;
    }
    if (p > 0) {
      let left;
      if (str.substring(p, p + 1) === '-') {
        left = str.substring(0, p + 1);
      } else {
        left = str.substring(0, p);
      }
      const right = str.substring(p + 1);
      return left + spaceReplacer + stringDivider(right, width, spaceReplacer);
    }
  }
  return str;
}

const getText = (feature: Feature, resolution: number, featureConfig: Record<string,string>, ZOOM_LEVELS_TABLE: Record<string,number>) => {
  const type = featureConfig.text;
  const maxResolution = parseInt(featureConfig.maxreso);
  const zoomLevel = Object.values(ZOOM_LEVELS_TABLE)
                      .map((res) => res.toString())
                      .findIndex( val => val === get(feature.properties,'resolutionDegree').toString())
  const ingestionDateUTC = dateFormatter(get(feature.properties,'ingestionDateUTC'), true);
  const updatedInVersion = get(feature.properties,'updatedInVersion');

  let text = `${ingestionDateUTC} (v${updatedInVersion}) \n\n ${zoomLevel}`;

  if (resolution > maxResolution) {
    text = '';
  } else if (type === 'hide') {
    text = '';
  } else if (type === 'shorten') {
    text = text.substring(12);
  } else if (
    type === 'wrap' &&
    (!featureConfig.placement || featureConfig.placement !== 'line')
  ) {
    text = stringDivider(text, 16, '\n');
  }

  return text;
};

export const FEATURE_LABEL_CONFIG = {
  // points: {
  // },
  // lines: {
  // },
  polygons: {
    text: 'normal',
    align: 'center',
    baseline: 'middle',
    rotation: '0',
    font: 'Roboto',
    weight: 'bold',
    placement: 'point',
    maxangle: '0.7853981633974483',
    overflow: 'false',
    size: '10px',
    height: '1',
    offsetX: '0',
    offsetY: '0',
    color: '#00ff00',
    // outline: '#ffffff',
    outlineWidth: '3',
    maxreso: '1200',
  },
};

export const createTextStyle = (feature: Feature, resolution: number, featureConfig: Record<string,string>, ZOOM_LEVELS_TABLE: Record<string,number>) => {
  const align = featureConfig.align;
  const baseline = featureConfig.baseline;
  const size = featureConfig.size;
  const height = featureConfig.height;
  const offsetX = parseInt(featureConfig.offsetX, 10);
  const offsetY = parseInt(featureConfig.offsetY, 10);
  const weight = featureConfig.weight;
  const placement = featureConfig.placement ? featureConfig.placement : undefined;
  const maxAngle = featureConfig.maxangle ? parseFloat(featureConfig.maxangle) : undefined;
  const overflow = featureConfig.overflow ? featureConfig.overflow === 'true' : undefined;
  const rotation = parseFloat(featureConfig.rotation);
  const font = weight + ' ' + size + '/' + height + ' ' + featureConfig.font;
  const fillColor = featureConfig.color;
  const outlineColor = featureConfig.outline;
  const outlineWidth = parseInt(featureConfig.outlineWidth, 10);

  return new Text({
    textAlign: align === '' ? undefined : align,
    textBaseline: baseline,
    font: font,
    text: getText(feature, resolution, featureConfig, ZOOM_LEVELS_TABLE),
    fill: new Fill({color: fillColor}),
    stroke: new Stroke({color: outlineColor, width: outlineWidth}),
    offsetX: offsetX,
    offsetY: offsetY,
    placement: placement,
    maxAngle: maxAngle,
    overflow: overflow,
    rotation: rotation,
  });
};