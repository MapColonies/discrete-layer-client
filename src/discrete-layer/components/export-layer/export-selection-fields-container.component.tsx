import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@map-colonies/react-components';
import { Typography } from '@map-colonies/react-core';
import { useIntl } from 'react-intl';
import useAddFeatureWithProps, { AvailableProperties, ExportFieldOptions } from './hooks/useAddFeatureWithProps';
import { useStore } from '../../models';
import './export-layer.component.css';

import useHighlightSelection from './hooks/useHighlightSelection';
import { get } from 'lodash';
import useGetSelectionFieldForDomain from './hooks/useGetSelectionFieldForDomain';

const ExportSelectionFieldsContainer: React.FC = observer(() => {
  const store = useStore();
  const intl = useIntl();
  const exportGeometrySelections =  store.exportStore.geometrySelectionsCollection;

  const {
    externalFields,
    internalFields,
    propsForDomain,
  } = useAddFeatureWithProps();

  const {onSelectionMouseOver, onSelectionMouseOut} = useHighlightSelection();
  const SelectionFieldPerDomainRenderer = useGetSelectionFieldForDomain();

  const renderExportSelectionsFields = useCallback((): JSX.Element[] => {
    return featuresWithProps.map((feature, selectionIdx) => {
      const featProps = feature.properties as Record<string, unknown>;
      const selectionId = featProps.id;

      const selectionFields = Object.entries(featProps)
        .filter(([key]) => key in (internalFields ?? {}))
        .map(([key, val]) => {
          return (
            <SelectionFieldPerDomainRenderer
              selectionId={selectionId as string}
              fieldInfo={get(propsForDomain, key) as ExportFieldOptions}
              fieldName={key as AvailableProperties}
              fieldValue={val as string}
            />
          );
        });

      return (
        <Box
          className="selectionContainer"
          onMouseEnter={(): void => {
            onSelectionMouseOver(feature.properties?.id as string);
          }}
          onMouseLeave={onSelectionMouseOut}
        >
          <Typography tag="p" className="selectionIndex">{`${selectionText} ${selectionIdx + 1}:`}</Typography>
          {selectionFields}
        </Box>
      );
    });
  }, [exportGeometrySelections.features]);

  const featuresWithProps = exportGeometrySelections.features;
  const selectionText = intl.formatMessage({ id: 'export-layer.selection-index.text' });


  const renderExternalExportFields = (): JSX.Element | JSX.Element[] => {
    const generalExportFields = Object.entries(
      externalFields as Record<AvailableProperties, unknown>
    ).map(([key, val], generalFieldIdx) => {
      return (
        <SelectionFieldPerDomainRenderer
          selectionId={generalFieldIdx.toString()}
          fieldInfo={get(propsForDomain, key) as ExportFieldOptions}
          fieldName={key as AvailableProperties}
          fieldValue={val as string}
        />
      );
    });

    return generalExportFields;
  };

  return (
    <>
      {propsForDomain && externalFields && internalFields && (
        <Box className="exportSelectionsContainer">
          {renderExternalExportFields()}
          {renderExportSelectionsFields()}
        </Box>
      )}
    </>
  );
});

export default ExportSelectionFieldsContainer;
