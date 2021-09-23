import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Icon, Menu, MenuItem, MenuSurfaceAnchor } from '@map-colonies/react-core';
import { Box, IContextMenuData } from '@map-colonies/react-components';
import { IAction, IActionGroup } from '../../../common/actions/entity.actions';
import { TabViews } from '../../views/tab-views';
import { useStore } from '../../models/RootStore';
import { IDispatchAction } from '../../models/actionDispatcherStore';

const EMPTY = 0;

export const ContextMenu: React.FC<IContextMenuData> = ({
  style,
  data,
  handleClose,
}) => {

  const store = useStore();
  const intl = useIntl();
  
  const entityPermittedActions = useMemo(() => {
    const entityActions: Record<string, unknown> = {};
    ['LayerRasterRecord'].forEach( entityName => {
       const allGroupsActions = store.actionDispatcherStore.getEntityActionGroups(entityName).filter(actionGroup => actionGroup.titleTranslationId === 'OperationsOnMap');
       const permittedGroupsActions = allGroupsActions.map((actionGroup) => {
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
       entityActions[entityName] = permittedGroupsActions;
    });
    return entityActions['LayerRasterRecord'];
  }, []);

  const flatPermittedActions = (entityPermittedActions as IActionGroup[])[0].group;
  
  // @ts-ignore
  const layer = data[0]?.meta as Record<string, unknown>;
  // const layerId = layer !== undefined ? layer.id ?? '' : '';
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const layerName = layer !== undefined ? (layer.details as Record<string, unknown>).name ?? '' : '';

  const dispatchAction = (
    action: string,
    data: Record<string, unknown>
  ): void => {
    store.actionDispatcherStore.dispatchAction(({ action, data } as unknown) as IDispatchAction);
  };

  return (
    <>
      {data.length > EMPTY && (
        <Box style={{...style, background: 'var(--mdc-theme-surface)', position: 'absolute', borderRadius: '4px', padding: '12px', paddingBottom: '154px'}}>
          <h4>Actions on {layerName}:</h4>
          {data.length > 1 && (
            <h3>
              <span style={{ color: 'red' }}>{data.length}</span> layers overlapping
            </h3>
          )}
          <MenuSurfaceAnchor id="imageryMenuContainer">
            <Menu
              open={true}
              onClose={(evt): void => handleClose()}
              onMouseOver={(evt): void => evt.stopPropagation()}
              style={{width: '100%'}}
            >
              {flatPermittedActions.map((action: IAction) => {
                return (
                  <MenuItem key={`imageryMenuItemAction_${action.action}`}>
                    <Box
                      onClick={(evt): void => {
                        dispatchAction(`LayerRasterRecord.${action.action}`, data[0].meta as Record<string, unknown>);
                      }}
                    >
                      <Icon
                        style={{ verticalAlign: 'sub'}}
                        icon={{ icon: action.icon, size: 'small' }}
                      />
                      {' '}
                      {action.titleTranslationId}
                    </Box>
                  </MenuItem>
                );
              })}
            </Menu>
          </MenuSurfaceAnchor>
        </Box>
      )}
      {data.length === EMPTY && <Box style={{...style, background: 'var(--mdc-theme-surface)', position: 'absolute', borderRadius: '4px'}}></Box>}
    </>
  );
};