/* eslint-disable */
/* tslint:disable */

import React, {useEffect, useState, useRef, useMemo} from 'react';
import { observer } from 'mobx-react';
import { changeNodeAtPath, getNodeAtPath, find } from 'react-sortable-tree';
import { useIntl } from 'react-intl';
import { cloneDeep, get, isEmpty } from 'lodash';
import { Box } from '@map-colonies/react-components';
import CONFIG from '../../../common/config';
import { TreeComponent, TreeItem } from '../../../common/components/tree';
import { Error } from '../../../common/components/tree/statuses/error';
import { Loading } from '../../../common/components/tree/statuses/loading';
import { FootprintRenderer } from '../../../common/components/tree/icon-renderers/footprint.icon-renderer';
import { LayerImageRenderer } from '../../../common/components/tree/icon-renderers/layer-image.icon-renderer';
import { EntityTypeRenderer } from '../../../common/components/tree/icon-renderers/entity-type.icon-renderer';
import { ActionsRenderer } from '../../../common/components/tree/icon-renderers/actions.button-renderer';
import { GroupBy, groupBy } from '../../../common/helpers/group-by';
import { IActionGroup } from '../../../common/actions/entity.actions';
import { useQuery, useStore } from '../../models/RootStore';
import { IDispatchAction } from '../../models/actionDispatcherStore';
import { ILayerImage } from '../../models/layerImage';
import { CapabilityModelType } from '../../models';
import { TabViews } from '../../views/tab-views';
import { BestInEditDialog } from '../dialogs/best-in-edit.dialog';
import { getLayerLink } from '../helpers/layersUtils';
import { isBest } from '../layer-details/utils';
import { queue } from '../snackbar/notification-queue';

import './catalog-tree.css';

// @ts-ignore
const keyFromTreeIndex = ({ treeIndex }) => treeIndex;
const getMax = (valuesArr: number[]): number => valuesArr.reduce((prev, current) => (prev > current) ? prev : current);
const intialOrder = 0;
const actionDismissibleRegex = new RegExp('actionDismissible');
const nodeOutRegex = new RegExp('toolbarButton|rowContents');

interface CatalogTreeComponentProps {
  refresh?: number;
}

export const CatalogTreeComponent: React.FC<CatalogTreeComponentProps> = observer(({refresh}) => {
  const { loading: loadingSearch, error: errorSearch, data: dataSearch, query: querySearch, setQuery: setQuerySearch } = useQuery();
  const { loading: loadingCapabilities, error: errorCapabilities, data: dataCapabilities, query: queryCapabilities, setQuery: setQueryCapabilities } = useQuery();
  const store = useStore();
  const [treeRawData, setTreeRawData] = useState<TreeItem[]>([]);
  const [hoveredNode, setHoveredNode] = useState<TreeItem>();
  const [isHoverAllowed, setIsHoverAllowed] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [isBestInEditDialogOpen, setBestInEditDialogOpen] = useState<boolean>(false);
  const selectedLayersRef = useRef(intialOrder);
  const intl = useIntl();

  useEffect(() => {
    setLoading(loadingSearch || (loadingCapabilities && !errorCapabilities));
  }, [loadingSearch, loadingCapabilities, errorCapabilities]);

  useEffect(() => {
    if (errorCapabilities) {
      const msg = errorCapabilities.message;
      const start = msg.indexOf('"url":"') + 7;
      const end = msg.indexOf('","', start) - 1;
      queue.notify({
        body: <Error class="errorNotification">{`${msg.slice(start, end)}`}</Error>
      });
    }
  }, [errorCapabilities]);

  useEffect(() => {
    setQuerySearch(
      store.querySearch({
        opts: {
          filter: [
            {
              field: 'mc:type',
              eq: store.discreteLayersStore.searchParams.recordType
            }
          ]
        },
        end: CONFIG.RUNNING_MODE.END_RECORD,
        start: CONFIG.RUNNING_MODE.START_RECORD,
      })
      //#region query params
      // store.queryCatalogItems({},`
      // ... on LayerRasterRecord {
      //   __typename
      //   sourceName
      //   creationDate
      //   geometry 
      //   type
      //   links {
      //     __typename
      //     name
      //     description
      //     protocol
      //     url
      //   }
      // }
      // ... on Layer3DRecord {
      //    __typename
      //   sourceName
      //   creationDate
      //   geometry
      //   type
      //   links {
      //     __typename
      //     name
      //     description
      //     protocol
      //     url
      //   }
      //   accuracyLE90
      // }
      // }`)
      //#endregion
    );
  }, [refresh]);

  const buildParentTreeNode = (arr: ILayerImage[], title: string, groupByParams: GroupBy) => {
    const treeDataUnlinked = groupBy(arr, groupByParams);
    return {
      title: title,
      isGroup: true,
      children: treeDataUnlinked.map(item=> {
        return {
            title: item.key['region'],
            isGroup: true,
            children: [...item.items.map(rec => {
              return {
                ...rec,
                title: rec['productName'],
                isSelected: false
              };
            })]
        };
      }) as TreeItem[]
    };
  };

  const entityPermittedActions = useMemo(() => {
    const entityActions: Record<string, unknown> = {};
    ['LayerRasterRecord', 'Layer3DRecord', 'BestRecord', 'LayerDemRecord','VectorBestRecord'].forEach( entityName => {
       const allGroupsActions = store.actionDispatcherStore.getEntityActionGroups(entityName);
       const permittedGroupsActions = allGroupsActions.map((actionGroup) => {
        return {
          titleTranslationId: actionGroup.titleTranslationId,
          group: 
            actionGroup.group.filter(action => {
              return store.userStore.isActionAllowed(`entity_action.${entityName}.${action.action}`) === false ? false : true &&
                    action.views.includes(TabViews.CATALOG);
            })
            .map((action) => {
              return {
                ...action,
                titleTranslationId: intl.formatMessage({ id: action.titleTranslationId }),
              };
            }),
        }
       });
       entityActions[entityName] = permittedGroupsActions;
    })
    return entityActions;
  }, []);

  useEffect(() => {
    if (store.actionDispatcherStore.action !== undefined) {
      setIsHoverAllowed(true);
    }
  });

  useEffect(() => {

    const layersList = get(dataSearch, 'search') as ILayerImage[];

    if (!isEmpty(layersList)) {
      const arr: ILayerImage[] = cloneDeep(layersList);

      store.discreteLayersStore.setLayersImages(arr, false);

      //#region getCapabilities()

      // NOTE:
      // Calling getCapabilities() should happen after querySearch.data
      // It is being called only here in the catalog because the other two places (bestCatalog & searchByPolygon)
      // are subsets of the catalog layers list

      const ids = layersList.map((layer: ILayerImage) => {
        return getLayerLink(layer).name ?? '';
      });
      setQueryCapabilities(
        store.queryCapabilities({
          idList: {
            value: [...ids]
          }
        })
      );

      //#endregion

      // get unlinked/new discretes shortcuts
      const arrUnlinked = arr.filter((item) => {
        // @ts-ignore
        const itemObjectBag =  item as Record<string,unknown>;
        return ('includedInBests' in itemObjectBag) && itemObjectBag.includedInBests === null;
      });
      const parentUnlinked = buildParentTreeNode(
        arrUnlinked,
        intl.formatMessage({ id: 'tab-views.catalog.top-categories.unlinked' }),
        {keys: ['region']}
      );

      // get BESTs shortcuts
      const arrBests = arr.filter(isBest);
      const drafts = store.bestStore.getDrafts();
      const draftNode = (drafts.length > 0) ? [{
        title: intl.formatMessage({ id: 'tab-views.catalog.top-categories.drafts' }),
        isGroup: true,
        children: [...store.bestStore.getDrafts().map(draft => {
          return {
            ...draft,
            title: draft['productName'],
            isSelected: false
          };
        })],
      }] : [];
      const parentBests = {
        title: intl.formatMessage({ id: 'tab-views.catalog.top-categories.bests' }),
        isGroup: true,
        children: [
          ...draftNode,
          ...arrBests.map(item => {
            return {
              ...item,
              title: item['productName'],
              isSelected: false
            };
          })
        ]
      }

      // whole catalog as is
      const parentCatalog = buildParentTreeNode(
        arr,
        intl.formatMessage({ id: 'tab-views.catalog.top-categories.catalog' }),
        {keys: ['region']}
      );

      setTreeRawData(
        [
          parentUnlinked,
          parentCatalog,
          parentBests,
          // parentDrafts,
        ]
      );
    }
  }, [dataSearch]);

  useEffect(() => {
    const capabilitiesList = get(dataCapabilities, 'capabilities') as CapabilityModelType[];
    if (!isEmpty(capabilitiesList)) {
      store.discreteLayersStore.setCapabilities(capabilitiesList);
    }
  }, [dataCapabilities]);

  const dispatchAction = (action: Record<string,unknown>): void => {
    if (!store.bestStore.isBestLoad()) {
      store.actionDispatcherStore.dispatchAction(
        {
          action: action.action,
          data: action.data,
        } as IDispatchAction
      );
    } else {
      setBestInEditDialogOpen(true);
    }
  };

  if (errorSearch) return <Error class="errorMessage">{errorSearch.message}</Error>
  if (dataSearch) {
    return (
      <>
        {
          loading && <Loading/>
        }
        <Box id="catalogContainer" className="catalogContainer">
          {
            !loading && <TreeComponent
              treeData={treeRawData}
              onChange={treeData => {
                console.log('****** UPDATE TREEE DATA *****');
                setTreeRawData(treeData);
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
                onClick: (evt: MouseEvent) => {
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
  
                    setTreeRawData(newTreeData);
                    store.discreteLayersStore.selectLayer(rowInfo.node as ILayerImage);
                  }
                },
                onMouseOver: (evt: MouseEvent) => {
                  if (!rowInfo.node.isGroup && isHoverAllowed) {
                    store.discreteLayersStore.highlightLayer(rowInfo.node as ILayerImage);
                    setHoveredNode(rowInfo.node);
                  } else {
                    setHoveredNode(undefined);
                  }
                },
                onMouseOut: (evt: MouseEvent) => {
                  store.discreteLayersStore.highlightLayer(undefined);
                  // console.log('*** MOUSE OUT *****', (evt.target as any).className, nodeOutRegex.test((evt.target as any).className));
                  if (evt.target !== null && nodeOutRegex.test((evt.target as any).className)) {
                    setHoveredNode(undefined);
                  }
                },
                icons: rowInfo.node.isGroup
                  ? []
                  : [
                      <FootprintRenderer
                        data={(rowInfo.node as any) as ILayerImage}
                        onClick={(data, value) => {
                          store.discreteLayersStore.showFootprint(data.id, value);
                          data.footprintShown = value;
                        }}
                      />,
                      <LayerImageRenderer
                        data={(rowInfo.node as any) as ILayerImage}
                        onClick={(data, value) => {
                          if(value) {
                            selectedLayersRef.current++;
                          }
                          else {
                            const orders: number[] = [];
                            // eslint-disable-next-line
                            store.discreteLayersStore.layersImages?.forEach((item: ILayerImage)=> {
                              if(item.layerImageShown === true && data.id !== item.id) {
                                orders.push(item.order as number);
                              }
                            });
                            selectedLayersRef.current = (orders.length) ? getMax(orders) : selectedLayersRef.current-1;
                          }
                          const order = value ? selectedLayersRef.current : null;
                          store.discreteLayersStore.showLayer(data.id, value, order);
                          data.layerImageShown = value;
                        }}
                      />,
                      <EntityTypeRenderer data={(rowInfo.node as any) as ILayerImage}/>
                    ],
                buttons: [
                  <>
                    {
                      (hoveredNode !== undefined && hoveredNode.id === rowInfo.node.id) && 
                      <ActionsRenderer 
                        node={rowInfo.node} 
                        actions = {entityPermittedActions[rowInfo.node.__typename] as IActionGroup[]}
                        entity = {rowInfo.node.__typename}
                        actionHandler = {dispatchAction}
                      />
                    }
                  </>
                ]
              })}
            />
          }
        </Box>
        {
          isBestInEditDialogOpen &&
          <BestInEditDialog
            isOpen={isBestInEditDialogOpen}
            onSetOpen={setBestInEditDialogOpen}/>
        }
      </>
    );
  }
  return (<><Loading/></>);
});

