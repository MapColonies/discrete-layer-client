import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { IconButton, Tooltip } from '@map-colonies/react-core';
import { isUnpublished } from '../../../common/helpers/style';
import { ILayerImage } from '../../models/layerImage';

interface PublishButtonProps {
  metadata: ILayerImage;
  className?: string;
}

export const PublishButton: React.FC<PublishButtonProps> = ({
  metadata,
  className = ''
}) => {
  const intl = useIntl();
  const [unpublished, setUnpublished] = useState<boolean>(isUnpublished(metadata as any));

  return (
    <Tooltip
      content={intl.formatMessage({
        id: `${
          unpublished
            ? 'action.unpublish.tooltip'
            : 'action.publish.tooltip'
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
        onClick={(): void =>
          setUnpublished(!unpublished)
        }
      />
    </Tooltip>
  );
};
