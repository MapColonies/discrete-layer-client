/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, {useState, useEffect} from 'react';
import { observer } from 'mobx-react';
import { Box, Autocomplete } from '@map-colonies/react-components';
import { TextField, Tooltip } from '@map-colonies/react-core';
import { Mode } from '../../../../common/models/mode.enum';
import CONFIG from '../../../../common/config';
import { RecordType, useQuery } from '../../../models';
import { IRecordFieldInfo } from '../layer-details.field-info';
import { EntityFormikHandlers } from '../layer-datails-form';
import useDebounceField, { GCHTMLInputElement } from '../../../../common/hooks/debounce-field.hook';

import './autocomplete.value-presentor.css';

interface AutocompleteValuePresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: string;
  formik?: EntityFormikHandlers;
  changeHandler?: (e: any)=>void; //unknown;
}

export const AutocompleteValuePresentorComponent: React.FC<AutocompleteValuePresentorProps> = observer(({ mode, fieldInfo, value, formik ,changeHandler }) => {
  const { data }  = useQuery((store) =>
    store.queryGetDomain({
      recordType: RecordType.RECORD_RASTER, 
      // eslint-disable-next-line
      domain: fieldInfo.autocomplete.value, // 'mc:productName'
    })
  );
  const [innerValue, handleOnChange] = useDebounceField(formik as EntityFormikHandlers , value);
  const [autocompleteValues, setAutocompleteValues] = useState<string[]>([]);
    

  const direction  = (CONFIG.I18N.DEFAULT_LANGUAGE.toUpperCase() === 'HE') ? 'rtl' : 'ltr';
  const required = {
    required: (fieldInfo.isRequired === true) ? true : false
  };

  useEffect(() => {
    setAutocompleteValues(data ? data.getDomain.value as [] : []);
  }, [data]);

  const controlValue = {value: innerValue ?? undefined};

  if (mode === Mode.VIEW || (mode === Mode.EDIT && fieldInfo.isManuallyEditable !== true)) {
    return (
      <Tooltip content={value}>
        <Box className="detailsFieldValue">
          {value}
        </Box>
      </Tooltip>
    );
  } else {
    return(
      <Box className="detailsFieldValue">
        <Autocomplete 
          {
            ...{
              Component: <TextField/>,
              ComponentProps: {
                name: fieldInfo.fieldName,
                autoComplete: 'off',
                ...required
              },
              ...controlValue,
              onChange: (eStr): void => {
                handleOnChange({
                  // eslint-disable-next-line
                  persist: () =>{},
                  // @ts-ignore
                  currentTarget: {
                    value: eStr,
                    name: fieldInfo.fieldName
                  } as GCHTMLInputElement
                })
              },
              mode: 'autocomplete',
              options: autocompleteValues,
              direction
            }
          }
        />
      </Box>
    );
  }
});
