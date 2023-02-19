import { degreesPerPixel, degreesPerPixelToZoomLevel } from '@map-colonies/mc-utils';
import { Feature } from 'geojson';
import { get } from 'lodash';
import { useContext, useEffect, useMemo, useState } from 'react';
import { RegisterOptions } from 'react-hook-form';
import { useIntl } from 'react-intl';
import EnumsMapContext, { IEnumsMapType } from '../../../../common/contexts/enumsMap.context';
import { RecordType, LayerMetadataMixedUnion, useStore, FieldConfigModelType } from '../../../models';
import { getTimeStamp } from '../../layer-details/utils';

type KeysOfUnion<T> = T extends T ? keyof T : never;

// All fields from all entities.
type LayerMetadataMixedUnionKeys = KeysOfUnion<LayerMetadataMixedUnion>;

// Add here more fields as union of strings.
export type AvailableProperties = 'areaZoomLevel' | 'description';

export type ExportFieldOptions =  Partial<FieldConfigModelType> & {
  defaultsFromEntityField?: LayerMetadataMixedUnionKeys;
  formatValueFunc?: (val: unknown) => unknown,
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

  const PROPS_PER_DOMAIN = useMemo(() => new Map<RecordType, Partial<ExportEntityProp>>([
    [
      RecordType.RECORD_RASTER,
      {
        description: {
          isExternal: true,
        },
        areaZoomLevel: {
          // defaultsFromEntityField: 'maxResolutionDeg',
          // formatValueFunc: (val): string | undefined => {
          //   try {
          //     return degreesPerPixelToZoomLevel(val as number).toString();
          //   } catch (e) {
          //     console.error(e);
          //   }
          // },
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
            // required: {value: true, message: intl.formatMessage({id: 'export-layer.validations.required'})},
            validate: {
              checkMinVal: (val): string | boolean => {
                const MIN_VALUE = 1;
                const minimumErrMsg = intl.formatMessage({id: 'export-layer.validations.min'}, {min: MIN_VALUE})
                
                return parseInt(val) < 1 ? minimumErrMsg : true
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
    [RecordType.RECORD_3D, {}],
    [RecordType.RECORD_DEM, {}],
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
