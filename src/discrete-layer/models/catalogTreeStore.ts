/* eslint-disable @typescript-eslint/naming-convention */
import { createIntl } from 'react-intl';
import {
  changeNodeAtPath,
  getNodeAtPath,
  find,
  addNodeUnderParent,
  TreeItem,
  GetNodeKeyFunction,
  NodeData,
  removeNodeAtPath,
  TreePath,
} from 'react-sortable-tree';
import { types, getParent, flow } from 'mobx-state-tree';
import { cloneDeep, get, isEmpty } from 'lodash';
import CONFIG from '../../common/config';
import { GroupBy, groupBy, KeyPredicate } from '../../common/helpers/group-by';
import MESSAGES from '../../common/i18n';
import { ResponseState } from '../../common/models/response-state.enum';
import { getLayerLink } from '../components/helpers/layersUtils';
import { existStatus, isUnpublished } from '../../common/helpers/style';
import { isBest } from '../components/layer-details/utils';
import { CapabilityModelType } from './CapabilityModel';
import { ILayerImage } from './layerImage';
import { ModelBase } from './ModelBase';
import { IRootStore, RootStoreType } from './RootStore';
import { RecordType } from './';

const NONE = 0;
const TOP_LEVEL_GROUP_BY_FIELD = 'region';
const INNER_SORT_FIELD = 'productName';

const locale = CONFIG.I18N.DEFAULT_LANGUAGE;
const intl = createIntl({ locale, messages: MESSAGES[locale] as Record<string, string> });

const getLayerTitle = (product: ILayerImage): string => {
  const PRODUCT_TITLE_PROPERTY = 'productName';

  return product[PRODUCT_TITLE_PROPERTY] as string;
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
const alphabeticalSort = (sortByField = INNER_SORT_FIELD) => (a: Record<string, unknown>, b: Record<string, unknown>): number => (a[sortByField] as string)?.localeCompare(b[sortByField] as string);

interface IGetParentNode {
  parentNode: NodeData | undefined;
  path: (string | number)[];
}

/* eslint-disable */
/* tslint:disable */
const buildParentTreeNode = (
  arr: ILayerImage[],
  title: string,
  groupByParams: GroupBy
): {
  title: string;
  isGroup: boolean;
  children: TreeItem[];
} => {
  const regionPredicate = (groupByParams.keys.find(
    (k) => k.name === TOP_LEVEL_GROUP_BY_FIELD
  ) as KeyPredicate).predicate;
  const treeData = groupBy(arr, groupByParams);
  return {
    title: title,
    isGroup: true,
    children: treeData
      .sort((a, b) =>
        regionPredicate(a.key[TOP_LEVEL_GROUP_BY_FIELD]).localeCompare(
          regionPredicate(b.key[TOP_LEVEL_GROUP_BY_FIELD])
        )
      )
      .map((item) => {
        return {
          title: regionPredicate(item.key[TOP_LEVEL_GROUP_BY_FIELD]),
          isGroup: true,
          children: [
            ...item.items
              .sort(alphabeticalSort())
              .map((rec) => {
                return {
                  ...rec,
                  title: getLayerTitle(rec),
                  isSelected: false,
                };
              }),
          ],
        };
      }) as TreeItem[],
  };
};

const keyFromTreeIndex: GetNodeKeyFunction = ({ treeIndex }) => treeIndex;

/* eslint-enable */

export const catalogTreeStore = ModelBase.props({
  state: types.enumeration<ResponseState>(
    'State',
    Object.values(ResponseState)
  ),
  catalogTreeData: types.maybe(types.frozen<TreeItem[]>([])),
  isLoading: types.maybe(types.frozen<boolean>(true)),
  errorSearch: types.maybe(types.frozen<any>(null)),
  errorCapabilities: types.maybe(types.frozen<any>(null)),
})
  .views((self) => ({
    get store(): IRootStore {
      return self.__getStore<RootStoreType>();
    },
    get root(): IRootStore {
      return getParent(self);
    },
  }))
  .actions((self) => {
    const store = self.root;

    function setSearchError(error: unknown): void {
      self.errorSearch = error;
    }

    function setErrorCapabilities(error: unknown): void {
      self.errorCapabilities = error;
    }

    function setIsDataLoading(isLoading: boolean): void {
      self.isLoading = isLoading;
    }

    function setCatalogTreeData(catalogTreeData: TreeItem[]): void {
      self.catalogTreeData = catalogTreeData;
    }

    function resetCatalogTreeData(): void {
      store.discreteLayersStore.setLayersImages([], false);
      setCatalogTreeData([]);
    }

    /**
     * Fetch new catalog data
     */
    const catalogSearch = flow(function* catalogSearchGen(): Generator<
      Promise<{ search: ILayerImage[] }>,
      ILayerImage[],
      ILayerImage[]
    > {
      const search = store.querySearch({
        opts: {
          filter: [
            {
              field: 'mc:type',
              eq: store.discreteLayersStore.searchParams.recordType,
            },
          ],
        },
        end: CONFIG.RUNNING_MODE.END_RECORD,
        start: CONFIG.RUNNING_MODE.START_RECORD,
      });

      try {
        setSearchError(null);

        // Avoiding the cache with the refetch
        const dataSearch = yield search.refetch();

        const layersList = get(dataSearch, 'search') as ILayerImage[];
        const layersImages: ILayerImage[] = cloneDeep(layersList);
        
        return store.discreteLayersStore.setLayersImages(layersImages, false);
      } catch (e) {
        setSearchError(search.error);
        resetCatalogTreeData();
        setIsDataLoading(false);
        return [];
      }
    });

    /**
     * Initial tree data, fetch new entries from server
     */
    const initTree = flow(function* initTree(): Generator<
      Promise<ILayerImage[]> | Promise<{ capabilities: CapabilityModelType[] }>,
      void,
      ILayerImage[]
    > {
      let capabilitiesQuery;
      try {
        setIsDataLoading(true);
        resetCatalogTreeData();

        const layersList = yield catalogSearch();

        if (typeof layersList !== 'undefined' && (layersList as ILayerImage[] | null) !== null) {

          //#region getCapabilities()

          // NOTE:
          // Calling getCapabilities() should happen after querySearch.data
          // It is being called only here in the catalog because the other two places (bestCatalog & searchByPolygon)
          // are subsets of the catalog layers list

          // eslint-disable-next-line @typescript-eslint/naming-convention
          const { RECORD_ALL, RECORD_RASTER } = RecordType;
          try {
            const withCapabilities = [RECORD_RASTER];
            if (
              [RECORD_ALL, ...withCapabilities].includes(
                store.discreteLayersStore.searchParams.recordType as RecordType
              )
            ) {
              const groupBy = <T, K extends keyof any>(
                list: T[],
                getKey: (item: T) => K,
                setItem: (item: T) => any
              ): Record<K, T[]> =>
                list.reduce((previous, currentItem) => {
                  const group = getKey(currentItem);
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                  if (!previous[group]) previous[group] = [];
                  previous[group].push(setItem(currentItem));
                  return previous;
                }, {} as Record<K, T[]>);
              const ids = groupBy(
                layersList,
                (l) => l.type as RecordType,
                (l) => getLayerLink(l).name ?? ''
              );
              const idList = [];
              for (const [key, value] of Object.entries(ids)) {
                if (withCapabilities.includes(key as RecordType)) {
                  idList.push({
                    recordType: key,
                    idList: value,
                  });
                }
              }
              capabilitiesQuery = store.queryCapabilities({
                // @ts-ignore
                params: { data: idList },
              });

              const dataCapabilities = yield capabilitiesQuery.refetch();

              const capabilitiesList = get(
                dataCapabilities,
                'capabilities'
              ) as CapabilityModelType[];

              if (!isEmpty(capabilitiesList)) {
                store.discreteLayersStore.setCapabilities(capabilitiesList);
              }
            }
          } catch(e) {
            // If getCapabilities request failed, show catalog tree and display relevant error message
            setErrorCapabilities(capabilitiesQuery?.error);
          }

          //#endregion

          // get unlinked/new discretes shortcuts
          /*const arrUnlinked = arr.filter((item) => {
            // @ts-ignore
            const itemObjectBag = item as Record<string,unknown>;
            return ('includedInBests' in itemObjectBag) && itemObjectBag.includedInBests === null;
            });
            const parentUnlinked = buildParentTreeNode(
              arrUnlinked,
              intl.formatMessage({ id: 'tab-views.catalog.top-categories.unlinked' }),
              {keys: [{ name: 'region', predicate: (val) => val?.join(',') }]}
            );*/

          // get unpublished/new discretes
          const arrUnpublished = layersList.filter((item) => {
            // @ts-ignore
            const itemObjectBag = item as Record<string, unknown>;
            return (
              existStatus(itemObjectBag) && isUnpublished(itemObjectBag)
            );
          });

          const parentUnpublished = {
            title: intl.formatMessage({
              id: 'tab-views.catalog.top-categories.unpublished',
            }),
            isGroup: true,
            children: [
              ...arrUnpublished.map((item) => {
                return {
                  ...item,
                  title: getLayerTitle(item),
                  isSelected: false,
                };
              }),
            ],
          };

          // get BESTs shortcuts
          const arrBests = layersList.filter(isBest);
          const drafts = store.bestStore.getDrafts();
          const draftNode =
            drafts.length > NONE
              ? [
                  {
                    title: intl.formatMessage({
                      id: 'tab-views.catalog.top-categories.drafts',
                    }),
                    isGroup: true,
                    children: [
                      ...store.bestStore.getDrafts().map((draft) => {
                        return {
                          ...draft,
                          title: getLayerTitle(draft),
                          isSelected: false,
                        };
                      }),
                    ],
                  },
                ]
              : [];
          const parentBests = {
            title: intl.formatMessage({
              id: 'tab-views.catalog.top-categories.bests',
            }),
            isGroup: true,
            children: [
              ...draftNode,
              ...arrBests.map((item) => {
                return {
                  ...item,
                  title: getLayerTitle(item),
                  isSelected: false,
                };
              }),
            ],
          };

          // whole catalog as is
          const parentCatalog = buildParentTreeNode(
            layersList,
            intl.formatMessage({
              id: 'tab-views.catalog.top-categories.catalog',
            }),
            /* eslint-disable */
            { keys: [{ name: 'region', predicate: (val) => val?.join(',') }] }
            /* eslint-enable */
          );

          const isUserAdmin = store.userStore.isUserAdmin();

          setCatalogTreeData([
            parentCatalog, 
            parentBests, 
            ...(isUserAdmin ? [parentUnpublished] : [])
          ]);
          setIsDataLoading(false);
        }
      } catch (e) {
        setIsDataLoading(false);
        resetCatalogTreeData();
      }
    });

    // Tree manipulations actions

    /**
     * Same as changeNodeAtPath from react-sortable-tree, defaults to our tree in store and our geNodeKey function
     */
    function changeNodeByPath(
      data: TreePath & {
          treeData?: TreeItem[],
          newNode: any,
          ignoreCollapsed?: boolean,
      }): TreeItem[] {
      return changeNodeAtPath({ ...data, getNodeKey: keyFromTreeIndex, treeData: data.treeData ?? self.catalogTreeData as TreeItem[]});
    };

    /**
     * 
     * @param title Title to search for
     * @param useTranslation Should translate provided title using intl's provider or not. (defaults to false)
     * @returns The first NodeData it finds that matches the provided title
     */
    function findNodeByTitle(title: string, useTranslation = false): NodeData | null {
      const nodeTitle =  useTranslation ? intl.formatMessage({ id: title }) : title;
      const node = find({
        treeData: self.catalogTreeData as TreeItem[],
        getNodeKey: keyFromTreeIndex,
        searchMethod: (data) => data.node.title === nodeTitle,
      }).matches[0];

      if (typeof node !== 'undefined') {
        return node;
      }
      return null;
    }

    /**
     * 
     * @param node
     * @param parentTitle 
     * @param useTranslation Should translate provided title using intl's provider or not. (defaults to false)
     * @returns Void. The method mutates the tree in store
     */
    function addNodeToParent(node: TreeItem, parentTitle: string, useTranslation = false): void {
      if ((self.catalogTreeData as TreeItem[]).length > NONE) {
        const parentNode = findNodeByTitle(parentTitle, useTranslation);

        const parentKey = parentNode?.path.pop();

        if (typeof parentKey !== 'undefined') {
          const newTreeData = addNodeUnderParent({
            treeData: self.catalogTreeData as TreeItem[],
            newNode: node, // Its up to you to decide whether to create a copy or not
            getNodeKey: keyFromTreeIndex,
            parentKey: parentKey,
          }).treeData;

          setCatalogTreeData(newTreeData);
        } else {
          throw new Error("Couldn't find parent by the given title");
        }
      }
    }

    function sortGroupChildrenByFieldValue(
      parentNode: TreeItem,
      sortByField = INNER_SORT_FIELD
    ): TreeItem | null {
      const parent = { ...parentNode };

      (parent.children as TreeItem[]).sort(alphabeticalSort(sortByField));

      return parent;
    }

    /**
    * 
    * @param node The node to find it's parent
    * @param treeData Defaults to store tree
    * @returns An object with the parentNode and its path
    */
    function getParentNode(node: NodeData, treeData = self.catalogTreeData as TreeItem[]): IGetParentNode {
      const FIRST_IDX = 0;
      const WITHOUT_LAST_IDX = -1;
      // In order to get the direct parent we need its path without the last one (which represent the node itself)
      const parentIndex = node.path.slice(FIRST_IDX, WITHOUT_LAST_IDX);

      const parentNode = getNodeAtPath({
        treeData,
        path: parentIndex,
        getNodeKey: keyFromTreeIndex,
      }) as NodeData;

      return ({ parentNode, path: parentIndex });
    }

    /**
     * Find the first tree node that its metadata matches the given id 
     */
    function findNodeById(id: string): NodeData | null {
      const node = find({
        treeData: self.catalogTreeData as TreeItem[],
        getNodeKey: keyFromTreeIndex,
        searchMethod: (data) => data.node.id === id,
      }).matches[0];

      if (typeof node !== 'undefined') {
        return node;
      }
      return null;
    }

    /**
     * 
     * @param id Id find the nodes from the current tree in store
     * @param updatedNodeData Updated node data to override the current data
     * @returns void - The method mutates the tree in store with the updated nodes
     * 
     * Affects ALL NODES that matches the same id
     */
    function updateNodeById(id: string, updatedNodeData: ILayerImage): void {
      if ((self.catalogTreeData as TreeItem[]).length > NONE) {
        let newTreeData: TreeItem[] = [...self.catalogTreeData as TreeItem[]] ;

        find({
          treeData: self.catalogTreeData as TreeItem[],
          getNodeKey: keyFromTreeIndex,
          searchMethod: (data) => data.node.id === id,
        }).matches.forEach((item) => {
          newTreeData = changeNodeByPath({
            treeData: newTreeData,
            newNode: {
              ...item.node,
              ...updatedNodeData,
              title: getLayerTitle(updatedNodeData),
            },
            path: item.path,
          });

          const { parentNode, path: parentPath } = getParentNode(item, newTreeData);
          
          // Re-sort parent group children after the changes (like if title has changed)
          const sortedParentNode = sortGroupChildrenByFieldValue(parentNode?.node as TreeItem);

          newTreeData = changeNodeByPath({
            newNode: sortedParentNode,
            path: parentPath,
            treeData: newTreeData,
          });
        });

        setCatalogTreeData(newTreeData);
      }
    }

    /**
     * 
     * @param path Node path to remove
     * @returns void - remove the node from tree in store
     */
    function removeNodeFromTree(path: (string | number)[]): void {
      const newTree = removeNodeAtPath({
         treeData: self.catalogTreeData as TreeItem[],
         getNodeKey: keyFromTreeIndex,
         path
       });
 
      self.catalogTreeData = newTree;
    }

    /**
    * 
    * @param nodeIdToRemove ID of a node to remove from parentNode
    * @param parentNode Node of the parent
    * @returns void - Remove the child from tree in store
    */
    function removeChildFromParent(nodeIdToRemove: string, parentNode: NodeData): void {
      const filteredChildren = ((parentNode.node.children) as TreeItem[]).filter(node => node.id !== nodeIdToRemove);
      parentNode.node.children = filteredChildren;

      const newTreeWithoutChild = changeNodeByPath({
        path: parentNode.path,
        newNode: parentNode.node
      });

      setCatalogTreeData(newTreeWithoutChild);
    }

    return {
      catalogSearch,
      initTree,
      setCatalogTreeData,
      setIsDataLoading,
      resetCatalogTreeData,
      addNodeToParent,
      updateNodeById,
      findNodeById,
      findNodeByTitle,
      removeNodeFromTree,
      removeChildFromParent,
      changeNodeByPath,
    };
  });
