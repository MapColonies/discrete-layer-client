import React, { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Box, IContextMenuData } from '@map-colonies/react-components';
import { IActionGroup } from '../../../common/actions/entity.actions';
import { TabViews } from '../../views/tab-views';
import { useStore } from '../../models/RootStore';
import { ContextMenu } from '../map-container/context-menu';
import { get } from 'lodash';
import { Icon, Tooltip } from '@map-colonies/react-core';

interface IBestMapContextMenuData extends IContextMenuData {
  entityTypeName: string;
}

const NONE = 0;
const FIRST = 0;

export const BestMapContextMenu: React.FC<IBestMapContextMenuData> = ({
  entityTypeName,
  ...restProps
}) => {
  const { data, position, handleClose } = restProps;
  const store = useStore();
  const intl = useIntl();

  const dispatchAction = (
    action: string,
    data: Record<string, unknown>
  ): void => {
    store.actionDispatcherStore.dispatchAction({ action, data });
  };

  const [
    isOverlappingLayersExpanded,
    setIsOverlappingLayersExpanded,
  ] = useState<boolean>(false);

  const entityName = store.actionDispatcherStore.getEntityActionConfiguration(
    entityTypeName
  )?.childEntity;
  const layer = get(data, '[0].meta') as Record<string, unknown>;
  const layerName = get(layer, 'details.name') as string;
  const numOfSelectedLayers = get(data, 'length');

  const subTitle = intl.formatMessage({ id: 'context-menu.sub-title.tooltip' });
  const tooltipInfoPrefixText = intl.formatMessage({
    id: 'context-menu.title.tooltip',
  });

  const entityPermittedActions = useMemo(() => {
    if (entityName !== undefined) {
      const allGroupsActions = store.actionDispatcherStore
        .getEntityActionGroups(entityName)
        .filter((actionGroup) => actionGroup.type === 'mapActions');
      return allGroupsActions.map((actionGroup) => {
        return {
          titleTranslationId: actionGroup.titleTranslationId,
          group: actionGroup.group
            .filter((action) => {
              return (store.userStore.isActionAllowed(`entity_action.${entityName}.${action.action}`) === true && action.views.includes(TabViews.CREATE_BEST)
              );
            })
            .map((action) => {
              return {
                ...action,
                titleTranslationId: intl.formatMessage({
                  id: action.titleTranslationId,
                }),
              };
            }),
        };
      });
    } else {
      return [];
    }
  }, []);

  const flatPermittedActions = (entityPermittedActions as IActionGroup[])[0]
    .group;

  const actionsSection = flatPermittedActions.map((action) => {
    return (
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
    );
  });

  const renderOverlappingSection = (): JSX.Element | false => {
    return (
      numOfSelectedLayers > 1 && (
        <Box>
          <Box className="imageryContextMenuSubTitle">
            {`${numOfSelectedLayers} ${subTitle}`}{' '}
            <Icon
              className="imageryContextMenuSubTitleIcon"
              icon={{
                icon: !isOverlappingLayersExpanded
                  ? 'arrow_drop_down'
                  : 'arrow_drop_up',
              }}
              onClick={(evt: React.MouseEvent<HTMLElement>): void => {
                evt.stopPropagation();
                setIsOverlappingLayersExpanded((prev) => !prev);
              }}
            />
          </Box>
          {isOverlappingLayersExpanded && (
            <Box className="imageryContextMenuTableContainer">
              <table className="imageryContextMenuTable">
                {data.map((item: Record<string, unknown>, index: number) => {
                  const meta = item.meta as Record<string, unknown>;
                  const details = meta.details as Record<string, unknown>;
                  return (
                    <tr
                      className={
                        index === FIRST
                          ? 'imageryContextMenuTableSelectedRow'
                          : ''
                      }
                    >
                      <td className="imageryContextMenuTableOrder">
                        {meta.zIndex as number}
                      </td>
                      <td>
                        <Tooltip content={details.name as string}>
                          <Box className="imageryContextMenuTableField">
                            {details.name as string}
                          </Box>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })}
              </table>
            </Box>
          )}
        </Box>
      )
    );
  };

  const emptyContainerStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`,
  };

  return (
    <>
      {numOfSelectedLayers > 1 && (
        <ContextMenu
          menuTitle={layerName}
          menuTitleTooltip={tooltipInfoPrefixText + layerName}
          menuSections={[actionsSection]}
          // Multi sections example
          // menuSections={[actionsSection, [<Box>One</Box>, <Box onClick={handleClose}>Two</Box>, <Box onClick={handleClose}>Three</Box>]]}
          {...restProps}
        >
          {renderOverlappingSection()}
          {numOfSelectedLayers === NONE && (
            <Box
              style={emptyContainerStyle}
              className="imageryContextMenuEmpty"
            ></Box>
          )}
        </ContextMenu>
      )}
    </>
  );
};
