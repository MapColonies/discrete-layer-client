import { Box, IContextMenuData } from '@map-colonies/react-components';
import React from 'react';
import { useStore } from '../../../models';
import { IDispatchAction } from '../../../models/actionDispatcherStore';
import { MenuItemsList } from '../../../models/mapMenusManagerStore';
import { ContextMenu } from './context-menu';

interface IActionsContextMenuProps extends IContextMenuData {
  menuItems?: MenuItemsList;
}

export const ActionsContextMenu: React.FC<IActionsContextMenuProps> = ({
  menuItems,
  ...restProps
}) => {
  const { handleClose, coordinates } = restProps;
  const store = useStore();

  const dispatchAction = (action: IDispatchAction): void => {
    store.actionDispatcherStore.dispatchAction({
      action: action.action,
      data: action.data,
    } as IDispatchAction);
  };

  const getMenuSections = (): JSX.Element[][] | undefined => {
    return menuItems?.map((section) => {
      return section.map((item) => {
        const actionToDispatch = {
          action: item.action.action,
          data: { ...item.payloadData, coordinates }
        };

        const onItemClick = (): void => {
          dispatchAction(actionToDispatch)
          handleClose();
        }

        return (
          <Box onClick={onItemClick}>
            {item.title}
          </Box>
        );
      });
    });
  };

  return (

        <ContextMenu
          menuTitle="Query Services"
          menuSections={getMenuSections()}
          {...restProps}
        />
  );
};
