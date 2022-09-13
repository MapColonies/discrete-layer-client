import React, { useState } from 'react';
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
      content={intl.formatMessage({
        id: `${
          unpublished
            ? 'action.publish.tooltip'
            : 'action.unpublish.tooltip'
        }`
      })}
    >
      <IconButton
        className={`${className} ${
          unpublished
            ? 'mc-icon-Expand-Panel'
            : 'mc-icon-Collapce-Panel'
        } glow-missing-icon`}
        label="PUBLISH AND UNPUBLISH"
        onClick={(): void => {
          updateStatus(unpublished ? RecordStatus.PUBLISHED : RecordStatus.UNPUBLISHED);
          setUnpublished(!unpublished);
        }}
      />
    </Tooltip>
  );
};
