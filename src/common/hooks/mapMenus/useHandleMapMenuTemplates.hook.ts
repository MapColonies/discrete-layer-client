import { useEffect, useState } from "react";
import {
    IMapMenuProperties,
    MenuItem,
    MenuItemsGroup,
    MenuItemsList,
    isMenuItemGroup
} from "../../../discrete-layer/models/mapMenusManagerStore";
import { ContextActionGroupProps, ContextActionsGroupTemplates, ContextActionsTemplates } from "../../actions/context.actions";
import { useStore } from "../../../discrete-layer/models";
import { IContextMenuData } from "@map-colonies/react-components";

export const useHandleMapMenuTemplates = (
    menuProperties?: IMapMenuProperties,
    contextProps?: IContextMenuData,
): IMapMenuProperties | undefined => {
    /**
     *  The hook should be able to generate the menu properties passed as an argument,
     *  using some dynamic data based on the specific logic for each template (Action template / Group Template).
     *
     * - A template should be used to duplicate the same logic / actions multiple times according to a dynamic data.
     * - How dynamic the template is? when should we re-template the data? it could be an expensive process and we must be able to declare how often to re process.
     * - Here we need to contain all of the logic for the templates based on a templateId inside either a group or an action.
     */

    const [generatedMenu, setGeneratedMenu] = useState<IMapMenuProperties>();

    // Gather all of the data to be used in the process to build the complete menu. store / contexts / hooks / etc.
    const store = useStore();


    const handleActionTemplates = (actionTemplateMenuItem: MenuItem): MenuItemsList => {
        switch (actionTemplateMenuItem.templateId) {
            case ContextActionsTemplates.WFS_QUERY_FEATURES: {
                const featureTypesList = store.mapMenusManagerStore.wfsFeatureTypes ?? [];
                const wfsQueryMenuItems: MenuItem[] = featureTypesList.map((feature) => {
                    const featureConfig =
                        store.mapMenusManagerStore.getFeatureConfig(feature);
                    const featureTitle = featureConfig.translationId ?? feature;

                    return {
                        title: featureTitle,
                        icon: featureConfig.icon,
                        action: { ...actionTemplateMenuItem.action },
                        payloadData: { feature }
                    };
                });
                return wfsQueryMenuItems;
            }
            default:
                return [actionTemplateMenuItem];
        }
    }
    
    const handleGroupTemplates = (groupTemplateMenuItem: MenuItemsGroup): MenuItemsList => {
        const generatedGroups: MenuItemsList = [];
        
        switch (groupTemplateMenuItem.templateId) {
            case ContextActionsGroupTemplates.ACTIVE_LAYERS_IN_POSITION: {
                // Mock active layers, this should be replaced by real logic
                // const MOCK_ACTIVE_LAYERS = [{ layerId: 'Layer 1' }, { layerId: 'Layer 2' }];
                const activeLayersInPosition = contextProps?.data as Record<string, unknown>[];

                const templateProps = groupTemplateMenuItem.groupProps;

                activeLayersInPosition.forEach(activeLayer => {
                    const groupProp: ContextActionGroupProps = {
                        ...templateProps,
                        id: templateProps.id + 1,
                        // @ts-ignore
                        titleTranslationId: activeLayer.meta?.layerRecord?.productName as string,
                    };

                    const generatedGroup: MenuItemsGroup = {
                        ...groupTemplateMenuItem,
                        groupProps: groupProp,
                        title: groupProp.titleTranslationId,
                        items: groupTemplateMenuItem.items.map(item => {
                            if(!isMenuItemGroup(item)) {
                                return {...item, payloadData: activeLayer};
                            }

                            return item;
                        })
                    };

                    generatedGroups.push(generatedGroup);
                });

                return generatedGroups;
            }
            default:
                return [groupTemplateMenuItem];
        }
        
    }

    // Iterate through the menu (and sub-menu) properties and handle the templates logic based on the templateId.
    // Returns the menu after the processing.
    const getGeneratedMenu = (items?: MenuItemsList): IMapMenuProperties => {
        const menuItems: MenuItemsList = [];
        const itemsList = items ?? menuProperties?.itemsList;

        itemsList?.forEach((item) => {

            if (!isMenuItemGroup(item)) {
                // Handle action templates
                const generatedActions: MenuItemsList = handleActionTemplates(item);
                menuItems.push(...generatedActions);
                return;                
            } else {
                // Handle group templates
                const generatedGroups: MenuItemsList = handleGroupTemplates({
                    ...item,
                    items: getGeneratedMenu(item.items).itemsList
                });

                menuItems.push(...generatedGroups);
                return;

            }

        });

        return {...menuProperties, itemsList: menuItems};
    };

    useEffect(() => {
        if(typeof menuProperties !== 'undefined') {
            setGeneratedMenu(getGeneratedMenu());
        }
    }, [menuProperties, contextProps?.contextEvt]);

    return generatedMenu;
};
