import React, {useState, useEffect} from 'react';
import { observer } from 'mobx-react';
import { Box, Autocomplete } from '@map-colonies/react-components';
import { TextField, Tooltip } from '@map-colonies/react-core';
import { Mode } from '../../../../common/models/mode.enum';
import CONFIG from '../../../../common/config';
import { RecordType, useQuery } from '../../../models';
import { IRecordFieldInfo } from '../layer-details.field-info';

import './autocomplete.value-presentors.css';

interface AutocompleteValuePresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: string;
  changeHandler?: (e: any)=>void; //unknown;
}

export const AutocompleteValuePresentorComponent: React.FC<AutocompleteValuePresentorProps> = observer(({ mode, fieldInfo, value, changeHandler }) => {
  const { data }  = useQuery((store) =>
    store.queryGetDomain({
      recordType: RecordType.RECORD_RASTER, 
      // eslint-disable-next-line
      domain: fieldInfo.autocomplete.value, // 'mc:productName'
    })
  );
  const [autocompleteValues, setAutocompleteValues] = useState<string[]>([]);
    

  const direction  = (CONFIG.I18N.DEFAULT_LANGUAGE.toUpperCase() === 'HE') ? 'rtl' : 'ltr';
  const required = {
    required: (fieldInfo.isRequired === true) ? true : false
  };

  useEffect(() => {
    setAutocompleteValues(data ? data.getDomain.value as [] : []);
  }, [data]);

  const controlValue = {value: value ?? undefined};

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
                autocomplete: 'off',
                ...required
              },
              ...controlValue,
              onChange: (eStr)=> {
                // @ts-ignore
                changeHandler(fieldInfo.fieldName, eStr);
                console.log('****** IN ONCHANGE*** ', eStr);
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
