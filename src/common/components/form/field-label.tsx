import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';

import './field-label.css';

interface FieldLabelProps {
  value?: string;
  isRequired?: boolean;
  customClassName?: string;
}

export const FieldLabelComponent: React.FC<FieldLabelProps> = ({
  value,
  isRequired,
  customClassName,
}) => {
  const intl = useIntl();

  const renderLabel = () => {
    // Indicates when the label will overflow the container
    const MAX_LABEL_LENGTH = 11;
    const formattedLabel = intl.formatMessage({ id: value });

    if (formattedLabel.length > MAX_LABEL_LENGTH) {
      return (
        <Tooltip content={formattedLabel}>
          <span>
            <FormattedMessage id={value} />
          </span>
        </Tooltip>
      );
    }
    return (
      <span>
        <FormattedMessage id={value} />
      </span>
    );
  };

  return (
    <>
      <Box
        className={
          customClassName !== undefined ? customClassName : 'detailsFieldLabel'
        }
      >
        {renderLabel()}
        <Box className="requiredAsterisk">{isRequired === true ? '*' : ''}</Box>
      </Box>
    </>
  );
};
