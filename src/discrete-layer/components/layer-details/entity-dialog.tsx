import React, { useEffect, useCallback } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FormattedMessage } from 'react-intl';
import { FormikValues, useFormik } from 'formik';
import { cloneDeep } from 'lodash';
import { observer } from 'mobx-react';
import { DialogContent } from '@material-ui/core';
import { Button, Dialog, DialogTitle, IconButton } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../common/models/mode.enum';
import { Layer3DRecordModel, LayerRasterRecordModel, RecordType, SensorType, useQuery, useStore } from '../../models';
import { ILayerImage } from '../../models/layerImage';
import { LayersDetailsComponent } from './layer-details';
import { Layer3DRecordModelKeys, LayerRasterRecordModelKeys } from './layer-details.field-info';
import { IngestionFields } from './ingestion-fields';

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
      record['__typename'] = Layer3DRecordModel.properties['__typename'].name.replaceAll('"','');
      break;
    case RecordType.RECORD_RASTER:
      LayerRasterRecordModelKeys.forEach(key => {
        record[key as string] = undefined;
      });
      record['__typename'] = LayerRasterRecordModel.properties['__typename'].name.replaceAll('"','');
      break;
    default:
      break;
  }
  record.type = recordType;
  return record as ILayerImage;
}
  
export const EntityDialogComponent: React.FC<EntityDialogComponentProps> = (props: EntityDialogComponentProps) => {
  const { isOpen, onSetOpen, recordType } = props;
  let layerRecord = cloneDeep(props.layerRecord);
  const updateMutation = useQuery();
  const store = useStore();

  const directory = '';
  let fileNames = '';

  let mode = Mode.EDIT;
  if (layerRecord === undefined && recordType !== undefined){
    mode = Mode.NEW;
    if (recordType === RecordType.RECORD_3D) {
      fileNames = 'tileset.json';
    }
    layerRecord = buildRecord(recordType);
  }

  const formik = useFormik({
    initialValues: layerRecord as FormikValues,
    onSubmit: values => {
      console.log(values);
      if (mode === Mode.EDIT) {
        updateMutation.setQuery(store.mutateUpdateMetadata({
          data: {
            id: values.id as string,
            type: values.type as RecordType,
            productName: values.productName as string,
            description: values.description as string,
            sensorType: values.sensorType as SensorType[],
            classification: values.classification as string ,
            keywords: values.keywords as string,
          }
        }));
      }
    }
  });
  
  const closeDialog = useCallback(
    () => {
      onSetOpen(false);
    },
    [onSetOpen]
  );
  
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if(!updateMutation.loading && updateMutation.data?.updateMetadata === 'ok'){
      closeDialog();
      store.discreteLayersStore.updateLayer(formik.values as ILayerImage);
      store.discreteLayersStore.selectLayerByID((formik.values as ILayerImage).id);
    }
  }, [updateMutation.data, updateMutation.loading, closeDialog, store.discreteLayersStore, formik.values]);

  return (
    <Box id="entityDialog">
      <Dialog open={isOpen} preventOutsideDismiss={true}>
        <DialogTitle>
          <FormattedMessage id={ mode === Mode.NEW ? (recordType === RecordType.RECORD_3D ? 'general.title.new.3d' : 'general.title.new.raster') : 'general.title.edit' }/>
          <IconButton
            className="closeIcon mc-icon-Close"
            label="CLOSE"
            onClick={ (): void => { closeDialog(); } }
          />
        </DialogTitle>
        <DialogContent className="dialogBody">
          <form onSubmit={formik.handleSubmit} className="form">
            {
              mode === Mode.NEW && <IngestionFields directory={directory} fileNames={fileNames} formik={formik}/>
            }
            {
              mode === Mode.NEW && <Box className="sectionTitle categoryFieldsTitle"><FormattedMessage id="general.section.title"/></Box>
            }
            <Box className={(mode === Mode.NEW) ? 'section' : ''}>
              <PerfectScrollbar className="content">
                <LayersDetailsComponent layerRecord={layerRecord} mode={mode} formik={formik}/>
              </PerfectScrollbar>
            </Box>
            <Box className="buttons">
              <Button type="button" onClick={(): void => { closeDialog(); }}>
                <FormattedMessage id="general.cancel-btn.text"/>
              </Button>
              <Button raised type="submit" disabled={ updateMutation.loading }>
                <FormattedMessage id="general.ok-btn.text"/>
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
