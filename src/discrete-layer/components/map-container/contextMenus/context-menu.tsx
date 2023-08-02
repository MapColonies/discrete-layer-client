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
import { ActionSpreadPreference, SeparatorPosition } from '../../../../common/actions/context.actions';
import { MenuItem, MenuItemsList, isMenuItemGroup } from '../../../models/mapMenusManagerStore';
import TooltippedValue from '../../../../common/components/form/tooltipped.value';

export const TITLE_HEIGHT = 24;
export const SUB_MENU_MAX_HEIGHT = 120;
export const MENU_HEIGHT_PADDING = 20;

export type ContextMenuItemRenderer = (item: MenuItem) => React.JSX.Element;

interface IMapContextMenuData extends IContextMenuData {
  menuTitle?: string;
  menuTitleTooltip?: string;
  menuTitleComponent?: React.ReactNode;
  getItemRenderer: ContextMenuItemRenderer;
  menuItems?: MenuItemsList;
  contextMenuId?: string;
}

const DEFAULT_CONTEXT_MENU_ID = 'MENU_ID';

// Children prop isn't rendered as a part of the menu, but as a separated bottom section.
export const ContextMenu: React.FC<PropsWithChildren<IMapContextMenuData>> = ({
  position,
  // coordinates,
  style,
  size,
  handleClose,
  menuItems,
  getItemRenderer,
  menuTitle = '',
  menuTitleTooltip = '',
  menuTitleComponent,
  children,
  data,
  contextEvt,
  contextMenuId = DEFAULT_CONTEXT_MENU_ID,
}) => {
  const intl = useIntl();
  const imageryContextMenuRef = useRef(null);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const direction = CONFIG.I18N.DEFAULT_LANGUAGE.toUpperCase() === 'HE' ? 'rtl' : 'ltr';

  const { show, hideAll } = useContextMenu({
    id: contextMenuId,
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
      setTimeout(() => {
        show({ event: contextEvt });
      }, 0)
    }
  });

  const MenuItemWithSeparator: React.FC<
    PropsWithChildren<{
      separator?: SeparatorPosition;
      separatorKeySuffix?: string;
      showSeparatorBefore?: boolean;
      showSeparatorAfter?: boolean;
    }>
  > = ({
    separator,
    separatorKeySuffix,
    showSeparatorBefore,
    showSeparatorAfter,
    children,
  }) => {
    return (
      <>
        {separator === 'BEFORE' && showSeparatorBefore && (
          <Separator key={`separator_before_${separatorKeySuffix}`} />
        )}

        {children}

        {separator === 'AFTER' && showSeparatorAfter && (
          <Separator key={`separator_after_${separatorKeySuffix}`} />
        )}
      </>
    );
  };

  const renderMenuContent = (items?: MenuItemsList): React.JSX.Element[] | null => {
    const itemsList = items ?? menuItems;

    if(!itemsList || !itemsList.length) return null;

    return itemsList.map((menuItemOrGroup, idx) => {
      const nextItem = itemsList[idx + 1];
      const itemBefore = itemsList[idx - 1];
      
      // For separators logic
      const isLastItem = idx === itemsList.length - 1;
      const isFirstItem = idx === 0;
      const isNextItemEmpty = isMenuItemGroup(nextItem) && nextItem.items.length === 0;
      const isItemBeforeEmpty = isMenuItemGroup(itemBefore) && itemBefore.items.length > 0;
      const isEmptyItem = isMenuItemGroup(menuItemOrGroup) && menuItemOrGroup.items.length === 0;

      // Not first item, item before not empty
      const showSeparatorBefore = !isEmptyItem && !isFirstItem && !isItemBeforeEmpty;

      // Not last item, not empty item, item after not empty
      const showSeparatorAfter = !isEmptyItem && !isLastItem && !isNextItemEmpty;

      if(!isMenuItemGroup(menuItemOrGroup)) {
        const itemElement = getItemRenderer(menuItemOrGroup);

        // Get click callback from item
        const menuItemClick = (itemElement.props as Record<string, unknown>).onClick ?? ((): void => { return });
        const menuItemDisabled = (itemElement.props as Record<string, unknown>).disabled ?? false;

        return (
          <>
            <MenuItemWithSeparator
              separatorKeySuffix={`${idx}`}
              separator={menuItemOrGroup.action.separator}
              showSeparatorBefore={showSeparatorBefore}
              showSeparatorAfter={showSeparatorAfter}
            >
              <Item
                className="imageryMenuItemAction"
                key={`imageryMenuItemAction_${menuItemOrGroup.title}_${idx}`}
                onClick={({ event }) =>
                  (menuItemClick as MouseEventHandler<HTMLElement>)(
                    event as React.MouseEvent<HTMLElement>
                  )
                }
                disabled={menuItemDisabled as boolean}
              >
                {itemElement}
              </Item>
            </MenuItemWithSeparator>
          </>
        );
      } else {
        const groupProps = menuItemOrGroup.groupProps;
        let groupToRender: JSX.Element;

        // Spread sections by preferences
        const shouldPresentAsMenu =
          groupProps?.actionsSpreadPreference === ActionSpreadPreference.MENU &&
          menuItemOrGroup.items.length >= (groupProps.minimumItemsInMenu ?? 0);
        
          const menuTitle = (
            <TooltippedValue disableTooltip className={"contextMenuLabel"}>
              {intl.formatMessage({
                id: groupProps.titleTranslationId ?? 'Sub Menu',
              })}
            </TooltippedValue>
          );


        if (shouldPresentAsMenu) {
          groupToRender = (
            <>
              <Submenu key={`imageryMenuGroupItems_${menuItemOrGroup.groupProps.id}`} dir={direction} label={menuTitle}>
                {renderMenuContent(menuItemOrGroup.items)}
              </Submenu>
            </>
          );
        } else {
          groupToRender = (
            <>
              {renderMenuContent(menuItemOrGroup.items)}
            </>
          );
        }

        return (
          <>
            <MenuItemWithSeparator
              separatorKeySuffix={`${menuItemOrGroup.groupProps.id}`}
              separator={menuItemOrGroup.groupProps.separator}
              showSeparatorBefore={showSeparatorBefore}
              showSeparatorAfter={showSeparatorAfter}
            >
              {groupToRender}
            </MenuItemWithSeparator>
          </>
        ); 
      }
    });
  }

  const menuContent = useMemo(renderMenuContent, [menuItems]);

  return (
    <>
      {/* {menuSections && hasSections && sectionsProps && ( */}
      {menuItems && (
        <div
          ref={imageryContextMenuRef}
          style={style}
          className="imageryContextMenuTheme imageryContextMenu"
          onContextMenu={(e): void => e.preventDefault()}
        >
          {(menuTitle || menuTitleComponent) && (
            <Box
              style={{ height: `${TITLE_HEIGHT}px` }}
              className="titleContainer"
            >
              <Box className="imageryContextMenuTitle">
                {menuTitleComponent ? (
                  menuTitleComponent
                ) : (
                  <>
                    {`${menuTitle} `}
                    {menuTitle && menuTitleTooltip && (
                      <Tooltip content={menuTitleTooltip}>
                        <Icon
                          className="imageryContextMenuTitleInfo"
                          icon={{ icon: 'info', size: 'small' }}
                        />
                      </Tooltip>
                    )}
                  </>
                )}
              </Box>
            </Box>
          )}

          <MCContextMenu
            isContainerized
            onVisibilityChange={setIsContextMenuVisible}
            animation={false}
            id={contextMenuId}
            dir={direction}
          >
            {menuContent}
          </MCContextMenu>
          <Box
            style={{
              maxHeight: `${SUB_MENU_MAX_HEIGHT}px`,
              overflow: 'hidden',
            }}
            className="subMenuContainer"
          >
            {children}
          </Box>
        </div>
      )}
    </>
  );
};
