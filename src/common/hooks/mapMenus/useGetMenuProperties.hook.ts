import { useEffect, useState } from "react";
import { useStore } from "../../../discrete-layer/models";
import { MapMenusIds, IMapMenuProperties } from "../../../discrete-layer/models/mapMenusManagerStore";


const useGetMenuProperties = (menuId: MapMenusIds): IMapMenuProperties | undefined => {
    const store = useStore();
    const [menuProperties, setMenuProperties] = useState<IMapMenuProperties>();
    
    useEffect(() => {
      const mapMenus = store.mapMenusManagerStore.mapMenus;
    
      if(mapMenus) {
        setMenuProperties(mapMenus[menuId]);
      }
    }, [store.mapMenusManagerStore.mapMenus])

    return menuProperties;
}

export default useGetMenuProperties;