const body = document.querySelector('body');
const uaParserObj = new UAParser();
const FIRST_ELEM = 0;
const CHROMIUM_ENGINE = 'Blink';
const MINIMUM_SUPPORTED_BROWSER_VERSION = 84;

const userAgentRes = uaParserObj.getResult();
const browserName = `'${userAgentRes.browser.name}'`;
const isEngineChromium = userAgentRes.engine.name === CHROMIUM_ENGINE;
const isBrowserVersionSupported =
    Number(userAgentRes.browser.version ?.split('.')[FIRST_ELEM]) >= MINIMUM_SUPPORTED_BROWSER_VERSION;

const ERROR_CODES = { 
  BROWSER_NOT_SUPPORTED : 'BROWSER_NOT_SUPPORTED',
  BROWSER_VERSION_TOO_OLD: 'BROWSER_VERSION_TOO_OLD'
}

if (!isEngineChromium || !isBrowserVersionSupported) {
  window.location.replace(`/assets/pages/compatibilityError.htm?error=${isEngineChromium ? ERROR_CODES.BROWSER_VERSION_TOO_OLD : ERROR_CODES.BROWSER_NOT_SUPPORTED}`);
}