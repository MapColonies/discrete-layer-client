import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { IContextMenuData } from '@map-colonies/react-components';
import { IActionGroup } from '../../../common/actions/entity.actions';
import { TabViews } from '../../views/tab-views';
import { useStore } from '../../models/RootStore';
import { ContextMenu } from '../map-container/context-menu';

interface IBestMapContextMenuData extends IContextMenuData {
  entityTypeName: string;
}

export const BestMapContextMenu: React.FC<IBestMapContextMenuData> = ({
  entityTypeName,
  ...restProps
}) => {

  const store = useStore();
  const intl = useIntl();
  
  const entityName = store.actionDispatcherStore.getEntityActionConfiguration(entityTypeName)?.childEntity;
  
  const entityPermittedActions = useMemo(() => {
    if (entityName !== undefined) {
      const allGroupsActions = store.actionDispatcherStore.getEntityActionGroups(entityName).filter(actionGroup => actionGroup.type === 'mapActions');
      return allGroupsActions.map((actionGroup) => {
        return {
          titleTranslationId: actionGroup.titleTranslationId,
          group: 
            actionGroup.group.filter(action => {
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              return store.userStore.isActionAllowed(`entity_action.${entityName}.${action.action}`) === false ? false : true &&
                    action.views.includes(TabViews.CREATE_BEST);
            })
            .map((action) => {
              return {
                ...action,
                titleTranslationId: intl.formatMessage({ id: action.titleTranslationId }),
              };
            }),
        }
      });
    }
    else {
      return [];
    }
  
  }, []);

  const flatPermittedActions = (entityPermittedActions as IActionGroup[])[0].group;

  return (
    <ContextMenu actions={flatPermittedActions} {...restProps} />
  );
};