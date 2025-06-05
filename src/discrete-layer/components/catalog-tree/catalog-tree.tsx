/* eslint-disable */
/* tslint:disable */

import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { observer } from 'mobx-react';
import {
  changeNodeAtPath,
  getNodeAtPath,
  find,
  ExtendedNodeData,
} from 'react-sortable-tree';
import { useIntl } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { IActionGroup } from '../../../common/actions/entity.actions';
import { TreeComponent, TreeItem } from '../../../common/components/tree';
import { ActionsRenderer } from '../../../common/components/tree/icon-renderers/actions.button-renderer';
import { FootprintRenderer } from '../../../common/components/tree/icon-renderers/footprint.icon-renderer';
import { LayerImageRenderer } from '../../../common/components/tree/icon-renderers/layer-image.icon-renderer';
import { ProductTypeRenderer } from '../../../common/components/tree/icon-renderers/product-type.icon-renderer';
import { Error } from '../../../common/components/tree/statuses/error';
import { Loading } from '../../../common/components/tree/statuses/loading';
import { getStatusStyle } from '../../../common/helpers/style';
import { LinkType } from '../../../common/models/link-type.enum';
import { IDispatchAction } from '../../models/actionDispatcherStore';
import { ILayerImage } from '../../models/layerImage';
import { useStore } from '../../models/RootStore';
import { UserAction } from '../../models/userStore';
import { TabViews } from '../../views/tab-views';
import { BestInEditDialog } from '../dialogs/best-in-edit.dialog';
import { getLinkUrlWithToken } from '../helpers/layersUtils';
import { queue } from '../snackbar/notification-queue';

import './catalog-tree.css';

// @ts-ignore
const keyFromTreeIndex = ({ treeIndex }) => treeIndex;
const getMax = (valuesArr: number[]): number => valuesArr.reduce((prev, current) => (prev > current ? prev : current));
const intialOrder = 0;
const actionDismissibleRegex = new RegExp('actionDismissible');
const nodeOutRegex = new RegExp('toolbarButton|rowContents');

interface CatalogTreeComponentProps {
  refresh?: number;
}

export const CatalogTreeComponent: React.FC<CatalogTreeComponentProps> = observer(
  ({ refresh }) => {
    const store = useStore();
    const [hoveredNode, setHoveredNode] = useState<TreeItem>();
    const [isHoverAllowed, setIsHoverAllowed] = useState<boolean>(true);
    const [isBestInEditDialogOpen, setBestInEditDialogOpen] = useState<boolean>(
      false
    );
    const selectedLayersRef = useRef(intialOrder);
    const intl = useIntl();
    const {
      isLoading: loading,
      setCatalogTreeData,
      setIsDataLoading,
      errorSearch,
      errorCapabilities,
    } = store.catalogTreeStore;
    const treeRawData = store.catalogTreeStore.catalogTreeData as TreeItem[];

    useEffect(() => {
      if (errorCapabilities) {
        queue.notify({
          body: (
            <Error
              className="errorNotification"
              message={errorCapabilities.response?.errors[0].message}
              details={
                errorCapabilities.response?.errors[0].extensions?.exception
                  ?.config?.url
              }
            />
          ),
        });
      } else {
        queue.clearAll();
      }
    }, [errorCapabilities]);

    useEffect(() => {
      if (refresh) {
        setIsDataLoading(true);
        void store.catalogTreeStore.initTree();
      }
    }, [refresh]);

    useEffect(() => {
      void store.catalogTreeStore.initTree();
    }, []);

    const entityPermittedActions = useMemo(() => {
      const entityActions: Record<string, unknown> = {};
      [
        'LayerRasterRecord',
        'Layer3DRecord',
        'LayerDemRecord',
        'VectorBestRecord',
        'QuantizedMeshBestRecord',
      ].forEach((entityName) => {
        const allGroupsActions = store.actionDispatcherStore.getEntityActionGroups(
          entityName
        );
        const permittedGroupsActions = allGroupsActions.map((actionGroup) => {
          return {
            titleTranslationId: actionGroup.titleTranslationId,
            group: actionGroup.group
              .filter((action) => {
                return store.userStore.isActionAllowed(
                  `entity_action.${entityName}.${action.action}`
                ) === false
                  ? false
                  : true && action.views.includes(TabViews.CATALOG);
              })
              .map((action) => {
                return {
                  ...action,
                  titleTranslationId: intl.formatMessage({
                    id: action.titleTranslationId,
                  }),
                };
              }),
          };
        });
        entityActions[entityName] = permittedGroupsActions;
      });
      return entityActions;
    }, [store.userStore.user]);

    useEffect(() => {
      if (store.actionDispatcherStore.action !== undefined) {
        setIsHoverAllowed(true);
      }
    });

    const handleRowClick = useCallback((evt: MouseEvent, rowInfo: ExtendedNodeData) => {
      if (!rowInfo.node.isGroup) {
        let newTreeData = treeRawData;
        if (!evt.ctrlKey) {
          // Remove prev selection
          const selection = find({
            treeData: newTreeData,
            getNodeKey: keyFromTreeIndex,
            searchMethod: (data) => data.node.isSelected,
          });

          selection.matches.forEach(match => {
            const selRowInfo = getNodeAtPath({
              treeData: newTreeData,
              path: match.path,
              getNodeKey: keyFromTreeIndex,
              // ignoreCollapsed: false,
            });

            newTreeData = changeNodeAtPath({
              treeData: newTreeData,
              path: match.path,
              newNode: {
                ...selRowInfo?.node,
                isSelected: false
              },
              getNodeKey: keyFromTreeIndex
            });
          });
        }

        newTreeData = changeNodeAtPath({
          treeData: newTreeData,
          path: rowInfo.path,
          newNode: {
            ...rowInfo.node,
            isSelected: !rowInfo.node.isSelected
          },
          getNodeKey: keyFromTreeIndex
        });

        // console.log('*** MOUSE ROW CLICK *****', (evt.target as any).className);
        if (evt.target !== null && actionDismissibleRegex.test((evt.target as any).className)) {
          setHoveredNode(undefined);
          setIsHoverAllowed(false);
        }

        setCatalogTreeData(newTreeData);
        store.discreteLayersStore.selectLayer(
          rowInfo.node as ILayerImage
        );
      }
    }, [treeRawData]);

    const dispatchAction = (action: Record<string, unknown>): void => {
      store.actionDispatcherStore.dispatchAction({
        action: action.action,
        data: action.data
      } as IDispatchAction);
    };

    if (errorSearch) {
      return (
        <Error
          className="errorMessage"
          message={errorSearch.response?.errors[0].message}
          details={
            errorSearch.response?.errors[0].extensions?.exception?.config?.url
          }
        />
      );
    }

    return (
      <>
        {loading && <Loading />}
        <Box id="catalogContainer" className="catalogContainer">
          {!loading && (
            <TreeComponent
              treeData={treeRawData}
              onChange={treeData => {
                console.log('****** UPDATE TREE DATA ******');
                setCatalogTreeData(treeData);
              }}
              canDrag={({ node }) => {
                return false;
                // return !node.dragDisabled
              }}
              canDrop={({ nextParent }) => {
                return false;
                // return !nextParent || nextParent.isDirectory
              }}
              generateNodeProps={rowInfo => ({
                onClick: (e: MouseEvent) => handleRowClick(e, rowInfo),
                onMouseOver: (evt: MouseEvent) => {
                  if (!rowInfo.node.isGroup && isHoverAllowed) {
                    store.discreteLayersStore.highlightLayer(
                      rowInfo.node as ILayerImage
                    );
                    if (rowInfo.node.id !== hoveredNode?.id) {
                      setHoveredNode({
                        ...rowInfo.node,
                        parentPath: rowInfo.path.slice(0, -1).toString(),
                      });
                    }
                  } else {
                    setHoveredNode(undefined);
                  }
                },
                onMouseOut: (evt: MouseEvent) => {
                  store.discreteLayersStore.highlightLayer(undefined);
                  // console.log('*** MOUSE OUT *****', (evt.target as any).className, nodeOutRegex.test((evt.target as any).className));
                  if (
                    evt.target !== null &&
                    nodeOutRegex.test((evt.target as any).className)
                  ) {
                    setHoveredNode(undefined);
                  }
                },
                style: getStatusStyle(rowInfo.node, 'color'),
                icons: rowInfo.node.isGroup
                  ? []
                  : [
                      <FootprintRenderer
                        data={(rowInfo.node as any) as ILayerImage}
                        onClick={(data, value) => {
                          dispatchAction({
                            action: UserAction.SYSTEM_CALLBACK_SHOWFOOTPRINT,
                            data: { selectedLayer: {...data, footprintShown: value } }
                          });
                        }}
                      />,
                      <LayerImageRenderer
                        data={(rowInfo.node as any) as ILayerImage}
                        onClick={(data, value) => {
                          if (value) {
                            selectedLayersRef.current++;
                          } else {
                            const orders: number[] = [];
                            // eslint-disable-next-line
                            store.discreteLayersStore.layersImages?.forEach(
                              (item: ILayerImage) => {
                                if (
                                  item.layerImageShown === true &&
                                  data.id !== item.id
                                ) {
                                  orders.push(item.order as number);
                                }
                              }
                            );
                            selectedLayersRef.current = orders.length
                              ? getMax(orders)
                              : selectedLayersRef.current - 1;
                          }
                          const order = value
                            ? selectedLayersRef.current
                            : null;
                          store.discreteLayersStore.showLayer(
                            data.id,
                            value,
                            order
                          );
                          data.layerImageShown = value;
                        }}
                      />,
                      <ProductTypeRenderer
                        data={(rowInfo.node as any) as ILayerImage}
                        thumbnailUrl={getLinkUrlWithToken(
                          rowInfo.node.links,
                          LinkType.THUMBNAIL_S
                        )}
                        onClick={(data: ILayerImage, value: boolean) => {
                          dispatchAction({
                            action: UserAction.SYSTEM_CALLBACK_SHOWPOLYGONPARTS,
                            data: { selectedLayer: {...data, polygonPartsShown: value } }
                          });
                        }}
                      />,
                    ],
                buttons: [
                  <>
                    {
                      !rowInfo.node.layerURLMissing &&
                      hoveredNode !== undefined &&
                      hoveredNode.id === rowInfo.node.id && 
                      hoveredNode.parentPath === rowInfo.path.slice(0, -1).toString() && (                      
                        <ActionsRenderer
                          node={rowInfo.node}
                          actions={
                            entityPermittedActions[
                              rowInfo.node.__typename
                            ] as IActionGroup[]
                          }
                          entity={rowInfo.node.__typename}
                          actionHandler={dispatchAction}
                        />
                      )
                    }
                  </>,
                ],
              })}
            />
          )}
        </Box>
        {
          isBestInEditDialogOpen &&
          <BestInEditDialog
            isOpen={isBestInEditDialogOpen}
            onSetOpen={setBestInEditDialogOpen}
          />
        }
      </>
    );
  }
);
