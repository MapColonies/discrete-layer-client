import React from 'react';
import { Mode } from '../../../../common/models/mode.enum';
import { EntityFormikHandlers } from '../layer-datails-form';
import { IRecordFieldInfo } from '../layer-details.field-info';
import { FormInputTextFieldComponent } from './form.input.text.field';
import { MultiSelection } from '@map-colonies/react-components';
import { CustomTheme } from '../../../../theming/custom.theme';

interface StringValuePresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: string;
  formik?: EntityFormikHandlers;
  fieldNamePrefix?: string;
}

export const StringValuePresentorComponent: React.FC<StringValuePresentorProps> = (props) => {
  const newLocal = [
    { value: "ocean", label: "Ocean", color: "#00B8D9" },
    { value: "blue", label: "Blue", color: "#0052CC", disabled: true },
    { value: "purple", label: "Purple", color: "#5243AA" },
    { value: "red", label: "Red", color: "#FF5630" },
    { value: "orange", label: "Orange", color: "#FF8B00" },
    { value: "yellow", label: "Yellow", color: "#FFC400" },
    { value: "green", label: "Green", color: "#36B37E" },
    { value: "forest", label: "Forest", color: "#00875A" },
    { value: "slate", label: "Slate", color: "#253858" },
    { value: "silver", label: "Silver", color: "#666666" }
  ];

  const customStyles = {
    control: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
      return {
      backgroundColor: CustomTheme.darkTheme.GC_ALTERNATIVE_SURFACE,
      cursor: 'default',
      border: `0.5px solid`,
      borderColor: isFocused ? '#24aee9': CustomTheme.darkTheme.GC_TAB_ACTIVE_BACKGROUND,
      borderRadius: '4px',
      marginRight: '11px',
      width: '99%',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row-reverse' as const,
      justifyContent: 'space-between',
      }},
    menuList: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
      return {
      ...styles,
      paddingTop: 0,
      paddingBottom: 0,
    }},
    option: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
      return {
      cursor: 'pointer',
      height: '40px',
      color: isSelected ? CustomTheme.darkTheme.GC_HOVER_BACKGROUND : 'lightgray',
      backgroundColor: isSelected ? 'black' : CustomTheme.darkTheme.GC_ALTERNATIVE_SURFACE,
      border: '0'
      }},
    input: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
      return {
      ...styles,
      marginRight: 'auto', 
      color: 'rgba(255, 255, 255, 0.7)',
    }},
    indicatorsContainer: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
      return {
      ...styles,
      position: 'absolute' as const,
      bottom: '15px',
      height: '2px',
      padding: '0 4px',
    }},
    dropdownIndicator: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
      return {
      ...styles,
      padding: '0',
      width: '14px',
      color: '#24aee9',
    }},
    clearIndicator: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
      return {
      ...styles,
      padding: '0',
      width: '14px',
      color: '#24aee9',
    }},
  };

  return (
    props.fieldInfo.fieldName === "region" ?
    <MultiSelection options={newLocal} placeholder={''} styles={customStyles} /> :
    <FormInputTextFieldComponent {...props} type="text" /> 
  )
}
