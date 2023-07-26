/* eslint-disable @typescript-eslint/naming-convention */
import { types, getParent } from 'mobx-state-tree';
import { ApplicationContexts, ContextActionGroupProps, ContextActions, getContextActionGroupProps } from '../../common/actions/context.actions';
import { IAction } from '../../common/actions/entity.actions';
import { ResponseState } from '../../common/models/response-state.enum';
import { ModelBase } from './ModelBase';
import { IRootStore, RootStoreType } from './RootStore';
import {GetFeatureModelType} from './GetFeatureModel';
import { WfsGetFeatureParams } from './RootStore.base';
import { IFeatureConfig, IFeatureConfigs } from '../views/components/data-fetchers/wfs-features-fetcher.component';

export interface MenuItem {
  title: string;
  action: IAction;
  icon?: string;
  payloadData?: Record<string, unknown>;
}

export type MenuItemsList = MenuItem[][];

export interface IMapMenuProperties {
  groupsProps: ContextActionGroupProps[];
  itemsList: MenuItemsList;
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

    function getActionsMenuProperties(featureTypes?: string[]): MapMenus {
        const mapContextActions = store.actionDispatcherStore.getContextActionGroups(ApplicationContexts.MAP_CONTEXT);
        const actionsMenuSections = mapContextActions.reduce((actionsSections, actionGroup) => {
          const flatGroup: MenuItem[] = [];
          
          actionGroup.group.forEach(action => {
            // Exclude forbidden actions from list.
            if(!(store.userStore.isActionAllowed(action.action) as boolean)) return;

            if(action.action === ContextActions.QUERY_WFS_FEATURE) {
              const featureTypesList = (featureTypes ?? self.wfsFeatureTypes) ?? [];
              const wfsAvailableFeatures: MenuItem[] = featureTypesList
              .map(feature => {
                const featureConfig = getFeatureConfig(feature);
                const featureTitle = featureConfig.translationId ?? feature;

                return ({title: featureTitle, icon: featureConfig.icon, action: {...action}, payloadData: { feature }})
              });

              flatGroup.push(...wfsAvailableFeatures);
              return;
            }
            flatGroup.push({title: action.titleTranslationId, action: {...action}});            
          });

          // Omit empty sections
          // if(flatGroup.length) {
            return [...actionsSections, flatGroup];
          // }

          // return [...actionsSections];
        } ,[] as MenuItem[][])

        return {
          ActionsMenu: {
            groupsProps: mapContextActions.map((group) => getContextActionGroupProps(group)),
            itemsList: actionsMenuSections,
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
