import React, { useState } from 'react';
import { FormattedMessage, useIntl, IntlShape } from 'react-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import * as turf from '@turf/helpers';
import distance from '@turf/distance/dist/js'; //TODO: make a consumption "REGULAR"
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  IconButton,
} from '@map-colonies/react-core';
import { BboxCorner, Box, DrawType, IDrawingEvent } from '@map-colonies/react-components';
import CONFIG from '../../../common/config';
import { ValidationsError } from '../../../common/components/error/validations.error-presentor';
import { FieldLabelComponent } from '../../../common/components/form/field-label';
import { BBoxCorner, Corner } from '../bbox/bbox-corner-indicator';

import './dialog-bbox.css';

const NONE = 0;

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    errorContainer: {
      display: 'flex',
      alignItems: 'center',
      marginRight: 'auto',
      color: theme.palette.error.main,
    },
  })
);

interface BBoxCorners {
  bottomLeftLat: number;
  bottomLeftLon: number;
  topRightLat: number;
  topRightLon: number;
}

interface BBoxCornersError {
  latDistance: string;
  lonDistance: string;
}

const validate = (values: BBoxCorners, intl: IntlShape): BBoxCornersError => {
  const errors: BBoxCornersError = { latDistance: '', lonDistance: '' };

  try {
    turf.lineString([
      [values.bottomLeftLon, values.bottomLeftLat],
      [values.topRightLon, values.topRightLat],
    ]);

    const yDistance = distance(
      [values.bottomLeftLon, values.bottomLeftLat],
      [values.bottomLeftLon, values.topRightLat]
    );

    const xDistance = distance(
      [values.bottomLeftLon, values.bottomLeftLat],
      [values.topRightLon, values.bottomLeftLat]
    );

    // eslint-disable-next-line
    if (yDistance > CONFIG.BOUNDARIES.MAX_Y_KM) {
      errors.latDistance = intl.formatMessage({
        id: 'custom-bbox.form-error.y-distance.text',
      });
    }
    // eslint-disable-next-line
    if (xDistance > CONFIG.BOUNDARIES.MAX_X_KM) {
      errors.lonDistance = intl.formatMessage({
        id: 'custom-bbox.form-error.x-distance.text',
      });
    }
  } catch (err) {
    errors.latDistance = 'Not valid coordinates';
  }

  return errors;
};

interface DialogBBoxProps {
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
  onPolygonUpdate: (polygon: IDrawingEvent) => void;
}

export const DialogBBox: React.FC<DialogBBoxProps> = (props) => {
  const { isOpen, onSetOpen, onPolygonUpdate } = props;
  const classes = useStyle();
  const intl = useIntl();
  const coordinates = {
    topRightLat: 0,
    topRightLon: 0,
    bottomLeftLat: 0,
    bottomLeftLon: 0,
  };
  const yupSchema: Record<string, any> = {};
  Object.keys(coordinates).forEach(fieldName => {
    const fieldLabel = `custom-bbox.dialog-field.${fieldName}.label`;
    yupSchema[fieldName] = Yup.number().required(
      intl.formatMessage(
        { id: 'validation-general.required' },
        { fieldName: `<strong>${intl.formatMessage({ id: fieldLabel })}</strong>` }
      )
    );
  });

  const formik = useFormik({
    initialValues: coordinates,
    validationSchema: Yup.object({
      ...yupSchema
    }),
    onSubmit: (values) => {
      const err = validate(values, intl);
      if (!err.latDistance && !err.lonDistance) {
        onPolygonUpdate({
          primitive: undefined,
          type: DrawType.BOX,
          geojson: {
            type : 'FeatureCollection',
            features: [
              { 
                type : 'Feature', 
                properties : {  
                  type : BboxCorner.TOP_RIGHT,
                }, 
                geometry : { 
                  type : 'Point', 
                  coordinates : [ values.topRightLon, values.topRightLat ] 
                }
              },
              { 
                type : 'Feature', 
                properties : {  
                  type : BboxCorner.BOTTOM_LEFT
                }, 
                geometry : { 
                  type : 'Point', 
                  coordinates : [ values.bottomLeftLon, values.bottomLeftLat ]  
                }
              }
            ]
          }
        });
        handleClose(false);
        setFormErrors({
          latDistance: '',
          lonDistance: '',
        });
      } else {
        setFormErrors(err);
      }
    },
  });

  const [formErrors, setFormErrors] = useState({
    latDistance: '',
    lonDistance: '',
  });

  const handleClose = (isOpened: boolean): void => {
    onSetOpen(isOpened);
  };

  const getYupErrors = (): Record<string, string[]> => {
    const validationResults: Record<string, string[]> = {};
    Object.entries(formik.errors).forEach(([key, value]) => {
      validationResults[key] = [ value as string ];
    });
    return validationResults;
  };

  return (
    <Box id="bboxDialog">
      <Dialog open={isOpen} preventOutsideDismiss={true}>
        <DialogTitle>
          <FormattedMessage id="custom-bbox.dialog.title" />
          <IconButton
            className="closeIcon mc-icon-Close"
            label="CLOSE"
            onClick={ (): void => { handleClose(false); } }
          />
        </DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit} className="dialogBboxForm" noValidate>
            <Box className="dialogBboxRow">
              <Box className="dialogBboxField">
                <FieldLabelComponent value='custom-bbox.dialog-field.topRightLat.label' isRequired={true} showTooltip={false}></FieldLabelComponent>
                <TextField
                  name="topRightLat"
                  type="number"
                  onChange={formik.handleChange}
                  value={formik.values.topRightLat}
                  required={true}
                />
              </Box>
              <Box className="dialogBboxField">
                <FieldLabelComponent value='custom-bbox.dialog-field.topRightLon.label' isRequired={true} showTooltip={false}></FieldLabelComponent>
                <TextField
                  name="topRightLon"
                  type="number"
                  onChange={formik.handleChange}
                  value={formik.values.topRightLon}
                  required={true}
                />
              </Box>
              <BBoxCorner corner={Corner.TOP_RIGHT} className="dialogBboxField"/>
            </Box>
            <Box className="dialogBboxRow">
              <Box className="dialogBboxField">
                <FieldLabelComponent value='custom-bbox.dialog-field.bottomLeftLat.label' isRequired={true} showTooltip={false}></FieldLabelComponent>
                <TextField
                  name="bottomLeftLat"
                  type="number"
                  onChange={formik.handleChange}
                  value={formik.values.bottomLeftLat}
                  required={true}
                />
              </Box>
              <Box className="dialogBboxField">
                <FieldLabelComponent value='custom-bbox.dialog-field.bottomLeftLon.label' isRequired={true} showTooltip={false}></FieldLabelComponent>
                <TextField
                  name="bottomLeftLon"
                  type="number"
                  onChange={formik.handleChange}
                  value={formik.values.bottomLeftLon}
                  required={true}
                />
              </Box>
              <BBoxCorner corner={Corner.BOTTOM_LEFT} className="dialogBboxField"/>
            </Box>
            <Box className="footer">
              <Box className="messages">
                {
                  Object.keys(formik.errors).length > NONE && 
                  <ValidationsError errors={getYupErrors()}/>
                }
                {
                  Object.keys(formik.errors).length === NONE && (!!formErrors.latDistance || !!formErrors.lonDistance) &&
                  <div id="errorContainer" className={classes.errorContainer}>
                    {`${intl.formatMessage({ id: 'general.error.text' })}: ${
                      formErrors.latDistance
                    } ${formErrors.lonDistance}`}
                  </div>
                }
              </Box>
              <Box className="buttons">
                <Button raised type="submit" disabled={Object.keys(formik.errors).length > NONE}>
                  <FormattedMessage id="general.ok-btn.text"/>
                </Button>
                <Button type="button" onClick={ (): void => { handleClose(false); } }>
                  <FormattedMessage id="general.cancel-btn.text"/>
                </Button>
              </Box>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
