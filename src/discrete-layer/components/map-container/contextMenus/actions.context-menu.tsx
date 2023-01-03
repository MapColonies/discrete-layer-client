import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { IContextMenuData, Box } from '@map-colonies/react-components';
import { CircularProgress, Icon, Typography } from '@map-colonies/react-core';
import CreateSvgIconLocationOn from '@material-ui/icons/LocationOn';
import CreateSvgIconTerrain from '@material-ui/icons/Terrain';
import { useStore } from '../../../models';
import { IDispatchAction } from '../../../models/actionDispatcherStore';
import { MenuItemsList } from '../../../models/mapMenusManagerStore';
import { getCoordinatesDisplayText } from '../../layer-details/utils';
import { ContextMenu } from './context-menu';

import './actions.context-menu.css';
import { useHeightFromTerrain } from '../../../../common/hooks/useHeightFromTerrain';

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
  const heightAtCoordinates = useHeightFromTerrain({ ...coordinates, precision: 1 });

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
            {typeof item.icon !== 'undefined' && <Icon className="glow-missing-icon featureIcon" icon={{ icon: item.icon, size: 'small' }} />}
            { intl.formatMessage({ id: item.title }) }
            { currentClickedItem === item.title && <CircularProgress className='actionsMenuItemLoading' /> }
          </Box>
        );
      });
    });
  };

  const getHeightText = (): string => {
    if(typeof heightAtCoordinates !== 'undefined' && !isNaN(heightAtCoordinates)){
      return `${heightAtCoordinates} ${intl.formatMessage({ id: 'actions.meter.sign' })}`;
    }

    return `N/A`;
  }

  return (
        <ContextMenu
          menuSections={getMenuSections()}
          {...restProps}
        >
          <Box className="contextMenuFooter">
            <Box className="coordinatesContainer">
              <CreateSvgIconLocationOn fontSize='small' className="glow-missing-icon" style={{stroke: 'currentColor', fill: 'currentColor' }} height="28" width="28" />
              {getCoordinatesDisplayText(coordinates.latitude, coordinates.longitude)}
            </Box>
            <Box className="heightContainer"> 
              <CreateSvgIconTerrain fontSize='small' className="glow-missing-icon" style={{stroke: 'currentColor', fill: 'currentColor' }} height="28" width="28" />
              <Typography tag="p">
                {getHeightText()} 
              </Typography>
            </Box>
          </Box>
        </ContextMenu>
  );
};
