import React from 'react';
import { Menu, MenuItem, MenuSurfaceAnchor } from '@map-colonies/react-core';
import { Box, IContextMenuData } from '@map-colonies/react-components';

const EMPTY = 0;

export const ContextMenu: React.FC<IContextMenuData> = ({
  style,
  data,
  handleClose,
}) => {
  const layerId =
    data[0]?.meta !== undefined
      ? ((data[0]?.meta as Record<string, unknown>).id as string)
      : '';

  const handleAction = (
    action: string,
    data: Record<string, unknown>[]
  ): void => {
    console.log(`ACTION: ${action}`);
    console.log('DATA:', data);
  };

  return (
    <>
      {data.length > EMPTY && (
        <Box className="container" style={style}>
          {data.length > 1 && (
            <h3>
              Overlapping <span style={{ color: 'red' }}>{data.length}</span>{' '}
              layers
            </h3>
          )}
          <MenuSurfaceAnchor id="actionsMenuContainer">
            <Menu
              open={true}
              onClose={(evt) => handleClose()}
              onMouseOver={(evt) => evt.stopPropagation()}
            >
              {['TOP', 'UP', 'DOWN', 'BOTTOM'].map((action) => {
                return (
                  <MenuItem key={`imageryMenuItemAction_${action}`}>
                    <Box
                      className="imageryMenuItem"
                      onClick={(evt): void => {
                        handleAction(action, data);
                      }}
                    >
                      {`${layerId} ${action}`}
                    </Box>
                  </MenuItem>
                );
              })}
            </Menu>
          </MenuSurfaceAnchor>
        </Box>
      )}
      {data.length === EMPTY && <Box style={style}></Box>}
    </>
  );
};