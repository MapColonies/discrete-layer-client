import { degreesPerPixelToZoomLevel } from '@map-colonies/mc-utils';
import { get } from 'lodash';
import React from 'react';
import { useStore } from '../../../models';
import { LayerMetadataMixedUnionKeys } from '../../layer-details/entity-types-keys';
import ExportGeneralFieldComponent from '../common/fields/export-general-field.component';
import ExportOptionsField from '../common/fields/export-options-field.component';
import { ZOOM_LEVELS_TABLE } from '../constants';
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
  isLoading?: boolean;
  type?: 'text' | 'number';
}

const RasterSelectionField: React.FC<ExportFieldProps> = (props) => {
  const { fieldName, fieldInfo } = props;
  const { exportStore } = useStore();

  switch (fieldName) {
    case 'maxResolutionDeg': {
      const currentRes = (get(exportStore.layerToExport, fieldInfo.defaultsFromEntityField as LayerMetadataMixedUnionKeys) as number).toString();

      const getValidResolutions = (): string[] => {
        return Object.values(ZOOM_LEVELS_TABLE)
        .map((res) => res.toString())
        .filter((res) => {
          const resolutionPrecision = currentRes.split('.')[1].length;
          const samePrecisionResFromTable = Number(res).toFixed(
            resolutionPrecision
          );
    
          return Number(currentRes) <= Number(samePrecisionResFromTable);
        })
      }

      let defaultZoomLevel: number;
      try {
        defaultZoomLevel = degreesPerPixelToZoomLevel(+currentRes);
      } catch(e) {
        console.error(e);
        defaultZoomLevel = NaN;
      }

      return (
        <>
          <ExportOptionsField 
            options={getValidResolutions()}
            defaultValue={(get(ZOOM_LEVELS_TABLE, defaultZoomLevel) as number | undefined)?.toString()}
            {...props} />
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
