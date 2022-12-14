/* eslint-disable @typescript-eslint/naming-convention */
import { types, getParent } from 'mobx-state-tree';
import { ResponseState } from '../../common/models/response-state.enum';
import { ModelBase } from './ModelBase';
import { IRootStore, RootStoreType } from './RootStore';

type MenuItemsList = unknown[];

export interface IMapMenuProperties {
  itemsList: MenuItemsList;
  heightBuffer?: number;
  absoluteHeight?: number;
};

export enum MapMenusNames {
    ActionsMenu = 'ActionsMenu',
    // BestsMenu = 'BestsMenu',
}

export type MapMenus = {
    [key in MapMenusNames]? : IMapMenuProperties;
}


export const mapMenusManagerStore = ModelBase
  .props({
    state: types.enumeration<ResponseState>(
      'State',
      Object.values(ResponseState)
    ),
    mapMenus: types.maybe(types.frozen<MapMenus>()),

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
    // const store = self.root;

    function getActionsMenuProperties(): MapMenus {
        // Fetch list of actions from another store.
        const availableActions = ['Buildings', 'Roads', 'Tiles Coordinates'];
        
        // Optionally add hard coded actions to the list.
        const generalActions = ['Get Height'];

        return {
           ActionsMenu: {
            itemsList: [...availableActions, ...generalActions],
           }
        };
    }

    function setMapMenus(): void {
        self.mapMenus = {
            ...getActionsMenuProperties(),
            // ...getBestMenuProperties(),
        }
    }

    // setMapMenus();
   
    return {
        setMapMenus,
    }
  });
