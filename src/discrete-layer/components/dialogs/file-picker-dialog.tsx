/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { cloneDeep } from 'lodash';
import { observer } from 'mobx-react';
import { DialogContent } from '@material-ui/core';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
} from '@map-colonies/react-core';
import {
  Box,
  FileActionData,
  FileData,
  FilePickerActions,
} from '@map-colonies/react-components';
import {
  FilePickerComponent,
  FilePickerComponentHandle,
  Selection,
} from '../../../common/components/file-picker';
import {
  FileModelType,
  LayerMetadataMixedUnion,
  RecordType,
  useQuery,
  useStore,
} from '../../models';
import { isMultiSelection } from '../layer-details/utils';

import './file-picker-dialog.css';

const EMPTY = 0;

interface FilePickerDialogComponentProps {
  recordType: RecordType;
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
  onFilesSelection: (selected: Selection) => void;
  selection: Selection;
}

const getSuffixFromFolderChain = (folderChain: FileData[]): string => {
  return '/' + folderChain.map((file) => file.name).join('/');
};

export const FilePickerDialogComponent: React.FC<FilePickerDialogComponentProps> = observer(
  ({
    recordType,
    isOpen,
    onSetOpen,
    onFilesSelection,
    selection: currentSelection,
  }) => {
    const filePickerRef = useRef<FilePickerComponentHandle>(null);
    const [files, setFiles] = useState<FileData[]>([]);
    const [isFileSelected, setIsFileSelected] = useState<boolean>(false);
    const [pathSuffix, setPathSuffix] = useState<string>(
      getSuffixFromFolderChain(currentSelection.folderChain)
    );
    const [selection, setSelection] = useState<Selection>(currentSelection);
    const store = useStore();
    const queryDirectory = useCallback(
      () => useQuery<{ getDirectory: FileModelType[] }>(), [])();
    const queryMetadata = useCallback(
      () => useQuery<{ getFile: LayerMetadataMixedUnion }>(), [])();
    const intl = useIntl();

    useEffect(() => {
      queryDirectory.setQuery(
        store.queryGetDirectory({
          data: {
            pathSuffix,
            type: recordType,
          },
        })
      );

      const prevSelection = filePickerRef.current?.getFileSelection();
      setSelection({
        ...prevSelection,
        metadata: {
          recordModel: {} as LayerMetadataMixedUnion,
          error: null,
        },
      } as Selection);
    }, [pathSuffix]);

    useEffect(() => {
      if (queryDirectory.data) {
        const dirContent = cloneDeep(
          queryDirectory.data.getDirectory
        ) as FileData[];
        setFiles(dirContent);
        if (dirContent.length) {
          const hasMetadata = dirContent.some(
            (file) => file.name === 'metadata.json'
          );
          if (hasMetadata) {
            queryMetadata.setQuery(
              store.queryGetFile({
                data: {
                  pathSuffix: pathSuffix + 'metadata.json',
                  type: recordType,
                },
              })
            );
          }
        }
      }
    }, [queryDirectory.data]);

    useEffect(() => {
      if (queryMetadata.data) {
        const prevSelection = filePickerRef.current?.getFileSelection();
        setSelection({
          ...prevSelection,
          metadata: {
            recordModel: cloneDeep(queryMetadata.data.getFile),
            error: null,
          },
        } as Selection);
      }
    }, [queryMetadata.data]);

    useEffect(() => {
      if (queryMetadata.error) {
        const metadataError = [
          {
            message: intl.formatMessage({
              id: 'ingestion.error.invalid-metadata',
            }),
          },
          // eslint-disable-next-line
          ...queryMetadata.error.response.errors,
        ];

        // eslint-disable-next-line
        const queryError = { ...queryMetadata.error };

        // eslint-disable-next-line
        queryError.response.errors = metadataError;

        const prevSelection = filePickerRef.current?.getFileSelection();
        setSelection({
          ...prevSelection,
          metadata: {
            recordModel: {} as LayerMetadataMixedUnion,
            error: queryError,
          },
        } as Selection);
      }
    }, [queryMetadata.error]);

    const closeDialog = useCallback(() => {
      onSetOpen(false);
    }, [onSetOpen]);

    const handleAction = useCallback((data: FileActionData): void => {
      const selected = filePickerRef.current?.getFileSelection() as Selection;
      if (data.id === FilePickerActions.OpenFiles.id) {
        const pathFromChain = getSuffixFromFolderChain(selected.folderChain);
        setPathSuffix(pathFromChain);
      } else if (data.id === FilePickerActions.ChangeSelection.id) {
        if (selected) {
          setIsFileSelected(selected.files.length > EMPTY);
        }
      }
    }, []);

    return (
      <Box id="filePickerDialog">
        <Dialog open={isOpen} preventOutsideDismiss={true}>
          <DialogTitle>
            <FormattedMessage id={'general.title.choose'} />
            <IconButton
              className="closeIcon mc-icon-Close"
              label="CLOSE"
              onClick={(): void => {
                closeDialog();
              }}
            />
          </DialogTitle>
          <DialogContent className="dialogBody">
            <FilePickerComponent
              ref={filePickerRef}
              files={files}
              selection={selection}
              isMultiSelection={isMultiSelection(recordType)}
              onFileAction={handleAction}
            />
          </DialogContent>
          <DialogActions>
            <Button
              raised
              type="button"
              disabled={!isFileSelected}
              onClick={(): void => {
                onFilesSelection({
                  ...(filePickerRef.current?.getFileSelection() as Selection),
                  metadata: selection.metadata,
                });
                closeDialog();
              }}
            >
              <FormattedMessage id="general.ok-btn.text" />
            </Button>
            <Button
              type="button"
              onClick={(): void => {
                closeDialog();
              }}
            >
              <FormattedMessage id="general.cancel-btn.text" />
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
);
