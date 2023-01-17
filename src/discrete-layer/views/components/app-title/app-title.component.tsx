import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Icon, Tooltip, Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { version } from '../../../../../package.json';

const AppTitle = (): JSX.Element => {
  const intl = useIntl();

  useEffect(() => {
    document.title = `${intl.formatMessage({ id: 'general.logo.text' })} - V${version}`
  }, [])

  return (
    <>
    <Box className='appLogoContainer'>
      <Box className='appTitleVersionContainer'>
        <Typography tag="b">
            {intl.formatMessage({ id: 'general.logo.text' })}
        </Typography>
        <Tooltip
          content={`${intl.formatMessage({
            id: 'general.version.tooltip',
          })} ${version}`}
        >
          <Box className="version">{version}</Box>
      </Tooltip>
      </Box>
      <Icon className="appIcon mc-icon-AppIcon" />
    </Box>
     
    </>
  );
};

export default AppTitle;
