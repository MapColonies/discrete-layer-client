import React from 'react';
import ExportNumberFieldComponent from '../export-common-fields/export-number-field.component';
import ExportStringFieldComponent from '../export-common-fields/export-string-field.component';
import {
  AvailableProperties,
  ExportFieldOptions,
} from '../hooks/useAddFeatureWithProps';

export interface ExportFieldProps {
  selectionId: string;
  fieldName: Partial<AvailableProperties>;
  fieldValue: string;
  fieldInfo: ExportFieldOptions;
}

const RasterSelectionField: React.FC<ExportFieldProps> = (props) => {
  const { fieldName } = props;

  switch (fieldName) {
    case 'areaZoomLevel': {
      return (
        <>
          <ExportNumberFieldComponent {...props} />
        </>
      );
    }
    case 'description': {
      return (
        <>
          <ExportStringFieldComponent {...props} />
        </>
      );
    }
    default: {
      return (
        <>
          <ExportStringFieldComponent {...props} />
        </>
      );
    }
  }
};

export default RasterSelectionField;
