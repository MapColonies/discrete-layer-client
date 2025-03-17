import { isEmpty } from 'lodash';
import React, { useContext, useState } from 'react';
import { MultiSelection as McMultiSelection } from '@map-colonies/react-components';
import CONFIG from '../../config';
import { Mode } from '../../models/mode.enum';
import lookupTablesContext, { ILookupOption } from '../../contexts/lookupTables.context';
import { CustomTheme } from '../../../theming/custom.theme';
import { LayerMetadataMixedUnion, LinkModelType, RecordType } from '../../../discrete-layer/models';
import { EntityFormikHandlers } from '../../../discrete-layer/components/layer-details/layer-datails-form';
import { IRecordFieldInfo } from '../../../discrete-layer/components/layer-details/layer-details.field-info';

// Css
import '../../../App.css'
import '../../../discrete-layer/components/map-container/catalogFilter/catalog-filter-panel.css'

interface MultiSelectionWrapperProps {
    mode: Mode;
    fieldInfo: IRecordFieldInfo;
    lookupOptions: (ILookupOption | {
        value: string;
        translationCode: string;
    })[];
    fieldName: string;
    layerRecord: LayerMetadataMixedUnion | LinkModelType;
    placeholder: string;
    value?: string;
    formik?: EntityFormikHandlers;
}

export const MultiSelection: React.FC<MultiSelectionWrapperProps> = (props) => {
    const { mode, fieldInfo, lookupOptions, fieldName, layerRecord, placeholder, value, formik } = props;
    const [multiSelectionValues, setMultiSelectionValues] = useState(fieldInfo.isMultiSelection && !isEmpty(value) ? value?.split(", ") : [])
    const { lookupTablesData } = useContext(lookupTablesContext);
    const lang = CONFIG.I18N.DEFAULT_LANGUAGE;
    const backLocale = CONFIG.DEFAULT_LOCALE;
    const customStyles = {
        container: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
            return {
                marginRight: mode === Mode.EDIT ? '18px' : (layerRecord as LayerMetadataMixedUnion)?.type === RecordType.RECORD_3D ? '16px' : '12px',
                marginLeft: '2px',
                width: '100%',
            }
        },
        control: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
            return {
                backgroundColor: CustomTheme.darkTheme.GC_ALTERNATIVE_SURFACE,
                cursor: 'pointer',
                border: `1px solid`,
                borderColor: isFocused ? '#24aee9' : CustomTheme.darkTheme.GC_TAB_ACTIVE_BACKGROUND,
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row-reverse' as const,
                justifyContent: 'space-between',
                //mode === Mode.EDIT && 
                height: '24px',
                // minHeight: '24px',
            }
        },
        menu: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
            return {
                ...styles,
                width: mode === Mode.EDIT ? '97%' : '99%',
                marginTop: '0px',
                animation: "fadeIn 0.3s ease-in-out",
            }
        },
        menuList: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
            return {
                ...styles,
                maxHeight: mode === Mode.EDIT ? '160px' : '80px',
                backgroundColor: 'var(--mdc-theme-surface)',
                scrollbarColor: 'var(--mdc-theme-surface)',
                paddingTop: 0,
                paddingBottom: 0,
            }
        },
        option: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
            return {
                cursor: 'pointer',
                height: '40px',
                color: isSelected ? CustomTheme.darkTheme.GC_HOVER_BACKGROUND : 'lightgray',
                backgroundColor: isSelected && 'black',
                border: '0',
            }
        },
        input: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
            return {
                ...styles,
                color: 'rgba(255, 255, 255, 0.7)',
            }
        },
        value: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
            return {
                position: 'relative',
            }
        },
        indicatorsContainer: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
            return {
                ...styles,
                position: 'absolute' as const,
                bottom: '20px',
                height: '2px',
                padding: mode === Mode.EDIT ? '0 22px' : '0 4px',
            }
        },
        dropdownIndicator: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
            return {
                ...styles,
                padding: '0',
                width: '14px',
                color: '#24aee9',
            }
        },
        clearIndicator: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
            return {
                ...styles,
                padding: '0',
                width: '14px',
                color: '#24aee9',
            }
        },
    };

    if (!lookupTablesData || !lookupTablesData.dictionary || fieldInfo.lookupTable == null) return null;

    const getMultiSelectionOptions = () => {
        return (lookupOptions as ILookupOption[]).map((option: ILookupOption) => {
            const text = option.translation?.find((trns) => trns.locale === lang)?.text ?? ''
            return { value: text, label: text }
        });
    };

    const getMultiSelectionValues = () => {
        const chosenValueStrings = (multiSelectionValues)?.map((value) =>
            getMultiSelectionOptions().filter((option) =>
                option.value.includes(value))).flat().map((filteredOption) => filteredOption.value);

        const chosenValueOptions = chosenValueStrings?.map((value) => {
            return [
                { value: value, label: value }
            ]
        }).flat();

        return chosenValueOptions;
    };

    const onChangeMultiSelection = (data: any) => {
        formik?.setFieldValue(fieldName, getFormikFieldValue(data));
        setMultiSelectionValues(data);
    };

    const getFormikFieldValue = (values: { value: string, label: string }[]) => {
        return values.map((val) => {
            const lookupOptionsTranslations = (lookupOptions as ILookupOption[]).map((option) => option.translation);
            const valueTranslation = lookupOptionsTranslations.find((trns) => (trns as unknown as { locale: string, text: string }[]).findIndex((trn) => trn.text === val.value) > -1);
            return valueTranslation?.find((valueTranslations) => valueTranslations.locale === backLocale)?.text
        }).join(', ')
    };

    return (
        <McMultiSelection
            options={getMultiSelectionOptions()}
            values={getMultiSelectionValues()}
            onChange={onChangeMultiSelection}
            placeholder={placeholder}
            styles={customStyles}
        />
    );
}
