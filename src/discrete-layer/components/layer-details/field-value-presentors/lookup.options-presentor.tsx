import { Box, MultiSelection } from '@map-colonies/react-components';
import { MenuItem, Select, Typography } from '@map-colonies/react-core';
import { isEmpty } from 'lodash';
import React, { useCallback, useContext, useState } from 'react';
import { useIntl } from 'react-intl';
import TooltippedValue from '../../../../common/components/form/tooltipped.value';
import lookupTablesContext, { ILookupOption } from '../../../../common/contexts/lookupTables.context';
import useDebounceField from '../../../../common/hooks/debounce-field.hook';
import { Mode } from '../../../../common/models/mode.enum';
import { EntityFormikHandlers } from '../layer-datails-form';
import { IRecordFieldInfo } from '../layer-details.field-info';
import './enum.value-presentor.css';
import { FormInputInfoTooltipComponent } from './form.input.info.tooltip';
import CONFIG from '../../../../common/config';
// import { CustomTheme } from '../../../../theming/custom.theme';
import '../../../../../src/App.css'
import '../../../components/map-container/catalogFilter/catalog-filter-panel.css'
import { MultiSelectionWrapper } from '../../../../common/components/multi-selection';


interface LookupTablesPresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: string;
  formik?: EntityFormikHandlers;
  fieldNamePrefix?: string;
}

export const LookupOptionsPresentorComponent: React.FC<LookupTablesPresentorProps> = (props) => {
  const { mode, fieldInfo, value, formik, fieldNamePrefix } = props;
  const fieldName = `${fieldNamePrefix ?? ''}${fieldInfo.fieldName}`;
  const lang = CONFIG.I18N.DEFAULT_LANGUAGE;
  // const backLocale = CONFIG.DEFAULT_LOCALE;
  // const [multiSelectionValues, setMultiSelectionValues] = useState(fieldInfo.fieldName === "region" && !isEmpty(value) ? value?.split(", ") : [])
  const intl = useIntl();
  const { lookupTablesData } = useContext(lookupTablesContext);
  const [innerValue] = useDebounceField(formik as EntityFormikHandlers, value ?? '');
  const isDataError = fieldInfo.isRequired && !value;
  // const customStyles = {
  //   container: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
  //     return {
  //       marginRight: mode === Mode.EDIT ? '18px' : '12px',
  //       marginLeft: '2px',
  //     }
  //   },
  //   control: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
  //     return {
  //       backgroundColor: CustomTheme.darkTheme.GC_ALTERNATIVE_SURFACE,
  //       cursor: 'pointer',
  //       border: `1px solid`,
  //       borderColor: isFocused ? '#24aee9' : CustomTheme.darkTheme.GC_TAB_ACTIVE_BACKGROUND,
  //       borderRadius: '4px',
  //       display: 'flex',
  //       alignItems: 'center',
  //       flexDirection: 'row-reverse' as const,
  //       justifyContent: 'space-between',
  //       //mode === Mode.EDIT && 
  //       height: '24px',
  //     }
  //   },
  //   menu: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
  //     return {
  //       ...styles,
  //       width: mode === Mode.EDIT ? '97%' : '99%',
  //       marginTop: '0px',
  //       animation: "fadeIn 0.3s ease-in-out",
  //     }
  //   },
  //   menuList: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
  //     return {
  //       ...styles,
  //       maxHeight: mode === Mode.EDIT ? '160px' : '80px',
  //       backgroundColor: 'var(--mdc-theme-surface)',
  //       scrollbarColor: 'var(--mdc-theme-surface)',
  //       paddingTop: 0,
  //       paddingBottom: 0,
  //     }
  //   },
  //   option: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
  //     return {
  //       cursor: 'pointer',
  //       height: '40px',
  //       color: isSelected ? CustomTheme.darkTheme.GC_HOVER_BACKGROUND : 'lightgray',
  //       backgroundColor: isSelected && 'black',
  //       border: '0',
  //     }
  //   },
  //   input: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
  //     return {
  //       ...styles,
  //       marginRight: 'auto',
  //       color: 'rgba(255, 255, 255, 0.7)',
  //       direction: lang === 'he' ? "rtl !importan" : "ltr !importan",
  //       textAlign: lang === 'he' ? "right !importan" : "left !importan",
  //     }
  //   },
  //   value: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
  //     return {
  //       ...styles,
  //       // mode === Mode.EDIT  && 
  //       height: '20px',
  //       direction: lang === 'he' ? "rtl !importan" : "ltr !importan",
  //       textAlign: lang === 'he' ? "right !importan" : "left !importan",
  //     }
  //   },
  //   indicatorsContainer: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
  //     return {
  //       ...styles,
  //       position: 'absolute' as const,
  //       bottom: '12px',
  //       height: '2px',
  //       padding: mode === Mode.EDIT ? '0 22px' : '0 4px',
  //     }
  //   },
  //   dropdownIndicator: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
  //     return {
  //       ...styles,
  //       padding: '0',
  //       width: '14px',
  //       color: '#24aee9',
  //     }
  //   },
  //   clearIndicator: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
  //     return {
  //       ...styles,
  //       padding: '0',
  //       width: '14px',
  //       color: '#24aee9',
  //     }
  //   },
  // };

  const getDisplayValue = useCallback((): string => {
    if (isEmpty(innerValue)) {
      return typeof innerValue === 'string' ? innerValue : (innerValue as string[]).toString();
    } else {
      const filteredOptions = lookupOptions.filter(option => option.value === innerValue);
      const displayValue = Object.keys(lookupOptions).includes('translation') ?
        filteredOptions.length ? (filteredOptions[0] as ILookupOption).translation?.find((trns) => trns.locale === lang)?.text : value
        :
        filteredOptions.length ? (filteredOptions[0] as ILookupOption).translationCode : value;

      // @ts-ignore
      return intl.formatMessage({ id: typeof displayValue === 'string' || 'undefined' ? (displayValue as string | undefined) : (displayValue as string[]).toString() });
    }
  }, [innerValue]);

  if (!lookupTablesData || !lookupTablesData.dictionary || fieldInfo.lookupTable == null) return null;

  const lookupOptions =
    !fieldInfo.isMultiSelection ?
      [
        { value: '', translationCode: 'general.empty-string' },
        ...lookupTablesData.dictionary[fieldInfo.lookupTable]
      ] :
      [
        ...lookupTablesData.dictionary[fieldInfo.lookupTable]

      ];


  if (formik === undefined || mode === Mode.VIEW || (mode === Mode.EDIT && fieldInfo.isManuallyEditable !== true)) {
    return (
      <TooltippedValue className={`detailsFieldValue  ${isDataError ? 'detailFieldDataError' : ''}`}>
        {getDisplayValue()}
      </TooltippedValue>
    );
  }

  // const getMultiSelectionOptions = () => {
  //   return (lookupOptions as ILookupOption[]).map((option: ILookupOption) => {
  //     const text = option.translation?.find((trns) => trns.locale === lang)?.text ?? ''
  //     return { value: text, label: text }
  //   });
  // };

  // const getMultiSelectionValues = () => {
  //   const chosenValueStrings = (multiSelectionValues)?.map((value) =>
  //     getMultiSelectionOptions().filter((option) =>
  //       option.value.includes(value))).flat().map((filteredOption) => filteredOption.value);

  //   const chosenValueOptions = chosenValueStrings?.map((value) => {
  //     return [
  //       { value: value, label: value }
  //     ]
  //   }).flat();

  //   return chosenValueOptions;
  // };

  // const onChangeMultiSelection = (data: any) => {
  //   setMultiSelectionValues(data);
  // };

  // const getFormikFieldValue = (values: { value: string, label: string }[]) => {
  //   return values.map((val) => {
  //     const lookupOptionsTranslations = (lookupOptions as ILookupOption[]).map((option) => option.translation);
  //     const valueTranslation = lookupOptionsTranslations.find((trns) => (trns as unknown as { locale: string, text: string }[]).findIndex((trn) => trn.text === val.value) > -1);
  //     return valueTranslation?.find((valueTranslations) => valueTranslations.locale === backLocale)?.text
  //   }).join(', ')
  // };

  return (
    fieldInfo.isMultiSelection ?
      <MultiSelectionWrapper
        mode={mode}
        fieldInfo={fieldInfo}
        lookupOptions={lookupOptions}
        value={value}
        formik={formik}
        fieldNamePrefix={fieldNamePrefix}
      /> :
      <Box className="detailsFieldValue selectBoxContainer">
        <Select
          className="enumOptions"
          value={value as string}
          id={fieldName}
          name={fieldName}
          onChange={(e: React.FormEvent<HTMLSelectElement>): void => {
            formik.setFieldValue(fieldName, e.currentTarget.value);
          }}
          onBlur={formik.handleBlur}
          outlined
          enhanced>
          {
            lookupOptions.map(({ translationCode, value }, index) => {
              const translation = intl.formatMessage({ id: translationCode });

              return (
                <MenuItem key={index} value={value}>
                  <Typography tag="span"></Typography>
                  {translation}
                </MenuItem>
              );
            })
          }
        </Select>
        {
          !(fieldInfo.infoMsgCode?.length === 1 && fieldInfo.infoMsgCode[0].includes('required')) &&
          <FormInputInfoTooltipComponent fieldInfo={fieldInfo} />
        }
      </Box>
  );
}
