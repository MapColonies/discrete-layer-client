import React from 'react';
import { Box } from '@map-colonies/react-components';
import { ExportAction, useGetExportActions } from './hooks/useGetExportActions';
import { observer } from 'mobx-react-lite';
import { IAction } from '../../../common/actions/entity.actions';
import { IconButton, Tooltip } from '@map-colonies/react-core';
import { useIntl } from 'react-intl';
import { IDispatchAction } from '../../models/actionDispatcherStore';
import { useStore } from '../../models';

interface ExportLayerToolbarProps {
  additionalCustomActions?: IAction[];
}

const ExportLayerToolbar: React.FC<ExportLayerToolbarProps> = observer(({ additionalCustomActions = [] }) => {
  const intl = useIntl();
  const store = useStore();
  const exportActions = useGetExportActions();

  const dispatchAction = (action: Record<string, unknown>): void => {
    store.actionDispatcherStore.dispatchAction({
      action: action.action,
      data: action.data,
    } as IDispatchAction);
  };

  const ActionPresentor: React.FC<{
    action: ExportAction;
    key: string;
    data?: Record<string, unknown>;
  }> = ({ action, key, data }) => {
    return (
      <Tooltip content={intl.formatMessage({ id: action.titleTranslationId })}>
        <IconButton
          className={`exportAction ${action.class}`}
          key={key}
          label={action.action}
          disabled={action.disabled}
          style={{ pointerEvents: action.disabled ? 'none': 'unset' }}
          onClick={(): void => dispatchAction({ action: action.action, data })}
        />
      </Tooltip>
    );
  };

  return (
        <Box className="exportToolbarContainer">
          {exportActions.map((action, i) => {
            return <ActionPresentor action={action} key={i.toString()} />;
          })}
        </Box>
    );
  });

export default ExportLayerToolbar;
