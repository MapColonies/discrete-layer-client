import { Box } from '@map-colonies/react-components';
import { MenuItem, Select, Typography } from '@map-colonies/react-core';
import { get } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useIntl } from 'react-intl';
import EnumsMapContext, {
  DEFAULT_ENUM_DESCRIPTOR,
  IEnumsMapType,
} from '../../../../common/contexts/enumsMap.context';
import { IDictionary } from '../../../../common/models/dictionary';
import CONFIG from '../../../../common/config';
import { useStore } from '../../../models';
import { ExportFieldProps } from '../export-entity-selections-fields/raster-selection-field.component';

interface ExportEnumSelectionFieldProps {
  options: string[];
  dictionary?: IDictionary;
}

const NONE = 0;

const ExportEnumSelectionField: React.FC<ExportFieldProps & ExportEnumSelectionFieldProps> = ({
  options,
  dictionary,
  selectionId,
  selectionIdx,
  fieldName,
  fieldValue,
  fieldInfo: { placeholderValue, helperTextValue, rhfValidation },
  type,
}) => {
  const intl = useIntl();
  const store = useStore();
  const formMethods = useFormContext();
  const { enumsMap } = useContext(EnumsMapContext);
  const [innerValue, setInnerValue] = useState(fieldValue);
  const enums = enumsMap as IEnumsMapType;
  const fieldId = `${selectionIdx}_${fieldName}_${selectionId}`;
  const locale = CONFIG.I18N.DEFAULT_LANGUAGE;

  const fieldLabel = intl.formatMessage({
    id: `export-layer.${fieldName}.field`,
  });

  useEffect(() => {
    formMethods.register(fieldId, {...(rhfValidation ?? {})});
    
    // Mitigate errors on init
    formMethods.setValue(fieldId, fieldValue, { shouldValidate: fieldValue.length > NONE })

    // Trigger form validations
    // void formMethods.trigger();

    return (): void => {
      formMethods.unregister(fieldId);
    }
  }, [fieldId]);

  return (
    <Box className="exportSelectionField enumSelectContainer">
      <Typography tag="span" className="exportFieldLabel" htmlFor={fieldId}>
        {fieldLabel}
      </Typography>
      <Select
        value={innerValue}
        id={fieldId}
        name={fieldId}
        // disabled={
        //   mode === Mode.UPDATE &&
        //   ((fieldInfo.updateRules as UpdateRulesModelType | undefined | null)
        //     ?.freeze as boolean)
        // }
        onChange={(e: React.FormEvent<HTMLSelectElement>): void => {
          const newFieldVal = e.currentTarget.value;
          
          store.exportStore.setSelectionProperty(
            selectionId,
            fieldName,
            newFieldVal
          );

          setInnerValue(newFieldVal);
        }}
        onBlur={(): void => {
          formMethods.setValue(fieldId, innerValue, { shouldValidate: true });
        }}
        outlined
        enhanced
        className="enumOptions"
      >
        {options.map((item, index) => {
          let icon = '';
          let translation = '';
          if (item !== '') {
            if (dictionary !== undefined) {
              icon = dictionary[item].icon;
              translation = get(dictionary[item], locale) as string;
            } else {
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              const { translationKey, internal } = enums[item] ?? DEFAULT_ENUM_DESCRIPTOR;
              icon = enums[item].icon;
              translation = intl.formatMessage({ id: translationKey });
              if (internal) {
                return null;
              }
            }
          }
          return (
            <MenuItem key={index} value={item}>
              <Typography tag="span" className={icon}></Typography>
              {translation}
            </MenuItem>
          );
        })}
      </Select>
    </Box>
  );
};

export default ExportEnumSelectionField;
