import { degreesPerPixelToZoomLevel } from '@map-colonies/mc-utils';
import { Feature } from 'geojson';
import { get } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import EnumsMapContext, { IEnumsMapType } from '../../../../common/contexts/enumsMap.context';
import { RecordType, LayerMetadataMixedUnion, useStore } from '../../../models';
import { getTimeStamp } from '../../layer-details/utils';

type KeysOfUnion<T> = T extends T ? keyof T : never;

// All fields from all entities.
type LayerMetadataMixedUnionKeys = KeysOfUnion<LayerMetadataMixedUnion>;

// Add here more fields as union of strings.
type AvailableProperties = 'areaZoomLevel';

type ExportEntityProp = Record<
  AvailableProperties,
  {
    defaultsFromEntityField?: LayerMetadataMixedUnionKeys;
    formatValueFunc?: (val: unknown) => unknown,
    isExternal?: boolean;
  }
>;

const PROPS_PER_DOMAIN = new Map<RecordType, Partial<ExportEntityProp>>([
  [
    RecordType.RECORD_RASTER,
    {
      areaZoomLevel: {
        defaultsFromEntityField: 'maxResolutionDeg',
        formatValueFunc: (val): string | undefined => {
          try {
            return degreesPerPixelToZoomLevel(val as number).toString();
          } catch (e) {
            console.error(e);
          }
        },
      },
    },
  ],
  [RecordType.RECORD_3D, {}],
  [RecordType.RECORD_DEM, {}],
]);

interface IUseAddFeatureWithProps { 
  externalFields?: Record<string, unknown>;
  internalFields?: Record<string, unknown>;
  propsForDomain?: ExportEntityProp;
}

const useAddFeatureWithProps = (): IUseAddFeatureWithProps => {
  const store = useStore();
  const { enumsMap } = useContext(EnumsMapContext);
  const enums = enumsMap as IEnumsMapType;

  const [propsForDomain, setPropsForDomain] = useState<ExportEntityProp>();
  const [internalPropsForDomain, setInternalPropsForDomain] = useState<Record<string, unknown>>();
  const [externalPropsForDomain, setExternalPropsForDomain] = useState<Record<string, unknown>>();

  const tempRawSelection = store.exportStore.tempRawSelection;
  const layerToExport = store.exportStore.layerToExport;

  const getInternalPropsForFeature = (): Record<string, unknown> => {
    const featureProps: Record<string, unknown> = {};

    for(const [fieldName, fieldOptions] of Object.entries(propsForDomain ?? {})) {
      if(!(fieldOptions.isExternal as boolean)) {
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

  const getExternalPropsForEntity = (): Record<string, unknown> => {
    const featureProps: Record<string, unknown> = {};

    for(const [fieldName, fieldOptions] of Object.entries(propsForDomain ?? {})) {
      if(fieldOptions.isExternal as boolean) {
        let fieldValue = get(layerToExport, fieldOptions.defaultsFromEntityField as string) as string | undefined ?? '';
        
        if(typeof fieldOptions.formatValueFunc !== 'undefined' && fieldValue) {
          const formattedVal = fieldOptions.formatValueFunc(fieldValue) as string | undefined;
            fieldValue = formattedVal ?? '';
        }

        featureProps[fieldName] = fieldValue;
      }
    }

    return featureProps; 
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
    if(tempRawSelection && internalPropsForDomain) {
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
