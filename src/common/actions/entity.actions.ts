import { TabViews } from "../../discrete-layer/views/tab-views";

export interface IAction {
  action: string;
  frequent: boolean;
  icon: string;
  class: string;
  titleTranslationId: string;
  views: TabViews[];
  dependentField?: string;
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

export enum EntityActionsTypes {
  GENERAL_ACTIONS = 'generalActions',
  MAP_ACTIONS = 'mapActions',
  CRUD = 'CRUD',
  JOB_ACTIONS = 'jobActions',
  EXPORT_ACTIONS = 'exportActions',

}

const GENERAL_ACTIONS_GROUP: IActionGroup = {
  id: 0,
  titleTranslationId: 'layerCatalogToMap',
  type: EntityActionsTypes.GENERAL_ACTIONS,
  group: [
    {
      action: 'flyTo',
      frequent: true,
      icon: '',
      class: 'mc-icon-Fly-to',
      titleTranslationId: 'action.flyTo.tooltip',
      views: [TabViews.CATALOG, TabViews.SEARCH_RESULTS]
    },
    {
      action: 'export',
      frequent: false,
      icon: '',
      class: 'mc-icon-Export',
      titleTranslationId: 'action.export.tooltip',
      views: [TabViews.CATALOG, TabViews.SEARCH_RESULTS]
    },
  ],
};

const ACTIONS_CONFIG: IEntityActions[] = [
  {
    entity: 'LayerRasterRecord',
    actions: [
      GENERAL_ACTIONS_GROUP,
      {
        id: 1,
        titleTranslationId: 'OperationsOnMap',
        type: EntityActionsTypes.MAP_ACTIONS,
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
        type: EntityActionsTypes.CRUD,
        group: [
          {
            action: 'edit',
            frequent: true,
            icon: '',
            class: 'mc-icon-Edit1',
            titleTranslationId: 'action.edit.tooltip',
            views: [TabViews.CATALOG, TabViews.SEARCH_RESULTS]
          },
          {
            action: 'update',
            frequent: false,
            icon: '',
            class: 'mc-icon-Update',
            titleTranslationId: 'action.update.tooltip',
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
      {
        id: 3,
        titleTranslationId: 'exportActions',
        type: EntityActionsTypes.EXPORT_ACTIONS,
        group: [
          {
            action: 'rectangle',
            frequent: true,
            icon: '',
            class: 'mc-icon-Rectangle',
            titleTranslationId: 'action.box.tooltip',
            views: [TabViews.EXPORT_LAYER]
          },
          {
            action: 'polygon',
            frequent: true,
            icon: '',
            class: 'mc-icon-Polygon',
            titleTranslationId: 'action.polygon.tooltip',
            views: [TabViews.EXPORT_LAYER]
          },
          {
            action: 'coordinates',
            frequent: true,
            icon: '',
            class: 'mc-icon-Coordinates',
            titleTranslationId: 'action.bbox-corners.tooltip',
            views: [TabViews.EXPORT_LAYER]
          },
          {
            action: 'clear',
            frequent: true,
            icon: '',
            class: 'mc-icon-Delete',
            titleTranslationId: 'action.clear.tooltip',
            views: [TabViews.EXPORT_LAYER]
          },
        ],
      },
    ]
  },
  {
    entity: 'Layer3DRecord',
    actions: [
      GENERAL_ACTIONS_GROUP,
      {
        id: 1,
        titleTranslationId: 'CRUD',
        type: EntityActionsTypes.CRUD,
        group: [
          {
            action: 'edit',
            frequent: true,
            icon: '',
            class: 'mc-icon-Edit1',
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
      GENERAL_ACTIONS_GROUP,
      {
        id: 1,
        titleTranslationId: 'CRUD',
        type: EntityActionsTypes.CRUD,
        group: [
          {
            action: 'edit',
            frequent: true,
            icon: '',
            class: 'mc-icon-Edit1',
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
    entity: 'VectorBestRecord',
    actions: [
      GENERAL_ACTIONS_GROUP,
      {
        id: 1,
        titleTranslationId: 'CRUD',
        type: EntityActionsTypes.CRUD,
        group: [
          {
            action: 'edit',
            frequent: true,
            icon: '',
            class: 'mc-icon-Edit1',
            titleTranslationId: 'action.edit.tooltip',
            views: [TabViews.CATALOG, TabViews.SEARCH_RESULTS]
          },
        ],
      }
    ]
  },
  {
    entity: 'QuantizedMeshBestRecord',
    actions: [
      GENERAL_ACTIONS_GROUP,
      {
        id: 1,
        titleTranslationId: 'CRUD',
        type: EntityActionsTypes.CRUD,
        group: [
          {
            action: 'edit',
            frequent: true,
            icon: '',
            class: 'mc-icon-Edit1',
            titleTranslationId: 'action.edit.tooltip',
            views: [TabViews.CATALOG, TabViews.SEARCH_RESULTS]
          },
        ],
      }
    ]
  },
  {
    entity: 'LayerDemRecord',
    actions: [
      GENERAL_ACTIONS_GROUP,
      {
        id: 1,
        titleTranslationId: 'CRUD',
        type: EntityActionsTypes.CRUD,
        group: [
          {
            action: 'edit',
            frequent: true,
            icon: '',
            class: 'mc-icon-Edit1',
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
    entity: 'Job',
    actions: [
      {
        id: 1,
        titleTranslationId: 'OperationsOnJobs',
        type: EntityActionsTypes.JOB_ACTIONS,
        group: [
          {
            action: 'retry',
            frequent: false,
            icon: '',
            class: 'mc-icon-Job-Resume',
            titleTranslationId: 'action.job.retry',
            views: [],
            dependentField: 'availableActions.isResumable'
          },
          {
            action: 'abort',
            frequent: false,
            icon: '',
            class: 'mc-icon-Job-Abort',
            titleTranslationId: 'action.job.abort',
            views: [],
            dependentField: 'availableActions.isAbortable'
          },
        ],
      }
    ]
    
  }
];

export default ACTIONS_CONFIG;
