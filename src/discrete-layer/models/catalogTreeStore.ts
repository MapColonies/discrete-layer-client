/* eslint-disable @typescript-eslint/naming-convention */
import { types, getParent, flow } from 'mobx-state-tree';
import { cloneDeep, get, isEmpty } from 'lodash';
import { createIntl } from 'react-intl';
import {
  changeNodeAtPath,
  getNodeAtPath,
  find,
  addNodeUnderParent,
  TreeItem,
  GetNodeKeyFunction,
  NodeData,
} from 'react-sortable-tree';
import { ResponseState } from '../../common/models/response-state.enum';
import CONFIG from '../../common/config';
import { getLayerLink } from '../components/helpers/layersUtils';
import { GroupBy, groupBy, KeyPredicate } from '../../common/helpers/group-by';
import MESSAGES from '../../common/i18n';
import { ModelBase } from './ModelBase';
import { IRootStore, RootStoreType } from './RootStore';
import { ILayerImage } from './layerImage';
import { RecordType } from './';
import { isBest } from '../components/layer-details/utils';
import { CapabilityModelType } from './CapabilityModel';

const NONE = 0;

const locale = CONFIG.I18N.DEFAULT_LANGUAGE;
const intl = createIntl({ locale, messages: MESSAGES[locale] });

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
  const topLevelGroupByField = 'region';
  const innerSortField = 'productName';
  const regionPredicate = (groupByParams.keys.find(
    (k) => k.name === topLevelGroupByField
  ) as KeyPredicate).predicate;
  const treeData = groupBy(arr, groupByParams);
  return {
    title: title,
    isGroup: true,
    children: treeData
      .sort((a, b) =>
        regionPredicate(a.key[topLevelGroupByField]).localeCompare(
          regionPredicate(b.key[topLevelGroupByField])
        )
      )
      .map((item) => {
        return {
          title: regionPredicate(item.key[topLevelGroupByField]),
          isGroup: true,
          children: [
            ...item.items
              .sort((a, b) =>
                a[innerSortField].localeCompare(b[innerSortField])
              )
              .map((rec) => {
                return {
                  ...rec,
                  title: rec[innerSortField],
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
      self.root.discreteLayersStore.setLayersImages([], false);
      setCatalogTreeData([]);
    }

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
              eq: self.root.discreteLayersStore.searchParams.recordType,
            },
          ],
        },
        end: CONFIG.RUNNING_MODE.END_RECORD,
        start: CONFIG.RUNNING_MODE.START_RECORD,
      });

      try {
        setSearchError(null);

        // Avoiding the cache with the refetch.
        const dataSearch = yield search.refetch();

        const layersList = get(dataSearch, 'search') as ILayerImage[];
        const arr: ILayerImage[] = cloneDeep(layersList);

        self.root.discreteLayersStore.setLayersImages(arr, false);
        return arr;
      } catch (e) {
        setSearchError(search.error);
        resetCatalogTreeData();
        setIsDataLoading(false);

        return [];
      }
    });

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
        //#region getCapabilities()

        // NOTE:
        // Calling getCapabilities() should happen after querySearch.data
        // It is being called only here in the catalog because the other two places (bestCatalog & searchByPolygon)
        // are subsets of the catalog layers list

        if (!isEmpty(layersList)) {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          const { RECORD_ALL, RECORD_RASTER, RECORD_DEM } = RecordType;
          const withCapabilities = [RECORD_RASTER, RECORD_DEM];
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
                'status' in itemObjectBag &&
                itemObjectBag.status === 'UNPUBLISHED'
              );
            });
            const parentUnpublished = buildParentTreeNode(
              arrUnpublished,
              intl.formatMessage({
                id: 'tab-views.catalog.top-categories.unpublished',
              }),
              /* eslint-disable */
              { keys: [{ name: 'region', predicate: (val) => val?.join(',') }] }
              /* eslint-enable */
            );

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
                            title: draft['productName'],
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
                    title: item['productName'],
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

            setCatalogTreeData([parentCatalog, parentBests, parentUnpublished]);
            setIsDataLoading(false);
          }
        }
      } catch (e) {
        setIsDataLoading(false);
        resetCatalogTreeData();
        setErrorCapabilities(capabilitiesQuery?.error);
      }
    });

    // Tree manipulations actions

    function findNodeByTitle(title: string): NodeData | null {
      const node = find({
        treeData: self.catalogTreeData as TreeItem[],
        getNodeKey: keyFromTreeIndex,
        searchMethod: (data) =>
          data.node.title === title,
      }).matches[0];
      if(typeof node !== 'undefined') {
        return node;
      }
      return null;
    }

    function addNodeToParent(parentTitle: string, node: TreeItem): void{
      if((self.catalogTreeData as TreeItem[]).length > NONE){
        const parentNode = findNodeByTitle(parentTitle);

        const parentKey = parentNode?.path.pop();

        if(typeof parentKey !== 'undefined') {
          const newTreeData = addNodeUnderParent({
            treeData: self.catalogTreeData as TreeItem[],
            newNode: node, // Its up to you to decide whether to create a copy or not
            getNodeKey: keyFromTreeIndex,
            parentKey:parentKey
          }).treeData;
  
          setCatalogTreeData(newTreeData);
        } else {
          throw new Error("Couldn't find parent by the given title")
        }
      }
    }

    function sortGroupChildrensByFieldValue(
      parentNode: TreeItem,
      groupByField = 'productName'
    ): TreeItem | null {
      const parent = { ...parentNode };

      (parent.children as TreeItem[]).sort((a, b) =>
        (a[groupByField] as string).localeCompare(b[groupByField] as string)
      );

      return parent;
    }

    function updateNodeById(id: string, updatedNodeData: ILayerImage): void {
      if((self.catalogTreeData as TreeItem[]).length > NONE) {
        const item = find({
          treeData: self.catalogTreeData as TreeItem[],
          getNodeKey: keyFromTreeIndex,
          searchMethod: (data) =>
            data.node.id === id,
        }).matches[0];

        let newTreeData = changeNodeAtPath({
          treeData: self.catalogTreeData as TreeItem[],
          newNode: { ...item.node, ...updatedNodeData, title: updatedNodeData.productName },
          getNodeKey: keyFromTreeIndex,
          path: item.path
        });

        // Re-sort parent group children after the changes (like if title has changed)
        const FIRST_IDX = 0;
        const WITHOUT_LAST_IDX = -1;
        const parentIndex  = item.path.slice(FIRST_IDX, WITHOUT_LAST_IDX);

        const parentNode = getNodeAtPath({
          treeData: newTreeData,
          /**
             In order to get the direct parent we need its path without the last one, 
              Which indicates the node itself.
           **/
          path: item.path.slice(FIRST_IDX, WITHOUT_LAST_IDX), 
          getNodeKey: keyFromTreeIndex,
        })?.node;

        const sortedParentNode = sortGroupChildrensByFieldValue(parentNode as TreeItem);

        newTreeData = changeNodeAtPath({
          getNodeKey: keyFromTreeIndex,
          newNode: sortedParentNode,
          path: parentIndex,
          treeData: newTreeData,
        })

        setCatalogTreeData(newTreeData);
      }
    }

    return {
      catalogSearch,
      initTree,
      setCatalogTreeData,
      setIsDataLoading,
      resetCatalogTreeData,
      addNodeToParent,
      updateNodeById,
    };
  });
