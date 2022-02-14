import React from 'react';
import { useTheme } from '@map-colonies/react-core';
import { FileActionData, FileData, FilePicker, FilePickerHandle, SupportedLocales } from '@map-colonies/react-components';
import { LayerMetadataMixedUnion } from '../../../discrete-layer/models';
import CONFIG from '../../config';

export interface Selection {
  files: FileData[];
  folderChain: FileData[];
  metadata?: LayerMetadataMixedUnion;
}

interface FilePickerComponentProps {
  files: FileData[];
  selection: Selection;
  onFileAction: (data: FileActionData) => void;
}

export const FilePickerComponent: React.FC<FilePickerComponentProps> = (
  React.forwardRef<FilePickerHandle, FilePickerComponentProps>(
    (
      {
        files,
        selection,
        onFileAction
      },
      ref
    ) => {
      const theme = useTheme();
      return (
        <FilePicker
          // @ts-ignore 
          ref={ref}
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
          folderChain={selection.folderChain}
          onFileAction={onFileAction}
        />
      );
    }
  )
);
