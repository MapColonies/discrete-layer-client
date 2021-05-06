export enum FieldCategory {
  MAIN,
  GENERAL,
  GEO_INFO,
}

export interface IRecordFieldInfo {
  fieldName: string,
  label: string,
  fullWidth?: boolean,
  subFields?: IRecordFieldInfo[],
}

export interface IRecordCategoryFieldsInfo {
  category: FieldCategory,
  categoryTitle: string,
  fields:  IRecordFieldInfo[],
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const LayerRasterRecorModelFieldsInfo = [
  {
    category: FieldCategory.MAIN,
    categoryTitle: 'fields-categories.main',
    fields: [
      {
        fieldName: 'id',
        label: 'field-names.raster.id',
      },
      {
        fieldName: 'source',
        label: 'field-names.raster.source',
      },
      // {
      //   fieldName: 'sourceName',
      //   isBrief: true,
      //   category: 'MAIN',
      //   label: 'SourceName',
      // },
      {
        fieldName: 'creationDate',
        label: 'field-names.raster.creation-date',
      },
    ]
  },
  {
    category: FieldCategory.GENERAL,
    categoryTitle: 'fields-categories.general',
    fields: [
      {
        fieldName: 'type',
        label: 'field-names.raster.type',
      },
      {
        fieldName: 'dsc',
        label: 'field-names.raster.dsc',
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
      }
    ]
  },
  

 
  // {
  //   fieldName: 'updateDate',
  //   isBrief: true,
  //   category: 'MAIN',
  //   label: 'UpdateDate',
  // }
  // resolution?: number;
  // ep90?: number;
  // sensorType?: SensorType;
  // rms?: number;
  // scale?: string;
  // dsc?: string;
  // geometry?: GeoJSON;
  // id?: string;
  // version?: string;

  // typeName: String
  // schema: String
  // mdSource: String
  // xml: String
  // anyText: String
  // insertDate: DateTime
  // wktGeometry: String
  // links: [Link]
  // anyTextTsvector: String
  // description: String
  // wkbGeometry: String
  // identifier: String
  // title: String
  // type: String
  // srs: String
  // producerName: String
  // projectName: String
  // creationDate: DateTime
  // classification: String
  // keywords: String
  // id: ID!
  // sourceName: String!
  // source: String
  // updateDate: String
  // resolution: Float
  // ep90: Float
  // sensorType: SensorType
  // rms: Float
  // scale: String
  // dsc: String
  // geometry: GeoJSONFeature
  // version: String
  // selected: Boolean
  // order: Float
];

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Layer3DRecorModelFieldsInfo = [
  {
    category: FieldCategory.MAIN,
    categoryTitle: 'fields-categories.main',
    fields: [
      {
        fieldName: 'id',
        label: 'field-names.3d.id',
      },
      {
        fieldName: 'source',
        label: 'field-names.3d.source',
      },
      {
        fieldName: 'creationDate',
        label: 'field-names.3d.creation-date',
      },
    ]
  },
  {
    category: FieldCategory.GENERAL,
    categoryTitle: 'fields-categories.general',
    fields: [
      {
        fieldName: 'type',
        label: 'field-names.3d.type',
      },
      {
        fieldName: 'dsc',
        label: 'field-names.3d.dsc',
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
      }
    ]
  },
  {
    category: FieldCategory.GEO_INFO,
    categoryTitle: 'fields-categories.geo',
    fields: [
      {
        fieldName: 'accuracyLE90',
        label: 'field-names.3d.accuracyLE90',
      },
    ]
  },
];