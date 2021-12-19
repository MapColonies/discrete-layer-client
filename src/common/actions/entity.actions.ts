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
  id: number;
  titleTranslationId: string;
  type: string;
  group: IAction[];
}

export interface IEntityActions {
  entity: string;
  childEntity?: string;
  actions: IActionGroup[];
}

const ACTIONS_CONFIG: IEntityActions[] = [
  {
    entity: 'LayerRasterRecord',
    actions: [
      {
        id: 1,
        titleTranslationId: 'OperationsOnMap',
        type: 'mapActions',
        group: [
          {
            action: 'moveToTop',
            frequent: false,
            icon: 'vertical_align_top',
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
            icon: 'vertical_align_bottom',
            class: '',
            titleTranslationId: 'action.layer.move-to-bottom.tooltip',
            views: [TabViews.CREATE_BEST]
          },
        ],
      },
      {
        id: 2,
        titleTranslationId: 'CRUD',
        type: 'CRUD',
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
      },
    ]
  },
  {
    entity: 'Layer3DRecord',
    actions: [
      {
        id: 1,
        titleTranslationId: 'CRUD',
        type: 'CRUD',
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
      }
    ]
  },
  {
    entity: 'BestRecord',
    childEntity: 'LayerRasterRecord',
    actions: [
      {
        id: 1,
        titleTranslationId: 'CRUD',
        type: 'CRUD',
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
      }
    ]
  },
  {
    entity: 'LayerDemRecord',
    actions: [
      {
        id: 1,
        titleTranslationId: 'CRUD',
        type: 'CRUD',
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
      }
    ]
  },
]

export default ACTIONS_CONFIG;
