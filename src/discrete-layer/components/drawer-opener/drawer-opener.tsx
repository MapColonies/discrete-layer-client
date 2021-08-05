import React from 'react';
import { useTheme } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';

import './drawer-opener.css';

interface DrawerOpenerProps {
  isOpen: boolean;
  onClick: (open: boolean) => void;
}

export const DrawerOpener: React.FC<DrawerOpenerProps> = (props) => {
  const {isOpen, onClick} = props;
  const theme = useTheme();
  return (
    <Box 
      onClick={(): void => onClick(!isOpen)} 
      style={{
        backgroundColor: theme.primary as string,
        color: theme.onPrimary as string,
      }} 
      className={`drawerOpenerPosition ${isOpen ? 'spacer' : ''}`}
    >
      {isOpen ? '<': '>'}
    </Box>
  );
};
