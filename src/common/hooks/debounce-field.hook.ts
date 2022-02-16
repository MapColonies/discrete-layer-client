import React, { useState, useEffect, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce/lib';
import { EntityFormikHandlers } from '../../discrete-layer/components/layer-details/layer-datails-form';

export interface GCHTMLInputElement{
  [prop:string]: unknown;
  persist: ()=>void;
  currentTarget: {
    [prop:string]: unknown;
    value: unknown
  }
};

const useDebounceField = <T> (
  formikHandlers: EntityFormikHandlers,
  value: T | string,
): [T | string, (event: React.ChangeEvent<HTMLInputElement | GCHTMLInputElement>) => void] => {
  const [innerValue, setInnerValue] = useState<T | string>(value);
  const INPUT_DELAY = 300;

  useEffect(() => {
    if (value) {
      setInnerValue(value);
    } 
  }, [value]);

  const debouncedHandleOnChange = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement | GCHTMLInputElement>) => {
      formikHandlers.handleChange(event);
    },
    INPUT_DELAY
  );

  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | GCHTMLInputElement>) => {
      event.persist();
      const newValue = event.currentTarget.value as (T | string);
      setInnerValue(newValue);
      debouncedHandleOnChange(event);
    },[]);

  return [innerValue, handleOnChange];
};

export default useDebounceField;