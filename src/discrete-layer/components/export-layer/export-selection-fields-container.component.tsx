import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@map-colonies/react-components';
import { IconButton, Typography } from '@map-colonies/react-core';
import { useIntl } from 'react-intl';
import useAddFeatureWithProps, { AvailableProperties, ExportFieldOptions } from './hooks/useAddFeatureWithProps';
import { useStore } from '../../models';
import './export-layer.component.css';

import useHighlightSelection from './hooks/useHighlightSelection';
import { get, isEmpty } from 'lodash';
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

  const renderExportSelectionsFields = useMemo((): JSX.Element[] => {
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
      
      const hasPropsSign = selectionFields.length > NONE ? ':' : '.';
      const selectionTextId = isEmpty(featProps.label) ? 'export-layer.selection-index.text' : featProps.label as string;
      
      const customOrGeneralSelectionText = intl.formatMessage({ id: selectionTextId }); 
      const selectionTitle = !isEmpty(featProps.label)
        ? `${selectionIdx + 1}. ${customOrGeneralSelectionText}${hasPropsSign}`
        : `${customOrGeneralSelectionText} ${selectionIdx + 1}${hasPropsSign}`;

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
              <Typography tag="bdi" className="selectionIndex">{selectionTitle}</Typography>
            </Box>
            {selectionFields}
          </Box>          
        </Box>
      );
    });
  }, [featuresWithProps, internalFields]);

  const externalExportFields = useMemo((): JSX.Element | JSX.Element[] => {
    const generalExportFields = Object.entries(
      externalFields as Record<AvailableProperties, unknown>
    ).map(([key,]) => {
      const formFieldValue = Object.entries(store.exportStore.formData)
        .reduce<string>((storedValue, [fieldName, value]): string => {
          if(fieldName.includes(key)) {
            return value as string;
          }
          return storedValue;
        }, '');

      return (
        <SelectionFieldPerDomainRenderer
          selectionIdx={0}
          selectionId={"0"}
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
