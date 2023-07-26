
import { TabViews } from '../../discrete-layer/views/tab-views';
import { IAction, IActionGroup } from './entity.actions';

export enum ApplicationContexts {
  MAP_CONTEXT = 'mapContext',
  MAP_ENTITY_CONTEXT = 'mapEntityContext',
}

export enum ContextActionsTypes {
  SERVICE_OPERATIONS = 'ServiceOperations',
  CLIENT_SIDE_OPERATIONS = 'ClientSideOperations',
}

export enum ContextActions {
  QUERY_WFS_FEATURE = 'QUERY_WFS_FEATURE',
  TEST = 'TEST',
}

export enum ContextActionsGroupTemplates {
  ACTIVE_LAYERS_IN_POSITION = 'ACTIVE_LAYERS_IN_POSITION',
}

export enum ActionSpreadPreference {
  FLAT = 'flat',
  MENU = 'menu'
}
export interface IContextActionGroup extends IActionGroup {
  order: number;
  actionsSpreadPreference: ActionSpreadPreference;
  templateId?: ContextActionsGroupTemplates;
  minimumItemsInMenu?: number; // Ignored if spread preference is not a menu. defaults to 2.
}

export interface IContextActions {
  context: ApplicationContexts;
  entity?: string;
  childEntity?: string;
  actions: IContextActionGroup[];
}

// Only group properties, no actions.
export interface ContextActionGroupProps extends Omit<IContextActionGroup, 'group'> {};

export const getContextActionGroupProps = (actionGroup: IContextActionGroup): ContextActionGroupProps => {
  const contextActionPropsKeys: Array<keyof ContextActionGroupProps> = [
      "actionsSpreadPreference",
      "id",
      "minimumItemsInMenu",
      "titleTranslationId",
      "type",
      "templateId",
      'order'
  ];

  const groupProps: ContextActionGroupProps = {} as ContextActionGroupProps;

  for(const [key, val] of Object.entries(actionGroup)) {
    if(contextActionPropsKeys.includes(key as keyof ContextActionGroupProps)) {
      (groupProps as Record<string,unknown>)[key] = val;
    }
  }

  return groupProps;
}

const DEFAULT_MINIMUM_ITEMS_IN_MENU = 2;

const defaultContextActionProps: IAction = {
  action: '',
  class: '',
  frequent: false,
  icon: '',
  titleTranslationId: '',
  views: [TabViews.CATALOG, TabViews.SEARCH_RESULTS],
};

const defaultContextActionGroupProps: Omit<IContextActionGroup, "order"> = {
  id: 0,
  actionsSpreadPreference: ActionSpreadPreference.MENU,
  minimumItemsInMenu: DEFAULT_MINIMUM_ITEMS_IN_MENU,
  group: [],
  titleTranslationId: '',
  type: ''
}

const CONTEXT_ACTIONS_CONFIG: IContextActions[] = [
  {
    context: ApplicationContexts.MAP_CONTEXT,
    actions: [
      {
        ...defaultContextActionGroupProps,
        order: 0,
        id: 1,
        titleTranslationId: 'map-context-menu.service-operations.group.title',
        type: ContextActionsTypes.SERVICE_OPERATIONS,
        actionsSpreadPreference: ActionSpreadPreference.MENU,
        minimumItemsInMenu: 2,
        group: [
          {
            ...defaultContextActionProps,
            action: ContextActions.QUERY_WFS_FEATURE,
          }
        ],
      },
      {
        ...defaultContextActionGroupProps,
        id: 2,
        order: 1,
        titleTranslationId: 'kuku',
        type: ContextActionsTypes.SERVICE_OPERATIONS,
        actionsSpreadPreference: ActionSpreadPreference.FLAT,
        minimumItemsInMenu: 0,
        group: [
          {
            ...defaultContextActionProps,
            titleTranslationId: 'Heights',
            action: "TEST",
          },
        ],
      },
      {
        ...defaultContextActionGroupProps,
        id: 3,
        order: 2,
        titleTranslationId: 'kuku',
        type: ContextActionsTypes.SERVICE_OPERATIONS,
        actionsSpreadPreference: ActionSpreadPreference.FLAT,
        minimumItemsInMenu: 0,
        group: [
          {
            ...defaultContextActionProps,
            titleTranslationId: 'Sensitive',
            action: "TEST",
          },
        ],
      },
      {
        ...defaultContextActionGroupProps,
        id: 4,
        order: 3,
        titleTranslationId: 'TEMPLATE',
        type: ContextActionsTypes.SERVICE_OPERATIONS,
        actionsSpreadPreference: ActionSpreadPreference.MENU,
        minimumItemsInMenu: 0,
        templateId: ContextActionsGroupTemplates.ACTIVE_LAYERS_IN_POSITION,
        group: [
          {
            ...defaultContextActionProps,
            titleTranslationId: 'UP',
            action: "TEST",
          },
          {
            ...defaultContextActionProps,
            titleTranslationId: 'DOWN',
            action: "TEST",
          },
          {
            ...defaultContextActionProps,
            titleTranslationId: 'PP',
            action: "TEST",
          },
        ],
      },
    ],
  },
];

export default CONTEXT_ACTIONS_CONFIG;
