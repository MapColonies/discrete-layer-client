import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FormattedMessage } from 'react-intl';
import { FormikValues, useFormik } from 'formik';
import { cloneDeep } from 'lodash';
import { DialogContent } from '@material-ui/core';
import { Button, Dialog, DialogTitle, IconButton } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../common/models/mode.enum';
import { RecordType } from '../../models';
import { ILayerImage } from '../../models/layerImage';
import { LayersDetailsComponent } from './layer-details';
import { Layer3DRecordModelKeys, LayerRasterRecordModelKeys } from './layer-details.field-info';

import './entity-dialog.css';

interface EntityDialogComponentProps {
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
  recordType?: RecordType;
  layerRecord?: ILayerImage | null;
}

const buildRecord = (recordType: RecordType): ILayerImage => {
  const record = {} as Record<string, any>;
  switch(recordType){
    case RecordType.RECORD_3D:
      Layer3DRecordModelKeys.forEach(key => {
        record[key as string] = undefined;
      });
      record['__typename'] = 'Layer3DRecord';
      break;
    case RecordType.RECORD_RASTER:
      LayerRasterRecordModelKeys.forEach(key => {
        record[key as string] = undefined;
      });
      record['__typename'] = 'LayerRasterRecord';
      break;
    default:
      break;
  }
  record.type = recordType;
  return record as ILayerImage;
}
  
export const EntityDialogComponent: React.FC<EntityDialogComponentProps> = (props: EntityDialogComponentProps) => {
  const { isOpen, onSetOpen, recordType } = props;
  let { layerRecord } = props;

  let mode = Mode.EDIT;
  if (layerRecord === undefined && recordType !== undefined){
    mode = Mode.NEW;
    layerRecord = buildRecord(recordType);
  }

  const formik = useFormik({
    initialValues: cloneDeep(layerRecord) as FormikValues,
    onSubmit: values => {
      console.log(values);
    }
  });

  const handleClose = (isOpened: boolean): void => {
    onSetOpen(isOpened);
  };

  return (
    <Box id="entityDialog">
      <Dialog open={isOpen} preventOutsideDismiss={true}>
        <DialogTitle>
          <FormattedMessage id={ mode === Mode.NEW ? 'general.title.new' : 'general.title.edit' }/>
          <IconButton
            className="closeIcon mc-icon-Close"
            label="CLOSE"
            onClick={ (): void => { handleClose(false); } }
          />
        </DialogTitle>
        <DialogContent className="dialogBody">
          <form onSubmit={formik.handleSubmit} className="form">
            <PerfectScrollbar className="content">
              <LayersDetailsComponent layerRecord={layerRecord} mode={mode} formik={formik}/>
            </PerfectScrollbar>
            <Box className="buttons">
              <Button type="button" onClick={(): void => { handleClose(false); }}>
                <FormattedMessage id="general.cancel-btn.text"/>
              </Button>
              <Button raised type="submit">
                <FormattedMessage id="general.ok-btn.text"/>
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
