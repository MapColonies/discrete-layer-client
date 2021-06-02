import React from 'react';
import moment from 'moment';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { Layer3DRecordModel, LayerMetadataMixedUnion, LayerRasterRecordModel, LinkModel, LinkModelType, RecordType } from '../../models';
import { ILayerImage } from '../../models/layerImage';
import { FieldCategory, LayerRasterRecorModelFieldsInfo, Layer3DRecorModelFieldsInfo, IRecordFieldInfo, IRecordCategoryFieldsInfo, FieldInfoName } from './layer-details.field-info';

import { StringValuePresentorComponent } from './field-value-presentors/string.value-presentors';
import { DateValuePresentorComponent } from './field-value-presentors/date.value-presentors';
import { UrlValuePresentorComponent } from './field-value-presentors/url.value-presentors';
import { LinksValuePresentorComponent } from './field-value-presentors/links.value-presentors';
import { UnknownValuePresentorComponent } from './field-value-presentors/unknown.value-presentors';
import { RecordTypeValuePresentorComponent } from  './field-value-presentors/record-type.value-presentors';
import { FieldLabelComponent } from './field-label';

import './layer-details.css';

interface LayersDetailsComponentProps {
  isBrief?: boolean;
  layerRecord?: ILayerImage | null;
}

const getBasicType = (fieldName: FieldInfoName, layerRecord: LayerMetadataMixedUnion | LinkModelType): string => {
  let recordModel;
  switch(layerRecord.__typename){
    case 'Layer3DRecord':
      recordModel = Layer3DRecordModel;
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
  if(fieldNameStr.toLowerCase().includes('url')){
    return 'url';
  }
  else if (fieldNameStr.toLowerCase().includes('links')){
    return 'links';
  }
  else {
    return typeString.replaceAll('(','').replaceAll(')','').replaceAll(' | ','').replaceAll('null','').replaceAll('undefined','');
  }
}

export const getValuePresentor = (layerRecord: LayerMetadataMixedUnion | LinkModelType, fieldInfo: IRecordFieldInfo, fieldValue: unknown): JSX.Element => {
  const fieldName = fieldInfo.fieldName;
  const basicType = getBasicType(fieldName, layerRecord);
  // console.log(`${fieldName} -->`, modelProps[fieldName].name, '-->', basicType);

  switch(basicType){
    case 'string':
    case 'identifier':
    case 'number':
    case 'SensorType':
      return (
        <StringValuePresentorComponent value={fieldValue as string}></StringValuePresentorComponent>
      );
    case 'links':
      return (
        <LinksValuePresentorComponent value={fieldValue  as LinkModelType[]} fieldInfo={fieldInfo}></LinksValuePresentorComponent>
      );
    case 'url':
      return (
        <UrlValuePresentorComponent value={fieldValue as string}></UrlValuePresentorComponent>
      );
    case 'momentDateType':
      return (
        <DateValuePresentorComponent value={fieldValue as moment.Moment}></DateValuePresentorComponent>
      );
    case 'RecordType':
      return(
        <RecordTypeValuePresentorComponent value={fieldValue as RecordType}></RecordTypeValuePresentorComponent>
      );
    default:
      return (
        <UnknownValuePresentorComponent value={basicType}></UnknownValuePresentorComponent>
      );
  }
};

export const LayersDetailsComponent: React.FC<LayersDetailsComponentProps> = (props :LayersDetailsComponentProps) => {
  const { isBrief, layerRecord } = props;

  const getCategoryFields = (layerRecord: LayerMetadataMixedUnion): IRecordCategoryFieldsInfo[] => {
    let fieldsInfo: IRecordCategoryFieldsInfo[];
    switch(layerRecord.__typename){
      case 'Layer3DRecord':
        fieldsInfo = Layer3DRecorModelFieldsInfo;
        break;
      default:
        fieldsInfo = LayerRasterRecorModelFieldsInfo;
        break;
    }
      
    if(isBrief === true){
      return fieldsInfo.filter((item) => item.category === FieldCategory.MAIN);
    }
    return fieldsInfo;
  };

  return (
    <>
      {
        layerRecord && getCategoryFields(layerRecord).map(category => {
          return (
            <Box 
              key={category.category}
              className="categoryFieldsParentContainer"
            >
              <Typography use="headline6" tag="div" className="categoryFieldsTitle">
                <FormattedMessage id={category.categoryTitle} />
              </Typography>
              <Box className="categoryFieldsContainer">
                {
                  category.fields.map(fieldInfo => {
                    return (
                      <Box key={fieldInfo.fieldName as string}
                        className={(fieldInfo.fullWidth === true) ? 'categoryFullWidthField' : 'categoryField'}
                      >
                        <FieldLabelComponent value={fieldInfo.label}></FieldLabelComponent>
                        {
                          getValuePresentor(layerRecord, fieldInfo,  get(layerRecord, fieldInfo.fieldName))
                        }
                      </Box>
                    )
                  })
                }
              </Box>
            </Box>
          )
        })
      }
      {
        !layerRecord && <Box>
          <Typography use="headline2" tag="div" className="noSelection" >
            <FormattedMessage id="details-panel.no-selection" />
          </Typography>
        </Box>
      }
    </>
  )
};