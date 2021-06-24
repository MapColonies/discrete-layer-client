import { Layer3DRecordModelType } from '../../models/Layer3DRecordModel';
import { LayerRasterRecordModelType } from '../../models/LayerRasterRecordModel';
import { LinkModelType } from '../../models/LinkModel';

export type FieldInfoName = keyof Layer3DRecordModelType | keyof LayerRasterRecordModelType | keyof LinkModelType;

export enum FieldCategory {
  MAIN,
  GENERAL,
  GEO_INFO,
}

export interface IRecordFieldInfo {
  fieldName: FieldInfoName,
  label: string,
  fullWidth?: boolean,
  subFields?: IRecordFieldInfo[],
  isManuallyEditable?: boolean,
}

export interface IRecordCategoryFieldsInfo {
  category: FieldCategory,
  categoryTitle: string,
  fields:  IRecordFieldInfo[],
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const LayerRasterRecorModelFieldsInfo: IRecordCategoryFieldsInfo[] = [
  {
    category: FieldCategory.MAIN,
    categoryTitle: 'fields-categories.main',
    fields: [
      {
        fieldName: 'id',
        label: 'field-names.raster.id',
      },
      {
        fieldName: 'productId',
        label: 'field-names.raster.productId',
      },
      {
        fieldName: 'productVersion',
        label: 'field-names.raster.productVersion',
      },
      {
        fieldName: 'productType',
        label: 'field-names.raster.productType',
      },
      {
        fieldName: 'type',
        label: 'field-names.raster.type',
      },
      {
        fieldName: 'resolution',
        label: 'field-names.raster.resolution',
      },
      {
        fieldName: 'updateDate',
        label: 'field-names.raster.update-date',
      },
    ]
  },
  {
    category: FieldCategory.GENERAL,
    categoryTitle: 'fields-categories.general',
    fields: [
      {
        fieldName: 'description',
        label: 'field-names.raster.description',
        fullWidth: true,
        isManuallyEditable: true
      },
      {
        fieldName: 'sensorType',
        label: 'field-names.raster.sensor-type',
        fullWidth: true,
      },
      {
        fieldName: 'region',
        label: 'field-names.raster.region',
        fullWidth: true,
      },
      {
        fieldName: 'classification',
        label: 'field-names.raster.classification',
        fullWidth: true,
      },
      {
        fieldName: 'links',
        label: 'field-names.raster.links',
        fullWidth: true,
        subFields: [
          {
            fieldName: 'name',
            label: 'field-names.raster.link.name',
            fullWidth: true,
          },
          {
            fieldName: 'description',
            label: 'field-names.raster.link.description',
            fullWidth: true,
          },
          {
            fieldName: 'protocol',
            label: 'field-names.raster.link.protocol',
            fullWidth: true,
          },
          {
            fieldName: 'url',
            label: 'field-names.raster.link.url',
            fullWidth: true,
          },
        ]
      },
      {
        fieldName: 'creationDate',
        label: 'field-names.raster.creation-date',
      },
      {
        fieldName: 'ingestionDate',
        label: 'field-names.raster.ingestion-date',
      },
      {
        fieldName: 'sourceDateStart',
        label: 'field-names.raster.source-start-date',
      },
      {
        fieldName: 'sourceDateEnd',
        label: 'field-names.raster.source-end-date',
      },
    ]
  },
  {
    category: FieldCategory.GEO_INFO,
    categoryTitle: 'fields-categories.geo',
    fields: [
      {
        fieldName: 'accuracyCE90',
        label: 'field-names.raster.accuracyCE90',
      },
      {
        fieldName: 'srsId',
        label: 'field-names.raster.srs',
      },
      {
        fieldName: 'srsName',
        label: 'field-names.raster.srs-name',
      },
    ]
  },
];

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Layer3DRecorModelFieldsInfo: IRecordCategoryFieldsInfo[] = [
  {
    category: FieldCategory.MAIN,
    categoryTitle: 'fields-categories.main',
    fields: [
      {
        fieldName: 'id',
        label: 'field-names.3d.id',
      },
      {
        fieldName: 'productId',
        label: 'field-names.3d.productId',
      },
      {
        fieldName: 'productVersion',
        label: 'field-names.3d.productVersion',
      },
      {
        fieldName: 'productType',
        label: 'field-names.3d.productType',
      },
      {
        fieldName: 'type',
        label: 'field-names.3d.type',
      },
      {
        fieldName: 'resolution',
        label: 'field-names.3d.resolution',
      },
      {
        fieldName: 'updateDate',
        label: 'field-names.3d.update-date',
      },
    ]
  },
  {
    category: FieldCategory.GENERAL,
    categoryTitle: 'fields-categories.general',
    fields: [
      {
        fieldName: 'description',
        label: 'field-names.3d.description',
        fullWidth: true,
        isManuallyEditable: true
      },
      {
        fieldName: 'sensorType',
        label: 'field-names.3d.sensor-type',
        fullWidth: true,
      },
      {
        fieldName: 'region',
        label: 'field-names.3d.region',
        fullWidth: true,
      },
      {
        fieldName: 'classification',
        label: 'field-names.3d.classification',
        fullWidth: true,
      },
      {
        fieldName: 'links',
        label: 'field-names.3d.links',
        fullWidth: true,
        subFields: [
          {
            fieldName: 'name',
            label: 'field-names.3d.link.name',
            fullWidth: true,
          },
          {
            fieldName: 'description',
            label: 'field-names.3d.link.description',
            fullWidth: true,
          },
          {
            fieldName: 'protocol',
            label: 'field-names.3d.link.protocol',
            fullWidth: true,
          },
          {
            fieldName: 'url',
            label: 'field-names.3d.link.url',
            fullWidth: true,
          },
        ]
      },
      {
        fieldName: 'creationDate',
        label: 'field-names.3d.creation-date',
      },
      {
        fieldName: 'ingestionDate',
        label: 'field-names.3d.ingestion-date',
      },
      {
        fieldName: 'sourceDateStart',
        label: 'field-names.3d.source-start-date',
      },
      {
        fieldName: 'sourceDateEnd',
        label: 'field-names.3d.source-end-date',
      },
    ]
  },
  {
    category: FieldCategory.GEO_INFO,
    categoryTitle: 'fields-categories.geo',
    fields: [
      {
        fieldName: 'accuracyCE90',
        label: 'field-names.3d.accuracyCE90',
      },
      {
        fieldName: 'accuracyLE90',
        label: 'field-names.3d.accuracyLE90',
      },
      {
        fieldName: 'srsId',
        label: 'field-names.3d.srs',
      },
      {
        fieldName: 'srsName',
        label: 'field-names.3d.srs-name',
      },
    ]
  },
];