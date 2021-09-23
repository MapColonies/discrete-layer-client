import React from 'react';
import { Menu, MenuItem, MenuSurfaceAnchor } from '@map-colonies/react-core';
import { Box, IContextMenuData } from '@map-colonies/react-components';

const EMPTY = 0;

export const ContextMenu: React.FC<IContextMenuData> = ({
  style,
  data,
  handleClose,
}) => {
  const layer = data[0]?.meta as Record<string, unknown>;
  // const layerId = layer !== undefined ? layer.id ?? '' : '';
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const layerName = layer !== undefined ? (layer.details as Record<string, unknown>).name ?? '' : '';

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
        <Box style={{...style, background: 'var(--mdc-theme-surface)', position: 'absolute', borderRadius: '4px', padding: '12px', paddingBottom: '154px'}}>
          <h4>Actions on {layerName}:</h4>
          {data.length > 1 && (
            <h3>
              <span style={{ color: 'red' }}>{data.length}</span> layers overlapping
            </h3>
          )}
          <MenuSurfaceAnchor id="imageryMenuContainer">
            <Menu
              open={true}
              onClose={(evt): void => handleClose()}
              onMouseOver={(evt): void => evt.stopPropagation()}
              style={{width: '100%'}}
            >
              {['Top', 'Up', 'Down', 'Bottom'].map((action) => {
                return (
                  <MenuItem key={`imageryMenuItemAction_${action}`}>
                    <Box
                      onClick={(evt): void => {
                        handleAction(action, data);
                      }}
                    >
                      {action}
                    </Box>
                  </MenuItem>
                );
              })}
            </Menu>
          </MenuSurfaceAnchor>
        </Box>
      )}
      {data.length === EMPTY && <Box style={{...style, background: 'var(--mdc-theme-surface)', position: 'absolute', borderRadius: '4px'}}></Box>}
    </>
  );
};