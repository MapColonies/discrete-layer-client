import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { IContextMenuData, Box } from '@map-colonies/react-components';
import { CircularProgress, Icon, Typography } from '@map-colonies/react-core';
import { useStore } from '../../../models';
import { IDispatchAction } from '../../../models/actionDispatcherStore';
import { IMapMenuProperties, MenuItemsList } from '../../../models/mapMenusManagerStore';
import { getCoordinatesDisplayText } from '../../layer-details/utils';
import { ContextMenu } from './context-menu';

import './actions.context-menu.css';
import { useHeightFromTerrain } from '../../../../common/hooks/useHeightFromTerrain';

interface IActionsContextMenuProps extends IContextMenuData {
  menuItems?: MenuItemsList;
  menuProperties?: IMapMenuProperties;
}

export const COORDS_DISPLAY_PRECISION = 1;
const FIRST = 0;

export const ActionsContextMenu: React.FC<IActionsContextMenuProps> = ({
  menuItems,
  menuProperties,
  ...restProps
}) => {
  const { handleClose, coordinates } = restProps;
  const store = useStore();
  const intl = useIntl();
  const [currentClickedItem, setCurrentClickedItem] = useState<string>();
  const heightsAtCoordinates = useHeightFromTerrain({ position: [{ ...coordinates }] });

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
    // If passed sections directly, use it, else use the items list from menuProperties
    const items = menuItems ?? menuProperties?.itemsList;
    
    return items?.map((section) => {
      return section.map((item) => {

        const actionToDispatch = {
          action: item.action.action,
          data: { ...item.payloadData, coordinates, handleClose }
        };
  
        return (
          <Box className='actionsMenuItem' onClick={(): void => onItemClick(item.title, actionToDispatch)}>
            {typeof item.icon !== 'undefined' && <Icon className={`featureIcon ${item.icon}`} />}
            { intl.formatMessage({ id: item.title }) }
            { currentClickedItem === item.title && <CircularProgress className='actionsMenuItemLoading' /> }
          </Box>
        );
      });
    });
  };

  const getHeightText = (): string => {
    const coordinateHeight = heightsAtCoordinates.newPositions?.[FIRST].height;

    if(typeof coordinateHeight !== 'undefined' && !isNaN(coordinateHeight)) {
      return `${coordinateHeight.toFixed(COORDS_DISPLAY_PRECISION)} ${intl.formatMessage({ id: 'actions.meter.sign' })}`;
    }

    return `N/A`;
  }

  return (
        <ContextMenu
          sectionsProps={menuProperties?.groupsProps}
          menuSections={getMenuSections()}
          {...restProps}
        >
          <Box className="contextMenuFooter">
            <Box className="coordinatesContainer">
              <Icon className='menuIcon mc-icon-Location-Full' />
              {getCoordinatesDisplayText(coordinates.latitude, coordinates.longitude)}
            </Box>
            <Box className="heightContainer"> 
              <Icon className='menuIcon mc-icon-Height-DTM' />
              <Typography tag="p">
                {getHeightText()} 
              </Typography>
            </Box>
          </Box>
        </ContextMenu>
  );
};
