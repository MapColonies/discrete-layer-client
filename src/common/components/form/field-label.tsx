import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Tooltip, Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import CONFIG from '../../../common/config';

import './field-label.css';

interface FieldLabelProps {
  value?: string;
  isRequired?: boolean;
  customClassName?: string;
  showTooltip?: boolean;
}

export const FieldLabelComponent: React.FC<FieldLabelProps> = ({
  value,
  isRequired,
  customClassName,
  showTooltip,
}) => {
  const intl = useIntl();

  const labelRenderer = useMemo(() => {
    const MAX_LABEL_LENGTH = CONFIG.NUMBER_OF_CHARACTERS_LIMIT;
    const label = intl.formatMessage({ id: value });

    if (showTooltip !== false && label.length > MAX_LABEL_LENGTH) {
      return (
        <Tooltip content={label}>
          <Typography tag="span"><FormattedMessage id={value}/></Typography>
        </Tooltip>
      );
    }
    return (
      <Typography tag="span"><FormattedMessage id={value}/></Typography>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box className={customClassName !== undefined ? customClassName : 'detailsFieldLabel'}>
      {labelRenderer}
      <Box className="requiredAsterisk">{isRequired === true ? '*' : ''}</Box>
    </Box>
  );
};
