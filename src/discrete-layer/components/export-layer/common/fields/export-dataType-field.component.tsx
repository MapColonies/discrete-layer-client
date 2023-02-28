import { get } from 'lodash';
import React, { useMemo } from 'react';
import { useStore } from '../../../../models';
import { LayerMetadataMixedUnionKeys } from '../../../layer-details/entity-types-keys';
import { ExportFieldProps } from '../../export-entity-selections-fields/raster-selection-field.component';
import ExportOptionsField from './export-options-field.component';

interface ExportDataTypeField extends ExportFieldProps {
  dataTypeFromLayer: LayerMetadataMixedUnionKeys;
}

const DATA_TYPE_OPTIONS = [
  'Int16',
  'Int32',
  'Int64',
  'Float32',
  'Float64',
];

const FIRST_IDX = 0;

const ExportDataTypeField: React.FC<ExportDataTypeField> = ({
  dataTypeFromLayer,
  ...fieldGeneralProps
}) => {
  const { exportStore } = useStore();

  const validOptions = useMemo((): { options: string[], defaultValue: string } => {
    const maximumDataType = (get(exportStore.layerToExport,dataTypeFromLayer) as string).toLowerCase();
    const currentDataTypeIdx = DATA_TYPE_OPTIONS.findIndex(
      (type) => type.toLowerCase() === maximumDataType
    );
  
    const validOptions = DATA_TYPE_OPTIONS.slice(
      FIRST_IDX,
      currentDataTypeIdx + 1
    );

    return ({
      options: validOptions,
      defaultValue: DATA_TYPE_OPTIONS[currentDataTypeIdx],
    });
  }, [exportStore.layerToExport]);
 
 

  return (
    <ExportOptionsField
      options={validOptions.options}
      defaultValue={validOptions.defaultValue}
      {...fieldGeneralProps}
    />
  );
};

export default ExportDataTypeField;
