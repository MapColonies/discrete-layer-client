/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useMemo } from 'react';
import moment from 'moment';
import { get, isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../common/models/mode.enum';
import { FieldLabelComponent } from '../../../common/components/form/field-label';
import { 
  AutocompletionModelType,
  EntityDescriptorModelType,
  FieldCategory,
  LayerMetadataMixedUnion,
  LinkModelType,
  ProductType,
  RecordType,
  SensorType
} from '../../models';
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
import { ProductTypeValuePresentorComponent } from './field-value-presentors/product-type.value-presentors';
import { AutocompleteValuePresentorComponent } from './field-value-presentors/autocomplete.value-presentors';
import { JsonValuePresentorComponent } from './field-value-presentors/json.value-presentor';
import { getBasicType, getEntityDescriptors } from './utils';

import './layer-details.css';

interface LayersDetailsComponentProps {
  entityDescriptors: EntityDescriptorModelType[];
  mode: Mode;
  isBrief?: boolean;
  layerRecord?: ILayerImage | null;
  formik?: unknown;
}

export const getValuePresentor = (
  layerRecord: LayerMetadataMixedUnion | LinkModelType,
  fieldInfo: IRecordFieldInfo,
  fieldValue: unknown,
  mode: Mode,
  formik?: unknown,
): JSX.Element => {
  const fieldName = fieldInfo.fieldName;
  const basicType = getBasicType(fieldName as FieldInfoName, layerRecord.__typename);
  
  switch (basicType) {
    case 'string':
    case 'identifier':
      return (!isEmpty(formik) && !isEmpty(fieldInfo.autocomplete) && (fieldInfo.autocomplete as AutocompletionModelType).type === 'DOMAIN') ? 
        // eslint-disable-next-line
        <AutocompleteValuePresentorComponent mode={mode} fieldInfo={fieldInfo} value={fieldValue as string} changeHandler={(formik as any).setFieldValue}></AutocompleteValuePresentorComponent> :
        <StringValuePresentorComponent mode={mode} fieldInfo={fieldInfo} value={fieldValue as string} formik={formik}></StringValuePresentorComponent>
    // case 'json':
    //   return (
    //     <JsonValuePresentorComponent mode={mode} fieldInfo={fieldInfo} value={fieldValue as string} formik={formik}></JsonValuePresentorComponent>
    //   );
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
      return (
        <RecordTypeValuePresentorComponent value={fieldValue as RecordType}></RecordTypeValuePresentorComponent>
      );
    case 'ProductType':
      return (
        <ProductTypeValuePresentorComponent value={fieldValue as ProductType}></ProductTypeValuePresentorComponent>
      );
    default:
      return (
        <UnknownValuePresentorComponent value={basicType}></UnknownValuePresentorComponent>
      );
  }
};

export const LayersDetailsComponent: React.FC<LayersDetailsComponentProps> = (props: LayersDetailsComponentProps) => {
  const { entityDescriptors, mode, isBrief, layerRecord, formik } = props;


  const renderCategory = (category: IRecordCategoryFieldsInfo) =>
  (
    <Box
      key={category.category}
      className="categoryFieldsParentContainer"
    >
      <Typography
        use="headline6"
        tag="div"
        className="categoryFieldsTitle"
      >
        <FormattedMessage id={category.categoryTitle} />
      </Typography>
      <Box className="categoryFieldsContainer">
        {(category as IRecordCategoryFieldsInfo)?.fields?.map(
          (fieldInfo: IRecordFieldInfo) => {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (
              mode !== Mode.NEW ||
              (mode === Mode.NEW && fieldInfo.isAutoGenerated !== true)
            ) {
              return (
                <Box
                  key={fieldInfo.fieldName as string}
                  className={
                    fieldInfo.fullWidth === true
                      ? 'categoryFullWidthField'
                      : 'categoryField'
                  }
                >
                  <FieldLabelComponent
                    value={fieldInfo.label}
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    isRequired={
                      (fieldInfo.isRequired ?? false) &&
                      !(isBrief ?? false) &&
                      mode !== Mode.VIEW
                    }
                  />
                  {getValuePresentor(
                    layerRecord as LayerMetadataMixedUnion,
                    fieldInfo,
                    get(layerRecord, fieldInfo.fieldName as string),
                    mode,
                    formik
                  )}
                </Box>
              );
            }
          }
        )}
      </Box>
    </Box>
  );

  // @ts-ignore
  const fullInputs = useMemo(() => {
    const fullArray = layerRecord && getEntityDescriptors(layerRecord, entityDescriptors);
    return (
      fullArray?.map((category) => {
        return renderCategory(category);
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layerRecord]);

  const briefInputs = useMemo(() => {
    const briefArr = layerRecord &&
    getEntityDescriptors(layerRecord, entityDescriptors)
    .filter((item: unknown) =>(item as IRecordCategoryFieldsInfo).category === FieldCategory.MAIN);

    return (
      briefArr?.map((category) => {
        return renderCategory(category);
      })
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layerRecord]);

  return (
    <>
      {!isBrief ? fullInputs: briefInputs}
    
      {!layerRecord && (
        <Box>
          <Typography use="headline2" tag="div" className="noSelection">
            <FormattedMessage id="details-panel.no-selection" />
          </Typography>
        </Box>
      )}
    </>
  );
};