import React, { useMemo, useState, useEffect, useCallback, MouseEventHandler } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  withFormik,
  FormikProps,
  FormikErrors,
  Form,
  FormikHandlers,
  FormikBag,
  Field,
} from 'formik';
import { List, ListRowRenderer } from "react-virtualized";
import * as Yup from 'yup';
import { OptionalObjectSchema, TypeOfShape } from 'yup/lib/object';
import { AnyObject } from 'yup/lib/types';
import { DraftResult } from 'vest/vestResult';
import { get, isEmpty, isObject } from 'lodash';
import { Style, Stroke, Fill } from 'ol/style';
import shp, { FeatureCollectionWithFilename, getShapeFile, parseDbf, parseShp } from 'shpjs';
import { Button, Checkbox, CircularProgress, CollapsibleList, Icon, IconButton, SimpleListItem, Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../../common/models/mode.enum';
import { ValidationsError } from '../../../../common/components/error/validations.error-presentor';
import { GraphQLError } from '../../../../common/components/error/graphql.error-presentor';
import { MetadataFile } from '../../../../common/components/file-picker';
import {
  EntityDescriptorModelType,
  FieldConfigModelType,
  LayerMetadataMixedUnion,
  LayerRasterRecordModelType,
  ParsedPolygonPart,
  PolygonPartRecordModelType,
  RecordType,
} from '../../../models';
import { LayersDetailsComponent } from '../layer-details';
import { IngestionFields } from '../ingestion-fields';
import {
  removeEmptyObjFields,
  transformFormFieldsToEntity,
  extractDescriptorRelatedFieldNames,
  getFlatEntityDescriptors,
  transformEntityToFormFields,
  filerModeDescriptors,
  importShapeFileFromClient,
  transformSynergyShapeFeatureToEntity,
} from '../utils';

import { GeoFeaturesPresentorComponent } from './pp-map';
import { Feature, GeoJsonProperties, Geometry, MultiPolygon, Polygon } from 'geojson';
import { emphasizeByHTML } from '../../../../common/helpers/formatters';
import { Loading } from '../../../../common/components/tree/statuses/loading';
import { getOutlinedFeature } from '../../../../common/utils/geo.tools';
import { mergeRecursive } from '../../../../common/helpers/object';
import { Properties } from '@turf/helpers';

import './layer-details-form.raster.css';
import 'react-virtualized/styles.css';

const NONE = 0;

// Shape of form values - a bit problematic because we cant extend union type.
export interface FormValues {
  directory: string;
  fileNames: string;
}

interface LayerDetailsFormCustomProps {
  recordType: RecordType;
  ingestionFields: FieldConfigModelType[];
  mode: Mode;
  entityDescriptors: EntityDescriptorModelType[];
  layerRecord: LayerMetadataMixedUnion;
  vestValidationResults: Record<string, DraftResult>;
  mutationQueryError: unknown;
  mutationQueryLoading: boolean;
  closeDialog: () => void;
  schemaUpdater: (parts:number, startIndex?: number) => void;
  removePolygonPart: (polygonPartKey: string) => void;
}

export interface StatusError {
  errors: {
    [fieldName: string]: string[];
  }
}

export interface EntityFormikHandlers extends FormikHandlers {
  setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => void;
  setFieldError: (field: string, message: string) => void;
  setFieldTouched: (field: string, isTouched?: boolean | undefined, shouldValidate?: boolean | undefined) => void;
  setStatus: (status?: StatusError | Record<string, unknown>) => void;
  status: StatusError | Record<string, unknown>;
}

export const InnerRasterForm = (
  props: LayerDetailsFormCustomProps & FormikProps<FormValues>
): JSX.Element => {
  const {
    errors,
    values,
    dirty,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    getFieldProps,
    getFieldMeta,
    getFieldHelpers,
    resetForm,
    setFieldValue,
    setValues,
    setFieldError,
    setFieldTouched,
    setStatus,
    recordType,
    ingestionFields,
    entityDescriptors,
    mode,
    layerRecord,
    vestValidationResults,
    // eslint-disable-next-line
    mutationQueryError,
    mutationQueryLoading,
    closeDialog,
    schemaUpdater,
    removePolygonPart
  } = props;

  const status = props.status as StatusError | Record<string, unknown>;
  const NESTED_FORMS_PRFIX = 'polygonPart_';
  type POLYGON_PARTS_MODE = 'FROM_SHAPE' | 'MANUAL';
  
  const intl = useIntl();
  const [graphQLError, setGraphQLError] = useState<unknown>(mutationQueryError);
  const [isSelectedFiles, setIsSelectedFiles] = useState<boolean>(false);
  const [firstPhaseErrors, setFirstPhaseErrors] = useState<Record<string, string[]>>({});
  const [showCurtain, setShowCurtain] = useState<boolean>(true);
  const [ppFeatures, setPPFeatures] = useState<Feature[]>([]);
  const [parsingErrors, setParsingErrors] = useState<Record<string, unknown>[]>([]);
  const [loadingPolygonParts, setLoadingPolygonParts] = useState<boolean>(false);
  const [outlinedPerimeter, setOutlinedPerimeter] = useState<Feature | undefined>();
  const [selectedFeature, setSelectedFeature] = useState<string | undefined>();
  const [expandedParts, setExpandedParts] = useState<boolean[]>([]);
  const [showPolygonPartsOnMap, setShowPolygonPartsOnMap] = useState<boolean>(true);
  const [showExisitngLayerPartsOnMap, setShowExisitngLayerPartsOnMap] = useState<boolean>(false);
  const [polygonPartsMode, setPolygonPartsMode] = useState<POLYGON_PARTS_MODE>('MANUAL');
  const [layerPolygonParts, setLayerPolygonParts] = useState<Record<string, PolygonPartRecordModelType>>({});

  const getStatusErrors = useCallback((): StatusError | Record<string, unknown> => {
    return get(status, 'errors') as Record<string, string[]> | null ?? {};
  }, [status]);

  const getYupErrors = useCallback(
    (): Record<string, string[]> => {
      const validationResults: Record<string, string[]> = {};
      Object.entries(errors).forEach(([key, value]) => {
        if(isObject(value)){
          Object.entries(value).forEach(([keyNested, valueNested]) => {
            if (getFieldMeta(key+'.'+keyNested).touched) {
              if(!validationResults[key]){
                // @ts-ignore
                validationResults[key] = {};
              }
              // @ts-ignore
              validationResults[key][keyNested] = [valueNested as string];
            }
          });
        }
        else{
          if (getFieldMeta(key).touched) {
            validationResults[key] = [value];
          }
        }
      });
      return validationResults;
    },
    [errors, getFieldMeta],
  );

  useEffect(() => {
    setShowCurtain((mode === Mode.NEW || mode === Mode.UPDATE) && !isSelectedFiles);
  }, [mode, isSelectedFiles])

  useEffect(() => {
    setGraphQLError(mutationQueryError);
  }, [mutationQueryError]);

  useEffect(() => {
    // @ts-ignore
    setFirstPhaseErrors(mergeRecursive(getYupErrors(), getStatusErrors()));

    setTimeout(()=>(ppList && updateListRowHeights()), 100);
  }, [errors, getYupErrors, getStatusErrors]);

  useEffect(() => {
    const features: Feature[] = [];
    const polygonParts: Record<string,PolygonPartRecordModelType> = {};

    Object.keys(values).filter(key=>key.includes(NESTED_FORMS_PRFIX)).forEach(key=>{
      features.push({
        type: "Feature",
        properties: {key},
        // @ts-ignore
        geometry: values[key].geometry
      });

       // @ts-ignore
      polygonParts[key] = {...values[key]};
    });
    setPPFeatures(features);
    setLayerPolygonParts(polygonParts);
  }, [values]);

  useEffect(() => {
    if(polygonPartsMode === 'MANUAL' && ppFeatures.length){
      const definedPPGeometries = ppFeatures.filter((item) => !isEmpty(item.geometry));
      if(definedPPGeometries.length){
        const outlinedPolygon = getOutlinedFeature(definedPPGeometries as Feature<Polygon | MultiPolygon, Properties>[]);
        setOutlinedPerimeter(outlinedPolygon as Feature<Geometry, GeoJsonProperties>);
      } else {
        setOutlinedPerimeter(undefined);
      }
    }
  }, [ppFeatures, polygonPartsMode]);

  useEffect(() => {
    const stattusErrors = parsingErrors.reduce(
      (acc,curr) => {
        Object.keys(curr).forEach(key=>{
          let errObj = curr[key] as Record<string, string[]>; 
          Object.keys(errObj).forEach(fieldKey => {
            errObj[fieldKey] = errObj[fieldKey].map(
              errText => intl.formatMessage({id: errText}, {fieldName: emphasizeByHTML(fieldKey)})
            );
          });
        });
        return ({...acc,...curr});
      },
      {}
    );

    if(parsingErrors.length){
      stattusErrors['shape'] = [
        intl.formatMessage(
          {id: 'validation-general.shapeFile.polygonParts.hasErrors'}, 
          {numErrorParts: emphasizeByHTML(`${parsingErrors.length}`)}
        )
      ];
    }

    setStatus({
      errors: {
        // ...currentErrors,
        ...stattusErrors,
      },
    });
   }, [parsingErrors]);

  const excidedFeaturesNumberError = useMemo(() => new Error(`validation-general.shapeFile.too-many-features`), []);
  const shapeFileGenericError = useMemo(() => new Error(`validation-general.shapeFile.generic`), []);

  const entityFormikHandlers: EntityFormikHandlers = useMemo(
    () => ({
      handleChange: (e: React.ChangeEvent<unknown>): void => {
        setGraphQLError(undefined);
        handleChange(e);
      },
      handleBlur: (e: React.FocusEvent<unknown>): void => {
        setGraphQLError(undefined);
        handleBlur(e);
      },
      handleSubmit,
      handleReset,
      getFieldProps,
      getFieldMeta,
      getFieldHelpers,
      resetForm,
      setFieldValue,
      setValues,
      setFieldError,
      setFieldTouched,
      setStatus,
      status,
    }),
    [
      getFieldHelpers,
      getFieldMeta,
      getFieldProps,
      handleBlur,
      handleChange,
      handleReset,
      handleSubmit,
      resetForm,
      setFieldError,
      setFieldTouched,
      setFieldValue,
      setStatus,
      setValues,
      status,
    ]
  );
  
  const reloadFormMetadata = (
    ingestionFields: FormValues,
    metadata: MetadataFile
  ): void => {
    setIsSelectedFiles(!!ingestionFields.fileNames);
    
    // Check update related fields in metadata obj
    const updateFields = extractDescriptorRelatedFieldNames('updateRules', getFlatEntityDescriptors(layerRecord.__typename, entityDescriptors));

    for (const [key, val] of Object.entries(metadata.recordModel)) {
      if (val === null || (updateFields.includes(key) && mode === Mode.UPDATE)) {
        delete ((metadata.recordModel as unknown) as Record<string, unknown>)[key];
      }
    }

    resetForm();
    setValues({
      ...values,
      ...transformEntityToFormFields((isEmpty(metadata.recordModel) ? layerRecord : metadata.recordModel)),
      ...ingestionFields,
    });

    setGraphQLError(metadata.error);
  };

  const isShapeFileValid = (featuresArr: unknown[] | undefined): boolean | Error => {
    // if (typeof featuresArr === 'undefined') {
    //   return shapeFileGenericError;
    // }
    // if (featuresArr.length > 30) {
    //   return excidedFeaturesNumberError;
    // }
    return true;
  }

  const isIngestedSourceSelected = () => {
    let res = true;
    ingestionFields.forEach((curr) => {
      // @ts-ignore
      res = res && !isEmpty(values[curr?.fieldName]);
    }, true);
    return res;
  }

  const proccessShapeFile = async (
    shapeArrayBuffer: ArrayBuffer,
    fileType: string
  ): Promise<Record<string,ParsedPolygonPart>> => {
    return new Promise((resolve, reject) => {
      const ZIP_EXTENSION = 'zip';

      try {
        // Supports zip files as well as single shape files.
        if (fileType === ZIP_EXTENSION) {
          void shp(shapeArrayBuffer)
            .then((data) => {
              const polygonPartDescriptors = getFlatEntityDescriptors('PolygonPartRecord', entityDescriptors);
              const parsedPolygonParts: Record<string,ParsedPolygonPart> = {};

              const shapeFileValidation = isShapeFileValid((data as FeatureCollectionWithFilename).features);
              if (shapeFileValidation instanceof Error) {
                return reject(shapeFileValidation);
              }

              (data as FeatureCollectionWithFilename).features.forEach((feature, idx) => {
                /*if(idx < 20)*/ {
                  const currentKey = `${NESTED_FORMS_PRFIX}${idx}`;
                  const parsedPolygonPartData = transformSynergyShapeFeatureToEntity(polygonPartDescriptors, feature);
                  parsedPolygonPartData.polygonPart.uniquePartId = currentKey;
                  // parsedPolygonPartData.polygonPart.resolutionDegree = 0.0439453125;
                  // parsedPolygonPartData.errors={};
                  parsedPolygonParts[currentKey] = {...parsedPolygonPartData};
                }
              });

              const outlinedPolygon = getOutlinedFeature((data as FeatureCollectionWithFilename).features as Feature<Polygon | MultiPolygon, Properties>[]);
              setOutlinedPerimeter(outlinedPolygon as Feature<Geometry, GeoJsonProperties>);

              return resolve(parsedPolygonParts);
            })
            .catch(() => {
              return reject(shapeFileGenericError);
            });
        } else {
          // **** SINGLE SHP FILE CONTAINS ONLY GEOMETRIES NOT SUPPORTED FOR PP **** 

          // const DEFAULT_PROJECTION = 'WGS84';
          // // Probably is shape file.
          // const geometryArr = parseShp(shapeArrayBuffer, DEFAULT_PROJECTION);

          
        }
      } catch (e) {
        return reject(shapeFileGenericError);
      }
    });
  };

  const topLevelFieldsErrors = {} as Record<string,string[]>;
  firstPhaseErrors && Object.keys(firstPhaseErrors).forEach((err) => {
    if(!err.includes(NESTED_FORMS_PRFIX)){
      topLevelFieldsErrors[err] = firstPhaseErrors[err];
    }
  });

  interface HandleProps {
    partIndex: number;
    text?: string;
    onClick?:  MouseEventHandler | undefined
    isErrorInPolygonPart?: boolean
    handleClick?: ()=>void;
    handleSelection?: ()=>void;
    handleClearSelection?: ()=>void;
  }

  const Handler: React.FC<HandleProps> = ({partIndex, text, onClick, isErrorInPolygonPart, handleClick, handleSelection, handleClearSelection}) => {
    const [deletingPart, setDeletingPart] = useState<boolean>(false);
    const [showActions, setShowActions] = useState<boolean>(false);
    return  <Box 
      onClick={(e) => {
        onClick ? onClick(e) : (()=>{})();
        expandedParts[partIndex] = !expandedParts[partIndex];
        updateListRowHeights(partIndex);
      }} 
      style={{ height: '48px'}}
    >
    <SimpleListItem
      text={text}
      // graphic="help"
      metaIcon="chevron_right"
      className={isErrorInPolygonPart ? 'polygonPartDataError' : ''}
      onMouseOver={(e: any): void => { handleSelection && handleSelection();}}
      onMouseOut={(e: any): void => { handleClearSelection && handleClearSelection();}}
    />
    <Box style={{ position: 'relative', top: '-44px', left: '-550px', display: "flex", width: "160px", alignItems: "center"}}
     onMouseOver={(e: any): void => { handleSelection && handleSelection();}}
     onMouseOut={(e: any): void => { handleClearSelection && handleClearSelection();}}
    >
      <Box style={{width: "100px"}}>
        {deletingPart && <Box style={{display: "flex", gap: "4px"}}>Deleting <CircularProgress/></Box>}
      </Box>
      <IconButton
        className="operationIcon mc-icon-Delete"
        label="DELETE PART"
        onClick={ (e): void => {
          if(handleClick){
            setDeletingPart(true);
            
            setTimeout(() => {
              handleClick();
            }, 200);

            e.preventDefault();
            e.stopPropagation();
          }
        } }
      />
    </Box>
  </Box>
  }

  let ppList:List;
  const setRef = (ref:List) => {
    ppList = ref;
  }
  const updateListRowHeights = (idx=0) => {
    ppList.recomputeRowHeights(idx);
    ppList.forceUpdate();
  }
    
  const renderRow: ListRowRenderer = ({ index, key, style }) => {
    const data = Object.values(layerPolygonParts);
    console.log('***** RENDERROW *****', index);

    let polygon_part = data[index];
    if(!polygon_part){
      return <></>;
    }

    const currentFormKey = polygon_part.uniquePartId;
    let isFirstPhaseErrorInPolygonPart = (firstPhaseErrors[currentFormKey] && Object.keys(firstPhaseErrors[currentFormKey])?.length > NONE);
    let isVestPhaseErrorInPolygonPart = (vestValidationResults[currentFormKey] && vestValidationResults[currentFormKey]?.errorCount > NONE);

    if(layerPolygonParts && Object.keys(layerPolygonParts).length > NONE){
      polygon_part = layerPolygonParts[currentFormKey];
    }
    return (
      <CollapsibleList
                  key={currentFormKey}
                  style={style}
                  open={expandedParts[index]}
                  handle={
                    <Handler partIndex={index} text={currentFormKey} 
                      isErrorInPolygonPart={isFirstPhaseErrorInPolygonPart || isVestPhaseErrorInPolygonPart}
                      handleClick={()=>{
                        removePolygonPart(currentFormKey);

                        expandedParts?.splice(index, 1);
                        setExpandedParts([...expandedParts]);
                        updateListRowHeights(index);
                        
                        //@ts-ignore
                        delete values[currentFormKey];
                        setValues({
                          ...values
                        });
                      }}
                      handleSelection={()=>{
                        setSelectedFeature(currentFormKey);
                      }}
                      handleClearSelection={()=>{
                        setSelectedFeature(undefined);
                      }}
                    />
                  }>
        <Box className="polygonPartFormContainer"> 
          <Field key={currentFormKey} name={currentFormKey}>
            {(props: any) => <LayersDetailsComponent
                                entityDescriptors={entityDescriptors}
                                layerRecord={polygon_part}
                                // mode={mode}
                                mode={polygonPartsMode === 'FROM_SHAPE' ? Mode.VIEW : mode}
                                formik={entityFormikHandlers}
                                enableMapPreview={false}
                                fieldNamePrefix={`${currentFormKey}.`}
                                showFiedlsCategory={false}
            />}
          </Field>
        </Box>
        <Box className="footer">
          <Box className="messages">
          {
            isFirstPhaseErrorInPolygonPart &&
            <ValidationsError errors={firstPhaseErrors[currentFormKey] as unknown as Record<string,string[]>} />
          }
          {
            !isFirstPhaseErrorInPolygonPart && isVestPhaseErrorInPolygonPart &&
            <ValidationsError errors={vestValidationResults[currentFormKey].getErrors()} />
          }
          </Box>
        </Box>
      </CollapsibleList>
    );
  };

  return (
    <Box id="layerDetailsFormRaster">
      <Form
        onSubmit={handleSubmit}
        autoComplete={'off'}
        className="form"
        noValidate
      >
        {
          (mode === Mode.NEW || mode === Mode.UPDATE) &&
          <IngestionFields
            formik={entityFormikHandlers}
            reloadFormMetadata={reloadFormMetadata}
            recordType={recordType}
            fields={ingestionFields}
            values={values}
          >
            <Button
              outlined
              type="button"
              disabled={!isIngestedSourceSelected()}
              onClick={(): void => {
                setLoadingPolygonParts(true);

                importShapeFileFromClient((ev, fileType) => {
                  const shpFile = (ev.target?.result as unknown) as ArrayBuffer;
                  void proccessShapeFile(shpFile, fileType)
                    .then((parsedPPData) => {
                      
                      setPolygonPartsMode('FROM_SHAPE');
                      
                      setLoadingPolygonParts(false);

                      const ppDataKeys = Object.keys(parsedPPData);
                      schemaUpdater(ppDataKeys.length);
                      
                      setExpandedParts(new Array(ppDataKeys.length).fill(false));
                      
                      /// ?reloadFormMetadata()
                      const polygonsData = ppDataKeys.map((key)=>{
                                                let {errors, polygonPart} = parsedPPData[key]; 
                                                return {[key]: polygonPart} 
                                            })
                                            .reduce((acc,curr)=> (acc={...acc,...curr},acc),{});

                      setParsingErrors(
                        ppDataKeys.map((key)=>{
                          let {errors, polygonPart} = parsedPPData[key];
                          return (!isEmpty(errors) ? {[key]: errors} : undefined)
                        }).
                        filter((item)=>item !== undefined) as Record<string, unknown>[]
                      );

                      setValues({
                        ...values,
                        ...transformEntityToFormFields(layerRecord),
                        ...ingestionFields,
                        ...polygonsData
                      });
                    })
                    .catch((e) => {
                      setStatus({
                        errors: {
                          // ...currentErrors,
                          ['shape']: [intl.formatMessage({ id: (e as Error).message })],
                        },
                      });
                    })
                },
                false,
                false,
                ()=>{
                  setLoadingPolygonParts(false);
                });
              }}
            >
              Load SHP
              {/* <FormattedMessage id="general.choose-btn.text" /> */}
            </Button>
          </IngestionFields>
        }
        <Box
          className={[
            mode === Mode.NEW ? 'content section' : 'content',
            showCurtain && 'curtainVisible',
          ].join(' ')}
        >
          {showCurtain && <Box className="curtain"></Box>}
          <LayersDetailsComponent
              entityDescriptors={filerModeDescriptors(mode, entityDescriptors)}
              layerRecord={layerRecord}
              mode={mode}
              formik={entityFormikHandlers}
              enableMapPreview={false}/>
          <Box style={{height: '20px'}}>
            <Checkbox 
              className='polygonPartsData showOnMapContainer'
              label={intl.formatMessage({id: 'polygon-parts.show-parts-on-map.label'})}
              checked={showPolygonPartsOnMap}
              onClick={
                (evt: React.MouseEvent<HTMLInputElement>): void => {
                  setShowPolygonPartsOnMap(evt.currentTarget.checked);
                }}
            />
            <Checkbox 
                className='showOnMapContainer'
                label={intl.formatMessage({id: 'polygon-parts.show-exisitng-parts-on-map.label'})}
                checked={showExisitngLayerPartsOnMap}
                onClick={
                  (evt: React.MouseEvent<HTMLInputElement>): void => {
                    setShowExisitngLayerPartsOnMap(evt.currentTarget.checked);
                  }}
              />
          </Box>
          <Box className="polygonPartsContainer">
            <Box className="polygonPartsData">
              
              {
                !loadingPolygonParts && isEmpty(layerPolygonParts) && <Typography
                    use="headline2"
                    tag="div"
                    className="noSelection"
                    style={{paddingTop: '120px', height: (polygonPartsMode === 'MANUAL') ? '370px' : '410px'}}
                  >
                    <FormattedMessage id="polygon-parts.empty-list" />
                  </Typography>
              }
              
              {
                loadingPolygonParts && <Loading />
              }
              {
                !loadingPolygonParts && !isEmpty(layerPolygonParts) && 
                  <List
                    width={740}
                    ref={setRef}
                    height={(polygonPartsMode === 'MANUAL') ? 370 : 410}
                    rowRenderer={renderRow}
                    rowCount={expandedParts.length}
                    overscanRowCount={3}
                    rowHeight={(idx)=> ( expandedParts[idx.index] ? 316 : 48 )}
                  />
              }
              {
                !loadingPolygonParts && (polygonPartsMode === 'MANUAL') && <Box className="addPolygonPart">
                  <Button
                    outlined
                    type="button"
                    onClick={(): void => {
                      setLoadingPolygonParts(false);

                      //Sort exisitng pp keys in descending order
                      const exisitngParts = layerPolygonParts ? Object.keys(layerPolygonParts)
                                            .map(key => parseInt(key.replace(NESTED_FORMS_PRFIX,'')))
                                            .sort((a, b) => b - a) : [];
                      const lastPartIdx = exisitngParts.length ? exisitngParts[0] + 1 : 0;

                      schemaUpdater(1, lastPartIdx);
                   
                      setExpandedParts([...expandedParts, false]);

                      const polygonData = {
                        uniquePartId: NESTED_FORMS_PRFIX + lastPartIdx,
                        __typename: "PolygonPartRecord",
                      }
                      
                      setValues({
                        ...values,
                        ...ingestionFields,
                        ...{[polygonData.uniquePartId]: polygonData}
                      });
                      
                    }}>
                      <Icon className="mc-icon-Plus" />
                    </Button>
                </Box>
              }
            </Box>
            {
            <>
              <GeoFeaturesPresentorComponent 
                mode={mode} 
                geoFeatures={showPolygonPartsOnMap ? [outlinedPerimeter as Feature<Geometry, GeoJsonProperties>,...ppFeatures] : []} 
                selectedFeatureKey={selectedFeature}
                selectionStyle={ new Style({
                                      stroke: new Stroke({
                                        width: 2,
                                        color: "#ff0000"
                                      }),
                                      fill: new Fill({
                                        color: "#aa2727"
                                      })
                                    })
                } 
                style={{width: '520px', position: 'relative'}} 
                fitOptions={{padding:[10,20,10,20]}}
                showExisitngPolygonParts={showExisitngLayerPartsOnMap}
              />
            </>
            }
          </Box>
        </Box>
        <Box className="footer">
          <Box className="messages">
            {
              topLevelFieldsErrors && Object.keys(topLevelFieldsErrors).length > NONE &&
              <ValidationsError errors={topLevelFieldsErrors} />
            }
            {
              Object.keys(topLevelFieldsErrors).length === NONE &&
              vestValidationResults.topLevelEntityVestErrors?.errorCount > NONE &&
              <ValidationsError errors={vestValidationResults.topLevelEntityVestErrors.getErrors()} />
            }
            { 
              graphQLError !== undefined && (
                <GraphQLError error={graphQLError} />
              )
            } 
          </Box>
          <Box className="buttons">
            <Button
              raised
              type="submit"
              disabled={
                mutationQueryLoading ||
                !dirty ||
                ppFeatures.length === NONE ||
                Object.keys(errors).length > NONE ||
                (Object.keys(getStatusErrors()).length > NONE) ||
                !isEmpty(graphQLError)
              }
            >
              <FormattedMessage id="general.ok-btn.text" />
            </Button>
            <Button
              type="button"
              onClick={(): void => {
                closeDialog();
              }}
            >
              <FormattedMessage id="general.cancel-btn.text" />
            </Button>
          </Box>
        </Box>
      </Form>
    </Box>
  );
};

interface LayerDetailsFormProps {
  recordType: RecordType;
  ingestionFields: FieldConfigModelType[];
  mode: Mode;
  entityDescriptors: EntityDescriptorModelType[];
  layerRecord: LayerMetadataMixedUnion;
  schemaUpdater: (parts:number) => void;
  removePolygonPart: (polygonPartKey: string) => void;
  yupSchema: OptionalObjectSchema<
    { [x: string]: Yup.AnySchema<unknown, unknown, unknown> },
    AnyObject,
    TypeOfShape<{ [x: string]: Yup.AnySchema<unknown, unknown, unknown> }>
  >;
  onSubmit: (values: Record<string, unknown>) => void;
  vestValidationResults: Record<string, DraftResult>;
  mutationQueryError: unknown;
  mutationQueryLoading: boolean;
  closeDialog: () => void;
}

export default withFormik<LayerDetailsFormProps, FormValues>({
  mapPropsToValues: (props) => {
    return {
      directory: '',
      fileNames: '',
      ...transformEntityToFormFields(props.layerRecord)
    };
  },

  validate: (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};
    return errors;
  },

  validationSchema: (props: LayerDetailsFormProps) => props.yupSchema,

  handleSubmit: (
    values,
    formikBag: FormikBag<LayerDetailsFormProps, FormValues>
  ) => {
    formikBag.props.onSubmit(
      transformFormFieldsToEntity(removeEmptyObjFields(values as unknown as Record<string, unknown>), formikBag.props.layerRecord)
    );
  },
})(InnerRasterForm);
