import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  withFormik,
  FormikProps,
  FormikErrors,
  Form,
  FormikHandlers,
  FormikBag,
} from 'formik';
import * as Yup from 'yup';
import { OptionalObjectSchema, TypeOfShape } from 'yup/lib/object';
import { AnyObject } from 'yup/lib/types';
import { DraftResult } from 'vest/vestResult';
import { get, isEmpty } from 'lodash';
import { Button, Checkbox, IconButton, Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { SYNC_QUERY_NAME } from '../../../syncHttpClientGql';
import { emphasizeByHTML } from '../../../common/helpers/formatters';
import { sessionStore } from '../../../common/helpers/storage';
import { Mode } from '../../../common/models/mode.enum';
import { ValidationsError } from '../../../common/components/error/validations.error-presentor';
import { GraphQLError } from '../../../common/components/error/graphql.error-presentor';
import { MetadataFile } from '../../../common/components/file-picker';
import {
  EntityDescriptorModelType,
  FieldConfigModelType,
  LayerMetadataMixedUnion,
  RecordType,
} from '../../models';
import { LayersDetailsComponent } from './layer-details';
import { IngestionFields } from './ingestion-fields';
import {
  removeEmptyObjFields,
  transformFormFieldsToEntity,
  extractDescriptorRelatedFieldNames,
  getFlatEntityDescriptors,
  transformEntityToFormFields,
} from './utils';

import './layer-details-form.css';

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
  vestValidationResults: DraftResult;
  mutationQueryError: unknown;
  mutationQueryLoading: boolean;
  closeDialog: () => void;
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

const InnerForm = (
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
  } = props;

  const status = props.status as StatusError | Record<string, unknown>;
  const intl = useIntl();
  const [graphQLError, setGraphQLError] = useState<unknown>(mutationQueryError);
  const [isSelectedFiles, setIsSelectedFiles] = useState<boolean>(false);
  const [firstPhaseErrors, setFirstPhaseErrors] = useState<Record<string, string[]>>({});
  const [showCurtain, setShowCurtain] = useState<boolean>(true);
  const [syncAnywayChecked, setSyncAnywayChecked] = useState<boolean>(false);
  const [validationSourceWarn, setValidationSourceWarn] = useState<string>('');

  const getStatusErrors = useCallback((): StatusError | Record<string, unknown> => {
    return get(status, 'errors') as Record<string, string[]> | null ?? {};
  }, [status]);

  const getYupErrors = useCallback(
    (): Record<string, string[]> => {
      const validationResults: Record<string, string[]> = {};
      Object.entries(errors).forEach(([key, value]) => {
        if (getFieldMeta(key).touched) {
          validationResults[key] = [value];
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
    // Add method wathers for storage changes
    sessionStore.watchMethods(
      ['setItem'],
      (method, key, ...args) => {},
      (method, key, ...args) => {
        // console.log(`**** call ${method} with key ${key} and args ${args}`);
        if (key.includes(SYNC_QUERY_NAME.VALIDATE_SOURCE)) {
          const validSource = sessionStore.getObject(SYNC_QUERY_NAME.VALIDATE_SOURCE);
          if (validSource) {
            setValidationSourceWarn((validSource as Record<string,any>)[SYNC_QUERY_NAME.VALIDATE_SOURCE]?.message)
          }
          // console.log('**** FORM #######################', validSource);
        }
      }
    );

    // Clean up the method wathers when the component unmounts
    return () => {
      sessionStore.unWatchMethods();
    };
  }, []);

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

  return (
    <Box id="layerDetailsForm">
      <Form
        onSubmit={handleSubmit}
        autoComplete={'off'}
        className="form"
        noValidate
      >
        {
          (mode === Mode.NEW || mode === Mode.UPDATE) &&
          <IngestionFields
            recordType={recordType}
            fields={ingestionFields}
            values={values}
            onSetCurtainOpen={setShowCurtain}
            validateSources={recordType === RecordType.RECORD_RASTER}
            reloadFormMetadata={reloadFormMetadata}
            formik={entityFormikHandlers}
          />
        }
        <Box
          className={[
            mode === Mode.NEW ? 'content section' : 'content',
            showCurtain && 'curtainVisible',
          ].join(' ')}
        >
          {showCurtain && <Box className="curtain"></Box>}
          <LayersDetailsComponent
            entityDescriptors={entityDescriptors}
            layerRecord={layerRecord}
            mode={mode}
            formik={entityFormikHandlers}
          />
        </Box>
        <Box className="footer">
          <Box className="messages">
            {
              Object.keys(firstPhaseErrors).length > NONE &&
              <ValidationsError errors={firstPhaseErrors} />
            }
            {
              Object.keys(errors).length === NONE &&
              vestValidationResults.errorCount > NONE &&
              <ValidationsError errors={vestValidationResults.getErrors()} />
            }
            {
              graphQLError !== undefined && (
                // eslint-disable-next-line
                <GraphQLError error={graphQLError} />
              )
            }
            {
              validationSourceWarn &&
              <Box className="ingestionWarning">
                <Typography tag="span"><IconButton className="mc-icon-Status-Warnings warningIcon warning" /></Typography>
                <Box>
                  <Typography tag="div" className="warningMessage warning"
                    dangerouslySetInnerHTML={{__html:
                      intl.formatMessage(
                        {id: 'ingestion.warning.invalid-secondary-file'},
                        {title: emphasizeByHTML(`${intl.formatMessage({ id: 'ingestion.warning.title' })}`), value: validationSourceWarn}
                      )
                    }}
                  />
                  <Checkbox
                    className="warning"
                    label={intl.formatMessage({id: 'ingestion.checkbox.label'})}
                    checked={syncAnywayChecked}
                    onClick={
                      (evt: React.MouseEvent<HTMLInputElement>): void => {
                        setSyncAnywayChecked(evt.currentTarget.checked);
                      }}
                  />
                </Box>
              </Box>
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
                !isEmpty(graphQLError) ||
                (!isEmpty(validationSourceWarn) && !syncAnywayChecked)
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
  yupSchema: OptionalObjectSchema<
    { [x: string]: Yup.AnySchema<unknown, unknown, unknown> },
    AnyObject,
    TypeOfShape<{ [x: string]: Yup.AnySchema<unknown, unknown, unknown> }>
  >;
  onSubmit: (values: Record<string, unknown>) => void;
  vestValidationResults: DraftResult;
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
})(InnerForm);
