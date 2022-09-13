import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { IconButton, Tooltip } from '@map-colonies/react-core';
import { isUnpublished } from '../../../common/helpers/style';
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
  const [unpublished, setUnpublished] = useState<boolean>(isUnpublished(layer as any));

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
        onClick={(): void =>
          setUnpublished(!unpublished)
        }
      />
    </Tooltip>
  );
};
