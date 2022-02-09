import React from 'react';
import { useTheme } from '@map-colonies/react-core';
import { FileActionData, FileData, FilePicker, SupportedLocales } from '@map-colonies/react-components';
import CONFIG from '../../config';

interface FilePickerComponentProps {
  files: FileData[];
  currentSelection: {
    // directory: string,
    files: string[];
    folderChain: FileData[];
  };
  onFileAction: (data: FileActionData) => void;
}

export const FilePickerComponent: React.FC<FilePickerComponentProps> = ({files, currentSelection, onFileAction}) => {
  const theme = useTheme();
  return (
    <FilePicker 
      theme={{
        primary: theme.primary as string,
        background: theme.background as string,
        surface: theme.surface as string,
        textOnBackground: theme.textSecondaryOnBackground as string,
        selectionBackground: theme.custom?.GC_SELECTION_BACKGROUND as string,
      }}
      readOnlyMode={true}
      locale={SupportedLocales[CONFIG.I18N.DEFAULT_LANGUAGE.toUpperCase() as keyof typeof SupportedLocales]}
      files={files}
      folderChain={currentSelection.folderChain}
      onFileAction={onFileAction}
    />
  );
}