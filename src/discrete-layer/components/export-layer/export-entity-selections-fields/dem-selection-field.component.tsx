import React, { useContext } from 'react';
import EnumsMapContext, { IEnumsMapType } from '../../../../common/contexts/enumsMap.context';
import ExportEnumSelectionField from '../common/fields/export-enum-selection-field.component';
import ExportGeneralFieldComponent from '../common/fields/export-general-field.component';
import { getEnumKeys } from '../../layer-details/utils';
import { ExportFieldProps } from './raster-selection-field.component';
import ExportDataTypeField from '../common/fields/export-dataType-field.component';

const DemSelectionField: React.FC<ExportFieldProps> = (props) => {
  const { fieldName } = props;

  const { enumsMap } = useContext(EnumsMapContext);
  const enums = enumsMap as IEnumsMapType;

  switch (fieldName) {
    case 'targetResolution': {
      return (
        <>
          <ExportGeneralFieldComponent type="number" {...props} />
        </>
      );
    }
    case 'resampleMethod': {
      return (
        <>
          <ExportEnumSelectionField {...props} options={getEnumKeys(enums, 'ProductType')} />
        </>
      );
    }
    case 'dataType': {
      return (
        <>
          <ExportDataTypeField {...props} dataTypeFromLayer="dataType" />
        </>
      )
    }
    case 'description': {
      return (
        <>
          <ExportGeneralFieldComponent type="text" {...props} />
        </>
      );
    }
    default: {
      return (
        <>
          <ExportGeneralFieldComponent {...props} />
        </>
      );
    }
  }
};

export default DemSelectionField;
