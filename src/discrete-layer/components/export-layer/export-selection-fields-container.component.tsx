import React from 'react';
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

  const featuresWithProps = exportGeometrySelections.features.filter((feat) => feat.properties);
  const selectionText = intl.formatMessage({ id: 'export-layer.selection-index.text' });

  return <Box className='exportSelectionsContainer'>
   {
    featuresWithProps.map((feature, selectionIdx) => {
        const featProps = feature.properties as Record<string, unknown>;
        const selectionId = featProps.id;
        
        const selectionFields = Object.entries(featProps)
        .filter(([key,]) => key in internalFields)
        .map(([key, val]) => {
            const fieldLabel = intl.formatMessage({ id: `export-layer.${key}.field` });
            return <Box className="fieldInputContainer" key={selectionId as string}>
                          <Typography tag='label' htmlFor={key} className='selectionIndex'>{fieldLabel}</Typography>
                         
                          <TextField name={key} value={val as string} onChange={
                              (e: React.ChangeEvent<HTMLInputElement>): void => {
                                  store.exportStore.setSelectionProperty(selectionId as string, key, e.target.value);
                              }
                          }/>
                      </Box>
        });

        return <Box className='selectionContainer'>
          <Typography tag='p' className='selectionIndex'>{`${selectionText} ${selectionIdx + 1}:`}</Typography>
          {selectionFields}
        </Box>

        }).flat()
      }
    </Box>;
});

export default ExportSelectionFieldsContainer;
