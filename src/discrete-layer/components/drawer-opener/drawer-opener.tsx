import React from 'react';
import { Box } from '@map-colonies/react-components';
import { useTheme } from '@map-colonies/react-core';
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
      onClick={() => onClick(!isOpen)} 
      style={{
        backgroundColor: theme.primary,
        color: theme.onPrimary,
      }} 
      className={`drawerOpenerPosition ${isOpen ? 'spacer' : ''}`}
    >
      {isOpen ? '<': '>'}
    </Box>
  );
};
