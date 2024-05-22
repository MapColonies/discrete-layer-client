import { Vector } from 'ol/layer';
import { Style, Stroke, Fill } from 'ol/style';

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
                                color: "#00ff00"
                              }),
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

//PPMapStyles.get(FeatureType.PP_PERIMETER)?.getF