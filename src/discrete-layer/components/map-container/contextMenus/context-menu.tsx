import React, { MouseEventHandler, useEffect, useMemo, useRef } from 'react';
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

export const TITLE_HEIGHT = 24;
export const SUB_MENU_MAX_HEIGHT = 120;
export const MENU_HEIGHT_PADDING = 20;

interface IMapContextMenuData extends IContextMenuData {
  menuTitle?: string;
  menuTitleTooltip?: string;
  menuSections?: JSX.Element[][];
}

const NONE = 0;

// Children prop isn't rendered as a part of the menu, but as a separated bottom section.
export const ContextMenu: React.FC<IMapContextMenuData> = ({
  position,
  // coordinates,
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

  const hasSections = useMemo(() => (menuSections?.length ?? NONE) > NONE, [menuSections])

  return (
    <>
      { menuSections && hasSections &&
        <div
          ref={imageryContextMenuRef}
          style={style}
          className="imageryContextMenuTheme imageryContextMenu"
        >
          <Box style={{ height: `${TITLE_HEIGHT}px` }} className='titleContainer'>
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

          <MenuSurfaceAnchor className='menuAnchor'>
            <Menu open={true} className="imageryMenu" style={{ maxHeight: (size?.height ?? MENU_HEIGHT_PADDING) + MENU_HEIGHT_PADDING }}>
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
                    sectionItems.push(<ListDivider key={`sectionDivider_${sectionIdx}}`} className='sectionDivider'/>);
                  }

                  return sectionItems;
              })}
                
            </Menu>
          </MenuSurfaceAnchor>
          <Box style={{ maxHeight: `${SUB_MENU_MAX_HEIGHT}px` }} className='subMenuContainer'>
            {children}
          </Box>
        </div>
      }
    </>
  );
};