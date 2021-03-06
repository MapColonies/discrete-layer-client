import React from 'react';
import moment from 'moment';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../common/models/mode.enum';
import { FieldCategory, Layer3DRecordModel, LayerMetadataMixedUnion, LayerRasterRecordModel, LinkModel, LinkModelType, RecordType, SensorType, useStore } from '../../models';
import { ILayerImage } from '../../models/layerImage';
import { IRecordFieldInfo, IRecordCategoryFieldsInfo, FieldInfoName } from './layer-details.field-info';
import { StringValuePresentorComponent } from './field-value-presentors/string.value-presentors';
import { DateValuePresentorComponent } from './field-value-presentors/date.value-presentors';
import { UrlValuePresentorComponent } from './field-value-presentors/url.value-presentors';
import { LinksValuePresentorComponent } from './field-value-presentors/links.value-presentors';
import { UnknownValuePresentorComponent } from './field-value-presentors/unknown.value-presentors';
import { RecordTypeValuePresentorComponent } from  './field-value-presentors/record-type.value-presentors';
import { NumberValuePresentorComponent } from './field-value-presentors/number.value-presentors';
import { EnumValuePresentorComponent } from './field-value-presentors/enum.value-presentors';
import { FieldLabelComponent } from './field-label';

import './layer-details.css';

interface LayersDetailsComponentProps {
  isBrief?: boolean;
  layerRecord?: ILayerImage | null;
  mode: Mode;
  formik?: unknown;
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
  else if (fieldNameStr.toLowerCase().includes('sensortype')){
    return 'SensorType';
  }
  else {
    return typeString.replaceAll('(','').replaceAll(')','').replaceAll(' | ','').replaceAll('null','').replaceAll('undefined','');
  }
}

export const getValuePresentor = (layerRecord: LayerMetadataMixedUnion | LinkModelType, fieldInfo: IRecordFieldInfo, fieldValue: unknown, mode: Mode, formik?: unknown): JSX.Element => {
  const fieldName = fieldInfo.fieldName;
  const basicType = getBasicType(fieldName as FieldInfoName, layerRecord);

  switch(basicType){
    case 'string':
    case 'identifier':
      return (
        <StringValuePresentorComponent mode={mode} fieldInfo={fieldInfo} value={fieldValue as string} formik={formik}></StringValuePresentorComponent>
      );
    case 'number':
      return (
        <NumberValuePresentorComponent mode={mode} fieldInfo={fieldInfo} value={fieldValue as string} formik={formik}></NumberValuePresentorComponent>
      );
    case 'links':
      return (
        <LinksValuePresentorComponent value={fieldValue as LinkModelType[]} fieldInfo={fieldInfo}></LinksValuePresentorComponent>
      );
    case 'url':
      return (
        <UrlValuePresentorComponent value={fieldValue as string}></UrlValuePresentorComponent>
      );
    case 'momentDateType':
      return (
        <DateValuePresentorComponent mode={mode} fieldInfo={fieldInfo} value={fieldValue as moment.Moment} formik={formik}></DateValuePresentorComponent>
      );
    case 'SensorType':
      return (
        <EnumValuePresentorComponent mode={mode} fieldInfo={fieldInfo} value={(fieldValue !== undefined && fieldValue !== null) ? (fieldValue as SensorType[]).join(',') : ''} formik={formik}></EnumValuePresentorComponent>
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

export const LayersDetailsComponent: React.FC<LayersDetailsComponentProps> = observer((props: LayersDetailsComponentProps) => {
  const { isBrief, layerRecord, mode, formik } = props;
  const store = useStore();

  const getCategoryFields = (layerRecord: LayerMetadataMixedUnion): IRecordCategoryFieldsInfo[] => {
    let entityDesc;
    switch(layerRecord.__typename){
      case 'Layer3DRecord':
        entityDesc = store.discreteLayersStore.entityDescriptors?.find(descriptor => descriptor.type === 'Pycsw3DCatalogRecord')
        break;
      default:
        entityDesc = store.discreteLayersStore.entityDescriptors?.find(descriptor => descriptor.type === 'PycswLayerCatalogRecord')
        break;
    }

    const fieldsInfo = get(entityDesc, 'categories') as IRecordCategoryFieldsInfo[];
    if(isBrief === true) {
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
                category.fields?.map((fieldInfo: IRecordFieldInfo) => {
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                  if (mode !== Mode.NEW || (mode === Mode.NEW && fieldInfo.isAutoGenerated !== true)) {
                    return (
                      <Box key={fieldInfo.fieldName as string}
                        className={(fieldInfo.fullWidth === true) ? 'categoryFullWidthField' : 'categoryField'}
                      >
                        <FieldLabelComponent value={fieldInfo.label}></FieldLabelComponent>
                        {
                          getValuePresentor(layerRecord, fieldInfo, get(layerRecord, fieldInfo.fieldName as string), mode, formik)
                        }
                      </Box>
                    );
                  }
                })
              }
              </Box>
            </Box>
          );
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
});