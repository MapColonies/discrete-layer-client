import React, { useMemo, useState, useEffect, useCallback } from 'react';
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
import * as Yup from 'yup';
import { OptionalObjectSchema, TypeOfShape } from 'yup/lib/object';
import { AnyObject } from 'yup/lib/types';
import { DraftResult } from 'vest/vestResult';
import { get, isEmpty, isObject } from 'lodash';
import shp, { FeatureCollectionWithFilename, getShapeFile, parseDbf, parseShp } from 'shpjs';
import { Button, CollapsibleList, SimpleListItem } from '@map-colonies/react-core';
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

import './layer-details-form.raster.css';
import { GeoFeaturesPresentorComponent } from './pp-map';
import moment from 'moment';
import { Feature } from 'geojson';
import { emphasizeByHTML } from '../../../../common/helpers/formatters';

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
  schemaUpdater: (parts:number) => void;
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
    schemaUpdater
  } = props;

  const status = props.status as StatusError | Record<string, unknown>;
  const NESTED_FORMS_PRFIX = 'polygonPart_';
  
  const intl = useIntl();
  const [graphQLError, setGraphQLError] = useState<unknown>(mutationQueryError);
  const [isSelectedFiles, setIsSelectedFiles] = useState<boolean>(false);
  const [firstPhaseErrors, setFirstPhaseErrors] = useState<Record<string, string[]>>({});
  const [showCurtain, setShowCurtain] = useState<boolean>(true);
  const [ppFeatures, setPPFeatures] = useState<Feature[]>([]);
  const [parsingErrors, setParsingErrors] = useState<Record<string, unknown>[]>([]);

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
    setFirstPhaseErrors({
      ...getYupErrors(),
      ...getStatusErrors() as { [fieldName: string]: string[]; },
    })
  }, [errors, getYupErrors, getStatusErrors]);

  useEffect(() => {
    const features: Feature[] = [];
    Object.keys(values).filter(key=>key.includes(NESTED_FORMS_PRFIX)).forEach(key=>{
      features.push({
        type: "Feature",
        properties: {},
        // @ts-ignore
        geometry: values[key].geometry
      })
    });
    setPPFeatures(features);
  }, [values]);

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

    setStatus({
      errors: {
        // ...currentErrors,
        ...stattusErrors
      },
    });
    
    // setStatus({
    //   errors: {
    //     // ...currentErrors,
    //     ['polygonPart_0']: {
    //       ['horizontalAccuracyCE90']: ['kuku']},
    //   },
    // });
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
                /*if(idx < 10)*/ {
                  const currentKey = `${NESTED_FORMS_PRFIX}${idx}`;
                  const parsedPolygonPartData = transformSynergyShapeFeatureToEntity(polygonPartDescriptors, feature);
                  parsedPolygonParts[currentKey] = {...parsedPolygonPartData};
                }
              })

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
              onClick={(): void => {
                importShapeFileFromClient((ev, fileType) => {
                  const shpFile = (ev.target?.result as unknown) as ArrayBuffer;
                  void proccessShapeFile(shpFile, fileType)
                    .then((parsedPPData) => {
                      // setJsonValue(JSON.stringify(geometryPolygon));
                      // removeStatusErrors();

                      // alert('kuku');
                      schemaUpdater(Object.keys(parsedPPData).length);``
                      /// ?reloadFormMetadata()
                      const polygonsData = Object.keys(parsedPPData).map((key)=>{let {errors, polygonPart} = parsedPPData[key]; return {[key]: polygonPart} })
                                          .reduce((acc,curr)=> (acc={...acc,...curr},acc),{});

                      setParsingErrors(Object.keys(parsedPPData).map((key)=>{let {errors, polygonPart} = parsedPPData[key]; return {[key]: errors} }));

                      setValues({
                        ...values,
                        ...transformEntityToFormFields(layerRecord),
                        ...ingestionFields,
                        ...polygonsData
                        
                      });
                      //@ts-ignore
                      layerRecord.layerPolygonParts = {...polygonsData};
                    })
                    .catch((e) => {
                      // const errorTranslation = intl.formatMessage(
                      //   { id: (e as Error).message },
                      //   {
                      //     fieldName: emphasizeByHTML(
                      //       `${intl.formatMessage({ id: fieldInfo.label })}`
                      //     ),
                      //   }
                      // );
    
                      setStatus({
                        errors: {
                          // ...currentErrors,
                          ['shape']: [intl.formatMessage({ id: (e as Error).message })],
                        },
                      });
                    })
                    // .finally(() => {
                    //   // Focus input after loading shape file, validations occurs on blur.
                    //   fieldRef.current?.focus();
                    // });
                },false,false);

                // alert('kuku');
                // schemaUpdater(2);
                // /// ?reloadFormMetadata()
                // setValues({
                //   ...values,
                //   ...transformEntityToFormFields(layerRecord),
                //   ...ingestionFields,
                //   ...{
                //     // layerPolygonParts: {
                //       polygonPart_0: {
                //         "__typename": "PolygonPartRecord",
                //         id: '11111',
                //       },
                //       polygonPart_1: {
                //         "__typename": "PolygonPartRecord",
                //         id: '22222',
                //       },
                //       // polygonPart_2: {
                //       //   "__typename": "PolygonPartRecord",
                //       //   id: '33333',
                //       // }

                //     }
                //   // }
                // });
                // //@ts-ignore
                // layerRecord.layerPolygonParts = {
                //   polygonPart_0: {
                //     "__typename": "PolygonPartRecord",
                //     id: '11111',
                //   },
                //   polygonPart_1: {
                //     "__typename": "PolygonPartRecord",
                //     id: '22222',
                //   },
                //   // polygonPart_2: {
                //   //   "__typename": "PolygonPartRecord",
                //   //   id: '33333',
                //   // }

                // }
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
            </Box>
          </Box>
          <Box className="polygonPartsContainer">
            <Box className="polygonPartsData">
              {
                // @ts-ignore
                layerRecord.layerPolygonParts && Object.values(layerRecord.layerPolygonParts).map((val,idx) => {
                                        const currentFormKey = `${NESTED_FORMS_PRFIX}${idx}`;
                                        let polygon_part = val as unknown as LayerMetadataMixedUnion;
                                        let isErrorInPolygonPart = firstPhaseErrors[currentFormKey] && Object.keys(firstPhaseErrors[currentFormKey])?.length > NONE;

                                        // @ts-ignore
                                        if(values.layerPolygonParts && Object.keys(values.layerPolygonParts).length > NONE){
                                          // @ts-ignore    
                                          polygon_part = values.layerPolygonParts[currentFormKey] as unknown as LayerMetadataMixedUnion
                                        }

                                        return <CollapsibleList
                                                  key={currentFormKey}
                                                  handle={
                                                    <SimpleListItem
                                                      text={currentFormKey}
                                                      // graphic="help"
                                                      metaIcon="chevron_right"
                                                      className={isErrorInPolygonPart ? 'polygonPartDataError' : ''}
                                                    />
                                                  }>
                                        <Box className="polygonPartFormContainer"> 
                                          <Field key={currentFormKey} name={currentFormKey}>
                                            {(props: any) => <LayersDetailsComponent
                                                                entityDescriptors={entityDescriptors}
                                                                layerRecord={polygon_part}
                                                                // mode={mode}
                                                                mode={Mode.VIEW}
                                                                formik={entityFormikHandlers}
                                                                enableMapPreview={false}
                                                                fieldNamePrefix={`${currentFormKey}.`}
                                                                showFiedlsCategory={false}
                                                /> /*JSON.stringify(polygon_part)*/}
                                          </Field>
                                        </Box>
                                        <Box className="footer">
                                          <Box className="messages">
                                          {
                                            isErrorInPolygonPart &&
                                            <ValidationsError errors={firstPhaseErrors[currentFormKey] as unknown as Record<string,string[]>} />
                                          }
                                          {
                                            !isErrorInPolygonPart &&
                                            vestValidationResults[currentFormKey]?.errorCount > NONE &&
                                            <ValidationsError errors={vestValidationResults[currentFormKey].getErrors()} />
                                          }
                                          </Box>
                                        </Box>
                                      </CollapsibleList>})
                
              }
            </Box>
            {
              
            // @ts-ignore 
            <GeoFeaturesPresentorComponent mode={mode} geoFeatures={ppFeatures} style={{width: '520px'}} fitOptions={{padding:[10,20,10,20]}}/>
            }
          </Box>
        </Box>
        <Box className="footer">
          <Box className="messages">
            { 
              graphQLError !== undefined && (
                // eslint-disable-next-line
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
                (layerRecord.__typename !== 'BestRecord' && !dirty) ||
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