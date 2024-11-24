import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { getValidationMessage, ValidationMessage } from '../../discrete-layer/components/layer-details/utils';
import { sessionStore } from '../helpers/storage';
import { SYNC_QUERY_NAME } from '../../syncHttpClientGql';

const useSessionStoreWatcherForm = (): ValidationMessage | undefined => {
  const intl = useIntl();
  const [validationWarn, setValidationWarn] = useState<ValidationMessage>();

  useEffect(() => {
    const handleStorageChange = (method: string, key: string) => {
      switch (true) {
        case key.includes(SYNC_QUERY_NAME.GET_PRODUCT): {
          if (method === 'setItem') {
            const invalidVersion = sessionStore.getObject(SYNC_QUERY_NAME.GET_PRODUCT);
            if (invalidVersion) {
              setValidationWarn(getValidationMessage(invalidVersion, intl));
            }
          } else if (method === 'removeItem') {
            setValidationWarn(undefined);
          }
          break;
        }
        case key.includes(SYNC_QUERY_NAME.VALIDATE_SOURCE): {
          if (method === 'setItem') {
            const sourceValidation = sessionStore.getObject(SYNC_QUERY_NAME.VALIDATE_SOURCE);
            if (sourceValidation && !sourceValidation.isValid && !sessionStore.getObject(SYNC_QUERY_NAME.GET_PRODUCT)) {
              setValidationWarn(getValidationMessage(sourceValidation, intl));
            }
          } else if (method === 'removeItem') {
            setValidationWarn(undefined);
          }
          break;
        }
      }
    };

    // Add method watchers for storage changes
    sessionStore.watchMethods(['setItem', 'removeItem'], handleStorageChange);

    // Clean up the method watchers when the component unmounts
    return () => {
      sessionStore.unWatchMethods();
    };
  }, [intl]);

  return validationWarn;
};

export default useSessionStoreWatcherForm;