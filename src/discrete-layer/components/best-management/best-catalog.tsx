/* eslint-disable */
/* tslint:disable */

import React, {useEffect, useState, useRef} from 'react';
import { observer } from 'mobx-react';
import { changeNodeAtPath, getNodeAtPath, find } from 'react-sortable-tree';
import { useIntl } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { TreeComponent, TreeItem } from '../../../common/components/tree';
import { GroupBy, groupBy } from '../../../common/helpers/group-by';
import { useQuery, useStore } from '../../models/RootStore';
import { ILayerImage } from '../../models/layerImage';
import { RecordType } from '../../models/RecordTypeEnum';
import { BestRecordModelType } from '../../models';
import { Error } from '../catalog-tree/Error';
import { Loading } from '../catalog-tree/Loading';
import { FootprintRenderer } from '../catalog-tree/icon-renderers/footprint.icon-renderer';
import { LayerImageRenderer } from '../catalog-tree/icon-renderers/layer-image.icon-renderer';

import './best-catalog.css';

// @ts-ignore
const keyFromTreeIndex = ({ treeIndex }) => treeIndex;
const getMax = (valuesArr: number[]): number => valuesArr.reduce((prev, current) => (prev > current) ? prev : current);
const intialOrder = 0;

export const BestCatalogComponent: React.FC = observer(() => {
  const { loading, error, data, query } = useQuery((store) =>
    store.querySearch({
      opts: {
        filter: [
          {
            field: 'mc:type',
            eq: RecordType.RECORD_RASTER
          }
        ]
      }
    })
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

  useEffect(() => {
    if (data && data.search) {
      const arr: ILayerImage[] = [];
      data.search.forEach((item) => arr.push({...item}));

      store.discreteLayersStore.setLayersImages(arr, false);
      
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
        ]
      );
    }
  },[data]);

  if (error) return <Error>{error.message}</Error>
  if (data) {
    return (
      <>
        <Box id="bestCatalogContainer" className="bestCatalogContainer">
          {loading && <Loading/>}

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
                  <button
                    style={{
                      padding: 0,
                      borderRadius: '100%',
                      backgroundColor: 'gray',
                      color: 'white',
                      width: 16,
                      height: 16,
                      border: 0,
                      fontWeight: 100,
                    }}
                    onClick={() => {
                      store.bestStore.editBest(rowInfo.node as BestRecordModelType)
                    }}
                  >
                    i
                  </button>,
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
