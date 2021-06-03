/* eslint-disable */
/* tslint:disable */

import React, {useEffect, useState} from "react";
import { observer } from "mobx-react";
import { changeNodeAtPath, getNodeAtPath } from 'react-sortable-tree';

import { TreeComponent, TreeItem } from "../../../common/components/tree";

import { useQuery, useStore } from "../../models/RootStore";
import { LayerMetadataMixedUnion } from "../../models/LayerMetadataMixedModelSelector";

import _ from 'lodash';

import { RecordType } from "../../models/RecordTypeEnum";
import { Error } from "./Error"
import { Loading } from "./Loading"
import { FootprintRenderer } from "./icon-renderers/footprint.icon-renderer";
import { LayerImageRenderer } from "./icon-renderers/layer-image.icon-renderer";
import { groupBy } from "../../../common/helpers/group-by";
import { ILayerImage } from "../../models/layerImage";

// @ts-ignore
const keyFromTreeIndex = ({ treeIndex }) => treeIndex;

export const CatalogTreeComponent = observer(() => {
  const { loading, error, data, query } = useQuery((store) =>
    // store.querySearch({})
    store.querySearch({
      start: 1,
      end: 10,
      opts: {
        filter: [
          {
            field: 'mc:type',
            eq: RecordType.RECORD_RASTER
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
  const [selectionPaths, setSelectionPaths] = useState<Array<string | number>[]>([]);
  const [treeRawData, setTreeRawData] = useState<TreeItem[]>(
    [
      { 
        title: 'Chicken',
        isGroup: true,
        children: [
          { title: 'Egg' },
          { title: 'Kukureku' },
        ] 
      },
      {
        title: 'Fish',
        isGroup: true,
        children: [
          { title: 'fingerline' }
        ]
      },
    ],
  );

  useEffect(()=>{
    if(data && data.search){
      const arr: any[] = [];
      data.search.forEach((item) => arr.push({...item}));
  
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
                  if(evt.ctrlKey){
                    // Add to current selection
                    setSelectionPaths([...selectionPaths, rowInfo.path]);
                  }
                  else{
                    // Remove prev selection
                    selectionPaths.forEach(path => {
                      const selRowInfo = getNodeAtPath({
                        treeData: newTreeData,
                        path,
                        getNodeKey: keyFromTreeIndex,
                        ignoreCollapsed: false,
                      });

                      newTreeData = changeNodeAtPath({
                        treeData: newTreeData,
                        path: path,
                        newNode: {
                          ...selRowInfo?.node,
                          isSelected: false
                        },
                        getNodeKey: keyFromTreeIndex
                      });
                    });
                    setSelectionPaths([rowInfo.path]);
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
                  discreteLayersStore.selectLayer(rowInfo.node as ILayerImage);
                  console.log('****** SELECTED NODE *******',rowInfo.node);
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
                    // <div
                    //   style={{
                    //     border: 'solid 1px black',
                    //     fontSize: 8,
                    //     textAlign: 'center',
                    //     marginRight: 10,
                    //     width: 12,
                    //     height: 16,
                    //   }}
                    // >
                    //   F
                    // </div>,
                    <FootprintRenderer
                      data={rowInfo.node}
                      onClick={(data) => console.log('******FOOTPRINT TREE NODE DATA*****', data)}
                    />,
                    <LayerImageRenderer
                      data={rowInfo.node}
                      onClick={(data) => console.log('****** LAYER TREE NODE DATA*****', data)}
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
