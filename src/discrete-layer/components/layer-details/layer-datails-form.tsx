import React, { useMemo, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
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
import { isEmpty } from 'lodash';
import { Button } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
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
  mutationQueryError: any;
  mutationQueryLoading: boolean;
  closeDialog: () => void;
}

export interface EntityFormikHandlers extends FormikHandlers {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
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

  const [graphQLError, setGraphQLError] = useState<unknown>(mutationQueryError);
  const [isSelectedFiles, setIsSelectedFiles] = useState<boolean>(false);

  useEffect(() => {
    setGraphQLError(mutationQueryError);
  }, [mutationQueryError]);

  const entityFormikHandlers: EntityFormikHandlers = useMemo(
    () => ({
      handleChange: (e: React.ChangeEvent<any>): void => {
        setGraphQLError(undefined);
        handleChange(e);
      },
      handleBlur,
      handleSubmit,
      handleReset,
      getFieldProps,
      getFieldMeta,
      getFieldHelpers,
      resetForm,
      setFieldValue,
      setValues,
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
      setFieldValue,
      setValues
    ]
  );

  const getYupErrors = (): Record<string, string[]> => {
    const validationResults: Record<string, string[]> = {};
    Object.entries(errors).forEach(([key, value]) => {
      if (getFieldMeta(key).touched) {
        validationResults[key] = [value as string];
      }
    });
    return validationResults;
  };

  const reloadFormMetadata = (
    ingestionFields: FormValues,
    metadata: MetadataFile
  ): void => {
    setIsSelectedFiles(!!ingestionFields.fileNames);

    // Check for null fields
    for (const [key, val] of Object.entries(metadata.recordModel ?? {})) {
      if (val === null) {
        delete ((metadata.recordModel as unknown) as Record<string, unknown>)[
          key
        ];
      }
    }

    setValues({
      ...values,
      ...ingestionFields,
      ...(isEmpty(metadata.recordModel) ? layerRecord : metadata.recordModel),
    });
    
    if (metadata.error !== null) {
      setGraphQLError(metadata.error);
    }
  };

  return (
    <Box id="layerDetailsForm">
      <Form
        onSubmit={handleSubmit}
        autoComplete={'off'}
        className="form"
        noValidate
      >
        {mode === Mode.NEW && (
          <IngestionFields
            formik={entityFormikHandlers}
            reloadFormMetadata={reloadFormMetadata}
            recordType={recordType}
            fields={ingestionFields}
            values={values}
          />
        )}

        {
          mode === Mode.NEW && !isSelectedFiles &&
          <Box className="curtain"></Box>
        }
        <Box className={mode === Mode.NEW ? 'content section' : 'content'}>
          <LayersDetailsComponent
            entityDescriptors={entityDescriptors}
            layerRecord={layerRecord}
            mode={mode}
            formik={entityFormikHandlers}
          />
        </Box>
        <Box className="footer">
          <Box className="messages">
            {Object.keys(errors).length > NONE && (
              <ValidationsError errors={getYupErrors()} />
            )}
            {Object.keys(errors).length === NONE &&
              vestValidationResults.errorCount > NONE && (
                <ValidationsError errors={vestValidationResults.getErrors()} />
              )}
            {graphQLError !== undefined && (
              // eslint-disable-next-line
              <GraphQLError error={graphQLError} />
            )}
          </Box>
          <Box className="buttons">
            <Button
              raised
              type="submit"
              disabled={
                mutationQueryLoading ||
                (layerRecord.__typename !== 'BestRecord' && !dirty) ||
                Object.keys(errors).length > NONE
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
    { [x: string]: Yup.AnySchema<any, any, any> },
    AnyObject,
    TypeOfShape<{ [x: string]: Yup.AnySchema<any, any, any> }>
  >;
  onSubmit: (values: Record<string, unknown>) => void;
  vestValidationResults: DraftResult;
  mutationQueryError: any;
  mutationQueryLoading: boolean;
  closeDialog: () => void;
}

export default withFormik<LayerDetailsFormProps, FormValues>({
  mapPropsToValues: (props) => {
    return {
      directory: '',
      fileNames: '',
      ...props.layerRecord,
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
    formikBag.props.onSubmit((values as unknown) as Record<string, unknown>);
  },
})(InnerForm);
