import { useTheme } from "@map-colonies/react-core";
import { get } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { TITLE_HEIGHT, SUB_MENU_MAX_HEIGHT } from "../../discrete-layer/components/map-container/context-menu";
import { useStore } from "../../discrete-layer/models";
import { MapMenusIds, IMapMenuProperties } from "../../discrete-layer/models/mapMenusManagerStore";
import { IDimensions } from "./useElementDimensions.hook";
 
export interface MenuDimensions extends IDimensions {
    dynamicHeightIncrement: number;
}

const useGetMenuDimensions = (menuId: MapMenusIds, customDynamicHeightIncrement?: number): MenuDimensions | undefined => {
    const store = useStore();
    const theme = useTheme();

    const [menuDimensions, setMenuDimensions] = useState<MenuDimensions>();
    
    const calcMenuDimensions = useCallback((mapMenu?: IMapMenuProperties): MenuDimensions | undefined => {
        if(typeof mapMenu === 'undefined') return undefined;

        const DEFAULT_HEIGHT_BUFFER = 5;
        const themedMenuItemHeight = Number((get(theme, 'gcMenuItemHeight') as string).split('px')[0]);
        const themedContextMenuWidth = Number((get(theme, 'gcContextMenuWidth') as string).split('px')[0]);

        const numberOfMenuItems = mapMenu.itemsList.flat().length;
        const calculatedMenuHeight = mapMenu.absoluteHeight ?? 
        (
            ((numberOfMenuItems * themedMenuItemHeight) + (mapMenu.heightBuffer ?? DEFAULT_HEIGHT_BUFFER)) + TITLE_HEIGHT
        );


        return { width: themedContextMenuWidth, height: calculatedMenuHeight, dynamicHeightIncrement:  customDynamicHeightIncrement ?? SUB_MENU_MAX_HEIGHT };
        
    }, [])

    useEffect(() => {
      const mapMenus = store.mapMenusManagerStore.mapMenus;
    
      if(mapMenus) {
         setMenuDimensions(calcMenuDimensions(mapMenus[menuId]));
      }
    }, [store.mapMenusManagerStore.mapMenus])

    return menuDimensions;
}

export default useGetMenuDimensions;