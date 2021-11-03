/* eslint-disable */
/* tslint:disable */

import React, {useEffect, useState, useRef, useMemo} from 'react';
import { observer } from 'mobx-react';
import { changeNodeAtPath, getNodeAtPath, find } from 'react-sortable-tree';
import { useIntl } from 'react-intl';
import { get, isEmpty } from 'lodash';
import { Box } from '@map-colonies/react-components';
import { TreeComponent, TreeItem } from '../../../common/components/tree';
import { Error } from '../../../common/components/tree/statuses/Error';
import { Loading } from '../../../common/components/tree/statuses/Loading';
import { FootprintRenderer } from '../../../common/components/tree/icon-renderers/footprint.icon-renderer';
import { LayerImageRenderer } from '../../../common/components/tree/icon-renderers/layer-image.icon-renderer';
import { EntityTypeRenderer } from '../../../common/components/tree/icon-renderers/entity-type.icon-renderer';
import { ActionsRenderer } from '../../../common/components/tree/icon-renderers/actions.button-renderer';
import { GroupBy, groupBy } from '../../../common/helpers/group-by';
import { IActionGroup } from '../../../common/actions/entity.actions';
import { useQuery, useStore } from '../../models/RootStore';
import { IDispatchAction } from '../../models/actionDispatcherStore';
import { ILayerImage } from '../../models/layerImage';
import { TabViews } from '../../views/tab-views';
import { BestinEditDialogComponent } from '../dialogs/best-in-edit.dialog';

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
  const { loading, error, data, query, setQuery } = useQuery();

  const store = useStore();
  const [treeRawData, setTreeRawData] = useState<TreeItem[]>([]);
  const [hoveredNode, setHoveredNode] = useState<TreeItem>();
  const [isHoverAllowed, setIsHoverAllowed] = useState<boolean>(true);
  const [isBestInEditDialogOpen, setBestInEditDialogOpen] = useState<boolean>(false);
  const selectedLayersRef = useRef(intialOrder);
  const intl = useIntl();

  useEffect(() => {
    setQuery(
      store.querySearch({
        opts: {
          filter: [
            {
              field: 'mc:type',
              eq: store.discreteLayersStore.searchParams.recordType
            }
          ]
        }
      })

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
    )
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
    ['LayerRasterRecord', 'Layer3DRecord', 'BestRecord'].forEach( entityName => {
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
       // entityActions[entityName] = getEntityActionGroups(entityName);
    })
    return entityActions;
  }, []);

  useEffect(() => {
    if(store.actionDispatcherStore.action !== undefined){
      setIsHoverAllowed(true);
    }
  });

  useEffect(() => {

    const layersList = get(data,'search') as ILayerImage[];
    if (!isEmpty(layersList)) {
      const arr: ILayerImage[] = [];
      layersList.forEach((item) => arr.push({...item}));

      store.discreteLayersStore.setLayersImages(arr, false);

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
      const arrBests = arr.filter((item) => {
        // @ts-ignore
        const itemObjectBag =  item as Record<string,unknown>;
        return ('discretes' in itemObjectBag) && itemObjectBag.discretes !== null;
      });
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
          ...arrBests.map(item=> {
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
  }, [data]);

  const dispatchAction = (action: Record<string,unknown>): void => {
    if(!store.bestStore.isBestLoad()) {
      store.actionDispatcherStore.dispatchAction(
        {
          action: action.action,
          data: action.data,
        } as IDispatchAction
      );
    }
    else {
      setBestInEditDialogOpen(true);
    }
  };

  if (error) return <Error>{error.message}</Error>
  if (data) {
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
                  if(!rowInfo.node.isGroup){
                    let newTreeData = treeRawData;
                    if(!evt.ctrlKey){
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
                    if(evt.target !== null && actionDismissibleRegex.test((evt.target as any).className)){
                      setHoveredNode(undefined);
                      setIsHoverAllowed(false);
                    }
  
                    setTreeRawData(newTreeData);
                    store.discreteLayersStore.selectLayer(rowInfo.node as ILayerImage);
                  }
                },
                onMouseOver: (evt: MouseEvent) => {
                  if(!rowInfo.node.isGroup && isHoverAllowed){
                    store.discreteLayersStore.highlightLayer(rowInfo.node as ILayerImage);

                    setHoveredNode(rowInfo.node);
                  }
                  else{
                    setHoveredNode(undefined);
                  }
                },
                onMouseOut: (evt: MouseEvent) => {
                  store.discreteLayersStore.highlightLayer(undefined);
                  // console.log('*** MOUSE OUT *****', (evt.target as any).className, nodeOutRegex.test((evt.target as any).className));
                  if(evt.target !== null && nodeOutRegex.test((evt.target as any).className)){
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
          <BestinEditDialogComponent
            isOpen={isBestInEditDialogOpen}
            onSetOpen={setBestInEditDialogOpen}/>
        }
      </>
    );
  }
  return (<><Loading/></>);
});
