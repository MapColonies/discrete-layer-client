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
      },
      // {
      //   group: [
      //     {
      //       action: 'moveUP',
      //       frequent: false,
      //       icon: '',
      //       class: 'mc-icon-Move-Row',
      //       titleTranslationId: 'action.layer.move-up.tooltip',
      //       views: [TabViews.CREATE_BEST, TabViews.CATALOG]
      //     },
      //   ],
      //   titleTranslationId: 'OperationsOnMap'
      // }
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
