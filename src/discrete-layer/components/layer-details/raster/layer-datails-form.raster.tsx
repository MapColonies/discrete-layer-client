import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
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
} from '../utils';

import './layer-details-form.raster.css';
import { GeoJsonMapValuePresentorComponent } from '../field-value-presentors/geojson-map.value-presentor';

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

  const [graphQLError, setGraphQLError] = useState<unknown>(mutationQueryError);
  const [isSelectedFiles, setIsSelectedFiles] = useState<boolean>(false);
  const [firstPhaseErrors, setFirstPhaseErrors] = useState<Record<string, string[]>>({});
  const [showCurtain, setShowCurtain] = useState<boolean>(true);

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

  const NESTED_FORMS_PRFIX = 'polygonPart_';
  const topLevelFieldsErrors = {} as Record<string,string[]>;
  firstPhaseErrors && Object.keys(firstPhaseErrors).forEach((err) => {
    if(!err.includes(NESTED_FORMS_PRFIX)){
      topLevelFieldsErrors[err] = firstPhaseErrors[err];
    }
  })
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
                alert('kuku');
                schemaUpdater(2);
                /// ?reloadFormMetadata()
                setValues({
                  ...values,
                  ...transformEntityToFormFields(layerRecord),
                  ...ingestionFields,
                  ...{
                    // layerPolygonParts: {
                      polygonPart_0: {
                        "__typename": "PolygonPartRecord",
                        id: '11111',
                      },
                      polygonPart_1: {
                        "__typename": "PolygonPartRecord",
                        id: '22222',
                      },
                      // polygonPart_2: {
                      //   "__typename": "PolygonPartRecord",
                      //   id: '33333',
                      // }

                    }
                  // }
                });
                //@ts-ignore
                layerRecord.layerPolygonParts = {
                  polygonPart_0: {
                    "__typename": "PolygonPartRecord",
                    id: '11111',
                  },
                  polygonPart_1: {
                    "__typename": "PolygonPartRecord",
                    id: '22222',
                  },
                  // polygonPart_2: {
                  //   "__typename": "PolygonPartRecord",
                  //   id: '33333',
                  // }

                }
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
                                                  handle={
                                                    <SimpleListItem
                                                      text={`part_${idx}`}
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
                                                                mode={mode}
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
            <GeoJsonMapValuePresentorComponent mode={mode}  style={{width: '520px'}} fitOptions={{padding:[10,20,10,20]}}/>
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
