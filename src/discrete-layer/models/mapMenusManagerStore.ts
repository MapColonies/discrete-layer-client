/* eslint-disable @typescript-eslint/naming-convention */
import { types, getParent } from 'mobx-state-tree';
import { ApplicationContexts, ContextActionGroupProps, ContextActionsGroupTemplates, ContextActionsTemplates, IContextAction, IContextActionGroup, isActionGroup } from '../../common/actions/context.actions';
import { ResponseState } from '../../common/models/response-state.enum';
import { ModelBase } from './ModelBase';
import { IRootStore, RootStoreType } from './RootStore';
import {GetFeatureModelType} from './GetFeatureModel';
import { WfsGetFeatureParams } from './RootStore.base';
import { IFeatureConfig, IFeatureConfigs } from '../views/components/data-fetchers/wfs-features-fetcher.component';

interface CommonMenuItem {
  templateId?: ContextActionsTemplates | ContextActionsGroupTemplates;
}
export interface MenuItem extends CommonMenuItem {
  title: string;
  action: IContextAction;
  icon?: string;
  payloadData?: Record<string, unknown>;
}

export type MenuItemsList = Array<MenuItem | MenuItemsGroup>;

export interface MenuItemsGroup extends CommonMenuItem {
  title: string;
  groupProps: ContextActionGroupProps;
  items: MenuItemsList;
  icon?: string;
}


// A "type guard" helper function to infer if a menu item is a group or a single menu item.
export const isMenuItemGroup = (menuItem: MenuItem | MenuItemsGroup): menuItem is MenuItemsGroup => {
  return (menuItem as MenuItemsGroup)?.items !== undefined;
}

export type DynamicMenuData = { 
  [K in ContextActionsGroupTemplates | ContextActionsTemplates]: unknown;
}

export interface IMapMenuProperties {
  itemsList: MenuItemsList;
  dynamicMenuData?: DynamicMenuData,
  heightBuffer?: number;
  absoluteHeight?: number;
};

export enum MapMenusIds {
    ActionsMenu = 'ActionsMenu',
    // BestsMenu = 'BestsMenu',
}

export type MapMenus = {
    [key in MapMenusIds]? : IMapMenuProperties;
}

export type WfsFeatureInfo = GetFeatureModelType & Pick<WfsGetFeatureParams, 'pointCoordinates' | 'typeName'> & { config: IFeatureConfig };

export const mapMenusManagerStore = ModelBase
  .props({
    state: types.enumeration<ResponseState>(
      'State',
      Object.values(ResponseState)
    ),
    mapMenus: types.maybe(types.frozen<MapMenus>()),
    wfsFeatureTypes: types.maybe(types.frozen<string[]>()),
    wfsFeatureConfigs: types.maybe(types.frozen<IFeatureConfigs>()),
    currentWfsFeatureInfo: types.maybe(types.frozen<WfsFeatureInfo>()),
  })
  .views((self) => ({
    get store(): IRootStore {
      return self.__getStore<RootStoreType>()
    },
    get root(): IRootStore {
      return getParent(self);
    },
  }))
  .actions((self) => {
    const store = self.root;

    // function getActionsMenuProperties(featureTypes?: string[]): MapMenus {
    //     const mapContextActions = store.actionDispatcherStore.getContextActionGroups(ApplicationContexts.MAP_CONTEXT);
    //     const actionsMenuSections = mapContextActions.reduce((actionsSections, actionGroup) => {
    //       const flatGroup: MenuItem[] = [];
          
    //       actionGroup.actions.forEach(action => {
    //         // Exclude forbidden actions from list.
    //         if(!(store.userStore.isActionAllowed(action.action) as boolean)) return;

    //         if(action.action === ContextActions.QUERY_WFS_FEATURE) {
    //           const featureTypesList = (featureTypes ?? self.wfsFeatureTypes) ?? [];
    //           const wfsAvailableFeatures: MenuItem[] = featureTypesList
    //           .map(feature => {
    //             const featureConfig = getFeatureConfig(feature);
    //             const featureTitle = featureConfig.translationId ?? feature;

    //             return ({title: featureTitle, icon: featureConfig.icon, action: {...action}, payloadData: { feature }})
    //           });

    //           flatGroup.push(...wfsAvailableFeatures);
    //           return;
    //         }
    //         flatGroup.push({title: action.titleTranslationId, action: {...action}});            
    //       });

    //       // Omit empty sections
    //       // if(flatGroup.length) {
    //         return [...actionsSections, flatGroup];
    //       // }

    //       // return [...actionsSections];
    //     } ,[] as MenuItem[][])

    //     return {
    //       ActionsMenu: {
    //         itemsList: actionsMenuSections,
    //         heightBuffer: 70
    //       }
    //     }

    // }

    function getActionsMenuProperties(): MapMenus {
      const mapContextActions = store.actionDispatcherStore.getContextActionGroups(ApplicationContexts.MAP_CONTEXT);

      const buildGroupItemsList = (actions: (IContextActionGroup | IContextAction)[]): MenuItemsList => {
        const itemsList: MenuItemsList = [];

        actions.forEach(groupOrAction => {
          if(!isActionGroup(groupOrAction)) {
            if(!(store.userStore.isActionAllowed(groupOrAction.action) as boolean)) return;
            
            const item: MenuItem = {
              action: {...groupOrAction},
              title: groupOrAction.titleTranslationId,
              icon: groupOrAction.icon,
              templateId: groupOrAction.templateId
            };

            itemsList.push(item);
          } else {
            const {actions, ...groupWithoutActions} = groupOrAction;
            const group: MenuItemsGroup = {
              title: groupOrAction.titleTranslationId,
              icon: groupOrAction.icon,
              groupProps: groupWithoutActions,
              templateId: groupOrAction.templateId,
              items: buildGroupItemsList(actions)
            };

            itemsList.push(group);
          }
        });

        return itemsList;
      }

      console.log(" buildGroupItemsList(mapContextActions)",  buildGroupItemsList(mapContextActions))
      
      return {
        ActionsMenu: {
          itemsList: buildGroupItemsList(mapContextActions),
          heightBuffer: 70
        }
      }

  }

    function initStore(): void {
        self.mapMenus = {
            ...getActionsMenuProperties(),
            // ...getBestMenuProperties(),
        }
    }
    
    function setWfsFeatureTypes(wfsFeatureTypes: string[]): void {
      self.wfsFeatureTypes = wfsFeatureTypes;
    }

    function setWfsFeatureConfigs(wfsFeatureConfigs: IFeatureConfigs): void {
      self.wfsFeatureConfigs = wfsFeatureConfigs;
    }

    function setCurrentWfsFeatureInfo(currentFeatureInfo: Omit<WfsFeatureInfo , 'config'>): void {
      const featureInfoWithConfig: WfsFeatureInfo = {...currentFeatureInfo, config: getFeatureConfig(currentFeatureInfo.typeName)};
      
      self.currentWfsFeatureInfo = featureInfoWithConfig;
    }

    function getFeatureConfig(typeName: string): IFeatureConfig {
      return self.wfsFeatureConfigs?.[typeName] as IFeatureConfig;
    }

    function resetCurrentWfsFeatureInfo(): void {
      self.currentWfsFeatureInfo = undefined;
    }

    return {
      setWfsFeatureTypes,
      setCurrentWfsFeatureInfo,
      setWfsFeatureConfigs,
      getFeatureConfig,
      resetCurrentWfsFeatureInfo,
      initStore,
    }
  });
