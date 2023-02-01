import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@map-colonies/react-components';
import { TextField, Typography } from '@map-colonies/react-core';
import { useIntl } from 'react-intl';
import useAddFeatureWithProps from './hooks/useAddFeatureWIthProps';
import { useStore } from '../../models';

import './export-layer.component.css';

const ExportSelectionFieldsContainer: React.FC = observer(() => {
  const store = useStore();
  const intl = useIntl();
  const exportGeometrySelections =
    store.exportStore.geometrySelectionsCollection;

  const {
    externalFields,
    internalFields,
    propsForDomain,
  } = useAddFeatureWithProps();

  if (!internalFields) return null;

  const renderFields = (): JSX.Element => {
    const { features } = exportGeometrySelections;

    const featuresWithProps = features.filter((feat) => feat.properties);

    const selectionText = intl.formatMessage({ id: 'export-layer.selection-index.text' });

    return <Box>{
            featuresWithProps.map((feature, selectionIdx) => {
                const featProps = feature.properties as Record<string, unknown>;
                const selectionId = featProps.id;
                
                return Object.entries(featProps)
                    .filter(([key,]) => key in internalFields)
                    .map(([key, val]) => {
                        const fieldLabel = intl.formatMessage({ id: `export-layer.${key}.field` });
                        return <Box className='selectionContainer' key={selectionId as string}>
                            <Typography tag='p' className='selectionIndex'>{`${selectionText} ${selectionIdx + 1}:`}</Typography>
                            <Box className="fieldInputContainer">
                                <Typography tag='label' htmlFor={key} className='selectionIndex'>{fieldLabel}</Typography>
                                <TextField name={key} value={val as string} onChange={
                                    (e: React.ChangeEvent<HTMLInputElement>): void => {
                                        store.exportStore.setSelectionProperty(selectionId as string, key, e.target.value);
                                    }
                                }/>
                            </Box>
                        </Box>
                    });
                }).flat()
            }</Box>
  };

  return <Box className='exportSelectionsContainer'>{renderFields()}</Box>;
});

export default ExportSelectionFieldsContainer;
