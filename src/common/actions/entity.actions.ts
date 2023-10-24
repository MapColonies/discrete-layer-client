import { TabViews } from '../../discrete-layer/views/tab-views';

interface DependentFieldWithValue {
  field: string;
  expectedValue: unknown;
}
export type DependentField = string | DependentFieldWithValue;

export interface IAction {
  action: string;
  frequent: boolean;
  icon: string;
  class: string;
  titleTranslationId: string;
  views: TabViews[];
  dependentField?: DependentField;
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

export const isDependentFieldWithValue = (dependentField?: DependentField): dependentField is DependentFieldWithValue => {
  return typeof dependentField !== 'undefined' && typeof dependentField !== 'string' && 'expectedValue' in dependentField;
};

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
      dependentField: {field: 'layerURLMissing', expectedValue: undefined},
      views: [TabViews.CATALOG, TabViews.SEARCH_RESULTS]
    },
    {
      action: 'analyze',
      frequent: true,
      icon: '',
      class: 'mc-icon-Earth',
      titleTranslationId: 'action.analyze.tooltip',
      views: [TabViews.CATALOG, TabViews.SEARCH_RESULTS]
    },
    {
      action: 'export',
      frequent: false,
      icon: '',
      class: 'mc-icon-Export',
      titleTranslationId: 'action.export.tooltip',
      dependentField: {field: 'layerURLMissing', expectedValue: undefined},
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
            dependentField: {field: 'layerURLMissing', expectedValue: undefined},
            views: [TabViews.CATALOG, TabViews.SEARCH_RESULTS]
          },
          {
            action: 'update',
            frequent: false,
            icon: '',
            class: 'mc-icon-Update',
            titleTranslationId: 'action.update.tooltip',
            dependentField: {field: 'layerURLMissing', expectedValue: undefined},
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
      }
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
      },
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
