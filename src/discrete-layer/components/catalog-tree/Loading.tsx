import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Box } from '@map-colonies/react-components';

export const Loading = (): JSX.Element => <Box style={{ height: '100%' }}><FormattedMessage id="general.loading.text"/></Box>
