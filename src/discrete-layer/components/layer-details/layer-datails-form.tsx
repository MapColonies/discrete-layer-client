import React, { useMemo, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  withFormik,
  FormikProps,
  FormikErrors,
  Form,
  FormikHandlers,
} from 'formik';
import { Button } from '@map-colonies/react-core';
import {
  EntityDescriptorModelType,
  FieldConfigModelType,
  LayerMetadataMixedUnion,
  RecordType,
} from '../../models';
import { IngestionFields } from './ingestion-fields';

import './ingestion-fields.css';
import { Box } from '@material-ui/core';
import { Mode } from '../../../common/models/mode.enum';
import { LayersDetailsComponent } from './layer-details';

import './entity-dialog.css';

// Shape of form values
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
}

export interface EntityFormikHandlers extends FormikHandlers {
  setValues: (
    values: React.SetStateAction<FormValues>,
    shouldValidate?: boolean | undefined
  ) => void;

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
      setFieldValue,
    }),
    [getFieldProps]
  );

  return (
    <Form onSubmit={handleSubmit} autoComplete={'off'} className="form" noValidate>
      {mode === Mode.NEW && (
        <IngestionFields
          formik={entityFormikHandlers}
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
      <Button type="submit" disabled={isSubmitting}>
        <FormattedMessage id="general.ok-btn.text" />
      </Button>
    </Form>
  );
};

interface MyFormProps {
  recordType: RecordType;
  ingestionFields: FieldConfigModelType[];
  mode: Mode;
  entityDescriptors: EntityDescriptorModelType[];
  layerRecord: LayerMetadataMixedUnion;
}

export default withFormik<MyFormProps, FormValues>({
  // Transform outer props into form values
  mapPropsToValues: (props) => {
    return {
      // directory: props.initialEmail || '',
      directory: '',
      fileNames: '',
      ...props.layerRecord
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
