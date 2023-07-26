import React, { MouseEventHandler, PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';
import { get } from 'lodash';
import {
  Icon,
  Tooltip,
  ContextMenu as MCContextMenu,
  Item,
  Separator,
  Submenu,
  useContextMenu
} from '@map-colonies/react-core';
import { Box, IContextMenuData } from '@map-colonies/react-components';
import CONFIG from '../../../../common/config';
import './context-menu.css';
import { useIntl } from 'react-intl';
import { ActionSpreadPreference, ContextActionGroupProps } from '../../../../common/actions/context.actions';

export const TITLE_HEIGHT = 24;
export const SUB_MENU_MAX_HEIGHT = 120;
export const MENU_HEIGHT_PADDING = 20;

interface IMapContextMenuData extends IContextMenuData {
  menuTitle?: string;
  menuTitleTooltip?: string;
  menuSections?: JSX.Element[][];
  sectionsProps?: ContextActionGroupProps[];
}

const NONE = 0;

// Children prop isn't rendered as a part of the menu, but as a separated bottom section.
export const ContextMenu: React.FC<PropsWithChildren<IMapContextMenuData>> = ({
  position,
  // coordinates,
  style,
  size,
  handleClose,
  menuSections,
  menuTitle = '',
  menuTitleTooltip = '',
  sectionsProps,
  children,
  data,
  contextEvt,
}) => {
  const intl = useIntl();
  const imageryContextMenuRef = useRef(null);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const direction = CONFIG.I18N.DEFAULT_LANGUAGE.toUpperCase() === 'HE' ? 'rtl' : 'ltr';

  const { show, hideAll } = useContextMenu({
    id: 'MENU_ID',
    locale: {
      dir: direction
    }
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      /* eslint-disable */
      const target: any = event.target;
      const imgContextMenuRef: any = get(imageryContextMenuRef, 'current');
      if (imgContextMenuRef && !imgContextMenuRef.contains(target)) {
        document.removeEventListener('click', handleClickOutside, false);
        handleClose();
        hideAll();
      }
      /* eslint-enable */
    };

    document.addEventListener('click', handleClickOutside, false);
    
    if(!isContextMenuVisible) {
      show({ event: contextEvt });
    }
  });

  const hasSections = useMemo(
    () => (menuSections?.length ?? NONE) > NONE,
    [menuSections]
  );

  const renderMenuContent = useMemo(() => {
    if(!menuSections || !sectionsProps) return null;

     return menuSections.map((section, sectionIdx) => {   

      const sectionProps = sectionsProps[sectionIdx] ?? null;
      const sectionId = sectionProps.id;
      const menuTitle = intl.formatMessage({ id: sectionProps.titleTranslationId ?? 'Section Title' });

      const sectionItems = section.map((item, itemIdx) => {
        // Get click callback from item
        const menuItemClick = (item.props as Record<string, unknown>).onClick ?? ((): void => { return });
        const menuItemDisabled = (item.props as Record<string, unknown>).disabled ?? false;

        return (
          <Item
            className='imageryMenuItemAction'
            key={`imageryMenuItemAction_${sectionIdx}_${itemIdx}`}
            onClick={({event}) => (menuItemClick as MouseEventHandler<HTMLElement>)(event as React.MouseEvent<HTMLElement>)}
            disabled={menuItemDisabled as boolean}
          >
            {item}
          </Item>
        )
      });
      
      const lastSectionIdx = menuSections.length - 1;
      let sectionToRender: JSX.Element | JSX.Element[];    

      // Spread sections by preferences
      const shouldPresentAsMenu = sectionProps?.actionsSpreadPreference === ActionSpreadPreference.MENU && sectionItems.length >= (sectionProps.minimumItemsInMenu ?? 0);
      if(shouldPresentAsMenu) {
          sectionToRender = [<Submenu key={`submenu_${sectionId}`} dir={direction} label={menuTitle}>{sectionItems}</Submenu>];
      } else {
        sectionToRender = sectionItems.map((item, idx) => {
          return React.cloneElement(item, {key: `sectionItem_${sectionId}_${idx}`});
        });
      }

      return (
        <>
          {sectionToRender}
          {sectionIdx < lastSectionIdx && section.length > 0 && (
            <Separator key={`sectionDivider_${sectionId}}`} />
          )}
        </>
      );

    })
  }, [menuSections]);

  return (
    <>
      {menuSections && hasSections && sectionsProps && (
        <div
          ref={imageryContextMenuRef}
          style={style}
          className="imageryContextMenuTheme imageryContextMenu"
          onContextMenu={(e): void => e.preventDefault()}
        >
          {menuTitle && (
            <Box
              style={{ height: `${TITLE_HEIGHT}px` }}
              className="titleContainer"
            >
              <Box className="imageryContextMenuTitle">{`${menuTitle} `}</Box>
              {menuTitle && menuTitleTooltip && (
                <Tooltip content={menuTitleTooltip}>
                  <Icon
                    className="imageryContextMenuTitleInfo"
                    icon={{ icon: 'info', size: 'small' }}
                  />
                </Tooltip>
              )}
            </Box>
          )}

          <MCContextMenu
            isContainerized
            onVisibilityChange={setIsContextMenuVisible}
            animation={false}
            id={'MENU_ID'}
            dir={direction}
          >
            {renderMenuContent}
          </MCContextMenu>
          <Box
            style={{ maxHeight: `${SUB_MENU_MAX_HEIGHT}px` }}
            className="subMenuContainer"
          >
            {children}
          </Box>
        </div>
      )}
    </>
  );
};
