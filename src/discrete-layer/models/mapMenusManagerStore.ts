/* eslint-disable @typescript-eslint/naming-convention */
import { types, getParent } from 'mobx-state-tree';
import { ApplicationContexts } from '../../common/actions/context.actions';
import { IAction } from '../../common/actions/entity.actions';
import { ResponseState } from '../../common/models/response-state.enum';
import { ModelBase } from './ModelBase';
import { IRootStore, RootStoreType } from './RootStore';

interface MenuItem {
  title: string;
  action: IAction;
  payloadData?: unknown;
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


export const mapMenusManagerStore = ModelBase
  .props({
    state: types.enumeration<ResponseState>(
      'State',
      Object.values(ResponseState)
    ),
    mapMenus: types.maybe(types.frozen<MapMenus>()),
    actionsMenuFeatures: types.maybe(types.frozen<string[]>()),

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

    function getActionsMenuProperties(): MapMenus {
        const WFS_SERVICE_ACTION = 'queryWfsFeature';
        const mapContextActions = store.actionDispatcherStore.getContextActionGroups(ApplicationContexts.MAP_CONTEXT);
        const actionsMenuSections = mapContextActions.reduce((actionsSections, actionGroup) => {
          const flatGroup: MenuItem[] = [];
          
          actionGroup.group.forEach(action => {
            if(action.action === WFS_SERVICE_ACTION) {
              const wfsAvailableFeatures: MenuItem[] = ['Buildings', 'Roads', 'Tile']
              .map(feature => ({title: feature, action: {...action}, payloadData: { feature }}));

              flatGroup.push(...wfsAvailableFeatures);
              return;
            }
            flatGroup.push({title: action.titleTranslationId, action: {...action}});            
          });

          return [...actionsSections, flatGroup];
        } ,[] as MenuItem[][])

        return {
          ActionsMenu: {
            itemsList: actionsMenuSections
          }
        }

    }

    function initStore(): void {
      if(!self.mapMenus){
        self.mapMenus = {
            ...getActionsMenuProperties(),
            // ...getBestMenuProperties(),
        }
      }
    }
    
    function setActionsMenuFeatures(actionsMenuFeatures: string[]): void {
      self.actionsMenuFeatures = actionsMenuFeatures;
    }
    return {
      setActionsMenuFeatures,
      initStore,
    }
  });
