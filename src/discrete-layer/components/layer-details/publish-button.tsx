import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { IconButton, Tooltip } from '@map-colonies/react-core';
import { isUnpublished } from '../../../common/helpers/style';
import { RecordStatus, RecordType, useQuery, useStore } from '../../models';
import { ILayerImage } from '../../models/layerImage';

interface PublishButtonProps {
  layer: ILayerImage;
  className?: string;
}

export const PublishButton: React.FC<PublishButtonProps> = ({
  layer,
  className = ''
}) => {
  const intl = useIntl();
  const store = useStore();
  const mutationQuery = useQuery();
  const [unpublished, setUnpublished] = useState<boolean>(isUnpublished(layer as any));
  const [icon, setIcon] = useState<string>(unpublished ? 'mc-icon-Expand-Panel' : 'mc-icon-Collapce-Panel');
  const [tooltip, setTooltip] = useState<string>(unpublished ? 'action.publish.tooltip' : 'action.unpublish.tooltip');

  useEffect(() => {
    setUnpublished(isUnpublished(layer as any));
  }, [layer]);

  useEffect(() => {
    setIcon(unpublished ? 'mc-icon-Expand-Panel' : 'mc-icon-Collapce-Panel');
    setTooltip(unpublished ? 'action.publish.tooltip' : 'action.unpublish.tooltip');
  }, [unpublished]);

  const updateStatus = (productStatus: RecordStatus): void => {
    mutationQuery.setQuery(
      store.mutateUpdateStatus({
        data: {
          id: layer.id,
          type: layer.type as RecordType,
          partialRecordData: { productStatus },
        },
      })
    );
  };

  return (
    <Tooltip
      content={intl.formatMessage({ id: tooltip })}
    >
      <IconButton
        className={`${className} ${icon} glow-missing-icon`}
        label="PUBLISH AND UNPUBLISH"
        onClick={(): void => {
          updateStatus(unpublished ? RecordStatus.PUBLISHED : RecordStatus.UNPUBLISHED);
          setUnpublished(!unpublished);
        }}
      />
    </Tooltip>
  );
};
