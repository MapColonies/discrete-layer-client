import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash';
import { Icon, Menu, MenuItem, MenuSurfaceAnchor, Tooltip } from '@map-colonies/react-core';
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
  const dialogPortalRef = useRef(null);
  
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      /* eslint-disable */
      const target: any = event.target;
      const dlgPortalRef: any = get(dialogPortalRef, 'current');
      if (
        dlgPortalRef &&
        !dlgPortalRef.contains(target)
      ) {
        console.log('KUKU');
        document.removeEventListener('click', handleClickOutside, false);
        handleClose();
      }
      /* eslint-enable */
    };

    document.addEventListener('click', handleClickOutside, false);

    // return (): void => {
    //   document.removeEventListener('click', handleClickOutside, false);
    // };
  });

  const flatPermittedActions = (entityPermittedActions as IActionGroup[])[0].group;
  
  const layer = get(data,'[0].meta') as Record<string, unknown>;
  const layerName = get(layer,'details.name') as string;
  const info = intl.formatMessage({ id: 'context-menu.title.tooltip' });
  const subTitle = intl.formatMessage({ id: 'context-menu.sub-title.tooltip' });
  // eslint-disable-next-line
  const numOfSelectedLayers = get(data,'length') as number;
  const [expanded, setExpanded] = useState<boolean>(false);

  const dispatchAction = (
    action: string,
    data: Record<string, unknown>
  ): void => {
    store.actionDispatcherStore.dispatchAction(({ action, data } as unknown) as IDispatchAction);
  };

  return (
    <>
      {numOfSelectedLayers > EMPTY && (
        <div 
          ref={dialogPortalRef}
          style={{...style, background: 'var(--mdc-theme-surface)', position: 'absolute', borderRadius: '4px', padding: '12px'}}
        >
          <h4>
            <span style={{ color: 'var(--mdc-theme-primary)' }}>{layerName}</span>
            {' '}
            <Tooltip content={info + layerName}>
              <Icon
                style={{ verticalAlign: 'sub', color: 'var(--mdc-theme-primary)' }}
                icon={{ icon: 'info', size: 'small' }}
              />
            </Tooltip>
          </h4>
          <MenuSurfaceAnchor id="imageryMenuContainer" style={{ height: '154px' }}>
            <Menu
              open={true}
              // onClose={(evt): void => handleClose()}
              onMouseOver={(evt): void => evt.stopPropagation()}
              style={{width: '100%'}}
            >
              {flatPermittedActions.map((action: IAction) => {
                return (
                  <MenuItem key={`imageryMenuItemAction_${action.action}`}>
                    <Box
                      onClick={(evt): void => {
                        dispatchAction(`LayerRasterRecord.${action.action}`, layer);
                        handleClose();
                      }}
                    >
                      <Icon
                        style={{ verticalAlign: 'sub' }}
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
          {numOfSelectedLayers > 1 && (
            <Box>
              <h4>
                {`${numOfSelectedLayers} ${subTitle}`}
                {' '}
                <Icon
                  style={{ verticalAlign: 'sub', color: 'var(--mdc-theme-primary)' }}
                  icon={{ icon: !expanded ? 'arrow_drop_down' : 'arrow_drop_up' }}
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                  onClick={(evt): void => {
                    evt.stopPropagation();
                    setExpanded(!expanded);
                  }}
                />
              </h4>
              {expanded  && <table>
                {data.map((item: Record<string, unknown>) => {
                  const meta = item.meta as Record<string, unknown>;
                  const details = meta.details as Record<string, unknown>;
                  return (
                    <tr>
                      <td style={{ width: '30px', textAlign: 'center' }}>{meta.zIndex as number}</td>
                      <td>{details.name as string}</td>
                    </tr>
                  );
                })}
              </table>}
            </Box>
          )}
        </div>
      )}
      {numOfSelectedLayers === EMPTY && <Box style={{...style, background: 'var(--mdc-theme-surface)', position: 'absolute', borderRadius: '4px'}}></Box>}
    </>
  );
};