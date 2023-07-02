import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash';
import { Geometry } from 'geojson';
import shp, { FeatureCollectionWithFilename, parseShp } from 'shpjs';
import { useDebouncedCallback } from 'use-debounce';
import { Button, TextField } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { emphasizeByHTML } from '../../../../common/helpers/formatters';
import { Mode } from '../../../../common/models/mode.enum';
import TooltippedValue from '../../../../common/components/form/tooltipped.value';
import { IRecordFieldInfo } from '../layer-details.field-info';
import { EntityFormikHandlers } from '../layer-datails-form';
import { importShapeFileFromClient } from '../utils';
import { FormInputInfoTooltipComponent } from './form.input.info.tooltip';

import './json.value-presentor.css';

const NONE = 0;
const REMOVE_ERROR_DELAY = 300;

interface JsonValuePresentorProps {
  mode: Mode;
  fieldInfo: IRecordFieldInfo;
  value?: string;
  formik?: EntityFormikHandlers;
  type?: string;
  enableLoadFromShape?: boolean;
}

export const JsonValuePresentorComponent: React.FC<JsonValuePresentorProps> = ({
  mode,
  fieldInfo,
  value,
  formik,
  type,
  enableLoadFromShape = false
}) => {
  const [jsonValue, setJsonValue] = useState(JSON.stringify(value ?? {}));
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
                  setJsonValue('{}');
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
    const stringifiedValue = JSON.stringify(value);
    return (
      <TooltippedValue tag="div" className="detailsFieldValue">
        {stringifiedValue}
      </TooltippedValue>
    );
  } else {
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
      formik.setFieldTouched(fieldInfo.fieldName as string, true, false);

      let formikValue: unknown = undefined;

      try {
        if (jsonValue === '{}' && (fieldInfo.isRequired as boolean)) {
          throw new Error('Required field');
        }

        formikValue = JSON.parse(jsonValue) as unknown;
        formik.setFieldValue(fieldInfo.fieldName as string, formikValue);

        removeStatusErrors();
      } catch (err) {
        const error = {
          id: `validation-field.${fieldInfo.fieldName as string}.json`,
        };
        const isFieldRequired = fieldInfo.isRequired as boolean;

        if (isFieldRequired || jsonValue.length > NONE) {
          if (isFieldRequired && (jsonValue.length === NONE || jsonValue === '{}')) {
            error.id = 'validation-general.required';
          }
          const errorMsg = intl.formatMessage(error, {
            fieldName: emphasizeByHTML(
              `${intl.formatMessage({ id: fieldInfo.label })}`
            ),
          });

          formik.setStatus({
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
        <Box className="detailsFieldValue">
          <TextField
            ref={fieldRef}
            id={fieldInfo.fieldName as string}
            name={fieldInfo.fieldName as string}
            type={type}
            value={jsonValue === '{}' ? '' : jsonValue}
            onChange={(e): void => {
              setJsonValue(e.currentTarget.value);
              debouncedRemoveStatusErrors();
            }}
            onBlur={handleBlur}
            placeholder={'JSON'}
            required={fieldInfo.isRequired as boolean}
            textarea
            rows={4}
          />
          {!(
            fieldInfo.infoMsgCode?.length === 1 &&
            fieldInfo.infoMsgCode[0].includes('required')
          ) && <FormInputInfoTooltipComponent fieldInfo={fieldInfo} />}

          { enableLoadFromShape && renderLoadShapeFileBtn() }
        </Box>
      </>
    );
  }
};
