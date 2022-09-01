import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Box } from '@map-colonies/react-components';

import './field-label.css';
import TooltippedValue from '../../../discrete-layer/components/layer-details/field-value-presentors/tooltipped.value';

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

  return (
    <Box className={customClassName !== undefined ? customClassName : 'detailsFieldLabel'}>
      <TooltippedValue disableTooltip={showTooltip}>
          <FormattedMessage id={value} />
      </TooltippedValue>
      {isRequired === true && <Box className="requiredAsterisk">{'*'}</Box>}
    </Box>
  );
};
