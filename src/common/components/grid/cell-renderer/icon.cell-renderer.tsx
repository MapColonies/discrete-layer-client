import React from 'react';
import { useIntl } from 'react-intl';
import { ICellRendererParams } from 'ag-grid-community';
import { Icon, Tooltip, useTheme } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';

export const IconRenderer: React.FC<ICellRendererParams> = (props) => {
  const theme = useTheme();
  const intl = useIntl();

  if (!props.value) {
    return <></>;
  }
  return (
    <Box className="expanderContainer">
      <Tooltip content={intl.formatMessage({ id: 'general.best-draft.new.tooltip' })}>
        <Icon 
          style={{ color: (theme.primary as string) }} 
          icon={{ icon: 'star_rate', size: 'small' }}
        />
      </Tooltip>
    </Box>
  );

};
