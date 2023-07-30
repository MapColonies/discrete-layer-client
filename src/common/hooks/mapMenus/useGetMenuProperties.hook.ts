import { useEffect, useState } from "react";
import { useStore } from "../../../discrete-layer/models";
import { MapMenusIds, IMapMenuProperties } from "../../../discrete-layer/models/mapMenusManagerStore";
import { useHandleMapMenuTemplates } from "./useHandleMapMenuTemplates.hook";


const useGetMenuProperties = (menuId: MapMenusIds): IMapMenuProperties | undefined => {
    const store = useStore();
    const [menuProperties, setMenuProperties] = useState<IMapMenuProperties>();
    const mapMenus = store.mapMenusManagerStore.mapMenus;
    const templatedMenuProperties = useHandleMapMenuTemplates(mapMenus?.[menuId]);
    
    useEffect(() => {
      if(templatedMenuProperties) {
        setMenuProperties(templatedMenuProperties);
        console.log("templatedMenuProperties", templatedMenuProperties)
      }
    }, [templatedMenuProperties])

    return menuProperties;
}

export default useGetMenuProperties;