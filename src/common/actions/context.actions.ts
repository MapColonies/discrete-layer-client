
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
}

export interface IContextActions {
  context: ApplicationContexts;
  entity?: string;
  childEntity?: string;
  actions: IActionGroup[];
}

const defaultContextActionProps: IAction = {
  action: '',
  class: '',
  frequent: false,
  icon: '',
  titleTranslationId: '',
  views: [TabViews.CATALOG, TabViews.SEARCH_RESULTS],
};

const CONTEXT_ACTIONS_CONFIG: IContextActions[] = [
  {
    context: ApplicationContexts.MAP_CONTEXT,
    actions: [
      {
        id: 1,
        titleTranslationId: '',
        type: ContextActionsTypes.SERVICE_OPERATIONS,
        group: [
          {
            ...defaultContextActionProps,
            action: ContextActions.QUERY_WFS_FEATURE,
          }
        ],
      },
    ],
  },
];

export default CONTEXT_ACTIONS_CONFIG;