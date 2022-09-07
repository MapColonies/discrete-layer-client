import { IconButton, Tooltip } from '@map-colonies/react-core';
import React, { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { ILayerImage } from '../../models/layerImage';
import { downloadJSONToClient } from './utils';

interface SaveMetadataProps {
  metadata: ILayerImage;
  className?: string;
}

export const SaveMetadataButton: React.FC<SaveMetadataProps> = ({
  metadata,
  className = ''
}) => {
  const intl = useIntl();

  const filteredMetadataToDownload = useCallback(() => {
    // Sorting out non-relevant properties from metadata

    const { links, ...pureMetadata } = metadata;
    return pureMetadata;
  }, [metadata]);

  const metadataExporter = useMemo((): JSX.Element => {
    return (
      <Tooltip
        content={intl.formatMessage({ id: 'action.save-metadata.tooltip' })}
      >
        <IconButton
          className={`mc-icon-Status-Downloads glow-missing-icon ${className}`}
          label="save-metadata"
          onClick={(): void =>
            downloadJSONToClient(filteredMetadataToDownload(), 'metadata.json')
          }
        />
      </Tooltip>
    );
  }, [metadata]);

  return metadataExporter;
};
