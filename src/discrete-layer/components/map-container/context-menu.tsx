import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash';
import { Icon, Menu, MenuItem, MenuSurfaceAnchor, Tooltip } from '@map-colonies/react-core';
import { Box, IContextMenuData } from '@map-colonies/react-components';
import { IAction, IActionGroup } from '../../../common/actions/entity.actions';
import { TabViews } from '../../views/tab-views';
import { useStore } from '../../models/RootStore';
import { IDispatchAction } from '../../models/actionDispatcherStore';

import './context-menu.css';

const NONE = 0;
const FIRST = 0;

export const ContextMenu: React.FC<IContextMenuData> = ({
  style,
  data,
  handleClose,
}) => {

  const store = useStore();
  const intl = useIntl();
  const imageryContextMenuRef = useRef(null);
  const [expanded, setExpanded] = useState<boolean>(false);
  
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
      const imgContextMenuRef: any = get(imageryContextMenuRef, 'current');
      if (
        imgContextMenuRef &&
        !imgContextMenuRef.contains(target)
      ) {
        document.removeEventListener('click', handleClickOutside, false);
        handleClose();
      }
      /* eslint-enable */
    };

    document.addEventListener('click', handleClickOutside, false);
  });

  const flatPermittedActions = (entityPermittedActions as IActionGroup[])[0].group;
  
  const layer = get(data,'[0].meta') as Record<string, unknown>;
  const layerName = get(layer,'details.name') as string;
  const info = intl.formatMessage({ id: 'context-menu.title.tooltip' });
  const subTitle = intl.formatMessage({ id: 'context-menu.sub-title.tooltip' });
  // eslint-disable-next-line
  const numOfSelectedLayers = get(data,'length') as number;

  const dispatchAction = (
    action: string,
    data: Record<string, unknown>
  ): void => {
    store.actionDispatcherStore.dispatchAction(({ action, data } as unknown) as IDispatchAction);
  };

  return (
    <>
      {numOfSelectedLayers > NONE && (
        <div 
          ref={imageryContextMenuRef}
          style={style}
          className="imageryContextMenuTheme imageryContextMenu"
        >
          <Box>
            <span className="imageryContextMenuTitle">{layerName}</span>
            {' '}
            <Tooltip content={info + layerName}>
              <Icon
                className="imageryContextMenuTitleInfo"
                icon={{ icon: 'info', size: 'small' }}
              />
            </Tooltip>
          </Box>
          <MenuSurfaceAnchor className="imageryMenuContainer">
            <Menu
              open={true}
              className="imageryMenu"
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
                        className="imageryMenuIcon glow-missing-icon"
                        icon={{ icon: action.icon, size: 'small' }}
                      />
                      {action.titleTranslationId}
                    </Box>
                  </MenuItem>
                );
              })}
            </Menu>
          </MenuSurfaceAnchor>
          {numOfSelectedLayers > 1 && (
            <Box>
              <Box className="imageryContextMenuSubTitle">
                {`${numOfSelectedLayers} ${subTitle}`}
                {' '}
                <Icon
                  className="imageryContextMenuSubTitleIcon"
                  icon={{ icon: !expanded ? 'arrow_drop_down' : 'arrow_drop_up' }}
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                  onClick={(evt): void => {
                    evt.stopPropagation();
                    setExpanded(!expanded);
                  }}
                />
              </Box>
              {expanded  && <Box className="imageryContextMenuTableContainer">
                <table className="imageryContextMenuTable">
                  {data.map((item: Record<string, unknown>, index: number) => {
                    const meta = item.meta as Record<string, unknown>;
                    const details = meta.details as Record<string, unknown>;
                    return (
                      <tr className={index === FIRST ? 'imageryContextMenuTableSelectedRow' : ''}>
                        <td className="imageryContextMenuTableOrder">{meta.zIndex as number}</td>
                        <td className="imageryContextMenuTableField">{details.name as string}</td>
                      </tr>
                    );
                  })}
                </table>
              </Box>}
            </Box>
          )}
        </div>
      )}
      {numOfSelectedLayers === NONE && <Box style={style} className="imageryContextMenuEmpty"></Box>}
    </>
  );
};