import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { observer } from 'mobx-react';
import { DialogContent } from '@material-ui/core';
import { Button, Dialog, DialogActions, DialogTitle, IconButton, useTheme } from '@map-colonies/react-core';
import { Box, FilePicker, SupportedLocales } from '@map-colonies/react-components';
import CONFIG from '../../../common/config';
// import FsMap from './fs-map.json';

import './file-picker-dialog.css';
/*
setChonkyDefaults({ iconComponent: ChonkyIconFA });

const rootFolderId = FsMap.rootFolderId;
const fileMap = (FsMap.fileMap as unknown) as {
    [fileId: string]: FileData & { childrenIds: string[] };
};

export const useFiles = (currentFolderId: string): FileArray => {
  return useMemo(() => {
      const currentFolder = fileMap[currentFolderId];
      const files = currentFolder.childrenIds
          ? currentFolder.childrenIds.map((fileId: string) => fileMap[fileId] ?? null)
          : [];
      return files;
  }, [currentFolderId]);
};

export const useFolderChain = (currentFolderId: string): FileArray => {
  return useMemo(() => {
      const currentFolder = fileMap[currentFolderId];

      const folderChain = [currentFolder];

      let parentId = currentFolder.parentId;
      while (parentId) {
          const parentFile = fileMap[parentId];
          if (parentFile) {
              folderChain.unshift(parentFile);
              parentId = parentFile.parentId;
          } else {
              parentId = null;
          }
      }

      return folderChain;
  }, [currentFolderId]);
};

export const useFileActionHandler = (
  setCurrentFolderId: (folderId: string) => void
) => {
  return useCallback(
      (data: ChonkyFileActionData) => {
          if (data.id === ChonkyActions.OpenFiles.id) {
              const { targetFile, files } = data.payload;
              const fileToOpen = targetFile ?? files[0];
              if (fileToOpen && FileHelper.isDirectory(fileToOpen)) {
                  setCurrentFolderId(fileToOpen.id);
                  return;
              }
          }

          // showActionNotification(data);
      },
      [setCurrentFolderId]
  );
};
*/
interface FilePickerDialogComponentProps {
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
}

export const FilePickerDialogComponent: React.FC<FilePickerDialogComponentProps> = observer(({ isOpen, onSetOpen }) => {
  /*
  const [currentFolderId, setCurrentFolderId] = useState(rootFolderId);
  const files = useFiles(currentFolderId);
  const folderChain = useFolderChain(currentFolderId);
  const handleFileAction = useFileActionHandler(setCurrentFolderId);
  */
  const theme = useTheme();
  const closeDialog = useCallback(
    () => {
      onSetOpen(false);
    },
    [onSetOpen]
  );
  
  return (
    <Box id="filePickerDialog">
      <Dialog open={isOpen} preventOutsideDismiss={true}>
        <DialogTitle>
          <FormattedMessage id={ 'general.title.choose' }/>
          <IconButton
            className="closeIcon mc-icon-Close"
            label="CLOSE"
            onClick={ (): void => { closeDialog(); } }
          />
        </DialogTitle>
        <DialogContent className="dialogBody">
          <FilePicker 
            theme={{
              primary: theme.primary as string,
              background: theme.background as string,
              textOnBackground: theme.textSecondaryOnBackground as string,
              selectionBackground: theme.custom?.GC_SELECTION_BACKGROUND as string,
            }}
            readOnlyMode={true}
            locale={SupportedLocales[CONFIG.I18N.DEFAULT_LANGUAGE.toUpperCase() as keyof typeof SupportedLocales]} 
          />
        </DialogContent>
        <DialogActions>
          <Button raised type="button" disabled={true} onClick={(): void => { closeDialog(); }}>
            <FormattedMessage id="general.ok-btn.text"/>
          </Button>
          <Button type="button" onClick={(): void => { closeDialog(); }}>
            <FormattedMessage id="general.cancel-btn.text"/>
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});
