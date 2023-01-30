import React from 'react';
import { Box } from '@map-colonies/react-components';
import { observer } from 'mobx-react-lite';
import { Checkbox, IconButton, Tooltip } from '@map-colonies/react-core';
import { useIntl } from 'react-intl';
import { FeatureCollection, lineString } from '@turf/helpers';
import { Point } from 'geojson';
import { get } from 'lodash';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import { IDispatchAction } from '../../models/actionDispatcherStore';
import { useStore } from '../../models';
import { BBoxDialog } from '../map-container/bbox.dialog';
import { ExportAction, useGetExportActions } from './hooks/useGetExportActions';


interface ExportLayerToolbarProps {}
interface ActionPresentorBaseProps {
  action: ExportAction;
  key: string;
  data?: Record<string, unknown>;
}

const ExportLayerToolbar: React.FC<ExportLayerToolbarProps> = observer(() => {
  const intl = useIntl();
  const store = useStore();
  const exportStore = store.exportStore;
  const exportActions = useGetExportActions();

  const dispatchAction = (action: Record<string, unknown>): void => {
    store.actionDispatcherStore.dispatchAction({
      action: action.action,
      data: action.data,
    } as IDispatchAction);
  };

  const ToggleActionPresentor: React.FC<ActionPresentorBaseProps> = ({
    action,
    key,
    data,
  }) => {
    const intl = useIntl();
    if (typeof action.toggleExportStoreFieldOptions === 'undefined')
      return null;

    const toggleOptions = action.toggleExportStoreFieldOptions;
    const isChecked = get(exportStore, toggleOptions.field) as boolean;
    const checkboxLabel = isChecked
      ? intl.formatMessage({ id: toggleOptions.labelChecked })
      : intl.formatMessage({ id: toggleOptions.labelUnchecked });

    return (
      <Checkbox
        checked={isChecked}
        onClick={(): void => dispatchAction({ action: action.action, data })}
        label={checkboxLabel}
        className={`exportAction exportToggle ${action.disabled ? 'disabled' : ''} ${action.class}`}
        key={key}
        disabled={action.disabled}
      />
    );
  };

  const ActionPresentor: React.FC<ActionPresentorBaseProps> = (props) => {
    const { action, key, data } = props;

    return (
      <Tooltip content={intl.formatMessage({ id: action.titleTranslationId })}>
        {typeof action.toggleExportStoreFieldOptions !== 'undefined' ? (
          <ToggleActionPresentor {...props} />
        ) : (
          <IconButton
            className={`exportAction ${action.disabled ? 'disabled' : ''} ${action.class}`}
            key={key}
            label={action.action}
            disabled={action.disabled}
            onClick={(): void =>
              dispatchAction({ action: action.action, data })
            }
          />
        )}
      </Tooltip>
    );
  };

  return (
    <Box className="exportToolbarContainer">
      {exportActions.map((action, i) => {
        return <ActionPresentor action={action} key={i.toString()} />;
      })}
      <BBoxDialog
        isOpen={exportStore.isBBoxDialogOpen as boolean}
        onSetOpen={exportStore.setIsBBoxDialogOpen}
        onPolygonUpdate={(selection): void => {
          const lineStr = lineString((selection.geojson as FeatureCollection).features.map(feature => (feature.geometry as Point).coordinates));
          const lineStrBBox = bbox(lineStr);
          const selectionPolygon = bboxPolygon(lineStrBBox);
          exportStore.addFeatureSelection(selectionPolygon);
        }}
      />
    </Box>
  );
});

export default ExportLayerToolbar;
