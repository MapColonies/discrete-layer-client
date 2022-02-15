import React from 'react';
import { FormattedMessage } from 'react-intl';
import { withFormik, FormikProps, FormikErrors, Form } from 'formik';
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

const InnerForm = (props: OtherProps & FormikProps<FormValues>) => {
  const {
    touched,
    errors,
    isSubmitting,
    values,
    handleChange,
    setValues,
    recordType,
    ingestionFields,
  } = props;
  return (
    <Form>
      <IngestionFields
        values={values}
        handleChange={handleChange}
        recordType={recordType}
        setValues={setValues}
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
