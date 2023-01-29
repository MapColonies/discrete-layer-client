import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { IAction } from '../../../../common/actions/entity.actions';
import { useStore } from '../../../models';
import { TabViews } from '../../../views/tab-views';

const IS_MULTI_SELECTION_ALLOWED = true;

export enum ExportActions {
    DRAW_RECTANGLE = 'export-draw-rectangle',
    DRAW_POLYGON = 'export-draw-polygon',
    DRAW_BY_COORDINATES = 'export-draw-coordinates',
    CLEAR_DRAWINGS = 'export-clear-drawings',
    IMPORT_FROM_SHAPE_FILE = 'import-from-shape-file',
    TOGGLE_FULL_LAYER_EXPORT = 'toggle-full-layer-export'
};

export type ExportAction = IAction & {
    disabled: boolean;
    toggleExportStoreFieldOptions?: {
        field: string;
        labelChecked: string;
        labelUnchecked: string;
    };
    multipleAllowed?: boolean;
};

const EXPORT_ACTIONS: ExportAction[] = [
    {
      action: ExportActions.TOGGLE_FULL_LAYER_EXPORT,
      frequent: true,
      icon: '',
      class: '',
      toggleExportStoreFieldOptions: { 
        field: 'isFullLayerExportEnabled', 
        labelChecked: 'action.export.full-layer.label',
        labelUnchecked: 'action.export.custom-selection.label' 
      },
      titleTranslationId: 'action.export.full-layer.tooltip',
      disabled: false,
      views: [TabViews.EXPORT_LAYER]
    },
    {
      action: ExportActions.DRAW_RECTANGLE,
      frequent: true,
      icon: '',
      class: 'mc-icon-Rectangle',
      titleTranslationId: 'action.export.box.tooltip',
      disabled: false,
      multipleAllowed: IS_MULTI_SELECTION_ALLOWED,
      views: [TabViews.EXPORT_LAYER]
    },
    {
      action: ExportActions.DRAW_POLYGON,
      frequent: true,
      icon: '',
      class: 'mc-icon-Polygon',
      titleTranslationId: 'action.export.polygon.tooltip',
      disabled: false,
      multipleAllowed: IS_MULTI_SELECTION_ALLOWED,
      views: [TabViews.EXPORT_LAYER]
    },
    {
      action: ExportActions.DRAW_BY_COORDINATES,
      frequent: true,
      icon: '',
      class: 'mc-icon-Coordinates',
      titleTranslationId: 'action.export.bbox-corners.tooltip',
      disabled: false,
      multipleAllowed: IS_MULTI_SELECTION_ALLOWED,
      views: [TabViews.EXPORT_LAYER]
    },
    {
      action: ExportActions.IMPORT_FROM_SHAPE_FILE,
      frequent: true,
      icon: '',
      class: 'glow-missing-icon mc-icon-Publish',
      titleTranslationId: 'action.export.import-shape.tooltip',
      disabled: false,
      views: [TabViews.EXPORT_LAYER]
    },
    {
      action: ExportActions.CLEAR_DRAWINGS,
      frequent: true,
      icon: '',
      class: 'mc-icon-Delete',
      titleTranslationId: 'action.clear.tooltip',
      disabled: false,
      views: [TabViews.EXPORT_LAYER]
    },
];

export const useGetExportActions = (): ExportAction[] => {
    const store = useStore();
    const geometrySelectionList = store.exportStore.geometrySelectionsCollection;
    const isFullLayerExportEnabled = store.exportStore.isFullLayerExportEnabled;
    
    const [exportActions, setExportActions] = useState<ExportAction[]>(EXPORT_ACTIONS);

    useEffect(() => {
        switch(true) {
            case !isEmpty(geometrySelectionList.features):
            case isFullLayerExportEnabled as boolean:
                setExportActions((currentActions) => currentActions.map(action => {
                    if(!isEmpty(geometrySelectionList.features) && !(action.multipleAllowed ?? false)) {
                        if(action.action !== ExportActions.CLEAR_DRAWINGS) {
                            return { ...action, disabled: true }
                        }
                    } else if(isFullLayerExportEnabled as boolean){
                        if(![ExportActions.CLEAR_DRAWINGS, ExportActions.TOGGLE_FULL_LAYER_EXPORT].includes(action.action as ExportActions)) {
                            return { ...action, disabled: true }
                        }
                    }
                    return action;
                }));
            break;

            case isEmpty(geometrySelectionList.features):
            case !(isFullLayerExportEnabled as boolean):
                setExportActions((currentActions) => currentActions.map(action => {
                    if(action.action !== ExportActions.CLEAR_DRAWINGS) {
                        return { ...action, disabled: false }
                    }
                    return action;
                }));
            break;
        }
    }, [geometrySelectionList, isFullLayerExportEnabled])

    return exportActions;
}