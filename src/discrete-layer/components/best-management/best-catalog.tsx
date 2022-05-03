/* eslint-disable */
/* tslint:disable */

import React, {useEffect, useState, useRef, forwardRef, useImperativeHandle} from 'react';
import { observer } from 'mobx-react';
import { changeNodeAtPath, getNodeAtPath, find } from 'react-sortable-tree';
import { useIntl } from 'react-intl';
import { cloneDeep, get, isEmpty } from 'lodash';
import { Box } from '@map-colonies/react-components';
import { TreeComponent, TreeItem } from '../../../common/components/tree';
import { Error } from '../../../common/components/tree/statuses/error';
import { Loading } from '../../../common/components/tree/statuses/loading';
import { ImportRenderer } from '../../../common/components/tree/icon-renderers/import.icon-renderer';
import { LayerImageRenderer } from '../../../common/components/tree/icon-renderers/layer-image.icon-renderer';
import { EntityTypeRenderer } from '../../../common/components/tree/icon-renderers/entity-type.icon-renderer';
import { GroupBy, groupBy, KeyPredicate } from '../../../common/helpers/group-by';
import { useQuery, useStore } from '../../models/RootStore';
import { ILayerImage } from '../../models/layerImage';
import { LayerRasterRecordModelType } from '../../models/LayerRasterRecordModel';
import { RecordType } from '../../models/RecordTypeEnum';
import { DiscreteOrder } from '../../models/DiscreteOrder';
import { isDiscrete } from '../layer-details/utils';

import './best-catalog.css';

// @ts-ignore
const keyFromTreeIndex = ({ treeIndex }) => treeIndex;
const getMax = (valuesArr: number[]): number => valuesArr.reduce((prev, current) => (prev > current) ? prev : current);
const INITIAL_ORDER = 0;
const IMMEDIATE_EXECUTION = 0;

interface BestCatalogComponentProps {
  filterOut: DiscreteOrder[] | undefined | null;
  handleImportLayerSelected: (isSelected: boolean) => void;
}

export const BestCatalogComponent: React.FC<BestCatalogComponentProps> = observer(forwardRef((props, ref) => {
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
  const [importList, setImportList] = useState<LayerRasterRecordModelType[]>([]);
  const selectedLayersRef = useRef(INITIAL_ORDER);
  const intl = useIntl();
  const discretesIds = props.filterOut?.map((item) => item.id);

  useImperativeHandle(ref, () => ({
    getImportList: (): LayerRasterRecordModelType[] => {
      return importList;
    }
  }));

  const addToImportList = (layer: LayerRasterRecordModelType): void  => {
    const ids = importList?.map(item => item.id);
    if (isEmpty(importList)) {
      props.handleImportLayerSelected(true);
    }
    if (isEmpty(importList) || !ids.includes(layer.id)) {
      setImportList([...importList ?? [], { ...layer }]);
    }
  };

  const removeFromImportList = (layerId: string): void => {
    if (importList.length === 1 && importList?.map(item => item.id).includes(layerId)) {
      props.handleImportLayerSelected(false);
    }
    setImportList(importList?.filter(item => item.id !== layerId));
  };

  const buildParentTreeNode = (arr: ILayerImage[], title: string, groupByParams: GroupBy) => {
    const treeDataUnlinked = groupBy(arr, groupByParams);
    return {
      title: title,
      isGroup: true,
      children: treeDataUnlinked.map(item => {
        return {
          title: (groupByParams.keys.find(k => k.name === 'region') as KeyPredicate).predicate(item.key['region']),
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

    const layersList = get(data, 'search') as ILayerImage[];

    if (!isEmpty(layersList)) {
      const arr: ILayerImage[] = cloneDeep(layersList.filter((item) => !discretesIds?.includes(item.id) && isDiscrete(item)));

      store.discreteLayersStore.setLayersImagesData([...arr]);
      
      // get unlinked/new discretes shortcuts
      const arrUnlinked = arr.filter((item) => {
        // @ts-ignore
        const itemObjectBag = item as Record<string,unknown>;
        return ('includedInBests' in itemObjectBag) && itemObjectBag.includedInBests === null;
      });
      const parentUnlinked = buildParentTreeNode(
        arrUnlinked,
        intl.formatMessage({ id: 'tab-views.catalog.top-categories.unlinked' }),
        {keys: [{ name: 'region', predicate: (val) => val?.join(',') }]}
      );

      // whole catalog as is
      const parentCatalog = buildParentTreeNode(
        arr,
        intl.formatMessage({ id: 'tab-views.catalog.top-categories.catalog' }),
        {keys: [{ name: 'region', predicate: (val) => val?.join(',') }]}
      );

      setTreeRawData(
        [
          parentUnlinked,
          parentCatalog,
        ]
      );
    }
  }, [data]);

  if (error) return (<Error className="errorMessage">{error.message}</Error>);
  if (data) {
    return (
      <>
        <Box id="bestCatalogContainer" className="bestCatalogContainer">
          {
            loading && <Loading/>
          }
          {
            !loading && <TreeComponent
              treeData={treeRawData}
              onChange={treeData => {
                console.log('****** UPDATE TREE DATA ******');
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
                  ? []
                  : [
                      <ImportRenderer
                        data={(rowInfo.node as any) as LayerRasterRecordModelType}
                        onClick={(layer, isSelected) => {
                          layer.isNewlyAddedToBest = isSelected;
                          if (isSelected) {
                            addToImportList(layer);
                          } else {
                            removeFromImportList(layer.id);
                          }
                        }}
                      />,
                      <LayerImageRenderer
                        data={(rowInfo.node as any) as ILayerImage}
                        onClick={(data, value) => {
                          if (value) {
                            selectedLayersRef.current++;
                            store.discreteLayersStore.addPreviewedLayer(data.id as string);
                          } else {
                            const orders: number[] = [];
                            // eslint-disable-next-line
                            store.discreteLayersStore.layersImages?.forEach((item: ILayerImage)=> {
                              if (item.layerImageShown === true && data.id !== item.id) {
                                orders.push(item.order as number);
                              }
                            });
                            selectedLayersRef.current = (orders.length) ? getMax(orders) : selectedLayersRef.current-1;
                            store.discreteLayersStore.removePreviewedLayer(data.id as string);
                          }
                          const order = value ? selectedLayersRef.current : null;
                          setTimeout(()=>{ store.discreteLayersStore.showLayer(data.id as string, value, order); }, IMMEDIATE_EXECUTION);
                          data.layerImageShown = value;
                        }}
                      />,
                      <EntityTypeRenderer data={(rowInfo.node as any) as ILayerImage}/>
                    ],
                buttons: [],
              })}
            />
          }
        </Box>
      </>
    );
  }
  return (<><Loading/></>);
}));
