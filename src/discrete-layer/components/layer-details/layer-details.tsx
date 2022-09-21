/* eslint-disable no-fallthrough */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { get, isEmpty } from 'lodash';
import { Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { FieldLabelComponent } from '../../../common/components/form/field-label';
import CONFIG from '../../../common/config';
import { LinkType } from '../../../common/models/link-type.enum';
import { Mode } from '../../../common/models/mode.enum';
import { 
  AutocompletionModelType,
  DataType,
  EntityDescriptorModelType,
  FieldCategory,
  LayerMetadataMixedUnion,
  LinkModelType,
  NoDataValue,
  RecordStatus,
  UndulationModel,
  Units,
  VerticalDatum
} from '../../models';
import { getCatalogProductsByEntityType } from '../../models/catalogProducts';
import { ILayerImage } from '../../models/layerImage';
import { links } from '../../models/links';
import { getLinkUrl, getLinkUrlWithToken } from '../helpers/layersUtils';
import { AutocompleteValuePresentorComponent } from './field-value-presentors/autocomplete.value-presentor';
import { DateValuePresentorComponent } from './field-value-presentors/date.value-presentor';
import { EnumValuePresentorComponent } from './field-value-presentors/enum.value-presentor';
import { JsonValuePresentorComponent } from './field-value-presentors/json.value-presentor';
import { LinksValuePresentorComponent } from './field-value-presentors/links.value-presentor';
import { NumberValuePresentorComponent } from './field-value-presentors/number.value-presentor';
import { StatusValuePresentorComponent } from './field-value-presentors/status.value-presentor';
import { StringValuePresentorComponent } from './field-value-presentors/string.value-presentor';
import { TypeValuePresentorComponent } from  './field-value-presentors/type.value-presentor';
import { UnknownValuePresentorComponent } from './field-value-presentors/unknown.value-presentor';
import { UrlValuePresentorComponent } from './field-value-presentors/url.value-presentor';
import { IRecordFieldInfo, IRecordCategoryFieldsInfo, FieldInfoName } from './layer-details.field-info';
import { EntityFormikHandlers } from './layer-datails-form';
import { getBasicType, getEntityDescriptors } from './utils';

import './layer-details.css';

interface LayersDetailsComponentProps {
  entityDescriptors: EntityDescriptorModelType[];
  mode: Mode;
  className?: string;
  isBrief?: boolean;
  layerRecord?: ILayerImage | null;
  formik?: EntityFormikHandlers;
}

export const getValuePresentor = (
  layerRecord: LayerMetadataMixedUnion | LinkModelType,
  fieldInfo: IRecordFieldInfo,
  fieldValue: unknown,
  mode: Mode,
  formik?: EntityFormikHandlers,
): JSX.Element => {

  const fieldName = fieldInfo.fieldName;
  const basicType = getBasicType(fieldName as FieldInfoName, layerRecord.__typename);
  const value = formik?.getFieldProps(fieldInfo.fieldName).value as unknown ?? fieldValue;
  let options: string[] = [];
  
  switch (basicType) {
    case 'string':
    case 'identifier':
    case 'sensors':
      return ((!isEmpty(formik) && !isEmpty(fieldInfo.autocomplete) && (fieldInfo.autocomplete as AutocompletionModelType).type === 'DOMAIN') ? 
        // eslint-disable-next-line
        <AutocompleteValuePresentorComponent mode={mode} fieldInfo={fieldInfo} value={value as string} formik={formik}></AutocompleteValuePresentorComponent> :
        <StringValuePresentorComponent mode={mode} fieldInfo={fieldInfo} value={value as string} formik={formik}></StringValuePresentorComponent>
      );
    case 'string[]':
      return (
        <StringValuePresentorComponent mode={mode} fieldInfo={fieldInfo} value={value as string} formik={formik}></StringValuePresentorComponent>
      );
    case 'json':
      return (
        <JsonValuePresentorComponent mode={mode} fieldInfo={fieldInfo} value={value as string} formik={formik}></JsonValuePresentorComponent>
      );
    case 'number':
      return (
        <NumberValuePresentorComponent mode={mode} fieldInfo={fieldInfo} value={value as string} formik={formik}></NumberValuePresentorComponent>
      );
    case 'links':
      return (
        <LinksValuePresentorComponent value={value as LinkModelType[]} fieldInfo={fieldInfo}></LinksValuePresentorComponent>
      );
    case 'url':
      return (
        <UrlValuePresentorComponent value={value as string} linkInfo={links[(layerRecord as LinkModelType).protocol as LinkType]}></UrlValuePresentorComponent>
      );
    case 'momentDateType':
      return (
        <DateValuePresentorComponent mode={mode} fieldInfo={fieldInfo} value={value as moment.Moment} formik={formik}></DateValuePresentorComponent>
      );
    case 'DataType':
      if (basicType === 'DataType') {
        options = Object.values(DataType);
      }
    case 'NoDataValue':
      if (basicType === 'NoDataValue') {
        options = Object.values(NoDataValue);
      }
    case 'VerticalDatum':
      if (basicType === 'VerticalDatum') {
        options = Object.values(VerticalDatum);
      }
    case 'Units':
      if (basicType === 'Units') {
        options = Object.values(Units);
      }
    case 'UndulationModel':
      if (basicType === 'UndulationModel') {
        options = Object.values(UndulationModel);
      }
    case 'ProductType':
      if (basicType === 'ProductType') {
        options = getCatalogProductsByEntityType(layerRecord.__typename);
      }
    case 'RecordStatus':
      if (basicType === 'RecordStatus') {
        options = Object.values(RecordStatus);
      }
      return (
        <EnumValuePresentorComponent options={options} mode={mode} fieldInfo={fieldInfo} value={value as string} formik={formik}></EnumValuePresentorComponent>
      );
    case 'RecordType':
      return (
        <TypeValuePresentorComponent value={value as string}></TypeValuePresentorComponent>
      );
    // case 'RecordStatus':
    //   return (
    //     <StatusValuePresentorComponent value={value as string}></StatusValuePresentorComponent>
    //   );
    default:
      return (
        <UnknownValuePresentorComponent value={basicType}></UnknownValuePresentorComponent>
      );
  }
};

export const LayersDetailsComponent: React.FC<LayersDetailsComponentProps> = (props: LayersDetailsComponentProps) => {
  const { entityDescriptors, mode, isBrief, layerRecord, formik, className = '' } = props;
  
  const maxLabelLengthCssVar = '--field-label-max-length';
  const categoryFieldsParentContainerStyle = (CONFIG.NUMBER_OF_CHARACTERS_LIMIT
    ? { [maxLabelLengthCssVar]: `${CONFIG.NUMBER_OF_CHARACTERS_LIMIT}ch` }
    : {}) as React.CSSProperties;

  const renderCategory = (category: IRecordCategoryFieldsInfo): JSX.Element =>
  (
    <Box
      key={category.category}
      className={`categoryFieldsParentContainer ${className}`}
      style={categoryFieldsParentContainerStyle}
    >
      <Typography
        use="headline6"
        tag="div"
        className="categoryFieldsTitle"
      >
        <FormattedMessage id={category.categoryTitle} />
      </Typography>
      <Box className="categoryFieldsContainer">
        {category.fields?.filter((fieldInfo)=>{
          // eslint-disable-next-line
          return (mode !== Mode.NEW && mode !== Mode.UPDATE && get(fieldInfo,'isCreationEssential') !== true) ||
                 ((mode === Mode.NEW || mode === Mode.UPDATE) && get(fieldInfo,'isAutoGenerated') !== true) || 
                 (mode === Mode.VIEW || mode === Mode.EDIT); 
        }).map(
          (fieldInfo: IRecordFieldInfo) => {
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
                  isRequired={
                    !!(fieldInfo.isRequired ?? false) &&
                    !(isBrief ?? false) &&
                    mode !== Mode.VIEW
                  }
                />
                {
                  getValuePresentor(
                    layerRecord as LayerMetadataMixedUnion,
                    fieldInfo,
                    get(layerRecord, fieldInfo.fieldName as string),
                    mode,
                    formik
                  )
                }
              </Box>
            )
          }
        )}
      </Box>
    </Box>
  );

  const fullInputs = useMemo(() => {
    const fullArray = layerRecord && getEntityDescriptors(layerRecord.__typename, entityDescriptors);
    return (
      fullArray?.map((category) => {
        return renderCategory(category);
      })
    );
  }, [layerRecord, formik]);

  const briefInputs = useMemo(() => {
    const briefArr = layerRecord &&
      getEntityDescriptors(layerRecord.__typename, entityDescriptors)
      .filter((item: unknown) => (item as IRecordCategoryFieldsInfo).category === FieldCategory.MAIN);
    return (
      briefArr?.map((category) => {
        return renderCategory(category);
      })
    );
  }, [layerRecord, formik]);

  return (
    <>
      {!(isBrief ?? false) ? fullInputs : briefInputs}
      {
        layerRecord?.links &&
        getLinkUrl(layerRecord.links, LinkType.THUMBNAIL_L) !== undefined &&
        mode !== Mode.UPDATE &&
        <img
          className="detailsThumbnail"
          src={getLinkUrlWithToken(layerRecord.links, LinkType.THUMBNAIL_L)}
        />
      }
      {
        !layerRecord &&
        <Box>
          <Typography use="headline2" tag="div" className="noSelection">
            <FormattedMessage id="details-panel.no-selection" />
          </Typography>
        </Box>
      }
    </>
  );
};
