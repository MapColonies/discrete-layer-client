import React from 'react';
import ExportGeneralFieldComponent from '../common/fields/export-general-field.component';
import {
  AvailableProperties,
  ExportFieldOptions,
} from '../hooks/useAddFeatureWithProps';

export interface ExportFieldProps {
  selectionId: string;
  selectionIdx: number;
  fieldName: Partial<AvailableProperties>;
  fieldValue: string;
  fieldInfo: ExportFieldOptions;
  type?: 'text' | 'number';
}

const RasterSelectionField: React.FC<ExportFieldProps> = (props) => {
  const { fieldName } = props;

  switch (fieldName) {
    case 'areaZoomLevel': {
      return (
        <>
          <ExportGeneralFieldComponent type="number" {...props} />
        </>
      );
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

export default RasterSelectionField;
