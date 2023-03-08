/* eslint-disable @typescript-eslint/naming-convention */
import { Box } from '@map-colonies/react-components';
import { CircularProgress, IconButton, Typography } from '@map-colonies/react-core';
import { Feature } from 'geojson';
import { get, isEmpty, isEqual } from 'lodash';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { usePrevious } from '../../../common/hooks/previous.hook';
import { useStore } from '../../models';
import {
  AvailableProperties,
  ExportEntityProp,
  ExportFieldOptions,
} from './hooks/useAddFeatureWithProps';
import { useEstimatedSize } from './hooks/useEstimatedSize';
import useGetSelectionFieldForDomain from './hooks/useGetSelectionFieldForDomain';
import useHighlightSelection from './hooks/useHighlightSelection';

interface ExportSelectionComponentProps {
  feature: Feature;
  selectionIdx: number;
  internalFields?: Record<AvailableProperties, unknown>;
  propsForDomain?: ExportEntityProp;
}

const NONE = 0;

const ExportSelectionComponent: React.FC<ExportSelectionComponentProps> = observer(({
  feature,
  selectionIdx,
  internalFields,
  propsForDomain,
}) => {
  const intl = useIntl();
  const store = useStore();
  const SelectionFieldPerDomainRenderer = useGetSelectionFieldForDomain();
  const { onSelectionMouseOver, onSelectionMouseOut } = useHighlightSelection();
  const featProps = feature.properties as Record<string, unknown>;
  const selectionId = featProps.id;
  const prevFeature = usePrevious(feature);
  const [newFeature, setNewFeature] = useState(feature);

  const {data: estimatedSizeRes, error, loading, setSelection} = useEstimatedSize(feature);

  useEffect(() => {
    const prevFeatureProps = prevFeature?.properties;
    const newFeatureProps = feature.properties;

    if(prevFeatureProps) {
        if(!isEqual(prevFeatureProps, newFeatureProps)) {
            setNewFeature(feature);
        }
    } else {
        setNewFeature(feature);
    }
  },[feature])

  useEffect(() => {
    // Estimate size.
    console.log('render! ', selectionIdx)
    setSelection(newFeature);
    
  }, [newFeature])

  const estimatedSizeText = useMemo(() => {
    const estimatedSizeLabel = intl.formatMessage(
      { id: 'export-layer.selection-estimated-size.text' },
      { estimatedSize: estimatedSizeRes ?? (loading ? '' : 'N/A')}
    );

    return (
      <Box className="estimatedSizeContainer">
        <Typography tag="p">{estimatedSizeLabel}</Typography>   
      </Box>
    );
  }, [estimatedSizeRes, error, loading]);
  
  const selection = useMemo(() => {
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
      const selectionTextId = isEmpty(featProps.label)
        ? 'export-layer.selection-index.text'
        : (featProps.label as string);
    
      const customOrGeneralSelectionText = intl.formatMessage({
        id: selectionTextId,
      });
      const selectionTitle = !isEmpty(featProps.label)
        ? `${selectionIdx + 1}. ${customOrGeneralSelectionText}${hasPropsSign}`
        : `${customOrGeneralSelectionText} ${selectionIdx + 1}${hasPropsSign}`;
    
      return (
        <Box
          className={`selectionContainer ${
            store.exportStore.isFullLayerExportEnabled || loading ? 'backdrop' : ''
          }`}
          onMouseEnter={(): void => {
            onSelectionMouseOver(feature.properties?.id as string);
          }}
          onMouseLeave={onSelectionMouseOut}
        >
         {loading && <CircularProgress className="selectionLoading" /> }
          <Box className="selectionFields">
            <Box className="selectionTitleContainer">
              <IconButton
                type="button"
                className="removeSelectionBtn mc-icon-Close"
                onClick={(): void => {
                  store.exportStore.resetHighlightedFeature();
                  store.exportStore.removeFeatureById(
                    feature.properties?.id as string
                  );
                }}
              />
              <Typography tag="bdi" className="selectionIndex">
                {selectionTitle}
              </Typography>
            </Box>
            {selectionFields}
            {estimatedSizeText}
          </Box>
        </Box>
      );
  }, [newFeature, estimatedSizeRes, error, loading, selectionIdx]);

  return selection;
});

export default ExportSelectionComponent;
