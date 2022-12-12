import { Box, IContextMenuData } from '@map-colonies/react-components';
import React from 'react';
import { ContextMenu } from './context-menu';

interface IActionsContextMenuProps extends IContextMenuData {}

export const ActionsContextMenu: React.FC<IActionsContextMenuProps> = ({ ...restProps }) => {
const { handleClose } = restProps;

  return (
    <ContextMenu
      menuTitle='Query Services'
      menuSections={[
       [
        <Box onClick={handleClose}>Buildings</Box>,
        <Box onClick={handleClose}>Roads</Box>,
        <Box onClick={handleClose}>Tiles Coordinates</Box>,
       ],
       [
        <Box onClick={handleClose}>Get Height</Box>
       ]
      ]}
      {...restProps}
    />
  );
};
