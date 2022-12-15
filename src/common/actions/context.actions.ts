
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
            action: 'queryWfsFeature',
          }
        ],
      },
      {
        id: 2,
        titleTranslationId: '',
        type: ContextActionsTypes.CLIENT_SIDE_OPERATIONS,
        group: [
          {
            ...defaultContextActionProps,
            titleTranslationId: 'Get Height',
            action: 'getHeight',
          },
        ],
      },
    ],
  },
];

export default CONTEXT_ACTIONS_CONFIG;
