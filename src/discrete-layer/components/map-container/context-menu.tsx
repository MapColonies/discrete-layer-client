import React, { MouseEventHandler, useEffect, useRef } from 'react';
import { get } from 'lodash';
import {
  Icon,
  ListDivider,
  Menu,
  MenuItem,
  MenuSurfaceAnchor,
  Tooltip,
} from '@map-colonies/react-core';
import { Box, IContextMenuData } from '@map-colonies/react-components';

import './context-menu.css';

const TITLE_HEIGHT = 24;
const SUB_TITLE_HEIGHT = 24;
const MARGIN_HEIGHT = 20;

interface IMapContextMenuData extends IContextMenuData {
  menuTitle?: string;
  menuTitleTooltip?: string;
  menuSections: JSX.Element[][];
}

// Children prop isn't rendered as a part of the menu, but as a separated bottom section.
export const ContextMenu: React.FC<IMapContextMenuData> = ({
  position,
  coordinates,
  style,
  size,
  handleClose,
  menuSections,
  menuTitle = '',
  menuTitleTooltip = '',
  children,
  data
}) => {
  const imageryContextMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      /* eslint-disable */
      const target: any = event.target;
      const imgContextMenuRef: any = get(imageryContextMenuRef, 'current');
      if (imgContextMenuRef && !imgContextMenuRef.contains(target)) {
        document.removeEventListener('click', handleClickOutside, false);
        handleClose();
      }
      /* eslint-enable */
    };

    document.addEventListener('click', handleClickOutside, false);
  });

  const baseStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`,
  };

  return (
    <>
      {
        <div
          ref={imageryContextMenuRef}
          style={{ ...baseStyle }}
          className="imageryContextMenuTheme imageryContextMenu"
        >
          <Box className='titleContainer'>
            {menuTitle && (
              <Box className="imageryContextMenuTitle">{`${menuTitle} `}</Box>
            )}
            {menuTitle && menuTitleTooltip && (
              <Tooltip content={menuTitleTooltip}>
                <Icon
                  className="imageryContextMenuTitleInfo"
                  icon={{ icon: 'info', size: 'small' }}
                />
              </Tooltip>
            )}
          </Box>

          <MenuSurfaceAnchor
            className='menuAnchor'
            // style={{
            //   height: `calc(${
            //     (size as Record<string, number>).height
            //   }px - ${TITLE_HEIGHT}px - ${SUB_TITLE_HEIGHT}px - ${MARGIN_HEIGHT}px)`,
            // }}
          >
            <Menu open={true} className="imageryMenu">
              {menuSections.map((section, sectionIdx) => {        
                 const sectionItems = section.map((item, itemIdx) => {
                    // Get click callback from item
                    const menuItemClick = (item.props as Record<string, unknown>).onClick ?? ((): void => { return });
                    return (
                      <MenuItem
                        key={`imageryMenuItemAction_${sectionIdx}_${itemIdx}`}
                        onClick={menuItemClick as MouseEventHandler<HTMLElement> | MouseEventHandler<HTMLDivElement>}
                      >
                        {item}
                      </MenuItem>
                    )
                  });

                  const lastSectionIdx = menuSections.length - 1;
                  if(sectionIdx < lastSectionIdx && section.length) {
                    sectionItems.push(<ListDivider className='sectionDivider'/>);
                  }

                  return sectionItems;
              })}
                
            </Menu>
          </MenuSurfaceAnchor>
          {children}
        </div>
      }
    </>
  );
};
