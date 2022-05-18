import React from 'react';
import { Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import CONFIG from '../../../common/config';
import { UAParser } from 'ua-parser-js';
import { useIntl } from 'react-intl';
import './browserCompatibilityCheckerStyle.css'

const uaParserObj = new UAParser();
const FIRST_ELEM = 0;
const CHROMIUM_ENGINE = 'Blink';
const BROWSER_NOT_SUPPORTED_ID = 'compatibility-check.browser-not-supported';
const BROWSER_OUTDATED_ID = 'compatibility-check.browser-version-not-supported';

export const BrowserCompatibilityChecker: React.FC = () => {
  const intl = useIntl();

  const userAgentRes = uaParserObj.getResult();
  const browserName = `'${userAgentRes.browser.name as string}'`;
  const isEngineChromium = userAgentRes.engine.name === CHROMIUM_ENGINE;
  const isBrowserVersionSupported =
    Number(userAgentRes.browser.version?.split('.')[FIRST_ELEM]) >=
    CONFIG.MINIMUM_SUPPORTED_BROWSER_VERSION;

  const browserNotSupportedErr = intl.formatMessage(
    { id: BROWSER_NOT_SUPPORTED_ID },
    { browserName, minimumVersion: CONFIG.MINIMUM_SUPPORTED_BROWSER_VERSION }
  );
  const browserTooOldErr = intl.formatMessage(
    { id: BROWSER_OUTDATED_ID },
    { browserName, minimumVersion: CONFIG.MINIMUM_SUPPORTED_BROWSER_VERSION }
  );

  if (!isEngineChromium || !isBrowserVersionSupported) {
    return (
      <Box className="compatibilityError">
        <Typography tag='h4'>
          {isEngineChromium ? browserTooOldErr : browserNotSupportedErr}
        </Typography>
      </Box>
    );
  }

  return null;
};
