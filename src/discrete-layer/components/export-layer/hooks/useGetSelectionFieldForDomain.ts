import { get } from 'lodash';
import React, { useContext, useMemo } from 'react';
import EnumsMapContext, {
  IEnumsMapType,
} from '../../../../common/contexts/enumsMap.context';
import { RecordType, useStore } from '../../../models';
import ExportStringFieldComponent from '../export-common-fields/export-general-field.component';
import DemSelectionField from '../export-entity-selections-fields/dem-selection-field.component';
import RasterSelectionField, {
  ExportFieldProps,
} from '../export-entity-selections-fields/raster-selection-field.component';

const useGetSelectionFieldForDomain = (): React.FC<ExportFieldProps> => {
  const { exportStore } = useStore();
  const { enumsMap } = useContext(EnumsMapContext);

  const enums = enumsMap as IEnumsMapType;
  const { layerToExport } = exportStore;

  const getSelectionByDomain = useMemo(() => {
    const layerRecordType = get(enums, layerToExport?.productType as string).parentDomain as RecordType;

    switch (layerRecordType) {
      case RecordType.RECORD_RASTER:
        return RasterSelectionField;
      case RecordType.RECORD_DEM:
        return DemSelectionField;
      default:
          return ExportStringFieldComponent;
    }
  }, [])

 return getSelectionByDomain;
};

export default useGetSelectionFieldForDomain;
