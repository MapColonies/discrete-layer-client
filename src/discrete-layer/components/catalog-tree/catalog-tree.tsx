/* eslint-disable */
/* tslint:disable */

import React, {useEffect, useState, useRef} from "react";
import { observer } from "mobx-react";
import { changeNodeAtPath, getNodeAtPath, find } from 'react-sortable-tree';

import { TreeComponent, TreeItem } from "../../../common/components/tree";

import { useQuery, useStore } from "../../models/RootStore";

import _ from 'lodash';

import { groupBy } from "../../../common/helpers/group-by";
import { ILayerImage } from "../../models/layerImage";
import { RecordType } from "../../models/RecordTypeEnum";
import { Error } from "./Error"
import { Loading } from "./Loading"
import { FootprintRenderer } from "./icon-renderers/footprint.icon-renderer";
import { LayerImageRenderer } from "./icon-renderers/layer-image.icon-renderer";

// @ts-ignore
const keyFromTreeIndex = ({ treeIndex }) => treeIndex;
const getMax = (valuesArr: number[]): number => valuesArr.reduce((prev, current) => (prev > current) ? prev : current);
const intialOrder = 0;

export const CatalogTreeComponent = observer(() => {
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

  const { discreteLayersStore } = useStore();
  const [treeRawData, setTreeRawData] = useState<TreeItem[]>([]);
  const selectedLayersRef = useRef(intialOrder);

  useEffect(()=>{
    if(data && data.search){
      const arr: ILayerImage[] = [];
      data.search.forEach((item) => arr.push({...item}));

      discreteLayersStore.setLayersImages(arr, false);
  
      const treeData = groupBy(arr, {keys: ['region']});
      setTreeRawData(treeData.map(item=> {
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
      }) as TreeItem[]);
    }
  },[data]);

  if (error) return <Error>{error.message}</Error>
  if (data){
    

    return (
      <>
        {loading ? (
          <Loading />
        ) : (
          <button onClick={query!.refetch}>Refetch</button>
        )}

        <div style={{ 
          height: '100%',
          margin: '0 12px'
        }}>
          <TreeComponent
            treeData={treeRawData}
            onChange={treeData => {
              console.log('****** UPDATE TREEE DATA *****')
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
                  discreteLayersStore.selectLayerByID((rowInfo.node as ILayerImage).id);
                }
              },
              onMouseOver: (evt: MouseEvent) => {
                if(!rowInfo.node.isGroup){
                  discreteLayersStore.highlightLayer(rowInfo.node as ILayerImage);
                }
              },
              onMouseOut: (evt: MouseEvent) => {
                discreteLayersStore.highlightLayer(undefined);
              },
              icons: rowInfo.node.isGroup
                ? [
                    <div
                      style={{
                        borderLeft: 'solid 8px gray',
                        borderBottom: 'solid 10px gray',
                        marginRight: 10,
                        boxSizing: 'border-box',
                        width: 16,
                        height: 12,
                        filter: rowInfo.node.expanded
                          ? 'drop-shadow(1px 0 0 gray) drop-shadow(0 1px 0 gray) drop-shadow(0 -1px 0 gray) drop-shadow(-1px 0 0 gray)'
                          : 'none',
                        borderColor: rowInfo.node.expanded ? 'white' : 'gray',
                      }}
                    />,
                  ]
                : [
                    <FootprintRenderer
                      data={(rowInfo.node as any) as ILayerImage}
                      onClick={(data, value) => {
                        discreteLayersStore.showFootprint(data.id, value);
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
                          discreteLayersStore.layersImages?.forEach((item: ILayerImage)=> {
                            if(item.layerImageShown === true && data.id !== item.id) {
                              orders.push(item.order as number);
                            }
                          });
                          selectedLayersRef.current = (orders.length) ? getMax(orders) : selectedLayersRef.current-1;
                        }
                        const order = value ? selectedLayersRef.current : null;
                        discreteLayersStore.showLayer(data.id, value, order);
                      }}
                    />
                  ],
              buttons: [
                // <button
                //   style={{
                //     padding: 0,
                //     borderRadius: '100%',
                //     backgroundColor: 'gray',
                //     color: 'white',
                //     width: 16,
                //     height: 16,
                //     border: 0,
                //     fontWeight: 100,
                //   }}
                //   onClick={() => {
                //     console.log('**** alertNodeInfo ****')
                //   }}
                // >
                //   i
                // </button>,
              ],
            })}
          />
        </div>
      </>
    )
  }
  return (<><Loading /></>)
})
