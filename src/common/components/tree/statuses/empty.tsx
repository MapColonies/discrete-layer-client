import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Box } from '@map-colonies/react-components';

import './empty.css';

export const Empty: React.FC = (): JSX.Element => {
  return (
    <>
      <Box className="alignCenter emptyText"><FormattedMessage id="general.empty.text"/></Box>
    </>
  );
};
