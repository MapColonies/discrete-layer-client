import React, { useEffect, useCallback, useState, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { observer } from 'mobx-react';
import { FormikValues, useFormik } from 'formik';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import * as Yup from 'yup';
import { MixedSchema } from 'yup/lib/mixed';
import { DraftResult } from 'vest/vestResult';
import { DialogContent } from '@material-ui/core';
import { Button, Dialog, DialogTitle, IconButton } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { usePrevious } from '../../../common/hooks/previous.hook';
import { GraphQLError } from '../../../common/components/error/graphql.error-presentor';
import { ValidationsError } from '../../../common/components/error/validations.error-presentor';
import CONFIG from '../../../common/config';
import { Mode } from '../../../common/models/mode.enum';
import {
  BestRecordModelType,
  EntityDescriptorModelType,
  Layer3DRecordModel,
  LayerMetadataMixedUnion,
  LayerRasterRecordModel,
  RecordType,
  useQuery,
  useStore,
  ValidationConfigModelType,
  FieldConfigModelType,
  ProductType,
  ValidationValueType,
  SensorType,
  LayerDemRecordModel
} from '../../models';
import { ILayerImage } from '../../models/layerImage';
import { Layer3DRecordInput, LayerDemRecordInput, LayerRasterRecordInput } from '../../models/RootStore.base';
import { LayersDetailsComponent } from './layer-details';
import { FieldConfigModelKeys, IRecordFieldInfo, Layer3DRecordModelKeys, LayerDemRecordModelKeys, LayerRasterRecordModelKeys } from './layer-details.field-info';
import { IngestionFields } from './ingestion-fields';
import { getFlatEntityDescriptors, getValidationType } from './utils';
import suite from './validate';

import './entity-dialog.css';

const DEFAULT_ID = 'DEFAULT_UI_ID';
const IMMEDIATE_EXECUTION = 0;
const NONE = 0;
const START = 0;
const isAutocompleteEnabled = CONFIG.RUNNING_MODE.AUTOCOMPLETE as boolean;

interface EntityDialogComponentProps {
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
  recordType?: RecordType;
  layerRecord?: ILayerImage | null;
}

const buildRecord = (recordType: RecordType): ILayerImage => {
  const record = {} as Record<string, any>;
  switch(recordType) {
    case RecordType.RECORD_DEM:
      LayerDemRecordModelKeys.forEach(key => {
        record[key as string] = undefined;
      });
      record.productType = ProductType.DTM;
      record['__typename'] = LayerDemRecordModel.properties['__typename'].name.replaceAll('"','');
      break;
    case RecordType.RECORD_3D:
      Layer3DRecordModelKeys.forEach(key => {
        record[key as string] = undefined;
      });
      record.productType = ProductType.PHOTO_REALISTIC_3D;
      record['__typename'] = Layer3DRecordModel.properties['__typename'].name.replaceAll('"','');
      break;
    case RecordType.RECORD_RASTER:
      LayerRasterRecordModelKeys.forEach(key => {
        record[key as string] = undefined;
      });
      record.updateDate = moment();
      record.sensorType = SensorType.UNDEFINED;
      record.productType = ProductType.ORTHOPHOTO;
      record['__typename'] = LayerRasterRecordModel.properties['__typename'].name.replaceAll('"','');
      break;
    default:
      break;
  }
  record.id = DEFAULT_ID;
  record.srsId = '4326';
  record.srsName = 'WGS84GEO';
  record.producerName = 'IDFMU';
  record.type = recordType;
  return record as ILayerImage;
};

const buildFieldInfo = (): IRecordFieldInfo => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recordFieldInfo = {} as Record<string, any>;
  FieldConfigModelKeys.forEach(key => {
    recordFieldInfo[key as string] = undefined;
  });
  return recordFieldInfo as IRecordFieldInfo;
};

const getLabel = (recordType: RecordType): string => {
  if (recordType === RecordType.RECORD_3D) {
    return 'field-names.3d.fileNames';
  }
  return 'field-names.ingestion.fileNames';
};

const getTooltip = (recordType: RecordType): string => {
  if (recordType === RecordType.RECORD_3D) {
    return 'info-field-tooltip.3d.fileNames.tooltip';
  }
  return 'info-field-tooltip.ingestion.fileNames.tooltip';
};
  
export const EntityDialogComponent: React.FC<EntityDialogComponentProps> = observer((props: EntityDialogComponentProps) => {
  const { isOpen, onSetOpen, recordType } = props;
  let layerRecord = cloneDeep(props.layerRecord);
  const directory = '';
  let fileNames = '';
  const mutationQuery = useQuery();
  const store = useStore();
  const intl = useIntl();
  const [vestValidationResults, setVestValidationResults] = useState<DraftResult>({} as DraftResult);
  const [descriptors, setDescriptors] = useState<any[]>([]);
  const [schema, setSchema] = useState<Record<string, Yup.AnySchema>>({});
  const [inputValues, setInputValues] = useState<FormikValues>({});
  const prevLayerRecord = usePrevious<ILayerImage | null | undefined>(layerRecord);
  const cacheRef = useRef({} as ILayerImage | null | undefined);

  useEffect(()=>{
   if(layerRecord?.id !== prevLayerRecord?.id){
    cacheRef.current = layerRecord;
   }
  }, [layerRecord, prevLayerRecord]);

  
  let mode = Mode.EDIT;
  if (layerRecord === undefined && recordType !== undefined) {
    mode = Mode.NEW;
    if (recordType === RecordType.RECORD_3D) {
      fileNames = 'tileset.json';
    }
    layerRecord = buildRecord(recordType);
  }

  const ingestionFields = (layerRecord?.__typename !== 'BestRecord') ?
    [
      {
        ...buildFieldInfo(),
        fieldName: 'directory',
        label: 'field-names.ingestion.directory',
        isRequired: true,
        isAutoGenerated: false,
        infoMsgCode: [
          'info-general-tooltip.required'
        ]
      },
      {
        ...buildFieldInfo(),
        fieldName: 'fileNames',
        label: getLabel(recordType as RecordType),
        isRequired: true,
        isAutoGenerated: false,
        infoMsgCode: [
          'info-general-tooltip.required',
          getTooltip(recordType as RecordType)
        ]
      }
    ] :
    [];

  useEffect(() => {
    const descriptors = getFlatEntityDescriptors(
      layerRecord as LayerMetadataMixedUnion,
      store.discreteLayersStore.entityDescriptors as EntityDescriptorModelType[]
    );

    const getYupRequiredFieldConfig = (field: FieldConfigModelType): MixedSchema => {
      return Yup.mixed().required(
        intl.formatMessage(
          { id: 'validation-general.required' },
          { fieldName: `<strong>${intl.formatMessage({ id: field.label })}</strong>` }
        )
      );
    };
  
    const yupSchema: Record<string, any> = {};
    [
      ...ingestionFields,
      ...descriptors
    ].forEach(field => {
      const fieldName: string = field.fieldName as string;
      switch(mode){
        case Mode.NEW:
          if (field.isRequired as boolean && field.isAutoGenerated !== true)
          {
            yupSchema[fieldName] = getYupRequiredFieldConfig(field);
          }
          break;
        case Mode.EDIT:
          if (field.isRequired as boolean && field.isManuallyEditable === true) {
            yupSchema[fieldName] = getYupRequiredFieldConfig(field);
          }
          break;
        default:
          break;
      }
    });
    setSchema(yupSchema);
  
    const desc =  [
      ...ingestionFields,
      ...descriptors
    ].map((field: FieldConfigModelType) => {
      return {
        ...field,
        validation: field.validation?.map((val: ValidationConfigModelType) => {
          const firstParam = intl.formatMessage({ id: field.label });
          const paramType = getValidationType(val) ?? '';
          // @ts-ignore
          // eslint-disable-next-line
          const paramValue: string = val[paramType] ?? '';
          let secondParam = '';
          if (paramType !== '' && paramValue !== '') {
            if (val.valueType === ValidationValueType.FIELD) {
              const fieldLabel = field.label as string;
              const fieldLabelPrefix = fieldLabel.substring(START, fieldLabel.lastIndexOf('.'));
              secondParam = intl.formatMessage({ id: `${fieldLabelPrefix}.${paramValue}` });
            } else {
              secondParam = paramValue;
            }
          }
          const finalMsg = intl.formatMessage(
            { id: val.errorMsgCode },
            { 
              fieldName: `<strong>${firstParam}</strong>`,
              value: `<strong>${secondParam}</strong>`,
            }
          );
          return {
            ...val,
            errorMsgTranslation: finalMsg
          };
        })
      };
    });
    setDescriptors(desc as any[]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (vestValidationResults.errorCount === NONE) {
      if (mode === Mode.EDIT) {
        if (inputValues.__typename !== 'BestRecord') {
          mutationQuery.setQuery(store.mutateUpdateMetadata({
            data: {
              id: inputValues.id as string,
              type: inputValues.type as RecordType,
              productName: inputValues.productName as string,
              description: inputValues.description as string,
              // sensorType: inputValues.sensorType as SensorType[],
              productSubType: inputValues.productSubType as string,
              producerName: inputValues.producerName as string,
              classification: inputValues.classification as string ,
              keywords: inputValues.keywords as string,
            }
          }));
        } else {
          setTimeout(() => {
            store.bestStore.editBest({
              ...(inputValues as BestRecordModelType),
              // @ts-ignore
              sensorType: (inputValues.sensorType !== undefined) ? JSON.parse('[' + (inputValues.sensorType as string) + ']') as string[] : []
            });
          }, IMMEDIATE_EXECUTION);
          closeDialog();
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { directory, fileNames, __typename, ...metadata } = inputValues;
        switch (recordType) {
          case RecordType.RECORD_DEM:
            mutationQuery.setQuery(store.mutateStartDemIngestion({
              data: {
                directory: directory as string,
                fileNames: (fileNames as string).split(","),
                metadata: metadata as LayerDemRecordInput,
                type: RecordType.RECORD_DEM
              }
            }));
            break;
          case RecordType.RECORD_3D:
            mutationQuery.setQuery(store.mutateStart3DIngestion({
              data: {
                directory: directory as string,
                fileNames: [ fileNames as string ],
                metadata: metadata as Layer3DRecordInput,
                type: RecordType.RECORD_3D
              }
            }));
            break;
          case RecordType.RECORD_RASTER:
            mutationQuery.setQuery(store.mutateStartRasterIngestion({
              data: {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vestValidationResults]);
  
  const formik = useFormik({
    initialValues: layerRecord as FormikValues,
    validationSchema: Yup.object({
      ...schema
    }),
    onSubmit: values => {
      console.log(values);
      
      setInputValues(values);
      // eslint-disable-next-line
      const vestSuite = suite(descriptors as FieldConfigModelType[], values);
      // eslint-disable-next-line
      setVestValidationResults(vestSuite.get());
    }
  });
 
  const closeDialog = useCallback(() => {
    onSetOpen(false);
  }, [onSetOpen]);
  
  useEffect(() => {
    // @ts-ignore
    if (!mutationQuery.loading && (mutationQuery.data?.updateMetadata === 'ok' || mutationQuery.data?.start3DIngestion === 'ok' || mutationQuery.data?.startRasterIngestion === 'ok')) {
      closeDialog();
      store.discreteLayersStore.updateLayer(formik.values as ILayerImage);
      store.discreteLayersStore.selectLayerByID((formik.values as ILayerImage).id);
    }
  }, [mutationQuery.data, mutationQuery.loading, closeDialog, store.discreteLayersStore, formik.values]);

  const getYupErrors = (): Record<string, string[]> => {
    const validationResults: Record<string, string[]> = {};
    Object.entries(formik.errors).forEach(([key, value]) => {
      if (formik.getFieldMeta(key).touched) {
        validationResults[key] = [ value as string ];
      }
    });
    return validationResults;
  };

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
          <form onSubmit={formik.handleSubmit} autoComplete={isAutocompleteEnabled ? 'on' : 'off'} className="form" noValidate>
            {
              mode === Mode.NEW && <IngestionFields fields={ingestionFields} values={[ directory, fileNames ]} formik={formik}/>
            }
            <Box className={(mode === Mode.NEW) ? 'content section' : 'content'}>
              <LayersDetailsComponent 
                entityDescriptors={store.discreteLayersStore.entityDescriptors as EntityDescriptorModelType[]} 
                layerRecord={cacheRef.current} 
                mode={mode} 
                formik={formik}
              />
            </Box>
            <Box className="footer">
              <Box className="messages">
                {
                  (Object.keys(formik.errors).length > NONE) && 
                  <ValidationsError errors={getYupErrors()}/>
                }
                {
                  (Object.keys(formik.errors).length === NONE && vestValidationResults.errorCount > NONE) && 
                  <ValidationsError errors={vestValidationResults.getErrors()}/>
                }
                {
                  mutationQuery.error !== undefined && 
                  // eslint-disable-next-line
                  <GraphQLError error={mutationQuery.error}/>
                }
              </Box>
              <Box className="buttons">
                <Button
                  raised 
                  type="submit" 
                  disabled={mutationQuery.loading || (layerRecord?.__typename !== 'BestRecord' && !formik.dirty) || Object.keys(formik.errors).length > NONE}
                >
                  <FormattedMessage id="general.ok-btn.text"/>
                </Button>
                <Button
                  type="button"
                  onClick={(): void => { closeDialog(); }}
                >
                  <FormattedMessage id="general.cancel-btn.text"/>
                </Button>
              </Box>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
});
