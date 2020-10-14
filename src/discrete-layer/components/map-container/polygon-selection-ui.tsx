import React from 'react';
import { Polygon } from 'geojson';
import { Menu, 
  MenuItem,
  Button,
  Tooltip } from '@map-colonies/react-core';
import '@map-colonies/react-core/dist/button/styles';
import '@map-colonies/react-core/dist/tooltip/styles';
import '@map-colonies/react-core/dist/menu/styles';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { Box, DrawType } from '@map-colonies/react-components';
import { useIntl, FormattedMessage } from 'react-intl';
import { DialogBBox } from './dialog-bbox';

const WIDTH_SPACING_FACTOR = 18;
const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    drawingButton: {
      width: theme.spacing(WIDTH_SPACING_FACTOR),
    },
    fullWidth: {
      width: '100%',
      marginTop: '36px',
    },
  })
);

export interface PolygonSelectionUiProps {
  isSelectionEnabled: boolean;
  onStartDraw: (type: DrawType) => void;
  onCancelDraw: () => void;
  onReset: () => void;
  onPolygonUpdate: (polygon: Polygon) => void;
}

export const PolygonSelectionUi: React.FC<PolygonSelectionUiProps> = (
  props
) => {
  const classes = useStyle();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const intl = useIntl();
  const { isSelectionEnabled, onCancelDraw, onStartDraw, onReset, onPolygonUpdate } = props;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const [open, setOpen] = React.useState(false);

  if (isSelectionEnabled) {
    return (
      <Tooltip 
        content={intl.formatMessage({id: 'polygon-selection.cancel-btn.tooltip'})} 
        align={'bottomLeft'}
      >
        <Button className={classes.drawingButton} raised onClick={onCancelDraw}>
          <FormattedMessage id="polygon-selection.cancel-btn.text"/>
        </Button>
      </Tooltip>
    );
  } else {
    return (
      <Box position="relative">
        <Tooltip
          content={intl.formatMessage({id: 'polygon-selection.draw-btn.tooltip'})}
          align={'bottomLeft'}
        >
          <Button
            className={classes.drawingButton}
            raised
            onClick={handleClick}
          >
            <FormattedMessage id="polygon-selection.draw-btn.text"/>
          </Button>
        </Tooltip>
        <DialogBBox 
          isOpen={open}
          onSetOpen={setOpen}
          onPolygonUpdate={onPolygonUpdate}>
        </DialogBBox>
        <Menu
          className={classes.fullWidth}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            onClick={(): void => {
              onStartDraw(DrawType.BOX);
              handleClose();
            }}
          >
            <FormattedMessage id="polygon-selection.box-menu_option.text"/>
          </MenuItem>
          <MenuItem
            onClick={(): void => {
              setOpen(true);
            }}
          >
            <FormattedMessage id="polygon-selection.box_coorinate-menu_option.text"/>
          </MenuItem>
          <MenuItem
            onClick={(): void => {
              onReset();
              handleClose();
            }}
          >
            <FormattedMessage id="polygon-selection.clear-menu_option.text"/>
          </MenuItem>
        </Menu>
      </Box>
    );
  }
};
