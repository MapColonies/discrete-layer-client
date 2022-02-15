import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  withFormik,
  FormikProps,
  FormikErrors,
  Form,
  FormikHandlers,
} from 'formik';
import { Button } from '@map-colonies/react-core';
import { FieldConfigModelType, RecordType } from '../../models';
import { IngestionFields } from './ingestion-fields';

import './ingestion-fields.css';

// Shape of form values
export interface FormValues {
  directory: string;
  fileNames: string;
}

interface OtherProps {
  recordType: RecordType;
  ingestionFields: FieldConfigModelType[];
}

export interface EntityFormikHandlers extends FormikHandlers {
  setValues: (
    values: React.SetStateAction<FormValues>,
    shouldValidate?: boolean | undefined
  ) => void;
}

const InnerForm = (props: OtherProps & FormikProps<FormValues>): JSX.Element => {
  const {
    touched,
    errors,
    isSubmitting,
    values,
    handleChange,
    handleBlur,
    setValues,
    handleSubmit,
    handleReset,
    getFieldProps,
    getFieldMeta,
    getFieldHelpers,
    recordType,
    ingestionFields,
  } = props;

  const entityFormikHandlers: EntityFormikHandlers = useMemo(
    () => ({
      handleChange,
      handleBlur,
      setValues,
      handleSubmit,
      handleReset,
      getFieldProps,
      getFieldMeta,
      getFieldHelpers,
    }),
    [
      handleChange,
      handleBlur,
      setValues,
      handleSubmit,
      handleReset,
      getFieldProps,
      getFieldMeta,
      getFieldHelpers,
    ]
  );

  return (
    <Form>
      <IngestionFields
        values={values}
        formik={entityFormikHandlers}
        recordType={recordType}
        fields={ingestionFields}
      />
      <Button type="submit" disabled={isSubmitting}>
        <FormattedMessage id="general.ok-btn.text" />
      </Button>
    </Form>
  );
};

interface MyFormProps {
  initialEmail?: string;
  recordType: RecordType;
  ingestionFields: FieldConfigModelType[];
}

export default withFormik<MyFormProps, FormValues>({
  // Transform outer props into form values
  mapPropsToValues: (props) => {
    return {
      // directory: props.initialEmail || '',
      directory: '',
      fileNames: '',
    };
  },

  // Add a custom validation function (this can be async too!)
  validate: (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};
    return errors;
  },

  handleSubmit: (values) => {
    console.log(values);
  },
})(InnerForm);
