/* eslint-disable @typescript-eslint/ban-ts-comment */
import { get, isEmpty, omit } from 'lodash';
import moment, { unitOfTime } from 'moment';
import { $enum } from 'ts-enum-util';
import { IEnumsMapType } from '../../../common/contexts/enumsMap.context';
import { ValidationTypeName } from '../../../common/models/validation.enum';
import {
  BestRecordModel,
  CategoryConfigModelType,
  EntityDescriptorModelType,
  FieldConfigModelType,
  FractionType,
  Layer3DRecordModel,
  LayerDemRecordModel,
  LayerMetadataMixedUnion,
  LayerRasterRecordModel,
  LinkModel,
  LinkModelType,
  OperationType,
  ProductType,
  QuantizedMeshBestRecordModel,
  RecordType,
  UpdateRulesModelType,
  UpdateRulesOperationModelType,
  ValidationConfigModelType,
  VectorBestRecordModel
} from '../../models';
import { ILayerImage } from '../../models/layerImage';
import { FieldInfoName, IRecordCategoryFieldsInfo } from './layer-details.field-info';
import {
  BestRecordModelArray,
  LayerRasterRecordModelArray,
  Layer3DRecordModelArray,
  LayerDemRecordModelArray,
  VectorBestRecordModelArray,
  QuantizedMeshBestRecordModelArray
} from './entity-types-keys';

const JSON_INDENTATION = 4;

export const getEntityDescriptors = (
  layerRecordTypename: "Layer3DRecord" | "LayerRasterRecord" | "BestRecord" | "LayerDemRecord" | "VectorBestRecord" | "QuantizedMeshBestRecord",
  entityDescriptors: EntityDescriptorModelType[]
): IRecordCategoryFieldsInfo[] => {
  let entityDesc;
  switch (layerRecordTypename) {
    case 'LayerDemRecord':
      entityDesc = entityDescriptors.find(descriptor => descriptor.type === 'PycswDemCatalogRecord')
      break;
    case 'Layer3DRecord':
      entityDesc = entityDescriptors.find(descriptor => descriptor.type === 'Pycsw3DCatalogRecord')
      break;
    case 'BestRecord':
      entityDesc = entityDescriptors.find(descriptor => descriptor.type === 'PycswBestCatalogRecord')
      break;
    case 'VectorBestRecord':
      entityDesc = entityDescriptors.find(descriptor => descriptor.type === 'PycswVectorBestCatalogRecord')
      break;
    case 'QuantizedMeshBestRecord':
      entityDesc = entityDescriptors.find(descriptor => descriptor.type === 'PycswQuantizedMeshBestCatalogRecord')
      break;
    default:
      entityDesc = entityDescriptors.find(descriptor => descriptor.type === 'PycswLayerCatalogRecord')
      break;
  }
  return (get(entityDesc, 'categories') ?? []) as IRecordCategoryFieldsInfo[];
};

export const getFlatEntityDescriptors = (
  layerRecordTypename: "Layer3DRecord" | "LayerRasterRecord" | "BestRecord" | "LayerDemRecord" | "VectorBestRecord" | "QuantizedMeshBestRecord",
  entityDescriptors: EntityDescriptorModelType[]
): FieldConfigModelType[] => {
  const descriptors = getEntityDescriptors(layerRecordTypename, entityDescriptors);
  const flat: FieldConfigModelType[] = [];
  descriptors.forEach((category: CategoryConfigModelType) => {
    category.fields?.forEach((field: FieldConfigModelType) => {
      flat.push(field);
    });
  });
  return flat;
};

export const getBasicType = (fieldName: FieldInfoName, typename: string, lookupTableKey: string | null = null): string => {
  let recordModel;
  if (lookupTableKey !== null) return 'LookupTableType';

  switch (typename) {
    case 'LayerDemRecord':
      recordModel = LayerDemRecordModel;
      break;
    case 'Layer3DRecord':
      recordModel = Layer3DRecordModel;
      break;
    case 'BestRecord':
      recordModel = BestRecordModel;
      break;
    case 'VectorBestRecord':
      recordModel = VectorBestRecordModel;
      break;
    case 'QuantizedMeshBestRecord':
      recordModel = QuantizedMeshBestRecordModel;
      break;
    case 'Link':
      recordModel = LinkModel;
      break;
    default:
      recordModel = LayerRasterRecordModel;
      break;
  }
  const fieldNameStr = fieldName as string;
  const typeString = get(recordModel,`properties.${fieldNameStr}.name`) as string;
  if (typeString) {
    if (fieldNameStr.toLowerCase().includes('url')) {
      return 'url';
    }
    else if (fieldNameStr.toLowerCase().includes('links')) {
      return 'links';
    }
    else if (fieldNameStr.toLowerCase().includes('sensors')) {
      return 'sensors';
    }
    else if (fieldNameStr.toLowerCase().includes('footprint') || fieldNameStr.toLowerCase().includes('layerpolygonparts')) {
      return 'json';
    }
    else {
      return typeString.replaceAll('(','').replaceAll(')','').replaceAll(' | ','').replaceAll('null','').replaceAll('undefined','');
    }
  }
  return 'string';
};

export const getValidationType = (validation: ValidationConfigModelType): ValidationTypeName | undefined => {
  const values = $enum(ValidationTypeName).getValues();
  // @ts-ignore
  const filteredArray = values.filter(value => validation[value] !== null && validation[value] !== undefined);
  return ValidationTypeName[filteredArray[0]];
};

export const getInfoMsgValidationType = (msgCode: string): ValidationTypeName => {
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return ValidationTypeName[msgCode.substring(msgCode.lastIndexOf('.') + 1)];
};

export const cleanUpEntity = (
  data: Record<string,unknown>,
  entityKeys: LayerRasterRecordModelArray | Layer3DRecordModelArray | LayerDemRecordModelArray | BestRecordModelArray | VectorBestRecordModelArray | QuantizedMeshBestRecordModelArray
): Record<string,unknown> => {
  const keysNotInModel = Object.keys(data).filter(key => {
    // @ts-ignore
    return !entityKeys.includes(key);
  });
  return omit(data, keysNotInModel);
};

const checkIsBest = (entity: ILayerImage): boolean => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { ORTHOPHOTO_BEST, RASTER_AID_BEST, RASTER_MAP_BEST, RASTER_VECTOR_BEST, VECTOR_BEST, QUANTIZED_MESH_DTM_BEST, QUANTIZED_MESH_DSM_BEST } = ProductType;

  const bestProductTypes: ProductType[] = [ ORTHOPHOTO_BEST, RASTER_AID_BEST, RASTER_MAP_BEST, RASTER_VECTOR_BEST, VECTOR_BEST, QUANTIZED_MESH_DTM_BEST, QUANTIZED_MESH_DSM_BEST ];

  return bestProductTypes.includes(entity.productType as ProductType);
};

export const isDiscrete = (entity: ILayerImage): boolean => {
  return !checkIsBest(entity)
};

export const isBest = (entity: ILayerImage): boolean => {
  return checkIsBest(entity)
};

export const isMultiSelection = (recordType: RecordType): boolean => {
  return recordType !== RecordType.RECORD_3D;
};

const removeObjFields = (
  obj: Record<string, unknown>,
  cbFn: (curVal: unknown) => boolean
): Record<string, unknown> => {
  // if cbFn returns true it means the field *should be omitted*.
  return Object.fromEntries(
    Object.entries(obj).filter(([_, val]) => {
      const shouldOmitField = cbFn(val);
      return !shouldOmitField;
    })
  );
};

export const removeEmptyObjFields = (
  obj: Record<string, unknown>
): Record<string, unknown> => {
  return removeObjFields(obj, (val) => typeof val === 'object' && isEmpty(val));
};

export const transformEntityToFormFields = (
  layerRecord: LayerMetadataMixedUnion | LinkModelType
): Record<string, unknown> => {
  const transformedFields = {...layerRecord};
  for (const fieldName of Object.keys(layerRecord)) {
    const basicType = getBasicType(fieldName as FieldInfoName, layerRecord.__typename);
    switch (basicType) {
      case 'string[]':
      case 'sensors':
        /* eslint-disable */
        // @ts-ignore
        transformedFields[fieldName] = transformedFields[fieldName]?.join(', ');
        /* eslint-enable */
        break;
      default:
        break;
    }
  }
  return transformedFields;
};

export const transformFormFieldsToEntity = (
  fields: Record<string, unknown>,
  layerRecord: LayerMetadataMixedUnion | LinkModelType
): Record<string, unknown> => {
  const transformedFields = {...fields};
  for (const fieldName of Object.keys(fields)) {
    const basicType = getBasicType(fieldName as FieldInfoName, layerRecord.__typename);
    switch (basicType) {
      case 'string[]':
      case 'sensors':
        /* eslint-disable */
        // @ts-ignore
        transformedFields[fieldName] = transformedFields[fieldName]?.split(',')?.map(val => (val as string).trim());
        /* eslint-enable */
        break;
      default:
        break;
    }
  }
  return transformedFields;
};

export const getPartialRecord = (inputValues: Partial<ILayerImage>, descriptors: FieldConfigModelType[], attr: string): Partial<ILayerImage> => {
  const editableFields = descriptors
    .filter(item => get(item, attr) === true)
    .map(item => item.fieldName);
  const partialRecordData = Object.keys(inputValues)
    .filter(key => editableFields.includes(key))
    .reduce((obj: Record<string, unknown>, key: string) => {
      obj[key] = get(inputValues, key) as unknown;
      return obj;
    }, {});
  return partialRecordData;
};

export const extractUpdateRelatedFieldNames = (record: ILayerImage, descriptors: FieldConfigModelType[]): string[] => {
  const updateRulesFields = descriptors.filter((descriptor) => descriptor.updateRules !== null);
  return updateRulesFields.map(field => field.fieldName) as string[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function downloadJSONToClient(jsonObj: Record<any, any>, fileName: string): void {
  const link = document.createElement('a');
  link.setAttribute('href', `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(jsonObj, null, JSON_INDENTATION)
  )}`);
  link.setAttribute('download', fileName);
  link.click();
  link.remove();
}

export function importJSONFileFromClient(fileLoadCB: (ev: ProgressEvent<FileReader>) => void): void {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', '.json');
  input.addEventListener('change', (e): void => {
    const target = (e.currentTarget as HTMLInputElement);
    if (target.files) {
      const file = target.files[0];
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.addEventListener('load', (e) => {
        fileLoadCB(e);
        input.remove();
      });
    }
  });
  input.click();
}  

export function importShapeFileFromClient(fileLoadCB: (ev: ProgressEvent<FileReader>, type: string) => void): void {
  const input = document.createElement('input');
  const supportedExtensions = ['.shp', '.zip'];
  input.setAttribute('type', 'file');
  input.setAttribute('accept', supportedExtensions.join(','));
  input.addEventListener('change',(e): void => {
    const target = (e.currentTarget as HTMLInputElement);
    if (target.files) {
      const file = target.files[0];
      const fileType = file.name.split('.').pop();
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.addEventListener('load', (e) => {
        fileLoadCB(e, fileType as string);
        input.remove();
      });
    }
  });
  input.click();
}  

export const getRecordForUpdate = (selectedLayer: ILayerImage ,record: ILayerImage, descriptors: FieldConfigModelType[]): ILayerImage => {
  const VERSION_DELIMITER = '.';

  // ---------- HELPERS ----------
  
  const handleExplicitOperation = (
    field: FieldConfigModelType,
    fieldOperation: UpdateRulesOperationModelType,
    recordForUpdate: Record<string, unknown>
  ): Record<string, unknown> => {
    const recordCopy = { ...recordForUpdate };
    const selectedLayerFieldValue = get(recordForUpdate, `[${field.fieldName as string}]`);
  
    if (fieldOperation.value === null || typeof fieldOperation.value === 'undefined') return recordCopy;
  
    const fraction = fieldOperation.fraction;
  
    // Handling regular number fields
    if (fraction === null || typeof fraction === 'undefined') {
      recordCopy[field.fieldName as string] = fieldOperation.value;
      return recordCopy;
    }
    
    // Handling Moment fields
    if (moment.isMoment(selectedLayerFieldValue)) {
      const dateFractions: Record<string, unitOfTime.Base> = {
        [FractionType.DAYS]: 'date' as unitOfTime.Base, 
        [FractionType.MONTHS]: 'month' as unitOfTime.Base,
        [FractionType.YEARS]: 'year' as unitOfTime.Base,
      };
      selectedLayerFieldValue.set(dateFractions[fraction], fieldOperation.value);
      recordCopy[field.fieldName as string] = selectedLayerFieldValue;
  
      return recordCopy;
    }

    // Handling version fields
    const versionFractions: Record<string, number> = {[FractionType.MAJOR]: 0, [FractionType.MINOR]: 1, [FractionType.PATCH]: 2 };
    
    if (fraction in versionFractions) {
      const currentVersionSplit = (recordCopy[field.fieldName as string] as string).split(VERSION_DELIMITER);
      currentVersionSplit[versionFractions[fraction]] = `${fieldOperation.value}`;
      recordCopy[field.fieldName as string] = currentVersionSplit.join(VERSION_DELIMITER);
      return recordCopy;
    }
    
    return recordCopy;
  };
  
  const handleIncrementOperation = (
    field: FieldConfigModelType,
    fieldOperation: UpdateRulesOperationModelType,
    recordForUpdate: Record<string, unknown>
  ): Record<string, unknown> => {
    const recordCpy = { ...recordForUpdate };
    const selectedLayerFieldValue = get(recordForUpdate,`[${field.fieldName as string}]`);

    if (fieldOperation.value === null || typeof fieldOperation.value === 'undefined') return recordCpy;

    const fraction = fieldOperation.fraction;

    // Handling regular number fields
    if (fraction === null || typeof fraction === 'undefined') {
      recordCpy[field.fieldName as string] = recordCpy[field.fieldName as string] as number + fieldOperation.value;
      return recordCpy;
    }
    
    // Handling Moment fields
    if (moment.isMoment(selectedLayerFieldValue)) {
      const dateFractions: Record<string, string> = {[FractionType.DAYS]: 'days', [FractionType.MONTHS]: 'months', [FractionType.YEARS]: 'years' };
      selectedLayerFieldValue.add(fieldOperation.value, dateFractions[fraction] as unitOfTime.DurationConstructor);
      recordCpy[field.fieldName as string] = selectedLayerFieldValue;
      return recordCpy;
    }

    // Handling version fields
    const versionFractions: Record<string, number> = {[FractionType.MAJOR]: 0, [FractionType.MINOR]: 1, [FractionType.PATCH]: 2 };
    
    if (fraction in versionFractions) {
      const currentVersionSplit = (recordCpy[field.fieldName as string] as string).split(VERSION_DELIMITER);
      const fractionVersionValue = currentVersionSplit[versionFractions[fraction]];
      currentVersionSplit[versionFractions[fraction]] = `${+fractionVersionValue + fieldOperation.value}`;
      recordCpy[field.fieldName as string] = currentVersionSplit.join(VERSION_DELIMITER);
      return recordCpy;
    }
    
    return recordCpy;
  };
  
  // -----------------------------

  let recordForUpdate: Record<string,unknown> = { ...record };
  const updateRulesFields = descriptors.filter((descriptor) => descriptor.updateRules !== null);
  
  for (const field of updateRulesFields) {
    const updateRules = field.updateRules as UpdateRulesModelType | undefined;
    const fieldOperation = get(updateRules,'value.operation') as UpdateRulesOperationModelType | undefined;
    const selectedLayerFieldValue = (selectedLayer as unknown as Record<string,unknown>)[field.fieldName as string];

    // Copy all relevant fields
    recordForUpdate[field.fieldName as string] = selectedLayerFieldValue;

    if (fieldOperation?.type !== null && fieldOperation?.type !== OperationType.COPY) {
      switch (fieldOperation?.type) {
        case OperationType.EXPLICIT: 
          recordForUpdate = {...handleExplicitOperation(field, fieldOperation, recordForUpdate)};
          break;
        case OperationType.INCREMENT:  
          recordForUpdate = {...handleIncrementOperation(field, fieldOperation, recordForUpdate)};
          break;
        default:
      }
    }
  }

  return recordForUpdate as unknown as ILayerImage;
};

export const getEnumKeys = (enumsMap: IEnumsMapType, enumName: string, parent?: string): string[] => {
  return Object.keys(enumsMap)
    .filter((key) => {
      if (!isEmpty(parent)) {
        return enumsMap[key].enumName === enumName && enumsMap[key].parent === parent;
      }
      return enumsMap[key].enumName === enumName;
    });
};

export const getProductDomain = (productType: ProductType, enumsMap?: IEnumsMapType): string => {
  return enumsMap?.[productType as string]?.parentDomain as string;
}