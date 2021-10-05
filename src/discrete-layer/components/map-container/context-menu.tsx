import React, { useState, useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash';
import { Icon, Menu, MenuItem, MenuSurfaceAnchor, Tooltip } from '@map-colonies/react-core';
import { Box, IContextMenuData } from '@map-colonies/react-components';
import { IAction } from '../../../common/actions/entity.actions';
import { useStore } from '../../models/RootStore';

import './context-menu.css';

const NONE = 0;
const FIRST = 0;
const TITLE_HEIGHT = 24;
const SUB_TITLE_HEIGHT = 24;
const MARGIN_HEIGHT = 20;

interface IMapContextMenuData extends IContextMenuData {
  actions: IAction[];
}

export const ContextMenu: React.FC<IMapContextMenuData> = ({
  data,
  position,
  style,
  size,
  handleClose,
  actions
}) => {

  const store = useStore();
  const intl = useIntl();
  const imageryContextMenuRef = useRef(null);
  const [expanded, setExpanded] = useState<boolean>(false);

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
  
  const emptyStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`
  };
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
    store.actionDispatcherStore.dispatchAction({ action, data });
  };

  return (
    <>
      {numOfSelectedLayers > NONE && (
        <div 
          ref={imageryContextMenuRef}
          style={{...emptyStyle, ...style}}
          className="imageryContextMenuTheme imageryContextMenu"
        >
          <Box>
            <Box className="imageryContextMenuTitle">{layerName}</Box>
            {' '}
            <Tooltip content={info + layerName}>
              <Icon
                className="imageryContextMenuTitleInfo"
                icon={{ icon: 'info', size: 'small' }}
              />
            </Tooltip>
          </Box>
          <MenuSurfaceAnchor style={{height: `calc(${(size as Record<string, number>).height}px - ${TITLE_HEIGHT}px - ${SUB_TITLE_HEIGHT}px - ${MARGIN_HEIGHT}px)`}}>
            <Menu
              open={true}
              className="imageryMenu"
            >
              {actions.map((action: IAction) => {
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
      {numOfSelectedLayers === NONE && <Box style={emptyStyle} className="imageryContextMenuEmpty"></Box>}
    </>
  );
};