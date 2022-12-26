import { IContextMenuData } from '@map-colonies/react-components';
import { Button, CircularProgress } from '@map-colonies/react-core';
import React, { useCallback, useState } from 'react';
import { useStore } from '../../../models';
import { IDispatchAction } from '../../../models/actionDispatcherStore';
import { MenuItemsList } from '../../../models/mapMenusManagerStore';
import { getCoordinatesDisplayText } from '../../layer-details/utils';
import { ContextMenu } from './context-menu';

import './actions.context-menu.css';

interface IActionsContextMenuProps extends IContextMenuData {
  menuItems?: MenuItemsList;
}

export const COORDS_DISPLAY_PRECISION = 5;

export const ActionsContextMenu: React.FC<IActionsContextMenuProps> = ({
  menuItems,
  ...restProps
}) => {
  const { handleClose, coordinates } = restProps;
  const store = useStore();
  const [currentClickedItem, setCurrentClickedItem] = useState<string>();

  const dispatchAction = useCallback((action: IDispatchAction): void => {
    store.actionDispatcherStore.dispatchAction({
      action: action.action,
      data: action.data,
    } as IDispatchAction);
  }, []);


  const onItemClick = (itemTitle: string, action: IDispatchAction): void => {
    if (typeof currentClickedItem === 'undefined') {
      dispatchAction(action);
      setCurrentClickedItem(itemTitle);
    }
  }

  const getMenuSections = (): JSX.Element[][] | undefined => {
    return menuItems?.map((section) => {
      return section.map((item) => {
        
        const actionToDispatch = {
          action: item.action.action,
          data: { ...item.payloadData, coordinates, handleClose }
        };
  
        return (
          <Button className='actionsMenuItem' disabled={typeof currentClickedItem !== 'undefined'} onClick={(): void => onItemClick(item.title, actionToDispatch)}>
            { item.title }
            { currentClickedItem === item.title && <CircularProgress className='actionsMenuItemLoading' /> }
          </Button>
        );
      });
    });
  };


  return (
        <ContextMenu
          menuTitle={getCoordinatesDisplayText(coordinates.latitude, coordinates.longitude)}
          menuSections={getMenuSections()}
          {...restProps}
        />
  );
};
