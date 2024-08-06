import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useIntl } from 'react-intl';
import CopyToClipboard from 'react-copy-to-clipboard';
import { get, isEmpty } from 'lodash';
import { Geometry } from 'geojson';
import shp, { FeatureCollectionWithFilename, parseShp } from 'shpjs';
import { useDebouncedCallback } from 'use-debounce';
import { Button, IconButton, TextField, Tooltip, Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { EMPTY_JSON_STRING_VALUE, validateGeoJSONString } from '../../../../common/utils/geojson.validation';
import { emphasizeByHTML } from '../../../../common/helpers/formatters';
import { Mode } from '../../../../common/models/mode.enum';
import TooltippedValue from '../../../../common/components/form/tooltipped.value';
import { IRecordFieldInfo } from '../layer-details.field-info';
import { EntityFormikHandlers } from '../layer-datails-form';
import { importShapeFileFromClient } from '../utils';
import { FormInputInfoTooltipComponent } from './form.input.info.tooltip';
import { GeoJsonMapValuePresentorComponent } from './geojson-map.value-presentor';

import './json.value-presentor.css';

const NONE = 0;
const REMOVE_ERROR_DELAY = 300;
const JSON_MAX_LENGTH = 300;

interface JsonValuePresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: string;
  formik?: EntityFormikHandlers;
  type?: string;
  enableLoadFromShape?: boolean;
  enableMapPreview?: boolean;
}

export const JsonValuePresentorComponent: React.FC<JsonValuePresentorProps> = ({
  mode,
  fieldInfo,
  value,
  formik,
  type,
  enableLoadFromShape = false,
  enableMapPreview = false
}) => {
  const [jsonValue, setJsonValue] = useState(JSON.stringify(value ?? {}));
  const [geoJsonWarning, setGeoJsonWarning] = useState('');
  const isCopyable = fieldInfo.isCopyable ?? false;
  const fieldRef = useRef<HTMLInputElement | null>(null);
  const intl = useIntl();
  const currentErrors = useMemo(
    () => get(formik?.status, 'errors') as { [fieldName: string]: string[] } | null | undefined,
    [formik?.status]
  );
  const multipleFeaturesError = useMemo(() => new Error(`validation-field.${fieldInfo.fieldName as string}.shapeFile.multiple-features`), [fieldInfo.fieldName]);
  const shapeFileGenericError = useMemo(() => new Error(`validation-field.${fieldInfo.fieldName as string}.shapeFile.generic`), [fieldInfo.fieldName]);

  useEffect(() => {
    setJsonValue(JSON.stringify(value ?? {}));
  }, [value]);

  const removeStatusErrors = (): void => {
    setTimeout(() => {
      if (typeof currentErrors !== 'undefined') {
        // Remove valid field from errors obj if exists
        delete currentErrors?.[fieldInfo.fieldName as string];
        formik?.setStatus({ errors: currentErrors });
      } else {
        formik?.setStatus({});
      }
    }, NONE);
  };

  const debouncedRemoveStatusErrors = useDebouncedCallback(
    removeStatusErrors,
    REMOVE_ERROR_DELAY
  );

  const isShapeFileValid = (featuresArr: unknown[] | undefined): boolean | Error => {
    if (typeof featuresArr === 'undefined') {
      return shapeFileGenericError;
    }
    if (featuresArr.length > 1) {
      return multipleFeaturesError;
    }
    return true;
  }

  const proccessShapeFile = async (
    shapeArrayBuffer: ArrayBuffer,
    fileType: string
  ): Promise<Geometry> => {
    return new Promise((resolve, reject) => {
      const ZIP_EXTENSION = 'zip';

      try {
        // Supports zip files as well as single shape files.
        if (fileType === ZIP_EXTENSION) {
          void shp(shapeArrayBuffer)
            .then((data) => {
              // Extract polygon from geoJson featureCollection
              const featuresArr = (data as FeatureCollectionWithFilename).features;
              const shapeFileValidation = isShapeFileValid(featuresArr);

              if (shapeFileValidation instanceof Error) {
                return reject(shapeFileValidation);
              }

              const geometryPolygon = featuresArr[0].geometry;
              return resolve(geometryPolygon);
            })
            .catch(() => {
              return reject(shapeFileGenericError);
            });
        } else {
          const DEFAULT_PROJECTION = 'WGS84';
          // Probably is shape file.
          const geometryArr = parseShp(shapeArrayBuffer, DEFAULT_PROJECTION);
          const shapeFileValidation = isShapeFileValid(geometryArr);
              
          if (shapeFileValidation instanceof Error) {
            return reject(shapeFileValidation);
          }

          const geometryPolygon = geometryArr[0];
          return resolve(geometryPolygon);
        }
      } catch (e) {
        return reject(shapeFileGenericError);
      }
    });
  };

  const renderLoadShapeFileBtn = (): JSX.Element => {
    const btnText = intl.formatMessage({
      id: 'button-field-text.footprint.load-from-shapeFile',
    });

    return (
      <Box className="loadFromShapeBtn">
        <Button
          outlined
          type="button"
          onClick={(): void => {
            importShapeFileFromClient((ev, fileType) => {
              const shpFile = (ev.target?.result as unknown) as ArrayBuffer;
              void proccessShapeFile(shpFile, fileType)
                .then((geometryPolygon) => {
                  setJsonValue(JSON.stringify(geometryPolygon));
                  removeStatusErrors();
                })
                .catch((e) => {
                  const errorTranslation = intl.formatMessage(
                    { id: (e as Error).message },
                    {
                      fieldName: emphasizeByHTML(
                        `${intl.formatMessage({ id: fieldInfo.label })}`
                      ),
                    }
                  );

                  formik?.setStatus({
                    errors: {
                      ...currentErrors,
                      [fieldInfo.fieldName as string]: [errorTranslation],
                    },
                  });
                  setJsonValue(EMPTY_JSON_STRING_VALUE);
                })
                .finally(() => {
                  // Focus input after loading shape file, validations occurs on blur.
                  fieldRef.current?.focus();
                });
            });
          }}
        >
          {btnText}
        </Button>
      </Box>
    );
  };

  if (
    formik === undefined ||
    mode === Mode.VIEW ||
    (mode === Mode.EDIT && fieldInfo.isManuallyEditable !== true)
  ) {
    const stringifiedValue = value ? JSON.stringify(value) : '';
    return (
      <Box className="detailsFieldValue" style={{display: 'flex',gap: '10px'}}>
        <Box style={{width: enableMapPreview ? '60%' : '100%', display: 'flex'}}>
          <TooltippedValue tag="div" className="detailsFieldValue jsonValueAlign" disableTooltip>
            {`${stringifiedValue.substring(0, JSON_MAX_LENGTH)} ${(stringifiedValue.length > JSON_MAX_LENGTH) ? '...' : ''}`}
          </TooltippedValue>
          {
            !isEmpty(value) && isCopyable &&
            <Box className="detailsFieldCopyIcon detailsFieldNoMargin">
              <Tooltip content={intl.formatMessage({ id: 'action.copy.tooltip' })}>
                <CopyToClipboard text={stringifiedValue}>
                  <IconButton type="button" className="mc-icon-Copy" />
                </CopyToClipboard>
              </Tooltip>
            </Box>
          }
        </Box>
        { enableMapPreview && 
            <GeoJsonMapValuePresentorComponent mode={mode} jsonValue={stringifiedValue} style={{width: '40%', height: '200px'}} fitOptions={{padding:[10,20,10,20]}}/>
          }
      </Box>
    );
  } else {
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
      formik?.setFieldTouched(fieldInfo.fieldName as string, true, false);

      let formikValue: unknown = undefined;

      try {
        if (jsonValue === EMPTY_JSON_STRING_VALUE && (fieldInfo.isRequired as boolean)) {
          throw new Error('Required field');
        }

        if (jsonValue !== EMPTY_JSON_STRING_VALUE){
          const validRes = validateGeoJSONString(jsonValue);
          
          if (!validRes.valid){
            setGeoJsonWarning('');
            throw new Error(validRes.reason);
          } else {
            if(validRes.severity_level === 'INFO') {
              setGeoJsonWarning('');
            } else {
              setGeoJsonWarning(intl.formatMessage(
                {
                  id: `validation-field.${fieldInfo.fieldName as string}.${validRes.reason as string}.geojson`,
                }, 
                {
                  fieldName: emphasizeByHTML(
                    `${intl.formatMessage({ id: fieldInfo.label })}`
                  ),
                }
              ));
            }
          }
        }

        formikValue = JSON.parse(jsonValue) as unknown;
        formik?.setFieldValue(fieldInfo.fieldName as string, formikValue);

        removeStatusErrors();
      } catch (err) {
        const error = {
          id: `validation-field.${fieldInfo.fieldName as string}.${get(err,'message') as string}.geojson`,
        };
        const isFieldRequired = fieldInfo.isRequired as boolean;

        if (isFieldRequired || jsonValue.length > NONE) {
          if (isFieldRequired && (jsonValue.length === NONE || jsonValue === EMPTY_JSON_STRING_VALUE)) {
            error.id = 'validation-general.required';
          }
          const errorMsg = intl.formatMessage(error, {
            fieldName: emphasizeByHTML(
              `${intl.formatMessage({ id: fieldInfo.label })}`
            ),
          });

          formik?.setStatus({
            errors: {
              ...currentErrors,
              [fieldInfo.fieldName as string]: Array.from(
                new Set([
                  ...(currentErrors?.[fieldInfo.fieldName as string] ?? []),
                  errorMsg,
                ])
              ),
            },
          });
        } else {
          removeStatusErrors();
        }
      }
    };

    return (
      <>
        <Box className="detailsFieldValue jsonDetailsFieldValueContainer">
          <Box style={{width: enableMapPreview ? '60%' : '100%'}}>
            <TextField
              ref={fieldRef}
              id={fieldInfo.fieldName as string}
              name={fieldInfo.fieldName as string}
              type={type}
              value={jsonValue === EMPTY_JSON_STRING_VALUE ? '' : jsonValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                setJsonValue(e.currentTarget.value);
                debouncedRemoveStatusErrors();
                formik?.handleChange({});
              }}
              onBlur={(e) => {
                handleBlur(e);
                formik?.handleBlur({});
              }}
              placeholder={'JSON'}
              required={fieldInfo.isRequired as boolean}
              textarea
              rows={enableMapPreview ? 8 : 4}
              className={`jsonInput ${enableMapPreview ? 'withMapPreview':''}` }
            />
            {!(
              fieldInfo.infoMsgCode?.length === 1 &&
              fieldInfo.infoMsgCode[0].includes('required')
            ) && <FormInputInfoTooltipComponent fieldInfo={fieldInfo} />}

            <Box className='jsonDetailsFieldTextValueContainer'>
              { enableLoadFromShape && renderLoadShapeFileBtn() }
              { geoJsonWarning !== '' && 
                <Box className="warningContainer">
                  <Typography
                    tag="span"
                    dangerouslySetInnerHTML={{__html: geoJsonWarning}}
                  />
                </Box>
              }
            </Box>
          </Box>
          { enableMapPreview && 
            <GeoJsonMapValuePresentorComponent mode={mode} jsonValue={jsonValue} style={{width: '40%', height: '200px'}} fitOptions={{padding:[10,20,10,20], duration: 300}}/>
          }
        </Box>
      </>
    );
  }
};
