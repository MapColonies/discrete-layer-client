import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { Layer3DRecordModel, LayerMetadataMixedUnion, LayerRasterRecordModel } from '../../models';
import { ILayerImage } from '../../models/layerImage';
import { dateFormatter } from '../layers-results/type-formatters/type-formatters';

import './layer-details.css';

export enum FieldCategory {
  MAIN = 0,
  GENERAL = 1,
  GEO_INFO = 2,
}

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

interface LayersDetailsComponentProps {
  isBrief?: boolean;
  layerRecord?: ILayerImage | null;
}

export const LayersDetailsComponent: React.FC<LayersDetailsComponentProps> = (props :LayersDetailsComponentProps) => {
  const { isBrief, layerRecord } = props;

  const getValuePresentor = (layerRecord: LayerMetadataMixedUnion, fieldName: string, fieldValue: any) => {
    const getBasicType = (typeString: string): string => {
      return typeString.replaceAll('(','').replaceAll(')','').replaceAll(' | ','').replaceAll('null','').replaceAll('undefined','');
    }

    let recordModel;
    switch(layerRecord.__typename){
      case 'Layer3DRecord':
        recordModel = Layer3DRecordModel;
        break;
      default:
        recordModel = LayerRasterRecordModel;
        break;
    }

    const modelProps: any = recordModel.properties as any;
    // console.log(`${fieldName} -->`, modelProps[fieldName]);
    const basicType = getBasicType(modelProps[fieldName].name);

    switch(basicType){
      case 'string':
      case 'identifier':
        return (
          <span className="detailsFieldValue">{fieldValue}</span> 
        )
      case 'momentDateType':
        return (
          <span className="detailsFieldValue">
            {
              dateFormatter(fieldValue)
            }
          </span> 
        )
  
    }
  };

  const getCategoryFields = (layerRecord: LayerMetadataMixedUnion) => {
    let fieldsInfo;
    switch(layerRecord.__typename){
      case 'Layer3DRecord':
        fieldsInfo = Layer3DRecorModelFieldsInfo;
        break;
      default:
        fieldsInfo = LayerRasterRecorModelFieldsInfo;
        break;
    }
      
    if(isBrief){
      return fieldsInfo.filter((item) => item.category === FieldCategory.MAIN);
    }
    return fieldsInfo;
  };

  return (
    <>
      {
        layerRecord && getCategoryFields(layerRecord).map(category => {
          return (
            <Box className="categoryFieldsParentContainer">
              <Typography use="headline6" tag="div" className="categoryFieldsTitle">
                <FormattedMessage id={category.categoryTitle} />
              </Typography>
              <Box className="categoryFieldsContainer">
                {
                  category.fields.map(fieldInfo => {
                    return (
                      <Box className="categoryField">
                        <span className="detailsFieldLabel">
                          <FormattedMessage id={fieldInfo.label} />:
                        </span>
                        {
                          getValuePresentor(layerRecord, fieldInfo.fieldName, (layerRecord as any)[fieldInfo.fieldName])
                        }
                      </Box>
                    )
                  })
                  // JSON.stringify(layerRecord)
                }
              </Box>
            </Box>
          )
        })
      }
    </>
  )
};