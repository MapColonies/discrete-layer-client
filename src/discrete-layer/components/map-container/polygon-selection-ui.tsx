import React from 'react';
import { Polygon } from 'geojson';
import { Menu, MenuItem, Button, Drawer, DrawerContent } from '@map-colonies/react-core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Box, DrawType } from '@map-colonies/react-components';
import { FormattedMessage } from 'react-intl';
import { DialogBBox } from './dialog-bbox';

const WIDTH_SPACING_FACTOR = 18;
const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    drawingButton: {
      width: theme.spacing(WIDTH_SPACING_FACTOR),
    },
    fullWidth: {
      width: '100%',
    },
  })
);

export interface PolygonSelectionUiProps {
  isSelectionEnabled: boolean;
  mapActionsWidth: string;
  onStartDraw: (type: DrawType) => void;
  onCancelDraw: () => void;
  onReset: () => void;
  onPolygonUpdate: (polygon: Polygon) => void;
  handleOtherDrawers: () => void;
}

export const PolygonSelectionUi: React.FC<PolygonSelectionUiProps> = (
  props
) => {
  const classes = useStyle();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const {
    isSelectionEnabled,
    onCancelDraw,
    onStartDraw,
    onReset,
    onPolygonUpdate,
    handleOtherDrawers,
    mapActionsWidth,
  } = props;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(!menuOpen);
    handleOtherDrawers();
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const [open, setOpen] = React.useState(false);

  if (isSelectionEnabled) {
    return (
      <Button className={classes.drawingButton} raised onClick={onCancelDraw}>
        <FormattedMessage id="polygon-selection.cancel-btn.text" />
      </Button>
    );
  } else {
    return (
      <Box position="relative">
        <Button
          className={classes.drawingButton}
          outlined
          theme={['primaryBg', 'onPrimary']}
          onClick={handleClick}
        >
          <FormattedMessage id="polygon-selection.draw-btn.text" />
        </Button>
        <DialogBBox
          isOpen={open}
          onSetOpen={setOpen}
          onPolygonUpdate={onPolygonUpdate}
        ></DialogBBox>
        <Box style={{
          height:'150px', 
          width: mapActionsWidth, 
          position:'absolute',
          left: '-8px',
          top: '50px'}}
        >
          <Drawer dismissible style={{width:'100%'}} open={Boolean(anchorEl) && menuOpen}>
            <DrawerContent >
              <Menu
                className={classes.fullWidth}
                open={true}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={(): void => {
                    onStartDraw(DrawType.BOX);
                    handleClose();
                  }}
                >
                  <FormattedMessage id="polygon-selection.box-menu_option.text" />
                </MenuItem>
                <MenuItem
                  onClick={(): void => {
                    setOpen(true);
                  }}
                >
                  <FormattedMessage id="polygon-selection.box_coorinate-menu_option.text" />
                </MenuItem>
                <MenuItem
                  onClick={(): void => {
                    onReset();
                    handleClose();
                  }}
                >
                  <FormattedMessage id="polygon-selection.clear-menu_option.text" />
                </MenuItem>
              </Menu>
            </DrawerContent>
          </Drawer>
        </Box>
      </Box>
    );
  }
};
