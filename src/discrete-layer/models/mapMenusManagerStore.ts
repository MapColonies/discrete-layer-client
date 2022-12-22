/* eslint-disable @typescript-eslint/naming-convention */
import { types, getParent } from 'mobx-state-tree';
import { ApplicationContexts, ContextActions } from '../../common/actions/context.actions';
import { IAction } from '../../common/actions/entity.actions';
import { ResponseState } from '../../common/models/response-state.enum';
import { ModelBase } from './ModelBase';
import { IRootStore, RootStoreType } from './RootStore';
import {GetFeatureModelType} from './GetFeatureModel';
import { WfsGetFeatureParams } from './RootStore.base';

interface MenuItem {
  title: string;
  action: IAction;
  payloadData?: Record<string, unknown>;
}

export type MenuItemsList = MenuItem[][];

export interface IMapMenuProperties {
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

export type WfsFeatureInfo = GetFeatureModelType & Pick<WfsGetFeatureParams, 'pointCoordinates'>;

export const mapMenusManagerStore = ModelBase
  .props({
    state: types.enumeration<ResponseState>(
      'State',
      Object.values(ResponseState)
    ),
    mapMenus: types.maybe(types.frozen<MapMenus>()),
    actionsMenuFeatures: types.maybe(types.frozen<string[]>()),
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
              const featureTypesList = (featureTypes ?? self.actionsMenuFeatures) ?? [];
              const wfsAvailableFeatures: MenuItem[] = featureTypesList
              .map(feature => ({title: feature, action: {...action}, payloadData: { feature }}));

              flatGroup.push(...wfsAvailableFeatures);
              return;
            }
            flatGroup.push({title: action.titleTranslationId, action: {...action}});            
          });

          // Omit empty sections
          if(flatGroup.length) {
            return [...actionsSections, flatGroup];
          }

          return [...actionsSections];
        } ,[] as MenuItem[][])

        return {
          ActionsMenu: {
            itemsList: actionsMenuSections
          }
        }

    }

    function initStore(): void {
        self.mapMenus = {
            ...getActionsMenuProperties(),
            // ...getBestMenuProperties(),
        }
    }
    
    function setActionsMenuFeatures(actionsMenuFeatures: string[]): void {
      self.actionsMenuFeatures = actionsMenuFeatures;
    }

    function setCurrentWfsFeatureInfo(currentFeatureInfo: WfsFeatureInfo): void {
      self.currentWfsFeatureInfo = currentFeatureInfo;
    }
    return {
      setActionsMenuFeatures,
      setCurrentWfsFeatureInfo,
      initStore,
    }
  });
