import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@map-colonies/react-components';
import { IconButton, Typography } from '@map-colonies/react-core';
import { useIntl } from 'react-intl';
import useAddFeatureWithProps, { AvailableProperties, ExportFieldOptions } from './hooks/useAddFeatureWithProps';
import { useStore } from '../../models';
import './export-layer.component.css';

import useHighlightSelection from './hooks/useHighlightSelection';
import { get } from 'lodash';
import useGetSelectionFieldForDomain from './hooks/useGetSelectionFieldForDomain';

const NONE = 0;

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

  const featuresWithProps = exportGeometrySelections.features;
  const selectionText = intl.formatMessage({ id: 'export-layer.selection-index.text' });

  const renderExportSelectionsFields = (): JSX.Element[] => {
    return featuresWithProps.map((feature, selectionIdx) => {
      const featProps = feature.properties as Record<string, unknown>;
      const selectionId = featProps.id;

      const selectionFields = Object.entries(featProps)
        .filter(([key]) => key in (internalFields ?? {}))
        .map(([key, val]) => {
          return (
            <SelectionFieldPerDomainRenderer
              selectionIdx={selectionIdx + 1}
              selectionId={selectionId as string}
              fieldInfo={get(propsForDomain, key) as ExportFieldOptions}
              fieldName={key as AvailableProperties}
              fieldValue={val as string}
            />
          );
        });

      const selectionTitle = `${selectionText} ${selectionIdx + 1}${selectionFields.length > NONE ? ':' : '.'}`;

      return (
        <Box
          className={`selectionContainer ${store.exportStore.isFullLayerExportEnabled ? 'backdrop' : ''}`}
          onMouseEnter={(): void => {
            onSelectionMouseOver(feature.properties?.id as string);
          }}
          onMouseLeave={onSelectionMouseOut}
        >
          <Box className='selectionFields'>
            <Box className='selectionTitleContainer'>
              <IconButton type="button" className="removeSelectionBtn mc-icon-Close" onClick={(): void => {
                store.exportStore.resetHighlightedFeature();
                store.exportStore.removeFeatureById(feature.properties?.id as string);
              }}/>
              <Typography tag="p" dir={'auto'} className="selectionIndex">{selectionTitle}</Typography>
            </Box>
            {selectionFields}
          </Box>          
        </Box>
      );
    });
  };

  const externalExportFields = useMemo((): JSX.Element | JSX.Element[] => {
    const generalExportFields = Object.entries(
      externalFields as Record<AvailableProperties, unknown>
    ).map(([key, val]) => {
      return (
        <SelectionFieldPerDomainRenderer
          selectionIdx={0}
          selectionId={"0"}
          fieldInfo={get(propsForDomain, key) as ExportFieldOptions}
          fieldName={key as AvailableProperties}
          fieldValue={val as string}
        />
      );
    });

    return generalExportFields;
  }, [externalFields]);

  return (
    <>
      {propsForDomain && externalFields && internalFields && (
        <Box className="exportSelectionsContainer">
          {externalExportFields}
          {renderExportSelectionsFields()}
        </Box>
      )}
    </>
  );
});

export default ExportSelectionFieldsContainer;
