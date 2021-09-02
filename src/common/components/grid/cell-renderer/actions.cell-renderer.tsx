import React, { useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { isEmpty } from 'lodash';
import { IconButton,   MenuSurfaceAnchor,  MenuSurface, Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { ILayerImage } from '../../../../discrete-layer/models/layerImage';
import { IActionGroup, IAction } from '../../../actions/entity.actions';

interface IActionsRendererParams extends ICellRendererParams {
  actions: IActionGroup[];
  entity: string;
  actionHandler: (action: Record<string,unknown>) => void;
}

export const ActionsRenderer: React.FC<IActionsRendererParams> = (props) => {
  let frequentActions: IAction[] = [];
  let allFlatActions: IAction[] = [];
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (props.actions !== undefined) {
    props.actions.forEach(actionGroup => {
      frequentActions = [
        ...frequentActions,
        ...actionGroup.group.filter(action => action.frequent)
      ];
      allFlatActions = [
        ...allFlatActions,
        ...actionGroup.group
      ];
    });
  }

  const [openActionsMenu, setOpenActionsMenu] = useState<boolean>(false);

  const sendAction = (entity: string, action: IAction, data: Record<string,unknown>): void => {
    console.log(`SEND ${action.action} EVENT`);
    props.actionHandler({
      action: `${entity}.${action.action}`,
      data: data,
    });
  }
  return (
    <Box>
      KUKU
    </Box>
  );
  // return (
  //   <Box className="actionsContainer">
  //     {
  //       frequentActions.map((action,idx) => {
  //         return (
  //           <IconButton
  //             className={action.class ? `actionIcon actionDismissible ${action.class}` : `actionIcon actionDismissible`}
  //             icon={action.icon}
  //             key={`freqAct_${(props.data as ILayerImage).id}_${idx}`}
  //             onClick={(evt): void => { 
  //               sendAction(props.entity, action, props.data);
  //             }}
  //           />
  //         );
  //       })
  //     }
  //     <MenuSurfaceAnchor id="actionsMenuContainer">
  //       <MenuSurface
  //         open={openActionsMenu}
  //         onClose={evt => setOpenActionsMenu(false)}
  //         onMouseOver={evt => evt.stopPropagation()}
  //       >
  //         {
  //           allFlatActions.map((action,idx) => {
  //             return (
  //               <Box 
  //                 key={`menuAct_${(props.data as ILayerImage).id}_${idx}`}
  //                 onClick={(evt): void => {
  //                   sendAction(props.entity, action, props.data);
  //                   setOpenActionsMenu(false); 
  //                 }}
  //                 className="actionMenuItem"
  //               >
  //                 <IconButton
  //                   className={action.class ? `actionIcon actionDismissible ${action.class}` : `actionIcon actionDismissible`}
  //                   icon={action.icon}
  //                 />
  //                 <Typography 
  //                   tag="div"
  //                   className="actionMenuItemTitle actionDismissible"
  //                 >
  //                   {action.titleTranslationId}
  //                 </Typography>
  //               </Box>
  //             );
  //           })
  //         }
  //       </MenuSurface>
  //       {
  //         !isEmpty(allFlatActions) && <IconButton 
  //           id="allActionsIcon"
  //           icon="more_vert" 
  //           className="actionIcon" 
  //           onClick={(evt): void => setOpenActionsMenu(!openActionsMenu)}
  //         />
  //       }
  //     </MenuSurfaceAnchor>
  //   </Box> 
  // );
};
