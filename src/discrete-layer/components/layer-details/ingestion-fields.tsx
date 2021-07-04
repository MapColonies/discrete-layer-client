import React from 'react';
import { Box } from '@map-colonies/react-components';
import { TextField } from '@map-colonies/react-core';
import { FieldLabelComponent } from './field-label';

import './ingestion-fields.css';

interface IngestionFieldsProps {
  directory: string;
  fileNames: string;
  formik?: unknown;
}

export const IngestionFields: React.FC<IngestionFieldsProps> = (props: IngestionFieldsProps) => {
  const { directory, fileNames, formik } = props;

  return (
    <Box>
      <Box className="categoryField">
        <Box className="ingestionFieldsSpacer"><FieldLabelComponent value="Directory"></FieldLabelComponent></Box>
        <TextField
          name="directory"
          type="text"
          // eslint-disable-next-line
          onChange={(formik as any).handleChange}
          // eslint-disable-next-line
          value={directory}
        />
        <Box className="ingestionFieldsSpacer"><FieldLabelComponent value="File names"></FieldLabelComponent></Box>
        <TextField
          name="fileNames"
          type="text"
          // eslint-disable-next-line
          onChange={(formik as any).handleChange}
          // eslint-disable-next-line
          value={fileNames}
        />
      </Box>
    </Box>
  );
};
