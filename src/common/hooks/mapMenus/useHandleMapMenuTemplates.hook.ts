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

export const useHandleMapMenuTemplates = (
    menuProperties?: IMapMenuProperties
): IMapMenuProperties | undefined => {
    /**
     *  The hook should be able to template the menu properties passed as an argument,
     *  using some dynamic data based on the specific logic for each template (Action template / Group Template).
     *
     * - A template should be used to duplicate the same logic / actions multiple times according to a dynamic logic.
     * - How dynamic the template is? when should we re-template the data? it could be an expensive process and we must be able to declare how often to re process.
     * - Here we need to contain all of the logic for the templates based on a templateId inside either a group or an action.
     */

    const [templatedMenu, setTemplatedMenu] = useState<IMapMenuProperties>();

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
                return [];
        }
    }
    
    const handleGroupTemplates = (groupTemplateMenuItem: MenuItemsGroup): MenuItemsList => {
        const templatedGroups: MenuItemsList = [];
        
        switch (groupTemplateMenuItem.templateId) {
            case ContextActionsGroupTemplates.ACTIVE_LAYERS_IN_POSITION: {
                // Mock active layers, this should be replaced by real logic
                const MOCK_ACTIVE_LAYERS = [{ layerId: 'Layer 1' }, { layerId: 'Layer 2' }];
                const activeLayersInPosition = MOCK_ACTIVE_LAYERS;

                const templateProps = groupTemplateMenuItem.groupProps;

                activeLayersInPosition.forEach(activeLayer => {
                    const groupProp: ContextActionGroupProps = {
                        ...templateProps,
                        id: templateProps.id + 1,
                        titleTranslationId: activeLayer.layerId,
                    };

                    const templatedGroup: MenuItemsGroup = {
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

                    templatedGroups.push(templatedGroup);
                });

                return templatedGroups;
            }
            default:
                return [];
        }
        
    }

    // Iterate through the menu (and sub-menu) properties and handle the templates logic based on the templateId.
    // Returns the menu after the processing.
    const getTemplatedMenu = (): IMapMenuProperties => {
        const menuItems: MenuItemsList = [];

        menuProperties?.itemsList.forEach((item) => {
            // If item is not a template, just add it to array as is.
            if (!item.templateId) {
                menuItems.push(item);
                return;
            }

            if (!isMenuItemGroup(item)) {
                // Handle action templates
                const templatedActions: MenuItemsList = handleActionTemplates(item);
                menuItems.push(...templatedActions);
                return;                
            } else {
                // Handle group templates
                const templatedGroups: MenuItemsList = handleGroupTemplates(item);
                menuItems.push(...templatedGroups);
                return;

            }

        });

        return {...menuProperties, itemsList: menuItems};
    };

    // This effect should occur on the first time the menu properties are made.
    useEffect(() => {
        if(typeof menuProperties !== 'undefined') {
            setTemplatedMenu(getTemplatedMenu());
        }
    }, [menuProperties]);

    return templatedMenu;
};
