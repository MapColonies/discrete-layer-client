import React, { useMemo } from 'react';
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
import { Button } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import {
  EntityDescriptorModelType,
  FieldConfigModelType,
  LayerMetadataMixedUnion,
  RecordType,
} from '../../models';
import { Mode } from '../../../common/models/mode.enum';
import { LayersDetailsComponent } from './layer-details';
import { IngestionFields } from './ingestion-fields';
import { OptionalObjectSchema, TypeOfShape } from 'yup/lib/object';
import { AnyObject } from 'yup/lib/types';
import { ValidationsError } from '../../../common/components/error/validations.error-presentor';
import { DraftResult } from 'vest/vestResult';
import { GraphQLError } from '../../../common/components/error/graphql.error-presentor';

import './ingestion-fields.css';
import './entity-dialog.css';

const NONE = 0;

// Shape of form values - a bit problematic because we cant extend union type.
export interface FormValues {
  directory: string;
  fileNames: string;
}

interface OtherProps {
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
  props: OtherProps & FormikProps<FormValues>
): JSX.Element => {
  const {
    touched,
    errors,
    isSubmitting,
    values,
    dirty,
    handleChange,
    handleBlur,
    setValues,
    handleSubmit,
    handleReset,
    getFieldProps,
    getFieldMeta,
    getFieldHelpers,
    setFieldValue,
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

  const entityFormikHandlers: EntityFormikHandlers = useMemo(
    () => ({
      handleChange,
      handleBlur,
      handleSubmit,
      handleReset,
      getFieldProps,
      getFieldMeta,
      getFieldHelpers,
      setFieldValue,
    }),
    [getFieldProps]
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

  return (
    <Form
      onSubmit={handleSubmit}
      autoComplete={'off'}
      className="form"
      noValidate
    >
      {mode === Mode.NEW && (
        <IngestionFields
          formik={entityFormikHandlers}
          reloadFormMetadata={(metadata: any) => setValues(metadata)}
          recordType={recordType}
          fields={ingestionFields}
        />
      )}

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
          {mutationQueryError !== undefined && (
            // eslint-disable-next-line
            <GraphQLError error={mutationQueryError} />
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
  );
};

interface MyFormProps {
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

export default withFormik<MyFormProps, FormValues>({
  // Transform outer props into form values
  mapPropsToValues: (props) => {
    return {
      // directory: props.initialEmail || '',
      directory: '',
      fileNames: '',
      ...props.layerRecord,
    };
  },

  // Add a custom validation function (this can be async too!)
  validate: (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};
    return errors;
  },

  validationSchema: (props: MyFormProps) => props.yupSchema,

  handleSubmit: (values, formikBag: FormikBag<MyFormProps, FormValues>) => {
    formikBag.props.onSubmit(values as unknown as Record<string, unknown>);
  },
})(InnerForm);
