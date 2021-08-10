/* eslint-disable */
/* tslint:disable */

import React, {useEffect, useState, useRef} from 'react';
import { observer } from 'mobx-react';
import { changeNodeAtPath, getNodeAtPath, find } from 'react-sortable-tree';
import { useIntl } from 'react-intl';
import { CircularProgress, IconButton, Tooltip } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { TreeComponent, TreeItem } from '../../../common/components/tree';
import { Error } from '../../../common/components/tree/statuses/Error';
import { Loading } from '../../../common/components/tree/statuses/Loading';
import { GroupBy, groupBy } from '../../../common/helpers/group-by';
import { useQuery, useStore } from '../../models/RootStore';
import { ILayerImage } from '../../models/layerImage';
import { RecordType } from '../../models/RecordTypeEnum';
import { BestRecordModelType } from '../../models';
import { FootprintRenderer } from './icon-renderers/footprint.icon-renderer';
import { LayerImageRenderer } from './icon-renderers/layer-image.icon-renderer';

import './catalog-tree.css';

// @ts-ignore
const keyFromTreeIndex = ({ treeIndex }) => treeIndex;
const getMax = (valuesArr: number[]): number => valuesArr.reduce((prev, current) => (prev > current) ? prev : current);
const intialOrder = 0;

export const CatalogTreeComponent: React.FC = observer(() => {
  const { loading, error, data, query } = useQuery((store) =>
    // store.querySearch({})
    store.querySearch({
      opts: {
        filter: [
          {
            field: 'mc:type',
            eq: RecordType.RECORD_ALL
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
  );

  const store = useStore();
  const [treeRawData, setTreeRawData] = useState<TreeItem[]>([]);
  const selectedLayersRef = useRef(intialOrder);
  const intl = useIntl();

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

  useEffect(()=>{
    if(data && data.search){
      const arr: ILayerImage[] = [];
      data.search.forEach((item) => arr.push({...item}));

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
  },[data]);

  if (error) return <Error>{error.message}</Error>
  if (data) {
    return (
      <>
        {loading ? (
          <>
            <CircularProgress className="refreshIconButton"/>
            <Loading/>
          </>
        ) : (
          <Tooltip content={intl.formatMessage({ id: 'action.refresh.tooltip' })}>
            <IconButton icon="autorenew" className="refreshIconButton" onClick={(): void => { void query!.refetch(); }}/>
          </Tooltip>
        )}

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

                    setTreeRawData(newTreeData);
                    store.discreteLayersStore.selectLayer(rowInfo.node as ILayerImage);
                  }
                },
                onMouseOver: (evt: MouseEvent) => {
                  if(!rowInfo.node.isGroup){
                    store.discreteLayersStore.highlightLayer(rowInfo.node as ILayerImage);
                  }
                },
                onMouseOut: (evt: MouseEvent) => {
                  store.discreteLayersStore.highlightLayer(undefined);
                },
                icons: rowInfo.node.isGroup
                  ? [
                      // <div
                      //   style={{
                      //     borderLeft: 'solid 8px gray',
                      //     borderBottom: 'solid 10px gray',
                      //     marginRight: 10,
                      //     boxSizing: 'border-box',
                      //     width: 16,
                      //     height: 12,
                      //     filter: rowInfo.node.expanded
                      //       ? 'drop-shadow(1px 0 0 gray) drop-shadow(0 1px 0 gray) drop-shadow(0 -1px 0 gray) drop-shadow(-1px 0 0 gray)'
                      //       : 'none',
                      //     borderColor: rowInfo.node.expanded ? 'white' : 'gray',
                      //   }}
                      // />,
                    ]
                  : [
                      <FootprintRenderer
                        data={(rowInfo.node as any) as ILayerImage}
                        onClick={(data, value) => {
                          store.discreteLayersStore.showFootprint(data.id, value);
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
                        }}
                      />
                    ],
                buttons: rowInfo.node.isDraft ? [
                  <>
                    <Tooltip content={intl.formatMessage({ id: 'field.actions.edit-draft' })}>
                      <IconButton
                        className="actionIcon glow-missing-icon"
                        icon="edit"
                        label="EDIT BEST"
                        onClick={ (): void => { store.bestStore.editBest(rowInfo.node as BestRecordModelType); } }/>
                    </Tooltip>
                  </>,
                ]
                : [],
              })}
            />
          }
        </Box>
      </>
    );
  }
  return (<><Loading/></>);
});
