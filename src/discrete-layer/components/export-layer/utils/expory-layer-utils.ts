import { Feature } from "geojson";
import { AvailableProperties } from "../hooks/useAddFeatureWithProps";

export function sanitizeFeaturesWithProps(features: Feature[], internalPropsForDomain: Record<AvailableProperties, unknown>): Feature[] {
    const otherValidFeatureProps = ['label'];
    const getNewFeatureProps = (feature: Feature): Record<AvailableProperties, unknown> => {
      const internalProps = [...otherValidFeatureProps, ...Object.keys(internalPropsForDomain)]
      .reduce((props, key) => ({ ...props, [key]: '' }), {} as Record<AvailableProperties, unknown>);

      const featureProps = (feature.properties ?? {}) as Record<string, unknown>;
      const newFeatureProps = {} as Record<string, unknown>;

      for(const [internalPropKey, internalPropValue] of  Object.entries(internalProps)) {
        newFeatureProps[internalPropKey] = featureProps[internalPropKey] ?? internalPropValue;
      }
      return newFeatureProps;
    }

    return features.map(feature => ({...feature, properties: getNewFeatureProps(feature)}));
  }