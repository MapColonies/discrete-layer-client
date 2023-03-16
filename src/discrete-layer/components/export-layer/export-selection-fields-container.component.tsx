import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@map-colonies/react-components';
import useAddFeatureWithProps, {
  AvailableProperties,
  ExportFieldOptions,
} from './hooks/useAddFeatureWithProps';
import { useStore } from '../../models';
import './export-layer.component.css';
import { get } from 'lodash';
import useGetSelectionFieldForDomain from './hooks/useGetSelectionFieldForDomain';
import { GENERAL_FIELDS_ID, GENERAL_FIELDS_IDX } from './constants';
import ExportSelectionComponent from './export-selection.component';

const ExportSelectionFieldsContainer: React.FC = observer(() => {
  const store = useStore();
  const exportGeometrySelections =
    store.exportStore.geometrySelectionsCollection;

  const {
    externalFields,
    internalFields,
    propsForDomain,
  } = useAddFeatureWithProps();

  const SelectionFieldPerDomainRenderer = useGetSelectionFieldForDomain();

  const featuresWithProps = exportGeometrySelections.features;

  const renderExportSelectionsFields = useMemo((): JSX.Element[] => {
    return featuresWithProps.map((feature, selectionIdx) => {
      return (
        <ExportSelectionComponent
          key={get(feature,'properties.id') as string}
          feature={feature}
          selectionIdx={selectionIdx}
          internalFields={internalFields}
          propsForDomain={propsForDomain}
        />
      );
    });
  }, [featuresWithProps, internalFields]);

  const externalExportFields = useMemo((): JSX.Element | JSX.Element[] => {
    const generalExportFields = Object.entries(
      externalFields as Record<AvailableProperties, unknown>
    ).map(([key]) => {
      const formFieldValue = Object.entries(store.exportStore.formData)
      .reduce<string>((storedValue, [fieldName, value]): string => {
        if (fieldName.includes(key)) {
          return value as string;
        }
        return storedValue;
      }, '');

      return (
        <SelectionFieldPerDomainRenderer
          selectionIdx={GENERAL_FIELDS_IDX}
          selectionId={GENERAL_FIELDS_ID}
          fieldInfo={get(propsForDomain, key) as ExportFieldOptions}
          fieldName={key as AvailableProperties}
          fieldValue={formFieldValue}
        />
      );
    });

    return generalExportFields;
  }, [store.exportStore.formData, externalFields]);

  return (
    <>
      {propsForDomain && externalFields && internalFields && (
        <Box className="exportSelectionsContainer">
          {externalExportFields}
          {renderExportSelectionsFields}
        </Box>
      )}
    </>
  );
});

export default ExportSelectionFieldsContainer;
