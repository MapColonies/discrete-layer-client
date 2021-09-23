import { TabViews } from "../../discrete-layer/views/tab-views";

export interface IAction {
  action: string;
  frequent: boolean;
  icon: string;
  class: string;
  titleTranslationId: string;
  views: TabViews[];
};

export interface IActionGroup {
  group: IAction[];
  titleTranslationId: string;
}

export interface IEntityActions {
  entity: string;
  actions: IActionGroup[];
}

const ACTIONS_CONFIG: IEntityActions[] = [
  {
    entity: 'LayerRasterRecord',
    actions:[
      {
        group: [
          {
            action: 'edit',
            frequent: true,
            icon: '',
            class: 'mc-icon-Edit',
            titleTranslationId: 'action.edit.tooltip',
            views: [TabViews.CATALOG, TabViews.SEARCH_RESULTS]
          },
          {
            action: 'delete',
            frequent: true,
            icon: '',
            class: 'mc-icon-Delete',
            titleTranslationId: 'action.delete.tooltip',
            views: [/*TabViews.CATALOG, TabViews.SEARCH_RESULTS, */TabViews.CREATE_BEST]
          },
        ],
        titleTranslationId: 'CRUD'
      },
      {
        group: [
          {
            action: 'moveToTop',
            frequent: false,
            icon: 'keyboard_double_arrow_up',
            class: '',
            titleTranslationId: 'action.layer.move-to-top.tooltip',
            views: [TabViews.CREATE_BEST]
          },
          {
            action: 'moveUp',
            frequent: false,
            icon: 'keyboard_arrow_up',
            class: '',
            titleTranslationId: 'action.layer.move-up.tooltip',
            views: [TabViews.CREATE_BEST]
          },
          {
            action: 'moveDown',
            frequent: false,
            icon: 'keyboard_arrow_down',
            class: '',
            titleTranslationId: 'action.layer.move-down.tooltip',
            views: [TabViews.CREATE_BEST]
          },
          {
            action: 'moveToBottom',
            frequent: false,
            icon: 'keyboard_double_arrow_down',
            class: '',
            titleTranslationId: 'action.layer.move-to-bottom.tooltip',
            views: [TabViews.CREATE_BEST]
          },
        ],
        titleTranslationId: 'OperationsOnMap'
      }
    ]
  },
  {
    entity: 'Layer3DRecord',
    actions:[
      {
        group: [
          {
            action: 'edit',
            frequent: true,
            icon: '',
            class: 'mc-icon-Edit',
            titleTranslationId: 'action.edit.tooltip',
            views: [TabViews.CATALOG, TabViews.SEARCH_RESULTS]
          },
          // {
          //   action: 'delete',
          //   frequent: false,
          //   icon: '',
          //   class: 'mc-icon-Delete',
          //   titleTranslationId: 'action.delete.tooltip',
          //   views: [TabViews.CATALOG, TabViews.SEARCH_RESULTS]
          // },
        ],
        titleTranslationId: 'CRUD'
      }
    ]
  },
  {
    entity: 'BestRecord',
    actions:[
      {
        group: [
          {
            action: 'edit',
            frequent: true,
            icon: '',
            class: 'mc-icon-Edit',
            titleTranslationId: 'action.edit.tooltip',
            views: [TabViews.CATALOG, TabViews.SEARCH_RESULTS]
          },
          // {
          //   action: 'delete',
          //   frequent: false,
          //   icon: '',
          //   class: 'mc-icon-Delete',
          //   titleTranslationId: 'action.delete.tooltip',
          //   views: [TabViews.CATALOG, TabViews.SEARCH_RESULTS]
          // },
        ],
        titleTranslationId: 'CRUD'
      }
    ]
  }
]

export default ACTIONS_CONFIG;
