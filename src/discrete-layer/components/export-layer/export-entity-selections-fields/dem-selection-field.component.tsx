import React, { useContext } from 'react';
import EnumsMapContext, { IEnumsMapType } from '../../../../common/contexts/enumsMap.context';
import { useStore } from '../../../models';
import ExportGeneralFieldComponent from '../common/fields/export-general-field.component';
import { ExportFieldProps } from './raster-selection-field.component';
import ExportOptionsField from '../common/fields/export-options-field.component';
import { getEnumRealValues } from '../utils/export-layer-utils';
import { DEMExportProjection } from '../types/enums';
import { get } from 'lodash';

const DemSelectionField: React.FC<ExportFieldProps> = (props) => {
  const { fieldName } = props;
  const {exportStore: { layerToExport }} = useStore();
  const { enumsMap } = useContext(EnumsMapContext);
  const enums = enumsMap as IEnumsMapType;

  switch (fieldName) {
    case 'resolution': {
      return (
        <>
          <ExportGeneralFieldComponent type="number" {...props} />
        </>
      );
    }
    case 'projection': {
      const PROJECTION_OPTIONS = [DEMExportProjection.WGS84, DEMExportProjection.UTM];
      const DEFAULT_PROJECTION = DEMExportProjection.WGS84;

      return (
        <>
           <ExportOptionsField
              options={PROJECTION_OPTIONS}
              defaultValue={DEFAULT_PROJECTION}
              {...props}
            />
        </>
      )
    }
    case 'resampleMethod': {
      const options = getEnumRealValues(enums, "ResamplingMethod");
      const defaultResamplingMethod = 'near';

      return (
        <>
           <ExportOptionsField
              options={options}
              defaultValue={defaultResamplingMethod}
              {...props}
            />
        </>
      )
    }
    case 'dataType': {
      const options = getEnumRealValues(enums, "DEMDataType");
      const defaultValueFromLayer = get(layerToExport, 'dataType') as string;
      const defaultValue = get(enums, defaultValueFromLayer).realValue;
      
      return (
        <>
            <ExportOptionsField
              options={options}
              defaultValue={defaultValue}
              {...props}
            />
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
