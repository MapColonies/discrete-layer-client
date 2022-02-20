
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useTheme } from '@map-colonies/react-core';
import {
  FileActionData,
  FileData,
  FilePicker,
  FilePickerAction,
  FilePickerActions,
  FilePickerHandle,
  SupportedLocales
} from '@map-colonies/react-components';
import { LayerMetadataMixedUnion } from '../../../discrete-layer/models';
import CONFIG from '../../config';

export interface FilePickerComponentHandle {
  isMultiSelection: () => boolean;
  getFileSelection: () => Selection;
  setFileSelection: (selection: Set<string>, reset?: boolean) => void;
  requestFileAction: <Action extends FilePickerAction>(action: Action, payload: Action['__payloadType']) => Promise<void>;
}

export interface Selection {
  files: FileData[];
  folderChain: FileData[];
  metadata?: LayerMetadataMixedUnion;
}

interface FilePickerComponentProps {
  files: FileData[];
  selection: Selection;
  isMultiSelection: boolean;
}

export const FilePickerComponent: React.FC<FilePickerComponentProps> = (
  React.forwardRef<FilePickerComponentHandle, FilePickerComponentProps>(
    (
      {
        files,
        selection: currentSelection,
        isMultiSelection
      },
      ref
    ) => {
      const theme = useTheme();
      const fpRef = useRef<FilePickerHandle>();
      const [selection, setSelection] = useState<Selection>(currentSelection);
      
      useImperativeHandle(ref, () => ({
        isMultiSelection: (): boolean => {
          return isMultiSelection;
        },
        getFileSelection(): Selection {
          return selection;
        },
        setFileSelection(selection, reset = true): void {
          return fpRef.current?.setFileSelection(selection, reset);
        },
        async requestFileAction<Action extends FilePickerAction>(
          action: Action,
          payload: Action['__payloadType']
        ): Promise<void> {
          return fpRef.current?.requestFileAction(action, payload);
        },
      }));

      useEffect(() => {
        const selectedFiles = new Set(currentSelection.files.map((file) => file.id));
        fpRef.current?.setFileSelection(selectedFiles, false);
      }, [currentSelection, files]);

      const handleAction = (data: FileActionData): void => {
        // eslint-disable-next-line
        if (data.id === FilePickerActions.OpenFiles.id) {
          const { targetFile, files } = data.payload;
          const fileToOpen = targetFile ?? files[0];
          if (fileToOpen.isDir === true) {
            setSelection((currentSelection) => {
              const newSelection = { ...currentSelection };
              newSelection.folderChain = [ ...newSelection.folderChain, fileToOpen ];
              return newSelection;
            });
          }
        // eslint-disable-next-line
        } else if (data.id === FilePickerActions.ChangeSelection.id) {
          setSelection((currentSelection) => {
            const newSelection = { ...currentSelection };
            // eslint-disable-next-line
            const selectedIds = fpRef?.current?.getFileSelection() as Set<string>;
            newSelection.files = files.filter((file: FileData) => selectedIds.has(file.id));
            return newSelection;
          });
        }
      };
      
      return (
        <FilePicker
          // @ts-ignore 
          ref={fpRef}
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
          onFileAction={handleAction}
        />
      );
    }
  )
);
