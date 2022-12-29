import { IContextMenuData, Box } from '@map-colonies/react-components';
import { Button, CircularProgress, Icon } from '@map-colonies/react-core';
import React, { useCallback, useState } from 'react';
import { useStore } from '../../../models';
import { IDispatchAction } from '../../../models/actionDispatcherStore';
import { MenuItemsList } from '../../../models/mapMenusManagerStore';
import { getCoordinatesDisplayText } from '../../layer-details/utils';
import { ContextMenu } from './context-menu';

import './actions.context-menu.css';
import { useIntl } from 'react-intl';

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
  const intl = useIntl();
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
          <Box className='actionsMenuItem' onClick={(): void => onItemClick(item.title, actionToDispatch)}>
            {typeof item.icon !== 'undefined' && <Icon className="featureIcon" icon={{ icon: item.icon, size: 'small' }} />}
            { intl.formatMessage({ id: item.title }) }
            { currentClickedItem === item.title && <CircularProgress className='actionsMenuItemLoading' /> }
          </Box>
        );
      });
    });
  };


  return (
        <ContextMenu
          menuTitle={intl.formatMessage({ id: 'map-context-menu.title' })}
          menuSections={getMenuSections()}
          {...restProps}
        >
          <Box className="coordinatesContainer">
            {getCoordinatesDisplayText(coordinates.latitude, coordinates.longitude)}
          </Box>
        </ContextMenu>
  );
};
