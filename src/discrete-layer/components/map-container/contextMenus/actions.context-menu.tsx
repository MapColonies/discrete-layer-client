import React, { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { IContextMenuData, Box } from '@map-colonies/react-components';
import { CircularProgress, Icon, Typography } from '@map-colonies/react-core';
import { useStore } from '../../../models';
import { IDispatchAction } from '../../../models/actionDispatcherStore';
import { IMapMenuProperties, MapMenusIds, MenuItem, MenuItemsList } from '../../../models/mapMenusManagerStore';
import { getCoordinatesDisplayText } from '../../layer-details/utils';
import { ContextMenu } from './context-menu';

import './actions.context-menu.css';
import { useHeightFromTerrain } from '../../../../common/hooks/useHeightFromTerrain';
import { ContextActionsGroupTemplates } from '../../../../common/actions/context.actions';
import useGetMenuProperties from '../../../../common/hooks/mapMenus/useGetMenuProperties.hook';

interface IActionsContextMenuProps extends IContextMenuData {}


export const COORDS_DISPLAY_PRECISION = 1;
const FIRST = 0;

export const ActionsContextMenu: React.FC<IActionsContextMenuProps> = (props) => {
  const { handleClose, coordinates } = props;
  const store = useStore();
  const intl = useIntl();
  const [currentClickedItem, setCurrentClickedItem] = useState<string>();
  const heightsAtCoordinates = useHeightFromTerrain({ position: [{ ...coordinates }] });
  const menuProperties = useGetMenuProperties(MapMenusIds.ActionsMenu);

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

  // const handleTemplateGroups = (
  //     menuItems?: MenuItemsList,
  //     groupsProps?: ContextActionGroupProps[]
  // ): CompleteMenuItemsAndProps | undefined => {
  //     if (!menuItems || !groupsProps) return;

  //     console.log('here?')
  //     const menuItemsWithDynamicTemplates: MenuItemsList = [];
  //     const groupsPropsWithDynamicTemplateProps: ContextActionGroupProps[] = [];
  //     const menuGroupTemplates: {
  //         templateProps: ContextActionGroupProps;
  //         items: MenuItem[];
  //     }[] = [];

  //     // Separate template groups from regular static groups
  //     menuItems.forEach((section, sectionIdx) => {
  //         const sectionProps = groupsProps[sectionIdx];
  //         if (sectionProps.templateId) {
  //             menuGroupTemplates.push({
  //                 templateProps: sectionProps,
  //                 items: section
  //             });
  //         } else {
  //             // Add static groups directly to final items, preserving original order.
  //             menuItemsWithDynamicTemplates[sectionProps.order] = section;
  //             groupsPropsWithDynamicTemplateProps[sectionProps.order] = sectionProps;
  //         }
  //     });

  //     // Handle template groups logic by id, add templated groups and props to general arrays.
  //     menuGroupTemplates.forEach((template) => {
  //         switch (template.templateProps.templateId) {
  //             case ContextActionsGroupTemplates.ACTIVE_LAYERS_IN_POSITION: {
  //                 const numberOfDuplicates = 5;

  //                 for (let i = 0; i < numberOfDuplicates; i++) {
  //                     const templatedGroupProps: ContextActionGroupProps = {
  //                         ...template.templateProps,
  //                         id: template.templateProps.id + i,
  //                         order: template.templateProps.order + i,
  //                         titleTranslationId: `${template.templateProps.titleTranslationId}_${i}`,
  //                     };
  //                     groupsPropsWithDynamicTemplateProps.splice(templatedGroupProps.order, 0, templatedGroupProps);
  //                     menuItemsWithDynamicTemplates.splice(templatedGroupProps.order, 0, template.items);
  //                 }
  //                 break;
  //             }
  //             default:
  //                 break;
  //         }
  //     });

  //     return {
  //         groupsProps: groupsPropsWithDynamicTemplateProps,
  //         menuItems: menuItemsWithDynamicTemplates
  //     };
  // };

  // const { groupsProps, menuItems: completeMenuItems } =
  //   useMemo<CompleteMenuItemsAndProps>(
  //     () =>
  //       handleTemplateGroups(
  //         menuItems ?? menuProperties?.itemsList,
  //         menuProperties?.groupsProps
  //       ) as CompleteMenuItemsAndProps,
  //     [props.contextEvt]
  //   );


  // const getMenuSections = (): JSX.Element[][] | undefined => {    
  //   return menuItems?.map((section) => {
  //     return section.map((item) => {

  //       const actionToDispatch = {
  //         action: item.action.action,
  //         data: { ...item.payloadData, coordinates, handleClose }
  //       };
  
  //       return (
  //         <Box className='actionsMenuItem' onClick={(): void => onItemClick(item.title, actionToDispatch)}>
  //           {typeof item.icon !== 'undefined' && <Icon className={`featureIcon ${item.icon}`} />}
  //           { intl.formatMessage({ id: item.title }) }
  //           { currentClickedItem === item.title && <CircularProgress className='actionsMenuItemLoading' /> }
  //         </Box>
  //       );
  //     });
  //   });
  // };

  const getHeightText = (): string => {
    const coordinateHeight = heightsAtCoordinates.newPositions?.[FIRST].height;

    if(typeof coordinateHeight !== 'undefined' && !isNaN(coordinateHeight)) {
      return `${coordinateHeight.toFixed(COORDS_DISPLAY_PRECISION)} ${intl.formatMessage({ id: 'actions.meter.sign' })}`;
    }

    return `N/A`;
  }

  return (
        <ContextMenu
          // menuSections={getMenuSections()}
          {...props}
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
