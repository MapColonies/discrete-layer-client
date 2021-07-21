import React, { useEffect, useCallback } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FormattedMessage } from 'react-intl';
import { FormikValues, useFormik } from 'formik';
import { cloneDeep } from 'lodash';
import { observer } from 'mobx-react';
import { DialogContent } from '@material-ui/core';
import { Button, Dialog, DialogTitle, IconButton } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { GpaphQLError } from '../../../common/components/graphql/graphql.error-presentor';
import { Mode } from '../../../common/models/mode.enum';
import { Layer3DRecordModel, LayerRasterRecordModel, RecordType, SensorType, useQuery, useStore } from '../../models';
import { ILayerImage } from '../../models/layerImage';
import { Layer3DRecordInput, LayerRasterRecordInput } from '../../models/RootStore.base';
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
  
export const EntityDialogComponent: React.FC<EntityDialogComponentProps> = observer((props: EntityDialogComponentProps) => {
  const { isOpen, onSetOpen, recordType } = props;
  let layerRecord = cloneDeep(props.layerRecord);
  const mutationQuery = useQuery();
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
      if(mode === Mode.EDIT) {
        mutationQuery.setQuery(store.mutateUpdateMetadata({
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
      else{
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { directory, fileNames, __typename, ...metadata } = values;
        switch(recordType){
          case RecordType.RECORD_3D:
            mutationQuery.setQuery(store.mutateStart3DIngestion({
              data:{
                directory: directory as string,
                fileNames: [ fileNames as string ],
                metadata: metadata as Layer3DRecordInput,
                type: RecordType.RECORD_3D
              }
            }));
            break;
          case RecordType.RECORD_RASTER:
            mutationQuery.setQuery(store.mutateStartRasterIngestion({
              data:{
                directory: directory as string,
                fileNames: (fileNames as string).split(","),
                metadata: metadata as LayerRasterRecordInput,
                type: RecordType.RECORD_RASTER
              }
            }));
            break;
          default:
            break;
        }
      }
    }
  });
  
  const closeDialog = useCallback(
    () => {
      onSetOpen(false);
    },
    [onSetOpen]
  );

  const isInvalidForm = (): boolean => {
    return !formik.values.directory || !formik.values.fileNames;
  };
  
  useEffect(() => {
    // @ts-ignore
    if(!mutationQuery.loading && mutationQuery.data?.updateMetadata === 'ok'){
      closeDialog();
      store.discreteLayersStore.updateLayer(formik.values as ILayerImage);
      store.discreteLayersStore.selectLayerByID((formik.values as ILayerImage).id);
    }
  }, [mutationQuery.data, mutationQuery.loading, closeDialog, store.discreteLayersStore, formik.values]);

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
              mode === Mode.NEW && <IngestionFields recordType={recordType} directory={directory} fileNames={fileNames} formik={formik}/>
            }
            <Box className={(mode === Mode.NEW) ? 'section' : ''}>
              <PerfectScrollbar className="content">
                <LayersDetailsComponent layerRecord={layerRecord} mode={mode} formik={formik}/>
              </PerfectScrollbar>
            </Box>
            <Box className="buttons">
              {
                // eslint-disable-next-line
                mutationQuery.error !== undefined && <GpaphQLError error={mutationQuery.error}/>
              }
              <Button type="button" onClick={(): void => { closeDialog(); }}>
                <FormattedMessage id="general.cancel-btn.text"/>
              </Button>
              <Button raised type="submit" disabled={mutationQuery.loading || isInvalidForm()}>
                <FormattedMessage id="general.ok-btn.text"/>
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
});
