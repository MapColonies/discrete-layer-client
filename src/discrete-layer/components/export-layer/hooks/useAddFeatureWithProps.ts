import { degreesPerPixel, degreesPerPixelToZoomLevel } from '@map-colonies/mc-utils';
import { Feature } from 'geojson';
import { get, isEmpty } from 'lodash';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { RegisterOptions } from 'react-hook-form';
import { useIntl } from 'react-intl';
import EnumsMapContext, { IEnumsMapType } from '../../../../common/contexts/enumsMap.context';
import { RecordType, useStore, FieldConfigModelType, ValidationConfigModelType } from '../../../models';
import { LayerMetadataMixedUnionKeys, LayerRecordTypes } from '../../layer-details/entity-types-keys';
import { getTimeStamp } from '../../layer-details/utils';

// Add here more fields as union of strings.
export type AvailableProperties =
  | 'areaZoomLevel'
  | 'description'
  | 'projection'
  | 'resampleMethod'
  | 'dataType'
  | 'resolution';

export type ExportFieldOptions =  Partial<FieldConfigModelType> & {
  defaultsFromEntityField?: LayerMetadataMixedUnionKeys;
  formatValueFunc?: (val: unknown) => unknown;
  isExternal?: boolean;
  rhfValidation?: RegisterOptions;
  helperTextValue?: string | ((value: unknown) => string);
  placeholderValue?: string | (() => string);
}

type ExportEntityProp = Record<
  AvailableProperties,
  ExportFieldOptions
>;

interface IUseAddFeatureWithProps { 
  externalFields?: Record<AvailableProperties, unknown>;
  internalFields?: Record<AvailableProperties, unknown>;
  propsForDomain?: ExportEntityProp;
}

const ABSOLUTE_MAX_ZOOM_LEVEL = 22;

const useAddFeatureWithProps = (): IUseAddFeatureWithProps => {
  const store = useStore();
  const intl = useIntl();
  const { enumsMap } = useContext(EnumsMapContext);
  const enums = enumsMap as IEnumsMapType;

  const [propsForDomain, setPropsForDomain] = useState<ExportEntityProp>();
  const [internalPropsForDomain, setInternalPropsForDomain] = useState<Record<AvailableProperties, unknown>>({} as Record<AvailableProperties, unknown>);
  const [externalPropsForDomain, setExternalPropsForDomain] = useState<Record<AvailableProperties, unknown>>({} as Record<AvailableProperties, unknown>);

  const tempRawSelection = store.exportStore.tempRawSelection;
  const layerToExport = store.exportStore.layerToExport;

  const getStaticMinMaxForField = useCallback((
    layerRecordType: LayerRecordTypes,
    fieldName: LayerMetadataMixedUnionKeys
  ): { min?: number; max?: number } => {
    const fieldConfig = store.discreteLayersStore.getFieldConfig(layerRecordType, fieldName);
    const fieldValidation = (fieldConfig?.validation ??[]) as ValidationConfigModelType[];
    const minMaxValues = fieldValidation.reduce<{ min?: number; max?: number }>(
      (acc, validation): { min?: number; max?: number } => {
        if (!isEmpty(validation.min)) {
          return { ...acc, min: Number(validation.min as string) };
        }

        if (!isEmpty(validation.max)) {
          return { ...acc, max: Number(validation.max as string) };
        }

        return acc;
      },
      {}
    );

    return minMaxValues;
  }, [store.discreteLayersStore.getFieldConfig]);

  const PROPS_PER_DOMAIN = useMemo(() => new Map<RecordType, Partial<ExportEntityProp>>([
    [
      RecordType.RECORD_RASTER,
      {
        description: {
          isExternal: true,
        },
        areaZoomLevel: {
          placeholderValue: (): string => {
            let maxZoomLevel: number;
            const minZoomLevel = 1;
            try {
              maxZoomLevel = degreesPerPixelToZoomLevel(
                get(layerToExport, 'maxResolutionDeg') as number
              );
            } catch (e) {
              console.error(e);
              maxZoomLevel = ABSOLUTE_MAX_ZOOM_LEVEL;
            }

            return `${minZoomLevel} - ${maxZoomLevel}`;
          },
          helperTextValue: (value): string => {
            const RES_PER_PIXEL_ACCURACY = 5;
            let resPerPixel = NaN;
           
            try {
              resPerPixel = parseFloat(degreesPerPixel(value as number).toFixed(RES_PER_PIXEL_ACCURACY));
            } catch (e) {
              console.error(e);
            }

            const helperTextVal = intl.formatMessage({id: 'export-layer.areaZoomLevel.helper-text'}, { res: resPerPixel });
            return helperTextVal;
          },
          rhfValidation: {
            validate: {
              checkMinVal: (val): string | boolean => {
                const MIN_VALUE = 1;
                const minimumErrMsg = intl.formatMessage({id: 'export-layer.validations.min'}, {min: MIN_VALUE})
                
                return parseInt(val) < MIN_VALUE ? minimumErrMsg : true;
              },
              lowerOrEqualsToMaxRes: (val): string | boolean => {
                let maxZoomLevel: number;
                try {
                  maxZoomLevel = degreesPerPixelToZoomLevel(get(layerToExport, 'maxResolutionDeg') as number);

                } catch(e){
                  console.error(e);
                  maxZoomLevel = ABSOLUTE_MAX_ZOOM_LEVEL;
                }

                const maximumErrMsg = intl.formatMessage({id: 'export-layer.validations.max'}, {max: maxZoomLevel});
                
                return parseInt(val) > maxZoomLevel ? maximumErrMsg : true;
              }
            },
            valueAsNumber: true
           }
        },
      },
    ],
    [RecordType.RECORD_3D, {
      description: {
        isExternal: true,
      },
    }],
    [RecordType.RECORD_DEM, {
      resolution: {
        placeholderValue: (): string => {
          const minMaxValues = getStaticMinMaxForField('LayerDemRecord', 'resolutionMeter');

          const minResolutionMeter = get(layerToExport, 'resolutionMeter') as number;
          const maxResolutionMeter = minMaxValues.max as number;
          
          return `${minResolutionMeter} - ${maxResolutionMeter}`;
        },
        helperTextValue: intl.formatMessage({id: 'export-layer.resolution.helper-text'}),
        rhfValidation: {
          validate: {
            checkMinVal: (val): string | boolean => {
              const minResolutionDeg = get(layerToExport, 'resolutionMeter') as number;
              const minimumErrMsg = intl.formatMessage({id: 'export-layer.validations.min'}, {min: minResolutionDeg})

              return val !== '' && +val < minResolutionDeg ? minimumErrMsg : true;
            },
            lowerOrEqualsToMaxRes: (val): string | boolean => {
              const maxResolutionDeg = getStaticMinMaxForField('LayerDemRecord', 'resolutionMeter').max as number;
              const maximumErrMsg = intl.formatMessage({id: 'export-layer.validations.max'}, {max: maxResolutionDeg});

              return val !== '' && +val > maxResolutionDeg ? maximumErrMsg : true;
            }
          },
          valueAsNumber: true
         }
      },
      description: {
        isExternal: true,
      },
      projection: {
        isExternal: true,
        rhfValidation: {
          required: {value: true, message: intl.formatMessage({id: 'export-layer.validations.required'})}
        }
      },
      resampleMethod: {
        isExternal: true,
        rhfValidation: {
          required: {value: true, message: intl.formatMessage({id: 'export-layer.validations.required'})}
        }
      },
      dataType: {
        isExternal: true,
        rhfValidation: {
          required: {value: true, message: intl.formatMessage({id: 'export-layer.validations.required'})}
        }
      }

    }],
  ]), [layerToExport]);

  const getPropsForFeature = (predicate: (fieldOptions: ExportFieldOptions) => boolean): Record<string, unknown> => {
    const featureProps: Record<string, unknown> = {};

    for(const [fieldName, fieldOptions] of Object.entries(propsForDomain ?? {})) {
      if(predicate(fieldOptions)) {
        let fieldValue = get(layerToExport, fieldOptions.defaultsFromEntityField as string) as string | undefined ?? '';
        
        if(typeof fieldOptions.formatValueFunc !== 'undefined' && fieldValue) {
          const formattedVal = fieldOptions.formatValueFunc(fieldValue) as string | undefined;
          fieldValue = formattedVal ?? ''
        }
        featureProps[fieldName] = fieldValue;
      }
    }

    return featureProps; 
  }

  const getInternalPropsForFeature = (): Record<string, unknown> => {
    return getPropsForFeature((options) => !(options.isExternal as boolean)); 
  }

  const getExternalPropsForEntity = (): Record<string, unknown> => {
    return getPropsForFeature((options) => options.isExternal as boolean); 
  }

  useEffect(() => {
    const layerRecordType = get(enums, layerToExport?.productType as string).parentDomain as RecordType;

    setPropsForDomain(PROPS_PER_DOMAIN.get(layerRecordType) as ExportEntityProp);
  }, [layerToExport]);

  useEffect(() => {
    setExternalPropsForDomain(getExternalPropsForEntity());
    setInternalPropsForDomain(getInternalPropsForFeature());
  }, [propsForDomain])

  useEffect(() => {
    if(tempRawSelection) {
      // Add entity related properties to the raw selection.
      const selectionWithProps: Feature = {...tempRawSelection, properties: {...internalPropsForDomain, id: getTimeStamp()}};

      // Add the enhanced feature to the feature collection.
      store.exportStore.addFeatureSelection(selectionWithProps);
      store.exportStore.resetTempRawSelection();
    }
  }, [tempRawSelection]);

  return { propsForDomain, externalFields: externalPropsForDomain, internalFields: internalPropsForDomain };
};

export default useAddFeatureWithProps;
