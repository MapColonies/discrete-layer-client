import { observer } from 'mobx-react-lite';
import { useStore } from '../../models';
import { IDispatchAction } from '../../models/actionDispatcherStore';
import { ContextActions } from '../../../common/actions/context.actions';
import { useCesiumMap } from '@map-colonies/react-components';
import { useEffect } from 'react';

export const MapActionResolver: React.FC = observer(() => {
  const store = useStore();
  const mapViewer = useCesiumMap();

  useEffect(() => {
    if (typeof store.actionDispatcherStore?.action === 'undefined') return;

    const { action, data } = store.actionDispatcherStore
      .action as IDispatchAction;

    /**
     * In theory, only context actions are supposed to be catch here.
     */

    const closeContextMenu = data?.handleClose as () => void | undefined;

    switch (action) {
      case ContextActions.MOVE_LAYER_UP: {
        mapViewer.layersManager?.raise(data?.id as string, 1);
        closeContextMenu();
        break;
      }
      case ContextActions.MOVE_LAYER_DOWN: {
        mapViewer.layersManager?.lower(data?.id as string, 1);
        closeContextMenu();
        break;
      }
      default:
        break;
    }
    
  }, [
    store.actionDispatcherStore.action,
    store.discreteLayersStore,
    store.bestStore,
  ]);

  return <></>;
});
